using Model;
using Model.Enums;
using System.Linq;
using System.Data.Entity;
using System;
using System.Collections.Generic;
using Service.Auth.Models;
using Model.Custom;
using System.Diagnostics.Metrics;

namespace Service.Encounters
{
    public class EncounterStudentStatusService : BaseService, IEncounterStudentStatusService
    {
        private readonly IPrimaryContext _context;
        private readonly IEncounterStudentLibrary _encounterStudentLibrary;

        public EncounterStudentStatusService(IPrimaryContext context)
            : base(context)
        {
            _context = context;
            _encounterStudentLibrary = new EncounterStudentLibrary(_context);
        }

        public void UpdateInvoice()
        {
            var ninetyDaysAgo = DateTime.UtcNow.AddDays(-90);
            var encountersToUpdate = _context.EncounterStudents
                .Include(es => es.ClaimsEncounters)
                .Include(es => es.EncounterStudentStatus)
                .Where(encounter => encounter.EncounterStatusId == (int)EncounterStatuses.Invoiced && !encounter.Archived)
                .ToList();

            foreach (var encounter in encountersToUpdate)
            {
                var mostRecentStatus = encounter.EncounterStudentStatus.OrderByDescending(ess => ess.DateCreated).FirstOrDefault();
                if (mostRecentStatus.EncounterStatusId == ((int)EncounterStatuses.Invoiced) && mostRecentStatus.DateCreated < ninetyDaysAgo)
                {
                    encounter.EncounterStatusId = (int)EncounterStatuses.READY_FOR_BILLING;
                    UpdateEncounterStudentStatusLog(encounter.EncounterStatusId, encounter.Id, 1);
                }

                foreach (var claim in encounter.ClaimsEncounters)
                {
                    claim.Rebilled = true;
                }
                _context.SetEntityState(encounter, EntityState.Modified);
                _context.SaveChanges();
            }
        }


        public void UpdateEncounterStudentStatusLog(int statusId, int encounterStudentId, int userId)
        {
            var statusLog = new EncounterStudentStatus()
            {
                EncounterStatusId = statusId,
                EncounterStudentId = encounterStudentId,
                CreatedById = userId,
            };

            _context.EncounterStudentStatus.Add(statusLog);
            _context.SaveChanges();
        }

