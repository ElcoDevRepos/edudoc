using Service.Core.Utilities;
using Service.Core.Utilities;
using BreckServiceBase.Utilities.Interfaces;
using DocumentFormat.OpenXml.ExtendedProperties;
using FluentValidation;
using Microsoft.AspNetCore.Authentication;
using Model;
using Model.DTOs;
using Model.Enums;
using Service.Base;
using Service.Utilities;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Data.Entity.Core.Objects;
using System.Data.SqlClient;
using System.Diagnostics;
using System.Linq;
using System.Linq.Expressions;
using System.Net;
using System.Text;

namespace Service.Encounters
{
    public class EncounterService : Base.CRUDBaseService, IEncounterService
    {
        private readonly IEncounterStudentService _encounterStudentService;
        private readonly IEncounterStudentStatusService _encounterStudentStatusService;
        private readonly IPrimaryContext _context;
        private readonly Dictionary<Expression<Func<ClaimAuditResponseDto, bool>>, string> AuditReasonMap = new Dictionary<Expression<Func<ClaimAuditResponseDto, bool>>, string>
        {
            { e => e.MedicaidNo == null || e.MedicaidNo.Trim() == "", "Missing Medicaid number. " },
            { e => e.CurrentParentalConsent != null && e.CurrentParentalConsent.ParentalConsentTypeId != (int)StudentParentalConsentTypes.ConfirmConsent, "Parental Consent Type is not Confirm Consent. " },
            { e => e.CurrentParentalConsent == null, "Parental Consent is missing. " },
            { e => e.CurrentParentalConsent != null && e.CurrentParentalConsent.ParentalConsentTypeId ==(int)StudentParentalConsentTypes.ConfirmConsent && e.CurrentParentalConsent.ParentalConsentEffectiveDate >= DateTime.Now, "Invalid parental consent effective date. " },
            { e => e.NeedsReferral && !e.ReferralSignOffs.Any(referral => referral.ServiceCodeId == e.ServiceAreaId) , "Missing referral sign off. " },
            { e => e.NeedsReferral && e.ReferralSignOffs.Any(referral => referral.ServiceCodeId == e.ServiceAreaId) && e.ReferralSignOffs.Any(referral => referral.ServiceCodeId == e.ServiceAreaId && referral.SignOffDate.HasValue && DateTime.Now.Year - referral.SignOffDate.GetValueOrDefault().Year != 0), "Referral is expired. " }
        };
        private readonly Dictionary<int, HashSet<EncounterStudent>> _providerEncounters;
        private readonly Dictionary<int, StudentTherapyProviderStudentsDto> _studentTherapies;
        private readonly Dictionary<int, List<CptCodeAssocation>> _associations;
        public EncounterService(
            IPrimaryContext context,
            IEncounterStudentService encounterStudentService,
            IEncounterStudentStatusService encounterStudentStatusService,
            IEmailHelper emailHelper
            ) : base(context, new ValidationService(context, emailHelper))
        {
            _encounterStudentService = encounterStudentService;
            _encounterStudentStatusService = encounterStudentStatusService;
            _context = context;
            _providerEncounters = new Dictionary<int, HashSet<EncounterStudent>>();
            _studentTherapies = new Dictionary<int, StudentTherapyProviderStudentsDto>();
            _associations = new Dictionary<int, List<CptCodeAssocation>>();
        }

        public (IEnumerable<ClaimAuditResponseDto> claims, int count) SearchForClaims(Model.Core.CRUDSearchParams csp)
        {

            var baseQuery = _context.EncounterStudents
                .Where(e => e.DateESigned != null && e.EncounterStatus.IsAuditable)
                .Where(e =>
                    (e.Student.MedicaidNo == null || e.Student.MedicaidNo.Trim() == "") ||
                    (!e.Student.StudentParentalConsents.Any() ||
                    e.Student.StudentParentalConsents.OrderByDescending(c => c.ParentalConsentDateEntered).FirstOrDefault().ParentalConsentTypeId != (int)StudentParentalConsentTypes.ConfirmConsent
                    || (
                    e.Student.StudentParentalConsents.OrderByDescending(c => c.ParentalConsentDateEntered).FirstOrDefault().ParentalConsentTypeId == (int)StudentParentalConsentTypes.ConfirmConsent &&
                    e.Student.StudentParentalConsents.OrderByDescending(c => c.ParentalConsentDateEntered).FirstOrDefault().ParentalConsentEffectiveDate >= DateTime.Now)) ||
                    (e.Encounter.Provider.ProviderTitle.ServiceCode.NeedsReferral && (!e.Student.SupervisorProviderStudentReferalSignOffs.Any() ||
                    e.Student.SupervisorProviderStudentReferalSignOffs.Any(s => s.SignOffDate != null && DbFunctions.DiffYears(DateTime.Now, (DateTime)s.SignOffDate) > 0))));

            var count = baseQuery.Count();
            var claims = baseQuery
               .Select(s =>
                    new ClaimAuditResponseDto
                    {
                        EncounterId = s.Id,
                        DateSigned = (DateTime)s.DateESigned,
                        StudentName = s.Student.LastName + ", " + s.Student.FirstName,
                        SchoolDistrict = s.Student.School.SchoolDistrictsSchools.FirstOrDefault().SchoolDistrict.Name,
                        CurrentStatus = s.EncounterStatus.Name,
                        CurrentStatusId = s.EncounterStatusId,
                        ProviderName = s.Encounter.Provider.ProviderUser.FirstName + " " + s.Encounter.Provider.ProviderUser.LastName,
                        ServiceArea = s.Encounter.Provider.ProviderTitle.ServiceCode.Name,
                        StartTime = s.EncounterStartTime,
                        EndTime = s.EncounterEndTime,
                        EncounterDate = s.EncounterDate,
                        NumStudentsInEncounter = s.Encounter.EncounterStudents.Where(es => es.EncounterStatusId != (int)EncounterStatuses.DEVIATED).Count()
                            + s.Encounter.AdditionalStudents,
                        CptCodes = s.EncounterStudentCptCodes.Select(e => e.CptCode),
                        Goals = s.CaseLoad.CaseLoadGoals.Select(c => c.Goal),
                        TreatmentNotes = s.TherapyCaseNotes,
                        MedicaidNo = s.Student.MedicaidNo,
                        CurrentParentalConsent = s.Student.StudentParentalConsents.OrderByDescending(c => c.ParentalConsentDateEntered).FirstOrDefault(),
                        ServiceAreaId = s.Encounter.Provider.ProviderTitle.ServiceCodeId,
                        NeedsReferral = s.Encounter.Provider.ProviderTitle.ServiceCode.NeedsReferral,
                        ReferralSignOffs = s.Student.SupervisorProviderStudentReferalSignOffs,
                        EncounterStudentStatuses = s.EncounterStudentStatus.OrderByDescending(es => es.DateCreated).Select(es => new EncounterStudentStatusesLogDto()
                        {
                            StatusName = es.EncounterStatus.Name,
                            CreatedBy = es.CreatedBy.LastName + ", " + es.CreatedBy.FirstName,
                            DateCreated = es.DateCreated ?? DateTime.MinValue,
                        }),
                    })
                .OrderByDescending(c => c.DateSigned)
                .Skip(csp.skip.GetValueOrDefault())
                .Take(csp.take.GetValueOrDefault())
                .AsEnumerable()
                .Select(c => { c.ReasonForAudit = GetReasonsForAudit(c); return c; });

            return (claims, count);
        }

