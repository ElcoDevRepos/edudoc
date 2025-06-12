using API.Core.Claims;
using API.Common;
using API.ControllerBase;
using API.CRUD;
using Microsoft.AspNetCore.Mvc;
using Model;
using Model.DTOs;
using Service.Base;
using Service.CaseLoads;
using Service.DiagnosisCodes;
using Service.Encounters.ProviderStudentSupervisors;
using Service.Encounters.Referrals;
using Service.Providers;
using Service.SchoolDistricts;
using Service.Students;
using Service.Utilities;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Data.Entity.SqlServer;
using System.Linq;
using System.Linq.Expressions;
using System.Net;

namespace API.ProviderPortal.CaseLoads
{

    [Route("api/v1/case-load")]
    [Restrict(ClaimTypes.MyCaseload, ClaimValues.ReadOnly | ClaimValues.FullAccess)]

    public class CaseLoadController : CrudBaseController<CaseLoad>
    {

        private readonly IStudentService _studentService;
        private readonly ISchoolDistrictService _schoolDistrictService;
        private readonly ICaseLoadService _caseLoadService;
        private readonly IDiagnosisCodeService _diagnosisCodeService;
        private readonly IProviderService _providerService;
        private readonly IProviderStudentSupervisorService _providerStudentSupervisorService;
        private readonly ISupervisorProviderStudentReferalSignOffService _supervisorProviderStudentReferalSignOffService;

        public CaseLoadController(
                    IStudentService studentService,
                    ISchoolDistrictService schoolDistrictService,
                    ICaseLoadService caseLoadService,
                    IDiagnosisCodeService diagnosisCodeService,
                    IProviderService providerService,
                    IProviderStudentSupervisorService providerStudentSupervisorService,
                    ISupervisorProviderStudentReferalSignOffService supervisorProviderStudentReferalSignOffService,
                    ICRUDService crudService
                ) : base(crudService)
        {
            _studentService = studentService;
            _schoolDistrictService = schoolDistrictService;
            _caseLoadService = caseLoadService;
            _diagnosisCodeService = diagnosisCodeService;
            _providerService = providerService;
            _supervisorProviderStudentReferalSignOffService = supervisorProviderStudentReferalSignOffService;
            _providerStudentSupervisorService = providerStudentSupervisorService;
        }

        [HttpGet]
        [Route("provider/students")]
        [Restrict(ClaimTypes.MyCaseload, ClaimValues.ReadOnly | ClaimValues.FullAccess)]
        public IEnumerable<ProviderCaseLoadDTO> SearchStudents([FromQuery] Model.Core.CRUDSearchParams csp)
        {
            var providerCaseLoadSearch = _studentService.ProviderSearchCaseLoads(csp, this.GetUserId());
            return providerCaseLoadSearch.Student
                        .ToSearchResults(providerCaseLoadSearch.Count)
                        .Respond(this);
        }

        [HttpGet]
        [Route("provider/students-missing-referrals")]
        [Restrict(ClaimTypes.MyCaseload, ClaimValues.ReadOnly | ClaimValues.FullAccess)]
        public IEnumerable<ProviderCaseLoadDTO> SearchStudentsForMissingReferrals([FromQuery] Model.Core.CRUDSearchParams csp)
        {
            var providerCaseLoadSearch = _studentService.ProviderSearchMissingReferrals(csp, this.GetUserId());
            return providerCaseLoadSearch.Student
                        .ToSearchResults(providerCaseLoadSearch.Count)
                        .Respond(this);
        }