        public void CheckEncounterStudentStatus(int encounterStudentId, int userId)
        {
            var encounterStudent = _context.EncounterStudents
                                            .Include(es => es.Student)
                                            .Include(es => es.Student.Address)
                                            .Include(es => es.Student.StudentParentalConsents)
                                            .Include(es => es.Student.SupervisorProviderStudentReferalSignOffs)
                                            .Include(es => es.Student.SupervisorProviderStudentReferalSignOffs.Select(spr => spr.Supervisor))
                                            .Include(es => es.Encounter)
                                            .Include(es => es.Encounter.Provider)
                                            .Include(es => es.Encounter.Provider.ProviderTitle)
                                            .Include(es => es.Encounter.Provider.ProviderTitle.ServiceCode)
                                            .Include(es => es.Encounter.Provider.ProviderInactivityDates)
                                            .Include(es => es.EncounterStudentCptCodes.Select(escc => escc.CptCode.ServiceUnitRule.ServiceUnitTimeSegments))
                                            .FirstOrDefault(es => es.Id == encounterStudentId);

            // Check for student's consent
            var consents = _context.StudentParentalConsents.Where(pc => pc.StudentId == encounterStudent.StudentId).ToList();
            var hasConsent = consents.Any(pc => pc.ParentalConsentEffectiveDate.HasValue
                && pc.ParentalConsentEffectiveDate.Value.Date <= encounterStudent.EncounterDate.Date
                && pc.ParentalConsentTypeId == (int)StudentParentalConsentTypes.ConfirmConsent);

            var minutes = encounterStudent.EncounterEndTime.Subtract(encounterStudent.EncounterStartTime).TotalMinutes;

            var serviceCode = encounterStudent.Encounter.Provider.ProviderTitle.ServiceCode;
            var isBillable = encounterStudent.Encounter.ServiceTypeId != (int)ServiceTypes.Non_Billable;
            var provider = encounterStudent.Encounter.Provider;
            var caseLoad = isBillable ? _encounterStudentLibrary.GetStudentCaseLoad((DateTime)encounterStudent.EncounterDate, encounterStudent.StudentId, serviceCode.Id) : null;
            var today = DateTime.Now;
            var hasMissingReferral = !encounterStudent.Student.SupervisorProviderStudentReferalSignOffs.Any(r =>
                        r.ServiceCodeId == serviceCode.Id &&
                        r.Supervisor.VerifiedOrp && r.Supervisor.OrpApprovalDate != null &&
                        (!r.EffectiveDateTo.HasValue || r.EffectiveDateTo.Value.Date > encounterStudent.EncounterDate.Date) &&
                        r.EffectiveDateFrom.HasValue && r.EffectiveDateFrom.Value.Date <= encounterStudent.EncounterDate.Date &&
                        r.EffectiveDateFrom >= ((DateTime)r.Supervisor.OrpApprovalDate).AddYears(-1));

            if (encounterStudent.ESignedById == null || encounterStudent.ESignedById == 0) { return; }

            if (encounterStudent.Encounter.ServiceTypeId == (int)ServiceTypes.Non_Billable)
            {
                encounterStudent.EncounterStatusId = (int)EncounterStatuses.NON_MSP_SERVICE;
            }
            else if (encounterStudent.StudentDeviationReasonId != null && encounterStudent.StudentDeviationReasonId > 0)
            {
                encounterStudent.EncounterStatusId = (int)EncounterStatuses.DEVIATED;
            }
            else if (encounterStudent.Encounter.ServiceTypeId == (int)ServiceTypes.Treatment_Therapy && (caseLoad == null || !caseLoad.StudentType.IsBillable))
            {
                if (encounterStudent.EncounterStatusId == (int)EncounterStatuses.E_Signed && caseLoad == null) { return; }
                if (caseLoad != null && !caseLoad.StudentType.IsBillable) { encounterStudent.EncounterStatusId = (int)EncounterStatuses.NON_IEP; }
            }
            else if (encounterStudent.Encounter.Provider.ProviderInactivityDates.Any(pid =>
                pid.ProviderInactivityStartDate <= encounterStudent.EncounterDate &&
                pid.ProviderInactivityEndDate >= encounterStudent.EncounterDate && !pid.Archived))
            {
                encounterStudent.EncounterStatusId = (int)EncounterStatuses.Do_Not_Bill;
            }
            else if (encounterStudent.Encounter.Provider.ProviderTitle.SupervisorTitleId > 0 && encounterStudent.Encounter.Provider.ProviderTitle.ServiceCode.NeedsReferral && !encounterStudent.SupervisorDateESigned.HasValue)
            {
                encounterStudent.EncounterStatusId = (int)EncounterStatuses.READY_FOR_SUPERVISOR_ESIGN;
            }
            else if (serviceCode.NeedsReferral && hasMissingReferral)
            {
                encounterStudent.EncounterStatusId = (int)EncounterStatuses.NO_REFFERAL;
            }
            else if (!hasConsent && consents.Any(pc => pc.ParentalConsentTypeId == (int)StudentParentalConsentTypes.ConfirmConsent && pc.ParentalConsentEffectiveDate.Value.Date > encounterStudent.EncounterDate.Date))
            {
                encounterStudent.EncounterStatusId = (int)EncounterStatuses.ENCOUNTER_ENTERED_PRIOR_TO_CONSENT;
            }
            else if (!hasConsent && (!consents.Any() || consents.Any(pc => pc.ParentalConsentTypeId == (int)StudentParentalConsentTypes.PendingConsent)))
            {
                encounterStudent.EncounterStatusId = (int)EncounterStatuses.Pending_Consent;
            }
            else if (!hasConsent && consents.Any(pc => pc.ParentalConsentTypeId == (int)StudentParentalConsentTypes.NonConsent))
            {
                encounterStudent.EncounterStatusId = (int)EncounterStatuses.NON_CONSENT;
            }
            else if (encounterStudent.Student.MedicaidNo == null || encounterStudent.Student.MedicaidNo.Trim().Length != 12)
            {
                encounterStudent.EncounterStatusId = (int)EncounterStatuses.MISSING_MEDICAID_NUMBER;
            }
            else if (encounterStudent.Student.Address == null)
            {
                encounterStudent.EncounterStatusId = (int)EncounterStatuses.ADDRESS_ISSUE;
            }
            else if (
                encounterStudent.EncounterStudentCptCodes.Any(escc =>
                    escc.CptCode.ServiceUnitRule != null
                    && escc.CptCode.ServiceUnitRule.ServiceUnitTimeSegments.All(ts =>
                        minutes < ts.StartMinutes || minutes > ts.EndMinutes
                    )))
            {
                encounterStudent.EncounterStatusId = (int)EncounterStatuses.Service_Unit_Rule_Violation;
            }
            else
            {
                encounterStudent.EncounterStatusId = (int)EncounterStatuses.READY_FOR_BILLING;
            }

            Context.SetEntityState(encounterStudent, EntityState.Modified);
            UpdateEncounterStudentStatusLog(encounterStudent.EncounterStatusId, encounterStudentId, userId);
        }