        public (IEnumerable<EncounterResponseDto> encounters, int count) SearchForEncounters(Model.Core.CRUDSearchParams csp, int? userId = null)
        {
            var serviceAreaWithMethods = new int[] { (int)ServiceCodes.Speech_Therapy, (int)ServiceCodes.Audiology };
            var baseQuery = _context.EncounterStudents.Where(es => !es.Archived && !es.Encounter.Archived).AsQueryable();

            if (!CommonFunctions.IsBlankSearch(csp.Query))
            {
                string[] terms = CommonFunctions.SplitTerms(csp.Query.Trim().ToLower());
                foreach (string t in terms)
                {
                    baseQuery = baseQuery.Where(s =>
                                                        s.Student.FirstName.ToLower().StartsWith(t) ||
                                                        s.Student.LastName.ToLower().StartsWith(t) ||
                                                        s.Student.StudentCode.ToString().ToLower().StartsWith(t) ||
                                                        s.Student.MedicaidNo.ToLower().StartsWith(t) ||
                                                        s.EncounterNumber.ToString().ToLower().StartsWith(t) ||
                                                        s.ClaimsEncounters.FirstOrDefault().ClaimId.ToString().ToLower().StartsWith(t)
                                                    );
                }
            }

            if (!string.IsNullOrEmpty(csp.extraparams))
            {
                var extras = System.Web.HttpUtility.ParseQueryString(WebUtility.UrlDecode(csp.extraparams));

                // if school district admin, only get encounters from that school district
                var user = userId != null ? _context.Users.FirstOrDefault(u => u.Id == userId) : null;
                if (user != null && user.SchoolDistrictId != null)
                {
                    var districtId = user.SchoolDistrictId;
                    baseQuery = baseQuery.Where(encounterStudent => encounterStudent.Student.DistrictId == districtId);
                }

                if (extras["districtId"] != null && extras["districtId"] != "0")
                {
                    int districtId = int.Parse(extras["districtId"]);
                    baseQuery = baseQuery.Where(encounterStudent => encounterStudent.Student.DistrictId == districtId);
                }

                if (extras["providerId"] != null && extras["providerId"] != "0")
                {
                    int providerId = int.Parse(extras["providerId"]);
                    baseQuery = baseQuery.Where(encounterStudent => encounterStudent.Encounter.ProviderId == providerId);

                }

                if (extras["studentId"] != null && extras["studentId"] != "0")
                {
                    int studentId = int.Parse(extras["studentId"]);
                    baseQuery = baseQuery.Where(encounterStudent => encounterStudent.StudentId == studentId);
                }

                if (extras["EncounterStatusIds"] != null)
                {
                    var encounterStatusIdsParamsList = CommonFunctions.GetIntListFromExtraParams(csp.extraparams, "EncounterStatusIds");
                    var encounterStatusIds = encounterStatusIdsParamsList["EncounterStatusIds"];

                    if (encounterStatusIds.Count > 0)
                        baseQuery = baseQuery.Where(encounterStudent => encounterStatusIds.Contains(encounterStudent.EncounterStatusId));
                }

                if (extras["CptCodeIds"] != null)
                {
                    var cptCodeIdsParamsList = CommonFunctions.GetIntListFromExtraParams(csp.extraparams, "CptCodeIds");
                    var cptCodeIds = cptCodeIdsParamsList["CptCodeIds"];

                    if (cptCodeIds.Count > 0)
                        baseQuery = baseQuery.Where(encounterStudent => encounterStudent.EncounterStudentCptCodes.Select(c => c.CptCodeId).Any(code => cptCodeIds.Contains(code)));
                }

                if (extras["ServiceCodeIds"] != null)
                {
                    var serviceCodeIdsParamsList = CommonFunctions.GetIntListFromExtraParams(csp.extraparams, "ServiceCodeIds");
                    var serviceCodeIds = serviceCodeIdsParamsList["ServiceCodeIds"];

                    if (serviceCodeIds.Count > 0)
                        baseQuery = baseQuery.Where(encounterStudent => serviceCodeIds.Contains(encounterStudent.Encounter.Provider.ProviderTitle.ServiceCodeId));
                }

                if (extras["StartDate"] != null)
                {
                    var startDate = DateTime.Parse(extras["StartDate"]);
                    baseQuery = baseQuery.Where(encounterStudent => DbFunctions.TruncateTime(encounterStudent.EncounterDate) >= DbFunctions.TruncateTime(startDate));
                }
                if (extras["EndDate"] != null)
                {
                    var endDate = DateTime.Parse(extras["EndDate"]);
                    baseQuery = baseQuery.Where(encounterStudent => DbFunctions.TruncateTime(encounterStudent.EncounterDate) <= DbFunctions.TruncateTime(endDate));
                }
                if (extras["EncounterQuery"] != null)
                {
                    var encounterNumbers = extras["EncounterQuery"].Split(new[] { ',', ' ' }).ToList();
                    baseQuery = baseQuery.Where(es => encounterNumbers.Contains(es.EncounterNumber));
                }
                if (extras["studentFirstName"] != null && extras["studentFirstName"].Trim().Length > 0)
                {
                    var firstName = extras["studentFirstName"];
                    baseQuery = baseQuery.Where(es => es.Student.FirstName.Trim().ToLower().StartsWith(firstName.ToLower()));
                }
                if (extras["studentLastName"] != null && extras["studentLastName"].Trim().Length > 0)
                {
                    var lastName = extras["studentLastName"];
                    baseQuery = baseQuery.Where(es => es.Student.LastName.Trim().ToLower().StartsWith(lastName.ToLower()));
                }
                if (extras["medicaidNo"] != null && extras["medicaidNo"].Trim().Length > 0)
                {
                    var medicaidNo = extras["medicaidNo"];
                    baseQuery = baseQuery.Where(es => es.Student.MedicaidNo.Trim().StartsWith(medicaidNo));
                }
                if (extras["studentCode"] != null && extras["studentCode"].Trim().Length > 0)
                {
                    var studentCode = extras["studentCode"];
                    baseQuery = baseQuery.Where(es => es.Student.StudentCode.Trim().StartsWith(studentCode));
                }
                if (extras["encounterNumber"] != null && extras["encounterNumber"].Trim().Length > 0)
                {
                    var encounterNumber = extras["encounterNumber"];
                    baseQuery = baseQuery.Where(es => es.EncounterNumber.Trim().ToLower().StartsWith(encounterNumber.ToLower()));
                }
                if (extras["claimId"] != null && extras["claimId"].Trim().Length > 0)
                {
                    var claimId = extras["claimId"];
                    baseQuery = baseQuery.Where(es => es.ClaimsEncounters.FirstOrDefault().ClaimId.ToString().ToLower().StartsWith(claimId));
                }
            }
            if (csp.order != null)
            {
                if (csp.order == "student")
                {
                    baseQuery = baseQuery.OrderByDir(e => e.Student.LastName, csp.orderdirection)
                                         .ThenByDir(e => e.Student.FirstName, csp.orderdirection);
                }
                else if (csp.order == "provider")
                {
                    baseQuery = baseQuery.OrderByDir(e => e.Encounter.Provider.ProviderUser.LastName, csp.orderdirection)
                                         .ThenByDir(e => e.Encounter.Provider.ProviderUser.FirstName, csp.orderdirection);
                }
                else
                {
                    baseQuery = baseQuery.OrderByDir(e => e.EncounterDate, csp.orderdirection)
                                         .ThenByDir(e => e.EncounterStartTime, csp.orderdirection);
                }
            }
            else
            {
                baseQuery = baseQuery.OrderBy(e => e.EncounterDate).ThenBy(e => e.EncounterStartTime);
            }

            var count = baseQuery.Count();
            if (csp.skip.HasValue && csp.skip.Value > 0)
            {
                baseQuery = baseQuery.Skip(csp.skip.Value);
            }
            if (csp.take.HasValue && csp.take.Value > 0)
            {
                baseQuery = baseQuery.Take(csp.take.Value);
            }

            _context.Database.CommandTimeout = 60;

            var encounters = baseQuery
                .AsNoTracking()
                .Select(s =>
                    new
                    {
                        ClaimsEncounters = s.ClaimsEncounters,
                        Supervisor = s.SupervisorESignedBy.Providers_ProviderUserId.Select(su => new {
                            SupervisorLicenseNumber = su.ProviderLicens.FirstOrDefault(l => l.AsOfDate <= s.EncounterDate && l.ExpirationDate > s.EncounterDate).License,
                            SupervisorTitle = su.ProviderTitle.Name + "/ " + su.ProviderTitle.Code,
                        }).FirstOrDefault(),
                        dto = new EncounterResponseDto
                        {
                            EncounterStudentId = s.Id,
                            StudentName = s.Student.LastName + ", " + s.Student.FirstName,
                            StudentCode = s.Student.StudentCode,
                            StudentId = s.StudentId,
                            DateOfBirth = s.Student.DateOfBirth,
                            SchoolDistrict = s.Student.SchoolDistrict.Name,
                            CurrentStatus = s.EncounterStatus.Name,
                            CurrentStatusId = s.EncounterStatusId,
                            HPCAdminStatusOnly = s.EncounterStatus.HpcAdminOnly,
                            ProviderName = s.Encounter.Provider.ProviderUser.FirstName + " " + s.Encounter.Provider.ProviderUser.LastName,
                            ProviderLicenseNumber = s.Encounter.Provider.ProviderLicens.FirstOrDefault(l => l.AsOfDate <= s.EncounterDate && l.ExpirationDate > s.EncounterDate).License,
                            SupervisorName = s.SupervisorESignedBy.FirstName + " " + s.SupervisorESignedBy.LastName,
                            ServiceArea = s.Encounter.Provider.ProviderTitle.ServiceCode.Name,
                            ServiceType = s.Encounter.ServiceType.Name,
                            StartTime = s.EncounterStartTime,
                            EndTime = s.EncounterEndTime,
                            EncounterDate = s.EncounterDate,
                            TreatmentNotes = s.TherapyCaseNotes,
                            AbandonmentNotes = s.AbandonmentNotes,
                            MedicaidNo = s.Student.MedicaidNo,
                            SupervisorComments = s.SupervisorComments,
                            EncounterNumber = s.EncounterNumber,
                            ReasonForService = s.CaseLoad.ServiceCodeId == (int)ServiceCodes.Nursing ?
                                s.CaseLoad.CaseLoadScripts.FirstOrDefault(cls => cls.InitiationDate <= s.EncounterDate).DiagnosisCode.Code
                                    : (s.DiagnosisCodeId != null ? s.DiagnosisCode.Code : s.CaseLoad.DiagnosisCode.Code ?? ""),
                            ProviderTitle = s.Encounter.Provider.ProviderTitle.Name + "/ " + s.Encounter.Provider.ProviderTitle.Code,
                            NumStudentsInEncounter = s.Encounter.EncounterStudents.Where(es => es.EncounterStatusId != (int)EncounterStatuses.DEVIATED).Count()
                            + s.Encounter.AdditionalStudents,
                            NumNonIEPStudents = s.Encounter.AdditionalStudents,
                            CptCodes = s.EncounterStudentCptCodes.Where(c => !c.Archived)
                            .Select(e => new CptCodeWithMinutesDto { CptCode = e.CptCode, Minutes = e.Minutes ?? 0 }),
                            Methods = s.EncounterStudentMethods
                            .Where(m => !m.Archived && s.Encounter.ServiceTypeId != (int)ServiceTypes.Evaluation_Assessment &&
                                serviceAreaWithMethods.Contains(s.Encounter.Provider.ProviderTitle.ServiceCodeId)).Select(m => m.Method),
                            Goals = s.EncounterStudentGoals
                            .Where(g => !g.Archived && s.Encounter.ServiceTypeId != (int)ServiceTypes.Evaluation_Assessment).Select(c => c.Goal),
                            EncounterStudentStatuses = s.EncounterStudentStatus.OrderByDescending(es => es.DateCreated).Select(es => new EncounterStudentStatusesLogDto()
                            {
                                StatusName = es.EncounterStatus.Name,
                                CreatedBy = es.CreatedBy.LastName + ", " + es.CreatedBy.FirstName,
                                DateCreated = es.DateCreated ?? DateTime.MinValue,
                                StatusId = es.EncounterStatusId
                            }),
                            IsTelehealth = s.IsTelehealth,
                            DateESigned = s.DateESigned,
                            Location = s.EncounterLocation.Name,
                        }
                    }).AsEnumerable().Select(s =>
                    {
                        s.dto.ClaimIds = s.ClaimsEncounters.Select(ce => ce.ClaimId).Where(id => id != null);
                        if(s.dto.CurrentStatusId == (int)EncounterStatuses.Invoiced
                        || s.dto.CurrentStatusId == (int)EncounterStatuses.Invoiced_and_Paid
                        || s.dto.CurrentStatusId == (int)EncounterStatuses.PAID_AND_REVERSED
                        || s.dto.CurrentStatusId == (int)EncounterStatuses.Invoiced_and_Denied) {
                            s.dto.DateInvoiced = s.dto.EncounterStudentStatuses.Where(ess => ess.StatusId == (int)EncounterStatuses.Invoiced).FirstOrDefault()?.DateCreated;
                        }

                        s.dto.HasSupervisor = s.Supervisor != null;
                        if(s.dto.HasSupervisor) {
                            s.dto.SupervisorLicenseNumber = s.Supervisor.SupervisorLicenseNumber;
                            s.dto.SupervisorTitle = s.Supervisor.SupervisorTitle;
                        }
                        return s.dto;
                    });

            return (encounters, count);
        }

