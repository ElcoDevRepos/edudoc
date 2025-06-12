using BreckServiceBase.Utilities.Interfaces;
using Model;
using Model.Enums;
using Service.Base;
using Service.Encounters;
using System;
using System.Linq;
using System.Data.Entity;
using System.Collections.Generic;

namespace Service.BillingFailureServices
{
    public class BillingFailureService : CRUDBaseService, IBillingFailureService
    {
        private readonly IPrimaryContext _context;
        private readonly IEmailHelper _emailHelper;
        private readonly IEncounterStudentStatusService _encounterStudentStatusService;

        public BillingFailureService(IPrimaryContext context,
                                      IEmailHelper emailHelper,
                                      IEncounterStudentStatusService encounterStudentStatusService
                                      ) : base(context, new ValidationService(context, emailHelper))
        {
            _context = context;
            _emailHelper = emailHelper;
            _encounterStudentStatusService = encounterStudentStatusService;
        }

        public int ResolveAllFailures(int userId)
        {
            var issues = _context.BillingFailures
                .Include(bf => bf.EncounterStudent)
                .Where(bf => !bf.IssueResolved)
                .ToList();

            foreach (var issue in issues)
            {
                issue.IssueResolved = true;
                issue.ResolvedById = userId;
                issue.DateResolved = DateTime.UtcNow;
                issue.EncounterStudent.EncounterStatusId = (int)EncounterStatuses.READY_FOR_BILLING;
                _context.SetEntityState(issue.EncounterStudent, EntityState.Modified);
                _encounterStudentStatusService.UpdateEncounterStudentStatusLog(issue.EncounterStudent.EncounterStatusId, issue.EncounterStudentId, userId);
            }

            return _context.SaveChanges();
        }

        public void CheckForMedicaidResolution(Student student, int userId)
        {
            if (student.MedicaidNo != null && student.MedicaidNo.Trim().Length == 12)
            {
                var failures = _context.BillingFailures.Where(bf => bf.EncounterStudent.StudentId == student.Id && bf.BillingFailureReasonId == (int)BillingFailureReasons.MedicaidNo);
                foreach (var failure in failures)
                {
                    failure.ResolvedById = userId;
                    failure.DateResolved = DateTime.UtcNow;
                    failure.IssueResolved = true;
                }

                _context.SaveChanges();
                _encounterStudentStatusService.CheckEncounterStudentStatusByStatusId(student.Id, (int)EncounterStatuses.MISSING_MEDICAID_NUMBER, userId);
            }
        }

        public void CheckForParentalConsentResolution(StudentParentalConsent studentParentalConsent, int userId)
        {
            if (studentParentalConsent.ParentalConsentTypeId == (int)StudentParentalConsentTypes.ConfirmConsent)
            {
                var failures = _context.BillingFailures.Where(bf => bf.EncounterStudent.StudentId == studentParentalConsent.StudentId && bf.BillingFailureReasonId == (int)BillingFailureReasons.Parental_Consent);
                foreach (var failure in failures)
                {
                    failure.ResolvedById = userId;
                    failure.DateResolved = DateTime.UtcNow;
                    failure.IssueResolved = true;
                }

                _context.SaveChanges();
            }

            var statuses = new List<int>
            {
                (int)EncounterStatuses.ENCOUNTER_ENTERED_PRIOR_TO_CONSENT,
                (int)EncounterStatuses.Pending_Consent,
                (int)EncounterStatuses.NON_CONSENT
            };
            foreach (var status in statuses)
            {
                _encounterStudentStatusService.CheckEncounterStudentStatusByStatusId(studentParentalConsent.StudentId, status, userId);
            }
        }

        public void CheckForReferralResolution(int studentId, int userId)
        {
            var serviceAreaId = _context.Providers.Where(p => p.ProviderUserId == userId).FirstOrDefault().ProviderTitle.ServiceCodeId;
            var failures = _context.BillingFailures.Where(bf => bf.EncounterStudent.StudentId == studentId
                && bf.EncounterStudent.Encounter.Provider.ProviderTitle.ServiceCodeId == serviceAreaId
                && bf.BillingFailureReasonId == (int)BillingFailureReasons.Referral);
            foreach (var failure in failures)
            {
                failure.ResolvedById = userId;
                failure.DateResolved = DateTime.UtcNow;
                failure.IssueResolved = true;
            }
            _encounterStudentStatusService.CheckEncounterStudentStatusByStatusAndServiceArea(studentId, (int)EncounterStatuses.NO_REFFERAL, serviceAreaId, userId);
        }

        public void CheckForProviderESignResolution(int encounterStudentId, int userId)
        {
            var failures = _context.BillingFailures.Where(bf => bf.EncounterStudentId == encounterStudentId && bf.BillingFailureReasonId == (int)BillingFailureReasons.Provider_Signature);
            foreach (var failure in failures)
            {
                failure.ResolvedById = userId;
                failure.DateResolved = DateTime.UtcNow;
                failure.IssueResolved = true;
            }
            _encounterStudentStatusService.CheckEncounterStudentStatus(encounterStudentId, userId);
        }

        public void CheckForSupervisorESignResolution(int encounterStudentId, int userId)
        {
            var failures = _context.BillingFailures.Where(bf => bf.EncounterStudentId == encounterStudentId && bf.BillingFailureReasonId == (int)BillingFailureReasons.Supervisor_Signature);
            foreach (var failure in failures)
            {
                failure.ResolvedById = userId;
                failure.DateResolved = DateTime.UtcNow;
                failure.IssueResolved = true;
            }
            _encounterStudentStatusService.CheckEncounterStudentStatus(encounterStudentId, userId);
        }

        public void CheckForStudentAddressResolution(int studentId, int userId)
        {
            var addrMaxLength = 55;
            var studentAddress = _context.Students.Where(s => s.Id == studentId).Select(s => s.Address).FirstOrDefault();
            if (studentAddress != null && studentAddress.Address1.Trim().Length > 0 && studentAddress.City.Trim().Length > 0 &&
                studentAddress.StateCode.Trim().Length > 0 && studentAddress.Zip.Trim().Length > 0)
            {
                if (studentAddress.Address1.Trim().Length <= addrMaxLength)
                {
                    var failures = _context.BillingFailures.Where(bf => bf.EncounterStudent.StudentId == studentId
                        && (bf.BillingFailureReasonId == (int)BillingFailureReasons.Address_Over_Max_Length
                            || bf.BillingFailureReasonId == (int)BillingFailureReasons.Address));
                    foreach (var failure in failures)
                    {
                        failure.ResolvedById = userId;
                        failure.DateResolved = DateTime.UtcNow;
                        failure.IssueResolved = true;
                    }
                }
                else
                {
                    var noAddressFailures = _context.BillingFailures.Where(bf => bf.EncounterStudent.StudentId == studentId
                        && bf.BillingFailureReasonId == (int)BillingFailureReasons.Address);
                    foreach (var failure in noAddressFailures)
                    {
                        failure.ResolvedById = userId;
                        failure.DateResolved = DateTime.UtcNow;
                        failure.IssueResolved = true;
                    }
                }
            }
            _encounterStudentStatusService.CheckEncounterStudentStatusByStatusId(studentId, (int)EncounterStatuses.ADDRESS_ISSUE, userId);
        }
    }
}