        public void CheckUnsignedEncounterStudentStatus(int encounterStudentId, int studentId, int encounterId, int userId)
        {
            var data = _context.Encounters
                .Where(encounter => encounter.Id == encounterId)
                .Select(e => new
                {
                    encounter = e,
                    encounterStudent = e.EncounterStudents.FirstOrDefault(es => es.Id == encounterStudentId),
                    serviceCodeId = e.Provider.ProviderTitle.ServiceCodeId
                }).FirstOrDefault();
            var caseLoad = _encounterStudentLibrary.GetStudentCaseLoad((DateTime)data.encounterStudent.EncounterDate, studentId, data.serviceCodeId);
            data.encounterStudent.EncounterStatusId = _encounterStudentLibrary.GetEncounterStudentStatus(caseLoad, data.encounter);
            _context.SetEntityState(data.encounterStudent, EntityState.Modified);
            _context.SaveChanges();

            UpdateEncounterStudentStatusLog(data.encounterStudent.EncounterStatusId, encounterStudentId, userId);
        }

        public void CheckEncounterStudentStatusByStatusId(int studentId, int statusId, int userId)
        {
            var encounterStudentIds = _context.EncounterStudents
                                            .Where(es => es.StudentId == studentId && es.EncounterStatusId == statusId)
                                            .Select(es => es.Id)
                                            .ToList();

            foreach (var id in encounterStudentIds)
            {
                CheckEncounterStudentStatus(id, userId);
            }
        }

        public void CheckEncounterStudentStatusByStudentId(int studentId, int userId)
        {
            var encounterStudentIds = _context.EncounterStudents
                                            .Where(es => es.StudentId == studentId)
                                            .Select(es => es.Id)
                                            .ToList();

            foreach (var id in encounterStudentIds)
            {
                CheckEncounterStudentStatus(id, userId);
            }
        }

        public void CheckEncounterStudentStatusByStatusAndServiceArea(int studentId, int statusId, int serviceAreaId, int userId)
        {
            var encounterStudentIds = _context.EncounterStudents
                .Where(es => es.StudentId == studentId && es.EncounterStatusId == statusId
                    && es.Encounter.Provider.ProviderTitle.ServiceCodeId == serviceAreaId)
                .Select(es => es.Id)
                .ToList();

            foreach (var id in encounterStudentIds)
            {
                CheckEncounterStudentStatus(id, userId);
            }
        }

        public void CheckOlderThan365Encounters()
        {
            var oneYearAgo = DateTime.Now.AddDays(-365);
            var oldEncounters = _context.EncounterStudents.Where(es => es.EncounterDate < oneYearAgo &&
                es.EncounterStatusId != (int)EncounterStatuses.Claims_older_than_365_Days && !es.Archived);
            foreach (var es in oldEncounters)
            {
                es.EncounterStatusId = (int)EncounterStatuses.Claims_older_than_365_Days;
                _context.EncounterStudentStatus.Add(new()
                {
                    EncounterStatusId = (int)EncounterStatuses.Claims_older_than_365_Days,
                    EncounterStudentId = es.Id,
                    DateCreated = DateTime.Now,
                    CreatedById = 1
                });

                _context.SetEntityState(es, EntityState.Modified);
            }
            _context.SaveChanges();
        }