        private string GetReasonsForAudit(ClaimAuditResponseDto s)
        {
            var result = new StringBuilder();
            foreach (var validation in AuditReasonMap)
            {
                if (validation.Key.Compile().Invoke(s))
                {
                    result.Append(validation.Value);
                }
            }
            return result.ToString();
        }

        public void UpdateClaimStatus(ClaimAuditRequestDto request, int userId, bool isProvider)
        {
            var encounterStudent = _context.EncounterStudents.FirstOrDefault(es => es.Id == request.EncounterStudentId);
            var restrictedStatuses = new[] { (int)EncounterStatuses.Invoiced, (int)EncounterStatuses.Invoiced_and_Paid };
            if (isProvider && restrictedStatuses.Contains(encounterStudent.EncounterStatusId) && request.StatusId == (int)EncounterStatuses.Abandoned)
            {
                throw new UnauthorizedAccessException("You are not authorized to change the status to Abandoned");
            }
            encounterStudent.EncounterStatusId = request.StatusId;
            if (request.ReasonForAbandonment != null)
                encounterStudent.AbandonmentNotes = request.ReasonForAbandonment;

            if (request.StatusId == (int)EncounterStatuses.Abandoned) {
                encounterStudent.ESignedById = null;
            }

            if (request.StatusId == (int)EncounterStatuses.Returned_ByAdmin_Encounter ||
                request.StatusId == (int)EncounterStatuses.Returned_BySupervisor_Encounter)
            {
                encounterStudent.ReasonForReturn = $"- {request.ReasonForReturn}\r\n{encounterStudent.ReasonForReturn} ({DateTime.Now.ToString("g")})";
                encounterStudent.SupervisorDateESigned = null;
                encounterStudent.SupervisorESignedById = null;
                encounterStudent.SupervisorESignatureText = null;
            }
            _context.SetEntityState(encounterStudent, EntityState.Modified);

            _context.SaveChanges();
            _encounterStudentStatusService.UpdateEncounterStudentStatusLog(request.StatusId, request.EncounterStudentId, userId);
        }