        [HttpGet]
        [Route("provider/student-options")]
        [Restrict(ClaimTypes.MyCaseload, ClaimValues.ReadOnly | ClaimValues.FullAccess)]
        public IEnumerable<SelectOptions> GetStudentOptions([FromQuery] Model.Core.CRUDSearchParams csp)
        {
            var cspFull = new Model.Core.CRUDSearchParams<Student>(csp);
            cspFull.StronglyTypedIncludes = new Model.Core.IncludeList<Student>
            {
                student => student.SchoolDistrict,
                student => student.School,
                student => student.School.SchoolDistrictsSchools.Select(s => s.SchoolDistrict),
            };
            cspFull.AddedWhereClause.Add(student => !student.Archived);

            if (!IsBlankQuery(csp.Query))
            {
                string[] terms = SplitSearchTerms(csp.Query);

                foreach (string t in terms)
                {
                    cspFull.AddedWhereClause.Add(student =>
                                                      student.FirstName.StartsWith(t) ||
                                                      student.LastName.StartsWith(t)
                                                 );
                }
            }

            if (!string.IsNullOrEmpty(csp.extraparams))
            {
                var extras = System.Web.HttpUtility.ParseQueryString(WebUtility.UrlDecode(csp.extraparams));
                int? providerId = int.TryParse(extras["providerId"], out int _providerId) ? _providerId : null;

                DateTime encounterDate;
                if(!DateTime.TryParse(extras["encounterDate"], out encounterDate)) {
                    encounterDate = DateTime.Now;
                }

                if (extras["fromCaseLoad"] == "1" && providerId.HasValue)
                {
                    if(extras["alsoIncludeAssistantStudents"] == "1") {
                        cspFull.AddedWhereClause.Add(student => student.ProviderStudents.Any(ps => ps.ProviderId == providerId) || student.ProviderStudentSupervisors.Any(pss => pss.SupervisorId == providerId));
                    } else {
                        cspFull.AddedWhereClause.Add(student => student.ProviderStudents.Any(ps => ps.ProviderId == providerId));
                    }

                    if (extras["getForAssistant"] == "1")
                    {
                        cspFull.AddedWhereClause.Add(student => student.ProviderStudentSupervisors
                                                                       .Any(pss => pss.AssistantId == providerId
                                                                        && (!pss.EffectiveEndDate.HasValue || pss.EffectiveEndDate.Value > encounterDate)));
                    }
                }


                if (providerId.HasValue)
                {
                    cspFull.AddedWhereClause.Add(student =>
                        student.SchoolDistrict.ProviderEscSchoolDistricts
                            .Any(z => z.ProviderEscAssignment.ProviderId == providerId && !z.ProviderEscAssignment.Archived && (z.ProviderEscAssignment.EndDate == null || z.ProviderEscAssignment.EndDate >= encounterDate)));
                }

                if (extras["districtId"] != null && int.TryParse(extras["districtId"], out int districtId) && districtId != 0) {
                    cspFull.AddedWhereClause.Add(student => student.DistrictId == districtId);
                }

                if (extras["hasPlan"] == "1" && providerId.HasValue)
                {

                    var provider = Crudservice.GetById<Provider>(
                        providerId.Value,
                        new string[]
                        {
                            "ProviderTitle",
                        });
                        if(provider != null) {
                            cspFull.AddedWhereClause.Add(student => student.CaseLoads.Any(cl => !cl.Archived && cl.ServiceCodeId == provider.ProviderTitle.ServiceCodeId));
                        }
                }
            }

            cspFull.SortList.Enqueue(new KeyValuePair<string, string>("LastName", "asc"));
            cspFull.SortList.Enqueue(new KeyValuePair<string, string>("FirstName", "asc"));

            var students = Crudservice.Search(cspFull, out _).AsEnumerable();

            return students.Select(x => new SelectOptions
            {
                Id = x.Id,
                Name = $"{x.LastName}, {x.FirstName} - {x.DateOfBirth.Date.ToShortDateString()} - {x.StudentCode}"
            });
        }

        [HttpGet]
        [Route("provider/students/non-caseload")]
        [Restrict(ClaimTypes.MyCaseload, ClaimValues.ReadOnly | ClaimValues.FullAccess)]
        public IActionResult GetNonCaseloadStudents([FromQuery] Model.Core.CRUDSearchParams csp)
        {
            var cspFull = new Model.Core.CRUDSearchParams<Student>(csp);
            cspFull.StronglyTypedIncludes = new Model.Core.IncludeList<Student>
            {
                student => student.CaseLoads
            };

            if (!IsBlankQuery(csp.Query))
            {
                string[] terms = SplitSearchTerms(csp.Query.Trim().ToLower());
                cspFull.AddedWhereClause.Add(student => terms.Any(t =>
                    student.FirstName.ToLower().StartsWith(t.ToLower())
                ));
            }

            if (!string.IsNullOrEmpty(csp.extraparams))
            {
                var extras = System.Web.HttpUtility.ParseQueryString(WebUtility.UrlDecode(csp.extraparams));

                if (extras["districtId"] != null && extras["districtId"] != "0")
                {
                    int districtId = int.Parse(extras["districtId"]);

                    cspFull.AddedWhereClause.Add(student => student.School.SchoolDistrictsSchools.Any(y => y.SchoolDistrictId == districtId));
                }
                if (extras["providerId"] != null)
                {
                    int providerId = int.Parse(extras["providerId"]);
                    cspFull.AddedWhereClause.Add(student => student.SchoolDistrict
                        .ProviderEscSchoolDistricts.Any(z => z.ProviderEscAssignment.ProviderId == providerId && !z.ProviderEscAssignment.Archived &&
                            (z.ProviderEscAssignment.EndDate == null || z.ProviderEscAssignment.EndDate >= DateTime.Now)));

                    cspFull.AddedWhereClause.Add(student => !student.ProviderStudents.Any(y => y.ProviderId == providerId));
                }
                if (extras["newStudentLastName"] != null)
                {
                    var lastName = extras["newStudentLastName"];
                    cspFull.AddedWhereClause.Add(student => student.LastName.ToLower().StartsWith(lastName.ToLower()));
                }
            }

            // Ensure that sorting by LastName and FirstName occurs
            cspFull.SortList.Clear();

            // Primary sort by LastName, secondary sort by FirstName
            cspFull.SortList.Enqueue(new KeyValuePair<string, string>("LastName", "asc"));
            cspFull.SortList.Enqueue(new KeyValuePair<string, string>("FirstName", "asc"));

            int ct;
            return Ok(Crudservice.Search(cspFull, out ct).AsQueryable()
                                .ToSearchResults(ct)
                                .Respond(this));
        }