        public void RemoveUnusedEncounters()
        {
            // Remove all encounters that are at least 7 days old and have no related students
            _context.Database.ExecuteSqlCommand(@"
            DELETE FROM Encounters
            WHERE DateCreated < DATEADD(DAY, -7, GETDATE())
            AND NOT EXISTS (SELECT TOP 1 * FROM EncounterStudents es WHERE es.EncounterId = Encounters.Id)");
            _context.SaveChanges();
        }

        public void EncounterStudentStatusUpdateFromBillingFailure(List<EncounterClaimsData> claims, int failureReasonId)
        {
            var statusId = 0;
            switch (failureReasonId)
            {
                case (int)BillingFailureReasons.Address:
                    statusId = (int)EncounterStatuses.ADDRESS_ISSUE;
                    break;
                case (int)BillingFailureReasons.Address_Over_Max_Length:
                    statusId = (int)EncounterStatuses.ADDRESS_ISSUE;
                    break;
                case (int)BillingFailureReasons.MedicaidNo:
                    statusId = (int)EncounterStatuses.MISSING_MEDICAID_NUMBER;
                    break;
                case (int)BillingFailureReasons.Supervisor_Signature:
                    statusId = (int)EncounterStatuses.READY_FOR_SUPERVISOR_ESIGN;
                    break;
                case (int)BillingFailureReasons.Referral:
                    statusId = (int)EncounterStatuses.NO_REFFERAL;
                    break;
                case (int)BillingFailureReasons.CPT_Code:
                    statusId = (int)EncounterStatuses.READY_FOR_BILLING;
                    break;
                case (int)BillingFailureReasons.Service_Unit_Rule_Violation:
                    statusId = (int)EncounterStatuses.Service_Unit_Rule_Violation;
                    break;
                default:
                    break;
            }

            List<EncounterStudentStatus> statusLogs = new List<EncounterStudentStatus>();
            var ids = claims.Select(c => c.EncounterStudentId).ToList();
            var encounterStudents = _context.EncounterStudents.Where(es => ids.Contains(es.Id)).ToList();

            if (statusId > 0)
            {
                foreach (var es in encounterStudents)
                {
                    es.EncounterStatusId = statusId;
                    var statusLog = new EncounterStudentStatus()
                    {
                        EncounterStatusId = statusId,
                        EncounterStudentId = es.Id,
                        CreatedById = (int)ProtectedAuthUsers.AdminUser,
                    };
                    statusLogs.Add(statusLog);
                    Context.SetEntityState(es, EntityState.Modified);
                }
            }
            else
            {
                foreach (var es in encounterStudents)
                {
                    var dtoData = claims.FirstOrDefault(c => c.EncounterStudentId == es.Id);
                    if (dtoData != null)
                    {
                        switch (failureReasonId)
                        {
                            case (int)BillingFailureReasons.Parental_Consent:
                                var consents = dtoData.ParentalConsents;
                                if (consents.Any(pc => pc.ParentalConsentTypeId == (int)StudentParentalConsentTypes.ConfirmConsent
                                    && pc.ParentalConsentEffectiveDate.Value.Date > dtoData.EncounterDate.Date))
                                {
                                    statusId = (int)EncounterStatuses.ENCOUNTER_ENTERED_PRIOR_TO_CONSENT;
                                }
                                else if (!consents.Any() || consents.Any(pc =>
                                    pc.ParentalConsentTypeId == (int)StudentParentalConsentTypes.PendingConsent))
                                {
                                    statusId = (int)EncounterStatuses.Pending_Consent;
                                }
                                else
                                {
                                    statusId = (int)EncounterStatuses.NON_CONSENT;
                                }
                                break;
                            case (int)BillingFailureReasons.Provider_Signature:
                                if (dtoData.IsTreatment)
                                {
                                    statusId = (int)EncounterStatuses.PENDING_TREATMENT_THERAPY;
                                }
                                else
                                {
                                    statusId = (int)EncounterStatuses.PENDING_EVALUATION_ASSESSMENT;
                                }
                                break;
                            case (int)BillingFailureReasons.Service_Unit_Rule_Violation:
                                statusId = (int)EncounterStatuses.Service_Unit_Rule_Violation;
                                break;
                            default:
                                statusId = (int)EncounterStatuses.READY_FOR_BILLING;
                                break;
                        }
                        es.EncounterStatusId = statusId;
                        var statusLog = new EncounterStudentStatus()
                        {
                            EncounterStatusId = statusId,
                            EncounterStudentId = es.Id,
                            CreatedById = (int)ProtectedAuthUsers.AdminUser,
                        };
                        statusLogs.Add(statusLog);
                        Context.SetEntityState(es, EntityState.Modified);
                    }
                }
            }
            _context.EncounterStudentStatus.AddRange(statusLogs);
            _context.SaveChanges();
        }

    }
}