        public int GetReturnedEncountersCount(int userId)
        {
            return _context.EncounterStudents.Where(encounterStudent =>
                                                        encounterStudent.Encounter.Provider.ProviderUserId == userId &&
                                                        !encounterStudent.Encounter.Archived &&
                                                        !encounterStudent.Archived &&
                                                        encounterStudent.DateESigned.HasValue &&
                                                        (encounterStudent.EncounterStatusId == (int)EncounterStatuses.Returned_ByAdmin_Encounter || encounterStudent.EncounterStatusId == (int)EncounterStatuses.Returned_BySupervisor_Encounter)
                                                    ).Count();
        }
        public int GetPendingApprovalsCount(int userId)
        {
            return _context.EncounterStudents.Where(es => es.ESignedById != null &&
                                                    es.Student.ProviderStudentSupervisors.Any(pss => pss.Supervisor.ProviderUserId == userId &&
                                                    DbFunctions.TruncateTime(pss.EffectiveStartDate) <= DbFunctions.TruncateTime(es.EncounterDate) &&
                                                    (pss.EffectiveEndDate == null
                                                        || DbFunctions.TruncateTime(pss.EffectiveEndDate) > DbFunctions.TruncateTime(es.EncounterDate)) &&
                                                    pss.AssistantId == es.ESignedBy.Providers_ProviderUserId.FirstOrDefault().Id) &&
                                                    es.SupervisorDateESigned == null &&
                                                    es.EncounterStatusId == (int)EncounterStatuses.READY_FOR_SUPERVISOR_ESIGN &&
                                                    !es.Archived
                                                    ).Count();
        }

        public int GetPendingTreatmentTherapiesCount(int userId)
        {
            return _context.Encounters.Where(encounter => ((encounter.FromSchedule &&
                                                            encounter.EncounterStudents.Any(es => es.EncounterDate < DateTime.Now && !es.DateESigned.HasValue && !es.Archived && !es.StudentTherapySchedule.StudentTherapy.Archived)) ||
                                                            (!encounter.FromSchedule && encounter.EncounterStudents.Any(es => es.EncounterDate < DateTime.Now && !es.DateESigned.HasValue && !es.Archived))) &&
                                                            encounter.ServiceTypeId == (int)ServiceTypes.Treatment_Therapy &&
                                                            !encounter.Archived &&
                                                            encounter.Provider.ProviderUserId == userId).Count();
        }

        public int GetPendingEvaluationsCount(int userId)
        {
            return _context.Encounters.Where(encounter => encounter.EncounterStudents.Any(es => es.EncounterDate < DateTime.Now && !es.DateESigned.HasValue && !es.Archived) &&
                                                            encounter.ServiceTypeId == (int)ServiceTypes.Evaluation_Assessment &&
                                                            !encounter.Archived &&
                                                            !encounter.EncounterStudents.Any(es => es.EncounterStatusId == (int)EncounterStatuses.Invoiced || es.EncounterStatusId == (int)EncounterStatuses.Invoiced_and_Paid) &&
                                                            encounter.Provider.ProviderUserId == userId).Count();
        }

        public Encounter GetByEncounterStudentId(int encounterStudentId)
        {
            return _context.Encounters
                            .Include(encounter => encounter.EncounterStudents)
                            .Include(encounter => encounter.ServiceType)
                            .Include(encounter => encounter.EvaluationType)
                            .Include(encounter => encounter.EncounterStudents.Select(x => x.Student))
                            .Include(encounter => encounter.EncounterStudents.Select(x => x.Student.School))
                            .Include(encounter => encounter.EncounterStudents.Select(x => x.Student.School.SchoolDistrictsSchools))
                            .Include(encounter => encounter.EncounterStudents.Select(x => x.Student.School.SchoolDistrictsSchools.Select(y => y.SchoolDistrict)))
                            .Include(encounter => encounter.EncounterStudents.Select(x => x.Student.SupervisorProviderStudentReferalSignOffs))
                            .Include(encounter => encounter.EncounterStudents.Select(x => x.Student.ProviderStudentSupervisors))
                            .Include(encounter => encounter.EncounterStudents.Select(x => x.EncounterLocation))
                            .Include(encounter => encounter.EncounterStudents.Select(x => x.ESignedBy))
                            .Include(encounter => encounter.EncounterStudents.Select(x => x.StudentDeviationReason))
                            .Include(encounter => encounter.EncounterStudents.Select(x => x.EncounterStudentCptCodes))
                            .Include(encounter => encounter.EncounterStudents.Select(x => x.EncounterStudentGoals))
                            .Include(encounter => encounter.EncounterStudents.Select(x => x.EncounterStudentMethods))
                            .Include(encounter => encounter.EncounterStudents.Select(x => x.EncounterStudentStatus))
                            .Include(encounter => encounter.EncounterStudents.Select(x => x.EncounterStudentStatus.Select(ess => ess.CreatedBy)))
                            .Include(encounter => encounter.EncounterStudents.Select(x => x.CaseLoad))
                            .Include(encounter => encounter.EncounterStudents.Select(x => x.DiagnosisCode))
                            .Include(encounter => encounter.EncounterStudents.Select(x => x.CaseLoad.CaseLoadScripts))
                            .Include(encounter => encounter.EncounterStudents.Select(x => x.ClaimsEncounters))
                            .FirstOrDefault(encounter => encounter.EncounterStudents.Any(encounterStudent => encounterStudent.Id == encounterStudentId));
        }

        public void BuildTodayFromStudentTherapySchedules()
        {
            _context.Database.CommandTimeout = 600;

            DateTime tomorrow = DateTime.UtcNow.AddDays(1).Date;
            DateTime schoolYearStart = CommonFunctions.GetCurrentSchoolYearStart();

            // Group schedules by date
            var scheduleDates = _context.StudentTherapySchedules
                .Include(ts => ts.StudentTherapy)
                .Where(ts => !ts.Archived && !ts.StudentTherapy.Archived
                    && !ts.StudentTherapy.CaseLoad.Archived
                    && ts.ScheduleDate >= schoolYearStart && ts.ScheduleDate < tomorrow
                    && !ts.EncounterStudents.Any())
                .AsNoTracking()
                .ToList()
                .GroupBy(ts => new
                {
                    date = ts.ScheduleDate.Value.Date,
                })
                .OrderByDescending(d => d.Key.date);

            foreach (var date in scheduleDates)
            {
                // Group schedules by therapy group
                var groups = date
                   .GroupBy(ts => new
                   {
                       groupId = ts.StudentTherapy.TherapyGroupId != null && ts.StudentTherapy.TherapyGroupId > 0 ? ts.StudentTherapy.TherapyGroupId : -ts.Id
                   }).ToList();

                List<TherapyScheduleSignedEncounterDto> signedEncounters = _context.EncounterStudents
                    .Where(es => EntityFunctions.TruncateTime(es.EncounterDate) == date.Key.date && !es.Archived && !es.Encounter.Archived
                        && es.EncounterStatusId != (int)EncounterStatuses.Abandoned && es.ESignedById != null && es.DateESigned != null)
                    .AsNoTracking()
                    .Select(x => new TherapyScheduleSignedEncounterDto
                    {
                        StudentId = x.StudentId,
                        ProviderId = x.Encounter.ProviderId,
                        StartTime = x.EncounterStartTime,
                        EndTime = x.EncounterEndTime,
                    })
                    .ToList();

                foreach (var group in groups)
                {
                    var therapyGroup = LoadGroupData(group, signedEncounters);
                    if (therapyGroup != null)
                    {
                        therapyGroup.TherapyGroupId = (int)group.Key.groupId;
                        BuildFromStudentTherapySchedule(therapyGroup, 1, true);
                    }
                }
            }
            ArchiveCompletedGroupSchedules();
            UpdateDefaultTherapyGroupName();
        }