        [HttpGet]
        [Route("provider/{providerId:int}/reason-for-service-options")]
        [Restrict(ClaimTypes.MyCaseload, ClaimValues.ReadOnly | ClaimValues.FullAccess)]
        public IEnumerable<DiagnosisCode> GetReasonForServiceOptions(int providerId)
        {

            return _diagnosisCodeService.GetReasonForServiceOptions(providerId);
        }

        [HttpGet]
        [Route("students/{studentId:int}/detail")]
        [Restrict(ClaimTypes.MyCaseload, ClaimValues.ReadOnly | ClaimValues.FullAccess)]
        public List<CaseLoad> GetCaseLoadByStudentId(int studentId)
        {
            return _caseLoadService.GetCaseLoadsByStudentId(studentId, this.GetUserId());
        }

        [HttpGet]
        [Route("schedule/{therapyScheduleId:int}/detail")]
        [Restrict(ClaimTypes.MyCaseload, ClaimValues.ReadOnly | ClaimValues.FullAccess)]
        public CaseLoad GetCaseLoadByTherapyScheduleId(int therapyScheduleId)
        {
            return _caseLoadService.GetCaseLoadByTherapyScheduleId(therapyScheduleId, this.GetUserId());
        }

        [HttpGet]
        [Route("students/{studentId:int}")]
        [Restrict(ClaimTypes.MyCaseload, ClaimValues.ReadOnly | ClaimValues.FullAccess)]
        public IActionResult GetStudentById(int studentId)
        {
            return Ok(_studentService.GetStudentById(studentId, this.GetUserId()));
        }

        [HttpGet]
        [Route("provider/{providerId:int}/supervisor-options")]
        [Restrict(ClaimTypes.MyCaseload, ClaimValues.ReadOnly | ClaimValues.FullAccess)]
        public IActionResult GetSupervisorOptions(int providerId)
        {
            return Ok(_providerService.GetSupervisorOptions(providerId));
        }

        [HttpGet]
        [Route("provider/{providerId:int}/assistant-options")]
        [Restrict(ClaimTypes.MyCaseload, ClaimValues.ReadOnly | ClaimValues.FullAccess)]
        public IActionResult GetAssistantOptions(int providerId)
        {
            return Ok(_providerService.GetAssistantOptions(providerId));
        }

        [HttpPut]
        [Route("students/assign-supervisor")]
        [Restrict(ClaimTypes.MyCaseload, ClaimValues.FullAccess)]
        public IActionResult AssignStudentSupervisor([FromBody] ProviderStudentSupervisor providerStudentSupervisor)
        {
            return ExecuteValidatedAction(() =>
            {
                var assignment = _providerStudentSupervisorService.AssignSupervisor(providerStudentSupervisor, this.GetUserId());
                return Ok(assignment);
            });
        }

        [HttpPut]
        [Route("students/assign-assistant")]
        [Restrict(ClaimTypes.MyCaseload, ClaimValues.FullAccess)]
        public IActionResult AssignStudentAssistant([FromBody] ProviderStudentSupervisor providerStudentSupervisor)
        {
            return ExecuteValidatedAction(() =>
            {
                var assignment = _providerStudentSupervisorService.AssignAssistant(providerStudentSupervisor, this.GetUserId());
                return Ok(assignment);
            });
        }