        private void UpdateDefaultTherapyGroupName()
        {
            var groupNamesToUpdate = _context.TherapyGroups
                .Where(tg => !tg.Archived && tg.StudentTherapies.Any(st =>
                    DbFunctions.TruncateTime(st.StudentTherapySchedules.Max(sts => sts.ScheduleDate)) <= DbFunctions.TruncateTime(DateTime.UtcNow)))
                .Select(tg => new
                {
                    TherapyGroup = tg,
                    Students = tg.StudentTherapies.Where(st => DbFunctions.TruncateTime(st.StudentTherapySchedules.Max(sts => sts.ScheduleDate))
                        > DbFunctions.TruncateTime(DateTime.UtcNow)).Select(s => s.CaseLoad.Student)
                });

            var x = groupNamesToUpdate.ToList();

            foreach (var group in groupNamesToUpdate)
            {
                if (CommonFunctions.IsDefaultTherapyGroupName(group.TherapyGroup.Name))
                {
                    var names = new List<string>();
                    foreach (var student in group.Students)
                    {
                        names.Add(CommonFunctions.GetDefaultTherapyGroupStudentName(student));
                    }
                    var groupName = $"{CommonFunctions.GetDefaultTherapyGroupDayString(group.TherapyGroup)} - {String.Join(", ", names)}";
                    group.TherapyGroup.Name = groupName;
                }
            }
            _context.SaveChanges();
        }

        private void ArchiveCompletedGroupSchedules()
        {
            var groupsToArchive = _context.TherapyGroups
                .Where(tg => !tg.Archived
                    && DbFunctions.TruncateTime(tg.StudentTherapies.SelectMany(st => st.StudentTherapySchedules)
                        .Max(s => s.ScheduleDate)) <= DbFunctions.TruncateTime(DateTime.UtcNow))
                .Select(tg => new { TherapyGroup = tg, StudentTherapies = tg.StudentTherapies }).ToList();

            foreach (var group in groupsToArchive)
            {
                group.TherapyGroup.Archived = true;

                foreach (var studentTherapy in group.StudentTherapies)
                {
                    studentTherapy.Archived = true;
                }
            }
            _context.SaveChanges();
        }

        private StudentTherapyByGroupDto LoadGroupData(IGrouping<object, StudentTherapySchedule> grouping, List<TherapyScheduleSignedEncounterDto> signedEncounters)
        {
            var scheduleIds = grouping.Select(s => s.Id);
            var group = _context.StudentTherapySchedules
                .Where(sts => scheduleIds.Contains(sts.Id))
                .Include(sts => sts.StudentTherapy)
                .Include(sts => sts.StudentTherapy.CaseLoad)
                .Include(sts => sts.StudentTherapy.CaseLoad.Student)
                .Include(sts => sts.StudentTherapy.CaseLoad.CaseLoadCptCodes)
                .Include(sts => sts.StudentTherapy.CaseLoad.CaseLoadMethods)
                .Include(sts => sts.StudentTherapy.Provider)
                .Include(sts => sts.StudentTherapy.Provider.ProviderTitle)
                .AsNoTracking()
                .AsEnumerable()
                .Where(sts => !signedEncounters.Any(se =>
                        se.StudentId == sts.StudentTherapy.CaseLoad.StudentId
                        && se.StartTime == sts.ScheduleStartTime && se.EndTime == sts.ScheduleEndTime
                        && se.ProviderId == sts.StudentTherapy.ProviderId))
                .ToList();

            if (group.Count == 0)
            {
                return null;
            }

            return new StudentTherapyByGroupDto
            {
                ScheduleDate = group.FirstOrDefault().ScheduleDate.Value,
                Provider = new StudentTherapyProviderData
                {
                    ProviderId = group.FirstOrDefault().StudentTherapy.ProviderId.Value,
                    ProviderTitleId = group.FirstOrDefault().StudentTherapy.Provider.TitleId,
                    ProviderTitleName = group.FirstOrDefault().StudentTherapy.Provider.ProviderTitle.Name,
                    ServiceCodeId = group.FirstOrDefault().StudentTherapy.Provider.ProviderTitle.ServiceCodeId,
                },
                Schedules = group.Select(s => new StudentTherapySchedulesData
                {
                    StudentTherapyScheduleId = s.Id,
                    StudentTherapyId = s.StudentTherapyId,
                    StudentId = s.StudentTherapy.CaseLoad.StudentId,
                    DistrictId = s.StudentTherapy.CaseLoad.Student.DistrictId.GetValueOrDefault(0),
                    CaseloadId = s.StudentTherapy.CaseLoadId,
                    EncounterLocationId = s.StudentTherapy.EncounterLocationId,
                    ScheduleDate = s.ScheduleDate.Value,
                    StartTime = s.ScheduleStartTime.Value,
                    EndTime = s.ScheduleEndTime.Value,
                    CptCodes = s.StudentTherapy.CaseLoad.CaseLoadCptCodes,
                    Methods = s.StudentTherapy.CaseLoad.CaseLoadMethods
                }),
            };
        }

        private int BuildFromStudentTherapySchedule(StudentTherapyByGroupDto studentTherapyRequestDto, int userId, bool fromSchedule)
        {
            // Create an encounter
            var newEncounter = new Encounter
            {
                IsGroup = studentTherapyRequestDto.Schedules.Count() > 1,
                ProviderId = studentTherapyRequestDto.Provider.ProviderId,
                ServiceTypeId = (int)ServiceTypes.Treatment_Therapy,
                CreatedById = userId,
                DateCreated = DateTime.UtcNow,
                EncounterDate = studentTherapyRequestDto.ScheduleDate,
                FromSchedule = true,
                Archived = fromSchedule,
                EncounterStartTime = studentTherapyRequestDto.Schedules.OrderBy(s => s.StartTime).First().StartTime,
                EncounterEndTime = studentTherapyRequestDto.Schedules.OrderByDescending(s => s.EndTime).First().EndTime,
            };

            int serviceCodeId = studentTherapyRequestDto.Provider.ServiceCodeId;
            if (!_associations.ContainsKey(serviceCodeId))
            {
                List<CptCodeAssocation> assoc = _context.CptCodeAssocations
                        .Include(association => association.CptCode)
                        .Where(association =>
                            association.ServiceTypeId == (int)ServiceTypes.Treatment_Therapy &&
                            association.ServiceCodeId == serviceCodeId &&
                            !association.Archived).ToList();
                _associations.Add(serviceCodeId, assoc);
            }
            List<CptCodeAssocation> associations = _associations.GetValueOrDefault(serviceCodeId, new List<CptCodeAssocation>());

            foreach (StudentTherapySchedulesData sts in studentTherapyRequestDto.Schedules)
            {
                var newEncounterStudent = _encounterStudentService
                    .BuildEncounterStudentFromStudentTherapy(sts, studentTherapyRequestDto.Provider,
                        userId, associations, fromSchedule, newEncounter.IsGroup);

                newEncounter.EncounterStudents.Add(newEncounterStudent);
            }

            if (newEncounter.EncounterStudents.Count > 0)
            {
                _context.Encounters.Add(newEncounter);
            }
            _context.SaveChanges();

            foreach (var encounterStudent in newEncounter.EncounterStudents)
            {
                _encounterStudentService.GenerateEncounterNumber((int)ServiceTypes.Treatment_Therapy,
                    encounterStudent,
                    studentTherapyRequestDto.Schedules.FirstOrDefault(s => s.StudentId == encounterStudent.StudentId).DistrictId);
            }
            _context.SaveChanges();
            return newEncounter.Id;
        }

        public int GetEncounterFromStudentTherapySchedule(StudentTherapiesRequestDto dto, int userId)
        {
            var encounter = _context.Encounters.Include(e => e.EncounterStudents)
                .FirstOrDefault(encounter => encounter.EncounterStudents
                    .Any(es => es.StudentTherapyScheduleId == dto.StudentTherapyScheduleId));
            if (encounter != null)
            {
                encounter.Archived = false;
                foreach (var es in encounter.EncounterStudents)
                {
                    var isInCaseLoad = _context.ProviderStudents
                        .Any(ps => ps.Provider.ProviderUserId == userId && ps.StudentId == es.StudentId);
                    if (isInCaseLoad)
                    {
                        es.Archived = false;
                    }
                }
                _context.SaveChanges();
                return encounter.Id;
            }
            else
            {
                StudentTherapyByGroupDto data = _context.StudentTherapySchedules
                    .Where(sts => sts.Id == dto.StudentTherapyScheduleId
                              && !sts.Archived
                              && !sts.StudentTherapy.Archived
                              && !sts.StudentTherapy.CaseLoad.Archived)
                    .Select(sts => new StudentTherapyByGroupDto
                    {
                        TherapyGroupId = sts.StudentTherapy.TherapyGroupId ?? -sts.Id,
                        Provider = new StudentTherapyProviderData
                        {
                            ProviderId = sts.StudentTherapy.ProviderId.GetValueOrDefault(0),
                            ProviderTitleId = sts.StudentTherapy.Provider.TitleId,
                            ProviderTitleName = sts.StudentTherapy.Provider.ProviderTitle.Name,
                            ServiceCodeId = sts.StudentTherapy.Provider.ProviderTitle.ServiceCodeId,
                        },
                        Schedules = new List<StudentTherapySchedulesData>()
                        {
                            new StudentTherapySchedulesData
                            {
                                StudentTherapyScheduleId = sts.Id,
                                StudentTherapyId = sts.StudentTherapyId,
                                StudentId = sts.StudentTherapy.CaseLoad.StudentId,
                                CaseloadId = sts.StudentTherapy.CaseLoadId,
                                EncounterLocationId = sts.StudentTherapy.EncounterLocationId,
                                ScheduleDate = sts.ScheduleDate.Value,
                                StartTime = sts.ScheduleStartTime.Value,
                                EndTime = sts.ScheduleEndTime.Value,
                                CptCodes = sts.StudentTherapy.CaseLoad.CaseLoadCptCodes,
                                Methods = sts.StudentTherapy.CaseLoad.CaseLoadMethods
                            }
                        }
                    }).First();
                return BuildFromStudentTherapySchedule(data, userId, false);
            }
        }

        public int GetTotalMinutes(Model.Core.CRUDSearchParams csp, int timeZoneOffsetMinutes)
        {
            var baseQuery = _context.EncounterStudents.Where(es => !es.Archived && !es.Encounter.Archived).AsQueryable();

            if (!CommonFunctions.IsBlankSearch(csp.Query))
            {
                string[] terms = CommonFunctions.SplitTerms(csp.Query.Trim().ToLower());
                foreach (string t in terms)
                {
                    baseQuery = baseQuery.Where(s =>
                                                        s.Student.FirstName.ToLower().StartsWith(t) ||
                                                        s.Student.LastName.ToLower().StartsWith(t) ||
                                                        s.Student.StudentCode.ToString().ToLower().StartsWith(t) ||
                                                        s.Student.MedicaidNo.ToLower().StartsWith(t) ||
                                                        s.EncounterNumber.ToString().ToLower().StartsWith(t) ||
                                                        s.ClaimsEncounters.FirstOrDefault().ClaimId.ToString().ToLower().StartsWith(t)
                                                    );
                }
            }

            if (!string.IsNullOrEmpty(csp.extraparams))
            {
                var extras = System.Web.HttpUtility.ParseQueryString(WebUtility.UrlDecode(csp.extraparams));

                if (extras["districtId"] != null && extras["districtId"] != "0")
                {
                    int districtId = int.Parse(extras["districtId"]);
                    baseQuery = baseQuery.Where(encounterStudent => encounterStudent.Student.DistrictId == districtId);

                }

                if (extras["providerId"] != null && extras["providerId"] != "0")
                {
                    int providerId = int.Parse(extras["providerId"]);
                    baseQuery = baseQuery.Where(r => r.Encounter.ProviderId == providerId);
                }

                if (extras["studentId"] != null && extras["studentId"] != "0")
                {
                    int studentId = int.Parse(extras["studentId"]);


                    baseQuery = baseQuery.Where(encounterStudent => encounterStudent.StudentId == studentId);

                }

                if (extras["CptCodeIds"] != null)
                {
                    var cptCodeIdsParamsList = CommonFunctions.GetIntListFromExtraParams(csp.extraparams, "CptCodeIds");
                    var cptCodeIds = cptCodeIdsParamsList["CptCodeIds"];

                    if (cptCodeIds.Count > 0)
                        baseQuery = baseQuery.Where(encounterStudent => encounterStudent.EncounterStudentCptCodes.Select(c => c.CptCodeId).Any(code => cptCodeIds.Contains(code)));
                }


                if (extras["ServiceCodeIds"] != null)
                {
                    var serviceCodeIdsParamsList = CommonFunctions.GetIntListFromExtraParams(csp.extraparams, "ServiceCodeIds");
                    var serviceCodeIds = serviceCodeIdsParamsList["ServiceCodeIds"];

                    if (serviceCodeIds.Count > 0)
                        baseQuery = baseQuery.Where(encounterStudent => serviceCodeIds.Contains(encounterStudent.Encounter.Provider.ProviderTitle.ServiceCodeId));
                }

                if (extras["StartDate"] != null)
                {
                    var startDate = DateTime.Parse(extras["StartDate"]);
                    baseQuery = baseQuery.Where(encounterStudent => DbFunctions.TruncateTime(encounterStudent.EncounterDate) >= DbFunctions.TruncateTime(startDate));
                }
                if (extras["EndDate"] != null)
                {
                    var endDate = DateTime.Parse(extras["EndDate"]);
                    baseQuery = baseQuery.Where(encounterStudent => DbFunctions.TruncateTime(encounterStudent.EncounterDate) <= DbFunctions.TruncateTime(endDate));
                }

            }

            var today = DateTime.UtcNow;
            var totalMinutes = baseQuery.Count() > 0 ? baseQuery.ToList().Sum(encounterStudent => (new DateTime(today.Year, today.Month, today.Day, encounterStudent.EncounterEndTime.Hours, encounterStudent.EncounterEndTime.Minutes, 0).AddHours(-5).TimeOfDay - new DateTime(today.Year, today.Month, today.Day, encounterStudent.EncounterStartTime.Hours, encounterStudent.EncounterStartTime.Minutes, 0).AddHours(-5).TimeOfDay).TotalMinutes) : 0;

            return (int)totalMinutes;
        }