        [HttpPut]
        [Route("students/update-assignment")]
        [Restrict(ClaimTypes.MyCaseload, ClaimValues.FullAccess)]
        public IActionResult UpdateProviderStudentSupervisor([FromBody] ProviderStudentSupervisor providerStudentSupervisor)
        {
            return ExecuteValidatedAction(() =>
            {
                return Ok(_providerStudentSupervisorService.UpdateProviderStudentSupervisor(providerStudentSupervisor, this.GetUserId()));
            });
        }

        [HttpGet]
        [Route("students/unassign-assignment/{id:int}")]
        [Restrict(ClaimTypes.MyCaseload, ClaimValues.FullAccess)]
        public IActionResult UnassignProviderStudentSupervisor(int id)
        {
            return ExecuteValidatedAction(() =>
            {
                var assignment = _providerStudentSupervisorService.UnassignProviderStudentSupervisor(id, this.GetUserId());
                return Ok(assignment);
            });
        }

        [HttpPut]
        [Route("students/sign-referral")]
        [Restrict(ClaimTypes.MyCaseload, ClaimValues.FullAccess)]
        public IActionResult SignReferral([FromBody] ReferralSignOffRequest referralSignOffRequest)
        {
            return ExecuteValidatedAction(() =>
            {
                return Ok(_supervisorProviderStudentReferalSignOffService.SignReferral(referralSignOffRequest, this.GetUserId()));
            });
        }

        [HttpGet]
        [Route("pending-referrals/{providerId:int}")]
        public IActionResult GetReferralsCount(int providerId)
        {
            return Ok(_providerService.GetReferralsCount(providerId));
        }

        [HttpGet]
        [Route("provider/{providerId:int}/send-reminder/{studentId:int}")]
        [Restrict(ClaimTypes.MyCaseload, ClaimValues.ReadOnly | ClaimValues.FullAccess)]

        public IActionResult SendReferralReminder(int providerId, int studentId)
        {
            return ExecuteValidatedAction(() =>
            {
                _supervisorProviderStudentReferalSignOffService.SendReferralReminder(providerId, studentId, this.GetUserId());
                return Ok();
            });
        }

        [HttpPut]
        [Route("students/{studentId:int}/assignEsc")]
        [Restrict(ClaimTypes.MyCaseload, ClaimValues.FullAccess)]
        public IActionResult AssignStudentEsc([FromBody] int escId, int studentId)
        {
            return Ok(_studentService.AssignStudentEsc(studentId, escId, this.GetUserId()));
        }

        [HttpPut]
        [Route("students/assignSchool")]
        [Restrict(ClaimTypes.MyCaseload, ClaimValues.FullAccess)]
        public IActionResult AssignStudentSchool([FromBody] Student student)
        {
            return Ok(_studentService.AssignStudentSchool(student.Id, (int)student.DistrictId, student.SchoolId, this.GetUserId()));
        }

        [HttpGet]
        [Route("provider/{escId:int}/district-options")]
        [Restrict(ClaimTypes.MyCaseload, ClaimValues.ReadOnly | ClaimValues.FullAccess)]

        public IActionResult GetDistrictOptions(int escId)
        {
            return ExecuteValidatedAction(() =>
            {
                return Ok(_schoolDistrictService.GetDistrictsByEscId(this.GetUserId(), escId));
            });
        }

        [HttpPut]
        [Route("students/remove")]
        [Restrict(ClaimTypes.MyCaseload, ClaimValues.FullAccess)]
        public IActionResult RemoveStudentFromCaseload([FromBody] int studentId)
        {
            return ExecuteValidatedAction(() =>
            {
                return Ok(_caseLoadService.RemoveStudentFromCaseload(studentId, this.GetUserId()));
            });
        }


        [HttpPost]
        [Route("provider/add")]
        public IActionResult AddProviderCaseLoad([FromBody] int studentId)
        {
            var providerId = Crudservice.GetById<User>(this.GetUserId(), new[] { "Providers_ProviderUserId" }).Providers_ProviderUserId.FirstOrDefault().Id;

            var data = new ProviderStudent()
            {
                ProviderId = providerId,
                StudentId = studentId,
            };

            int resultId = Crudservice.Create(data);
            return Ok(resultId);
        }

    }
}