        public (IEnumerable<EncounterResponseDto> encounters, int count) SearchForAssistantEncounters(Model.Core.CRUDSearchParams csp, int userId)
        {
            int[] serviceAreaWithMethods = new int[] { (int)ServiceCodes.Speech_Therapy, (int)ServiceCodes.Audiology };

            var baseQuery =
                _context.EncounterStudents
                .Where(es =>
                    es.ESignedById != null &&
                    es.Student.ProviderStudentSupervisors.Any(pss =>
                        pss.Supervisor.ProviderUserId == userId &&
                        DbFunctions.TruncateTime(pss.EffectiveStartDate) <= DbFunctions.TruncateTime(es.EncounterDate) &&
                        (pss.EffectiveEndDate == null
                            || DbFunctions.TruncateTime(pss.EffectiveEndDate) > DbFunctions.TruncateTime(es.EncounterDate)) &&
                        pss.AssistantId == es.ESignedBy.Providers_ProviderUserId.FirstOrDefault().Id
                    ) &&
                    es.SupervisorDateESigned == null &&
                    es.EncounterStatusId == (int)EncounterStatuses.READY_FOR_SUPERVISOR_ESIGN &&
                    !es.Archived
                );

            if (!CommonFunctions.IsBlankSearch(csp.Query))
            {
                var terms = CommonFunctions.SplitTerms(csp.Query.Trim().ToLower());
                baseQuery = baseQuery.Where(s =>
                    terms.Any(t => s.Student.FirstName.ToLower().StartsWith(t) ||
                                    s.Student.LastName.ToLower().StartsWith(t) ||
                                    s.Student.StudentCode.ToString().ToLower().StartsWith(t) ||
                                    s.Student.MedicaidNo.ToLower().StartsWith(t) ||
                                    s.EncounterNumber.ToString().ToLower().StartsWith(t) ||
                                    s.ClaimsEncounters.FirstOrDefault().ClaimId.ToString().ToLower().StartsWith(t)
                    ));
            }

            if (!string.IsNullOrEmpty(csp.extraparams))
            {
                var extras = System.Web.HttpUtility.ParseQueryString(WebUtility.UrlDecode(csp.extraparams));

                if (extras["assistantId"] != null && extras["assistantId"] != "0")
                {
                    var assistantIdsParamsList = CommonFunctions.GetIntListFromExtraParams(csp.extraparams, "assistantId");
                    var assistantIds = assistantIdsParamsList["assistantId"];
                    baseQuery = baseQuery.Where(es =>
                        assistantIds.Contains(es.ESignedBy.Providers_ProviderUserId.FirstOrDefault().Id) &&
                        es.Student.ProviderStudentSupervisors.Any(pss =>
                            assistantIds.Contains(pss.AssistantId) && pss.Supervisor.ProviderUserId == userId));
                }

                if (extras["studentId"] != null && extras["studentId"] != "0")
                {
                    var studentIdsParamsList = CommonFunctions.GetIntListFromExtraParams(csp.extraparams, "studentId");
                    var studentIds = studentIdsParamsList["studentId"];
                    baseQuery = baseQuery.Where(es => studentIds.Contains(es.StudentId));
                }

                if (extras["StartDate"] != null)
                {
                    var startDate = DateTime.Parse(extras["StartDate"]);
                    baseQuery = baseQuery.Where(encounterStudent =>
                        DbFunctions.TruncateTime(encounterStudent.EncounterDate) >= DbFunctions.TruncateTime(startDate));
                }

                if (extras["EndDate"] != null)
                {
                    var endDate = DateTime.Parse(extras["EndDate"]);
                    baseQuery = baseQuery.Where(encounterStudent =>
                        DbFunctions.TruncateTime(encounterStudent.EncounterDate) <= DbFunctions.TruncateTime(endDate));
                }
            }

            var count = baseQuery.Count();

            var students = baseQuery
                .OrderByDescending(e => e.Student.LastName)
                .ThenByDescending(e => e.Student.FirstName)
                .ThenBy(e => e.Id) // Because we're re-using this query multiple times we need it to be sorted deterministically.
                .Skip(csp.skip.GetValueOrDefault())
                .Take(csp.take.GetValueOrDefault());


            var cptCodes = students
                .Select(s =>
                new
                {
                    encounterStudentId = s.Id,
                    codes = s.EncounterStudentCptCodes
                .Where(c => !c.Archived)
                .Select(e => new CptCodeWithMinutesDto { CptCode = e.CptCode, Minutes = e.Minutes ?? 0 })
                }).ToList();

            var methods = students
                .Select(s => new
                {
                    encounterStudentId = s.Id,
                    methods = s.EncounterStudentMethods
                .Where(m => !m.Archived && s.Encounter.ServiceTypeId != (int)ServiceTypes.Evaluation_Assessment &&
                            serviceAreaWithMethods.Contains(s.Encounter.Provider.ProviderTitle.ServiceCodeId))
                .Select(m => m.Method)
                }).ToList();

            var goals = students
                .Select(s => new
                {
                    encounterStudentId = s.Id,
                    goals = s.EncounterStudentGoals
                .Where(g => !g.Archived && s.Encounter.ServiceTypeId != (int)ServiceTypes.Evaluation_Assessment)
                .Select(c => c.Goal)
                }).ToList();

            var encounterStudentStatuses = students
                .Select(s => new
                {
                    encounterStudentId = s.Id,
                    statuses = s.EncounterStudentStatus
                .OrderByDescending(es => es.DateCreated)
                .Select(es => new EncounterStudentStatusesLogDto
                {
                    StatusName = es.EncounterStatus.Name,
                    CreatedBy = es.CreatedBy.LastName + ", " + es.CreatedBy.FirstName,
                    DateCreated = es.DateCreated ?? DateTime.MinValue,
                })
                }).ToList();


            var encounters = students.Select(s => new EncounterResponseDto
            {
                EncounterStudentId = s.Id,
                StudentName = s.Student.LastName + ", " + s.Student.FirstName,
                StudentCode = s.Student.StudentCode,
                StudentId = s.StudentId,
                DateOfBirth = s.Student.DateOfBirth,
                SchoolDistrict = s.Student.School.SchoolDistrictsSchools.FirstOrDefault().SchoolDistrict.Name,
                CurrentStatus = s.EncounterStatus.Name,
                CurrentStatusId = s.EncounterStatusId,
                HPCAdminStatusOnly = s.EncounterStatus.HpcAdminOnly,
                ProviderName = s.Encounter.Provider.ProviderUser.FirstName + " " + s.Encounter.Provider.ProviderUser.LastName,
                ServiceArea = s.Encounter.Provider.ProviderTitle.ServiceCode.Name,
                ServiceType = s.Encounter.ServiceType.Name,
                StartTime = s.EncounterStartTime,
                EndTime = s.EncounterEndTime,
                EncounterDate = s.EncounterDate,
                TreatmentNotes = s.TherapyCaseNotes,
                AbandonmentNotes = s.AbandonmentNotes,
                MedicaidNo = s.Student.MedicaidNo,
                SupervisorComments = s.SupervisorComments,
                EncounterNumber = s.EncounterNumber ?? "",
                ClaimIds = s.ClaimsEncounters.Select(ce => ce.ClaimId).Where(id => id != null),
                ReasonForService = s.CaseLoad.ServiceCodeId == (int)ServiceCodes.Nursing ?
                    s.CaseLoad.CaseLoadScripts.FirstOrDefault(cls => cls.InitiationDate <= s.EncounterDate).DiagnosisCode.Code
                        : (s.DiagnosisCodeId != null ? s.DiagnosisCode.Code : s.CaseLoad.DiagnosisCode.Code ?? ""),
                ReasonForReturn = s.ReasonForReturn,
                ProviderTitle = s.Encounter.Provider.ProviderTitle.Name + "/ " + s.Encounter.Provider.ProviderTitle.Code,
                NumStudentsInEncounter = s.Encounter.EncounterStudents
                        .Where(es => es.EncounterStatusId != (int)EncounterStatuses.DEVIATED).Count()
                        + s.Encounter.AdditionalStudents,
                IsTelehealth = s.IsTelehealth
            })
                .AsNoTracking().ToList();

            var result = encounters
            .Select(e =>
            {
                var individualCodes = cptCodes.First(c => c.encounterStudentId == e.EncounterStudentId).codes;
                var individualMethods = methods.First(c => c.encounterStudentId == e.EncounterStudentId).methods;
                var individualGoals = goals.First(c => c.encounterStudentId == e.EncounterStudentId).goals;
                var individualStatuses = encounterStudentStatuses.First(c => c.encounterStudentId == e.EncounterStudentId).statuses;
                return e with
                {
                    CptCodes = individualCodes,
                    Methods = individualMethods,
                    Goals = individualGoals,
                    EncounterStudentStatuses = individualStatuses
                };
            });

            return (result, count);
        }


        public int CheckEncounterStudentOverlap(EncounterOverlapDto dto)
        {
            TimeSpan startTime = CommonFunctions.ConvertTimeSpanWithOffset(dto.EncounterStartTime, dto.EncounterDate, dto.TimeZoneOffsetMinutes);
            TimeSpan endTime = CommonFunctions.ConvertTimeSpanWithOffset(dto.EncounterEndTime, dto.EncounterDate, dto.TimeZoneOffsetMinutes);
            var date = dto.EncounterDate.Date;
            var encounterId = dto.EncounterId;
            var encounter = _context.Encounters.Where(e => e.Id == encounterId).SingleOrDefault();
            var providerId = encounter.ProviderId;
            // ensure encounter time is not more than 8 hours long
            if (endTime.TotalMinutes - startTime.TotalMinutes > 480)
            {
                throw new ValidationException("Encounter cannot be more than 8 hours long.");
            }

            var overlapEncounters = _context.EncounterStudents
                .Where(es => !es.Archived && !es.Encounter.Archived)
                // Only check for overlap on signed encounters
                .Where(es => es.ESignedById != null && es.EncounterStatusId != (int)EncounterStatuses.Abandoned)
                .Where(es => es.StudentDeviationReasonId == null)
                .Where(es =>
                    es.Encounter.ServiceTypeId != (int)ServiceTypes.Evaluation_Assessment
                    && es.Encounter.ServiceTypeId != (int)ServiceTypes.Non_Billable)
                .Where(es => es.EncounterId != encounterId)
                .Where(es => DbFunctions.TruncateTime(es.EncounterDate) == date)
                .Where(es =>
                    (startTime >= es.EncounterStartTime && startTime < es.EncounterEndTime) ||
                    (endTime > es.EncounterStartTime && endTime <= es.EncounterEndTime) ||
                    (es.EncounterStartTime >= startTime && es.EncounterStartTime < endTime) ||
                    (es.EncounterEndTime > startTime && es.EncounterEndTime <= endTime)
                );

            var overlapSchedules = _context.StudentTherapySchedules
                .Where(sts => !sts.Archived)
                .Where(sts => !sts.StudentTherapy.Archived)
                .Where(sts => sts.DeviationReasonId == null)
                // EncounterStudents haven't been created yet or haven't been viewed yet on ERFY page,
                // otherwise it should be covered by overlapEncounters query:
                .Where(sts => !sts.EncounterStudents.Any() || sts.EncounterStudents.All(es => es.Archived))
                .Where(sts => DbFunctions.TruncateTime(sts.ScheduleDate) == date)
                .Where(sts =>
                    (startTime >= sts.ScheduleStartTime && startTime < sts.ScheduleEndTime) ||
                    (endTime > sts.ScheduleStartTime && endTime <= sts.ScheduleEndTime) ||
                    (sts.ScheduleStartTime >= startTime && sts.ScheduleStartTime < endTime) ||
                    (sts.ScheduleEndTime > startTime && sts.ScheduleEndTime <= endTime)
                );

            return overlapEncounters.Any(es => es.StudentId == dto.StudentId || es.Encounter.ProviderId == providerId) ?
                dto.StudentId : 0;
        }
        public (IEnumerable<EncounterStudent> encounters, int count) SearchForReturnEncounters(Model.Core.CRUDSearchParams csp, int userId)
        {
            var baseQuery = _context.EncounterStudents
                .Include(es => es.Student)
                .Include(es => es.EncounterStatus)
                .Include(es => es.EncounterStudentStatus)
                .Include(es => es.EncounterStudentStatus.Select(ess => ess.CreatedBy))
                .Where(es => !es.Archived && es.Encounter.Provider.ProviderUserId == userId &&
                    (es.EncounterStatusId == (int)EncounterStatuses.Returned_BySupervisor_Encounter || es.EncounterStatusId == (int)EncounterStatuses.Returned_ByAdmin_Encounter))
                .AsNoTracking()
                .AsQueryable();

            if (!CommonFunctions.IsBlankSearch(csp.Query))
            {
                string[] terms = CommonFunctions.SplitTerms(csp.Query.Trim().ToLower());
                foreach (string t in terms)
                {
                    baseQuery = baseQuery.Where(s =>
                        s.Student.FirstName.ToLower().StartsWith(t) ||
                        s.Student.LastName.ToLower().StartsWith(t)
                    );
                }
            }

            if (!string.IsNullOrEmpty(csp.extraparams))
            {
                var extras = System.Web.HttpUtility.ParseQueryString(WebUtility.UrlDecode(csp.extraparams));
                if (extras["StartDate"] != null)
                {
                    var startDate = DateTime.Parse(extras["StartDate"]);
                    baseQuery = baseQuery.Where(encounterStudent => DbFunctions.TruncateTime(encounterStudent.EncounterDate) >= DbFunctions.TruncateTime(startDate));
                }
                if (extras["EndDate"] != null)
                {
                    var endDate = DateTime.Parse(extras["EndDate"]);
                    baseQuery = baseQuery.Where(encounterStudent => DbFunctions.TruncateTime(encounterStudent.EncounterDate) <= DbFunctions.TruncateTime(endDate));
                }
            }

            var count = baseQuery.Count();
            var encounters = baseQuery
                .OrderByDescending(e => e.EncounterDate)
                .Skip(csp.skip.GetValueOrDefault())
                .Take(csp.take.GetValueOrDefault())
                .AsEnumerable();

            return (encounters, count);
        }

        public void ArchiveEncounterStudentsByEncounter(int encounterId)
        {
            List<EncounterStudent> encounterStudents = _context.EncounterStudents.Where(es => es.EncounterId == encounterId).ToList();
            foreach (EncounterStudent es in encounterStudents)
            {
                es.Archived = true;
            }
            _context.SaveChanges();
        }
        public void ArchiveAll(Model.Core.CRUDSearchParams<Encounter> cspFull)
        {
            cspFull.StronglyTypedIncludes.Add((e) => e.EncounterStudents);
            var toArchive = base.GetAll(cspFull);
            var ids = GenerateSearchQuery(cspFull).Select(e => e.Id).ToList();
            var parameters = ids.Select((id, index) => new SqlParameter(string.Format("@p{0}", index), id));
            var parameterNames = string.Join(", ", parameters.Select(p => p.ParameterName));

            using (var transaction = _context.Database.BeginTransaction())
            {
                var encountersQueryString = string.Format("UPDATE dbo.Encounters SET Archived = 1 WHERE Id IN ({0})", parameterNames);
                _context.Database.ExecuteSqlCommand(encountersQueryString, parameters.ToArray());

                var encounterStudentsQueryString = string.Format("UPDATE dbo.EncounterStudents SET Archived = 1 WHERE EncounterId IN ({0})", parameterNames);
                _context.Database.ExecuteSqlCommand(encounterStudentsQueryString, parameters.ToArray());
                transaction.Commit();
            }


        }

        public void UpdateEvaluationDiagnosisCodes(int encounterId, int? diagnosisCodeId)
        {
            if (diagnosisCodeId == null)
            {
                throw new ValidationException("Reason for service is required for evaluations.");
            }

            var encounterStudents = _context.EncounterStudents.Where(es => es.EncounterId == encounterId && es.DiagnosisCodeId != diagnosisCodeId && !es.Archived);
            foreach(var encounterStudent in encounterStudents)
            {
                encounterStudent.DiagnosisCodeId = diagnosisCodeId;
            }
            _context.SaveChanges();
        }
    }
}
