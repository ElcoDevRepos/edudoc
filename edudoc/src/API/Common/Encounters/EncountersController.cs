using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Net;
using API.Base;
using API.Claims;
using API.Common.SearchUtilities;
using API.ControllerBase;
using API.CRUD;
using API.Core.Claims;
using Microsoft.AspNetCore.Mvc;
using Model;
using Model.DTOs;
using Model.Enums;
using Service.Auth;
using Service.Base;
using Service.Encounters;
using Service.Utilities;

namespace API.Common.Encounters
{
    [Route("api/v1/encounters")]
    [Restrict(ClaimTypes.Encounters, ClaimValues.ReadOnly | ClaimValues.FullAccess)]
    public class EncounterController : CrudBaseController<Encounter>
    {
        private readonly IEncounterService _encounterService;
        private readonly IEncounterStudentCptCodeService _encounterStudentCptCodeService;

        public EncounterController(
            ICRUDService crudService,
            IEncounterService encounterService,
            IAuthService authService,
            IEncounterStudentCptCodeService encounterStudentCptCodeService
        )
            : base(crudService)
        {
            Getbyincludes = new[]
            {
                "ServiceType",
                "EvaluationType",
                "NonMspService",
                "DiagnosisCode",
            };
            _encounterService = encounterService;
            _encounterStudentCptCodeService = encounterStudentCptCodeService;
        }

        public override IActionResult Update([FromRoute] int id, [FromBody] Encounter data)
        {
            return ExecuteValidatedAction(() =>
            {
                var encounterStudents = Crudservice.GetById<Encounter>(id, new[] { "EncounterStudents" }).EncounterStudents;

                var wasGroup = data.IsGroup;
                var totalStudentsCount = encounterStudents.Count(e => !e.Archived && e.StudentDeviationReasonId == null) + data.AdditionalStudents;
                data.IsGroup = totalStudentsCount > 1;


                if (!wasGroup && data.IsGroup)
                {
                    _encounterStudentCptCodeService.UpdateGroupCptCodes(id, this.GetUserId());
                }
                else if (wasGroup && !data.IsGroup)
                {
                    _encounterStudentCptCodeService.UpdateIndividualCptCodes(id, this.GetUserId());
                }

                if (
                    data.EncounterDate != null
                    && data.EncounterStartTime != null
                    && data.EncounterEndTime != null
                )
                {
                    DateTime date =
                        data.EncounterDate != null ? data.EncounterDate.Value.Date : new DateTime();
                    TimeSpan startTime = data.EncounterStartTime ?? new TimeSpan();
                    TimeSpan endTime = data.EncounterEndTime ?? new TimeSpan();
                    TimeZoneInfo tz = CommonFunctions.GetTimeZone();

                    DateTime now = DateTime.UtcNow;
                    // During DST offset is 240 mins, Non-DST offset is 300 mins
                    int DATE_OFFSET = -Convert.ToInt32(tz.GetUtcOffset(now).TotalMinutes);
                    data.EncounterStartTime = CommonFunctions.ConvertTimeSpanForDate(
                        startTime,
                        date.ToUniversalTime()
                    );
                    data.EncounterEndTime = CommonFunctions.ConvertTimeSpanForDate(
                        endTime,
                        date.ToUniversalTime()
                    );
                    data.EncounterDate = new DateTime(date.Year, date.Month, date.Day);
                }

                if (data.Archived)
                {
                    _encounterService.ArchiveEncounterStudentsByEncounter(data.Id);
                }

                if (data.ServiceTypeId == (int)ServiceTypes.Evaluation_Assessment)
                {
                    _encounterService.UpdateEvaluationDiagnosisCodes(data.Id, data.DiagnosisCodeId);
                }

                return base.Update(id, data);
            });
        }

        [Route("get-encounters")]
        [HttpGet]
        [Restrict(ClaimTypes.Encounters, ClaimValues.ReadOnly | ClaimValues.FullAccess)]
        public IActionResult GetEncounters([FromQuery] Model.Core.CRUDSearchParams csp)
        {
            var searchResults = _encounterService.SearchForEncounters(csp, this.GetUserId());
            return Ok(searchResults.encounters.ToSearchResults(searchResults.count).Respond(this));
        }

        [Route("update-status")]
        [HttpPut]
        [Restrict(ClaimTypes.Encounters, ClaimValues.ReadOnly | ClaimValues.FullAccess)]
        public IActionResult UpdateEncounterStatus([FromBody] ClaimAuditRequestDto request)
        {
            try
            {
                return ExecuteValidatedAction(() =>
                {
                    var isProvider =
                        this.GetUserRoleTypeId<Encounter>()
                        == (int)Model.Enums.UserTypeEnums.Provider;
                    _encounterService.UpdateClaimStatus(request, this.GetUserId(), isProvider);
                    return Ok();
                });
            }
            catch (UnauthorizedAccessException uae)
            {
                return Unauthorized(uae.Message.ToString());
            }
        }


        private (Model.Core.CRUDSearchParams<Encounter> searchParams, bool isEval) BuildSearchParams(Model.Core.CRUDSearchParams csp) {
            var cspFull = new Model.Core.CRUDSearchParams<Encounter>(csp)
            {
                StronglyTypedIncludes = new Model.Core.IncludeList<Encounter>
            {
                encounter => encounter.EncounterStudents,
                encounter => encounter.EncounterStudents.Select(es => es.Student),
                encounter => encounter.EncounterStudents.Select(es => es.EncounterStatus),
                encounter => encounter.EncounterStudents.Select(es => es.EncounterLocation),
                encounter => encounter.EncounterStudents.Select(es => es.CaseLoad),
                encounter => encounter.EncounterStudents.Select(es => es.CaseLoad.CaseLoadScripts),
                encounter => encounter.ServiceType,
                encounter => encounter.EvaluationType,
                encounter => encounter.EncounterStudents.Select(es => es.StudentTherapySchedule),
                encounter => encounter.EncounterStudents.Select(es => es.StudentTherapySchedule.StudentTherapy),
            }
            };

            cspFull.AddedWhereClause.Add(encounter => !encounter.Archived);

            cspFull.AddedWhereClause.Add(encounter =>
                !encounter.FromSchedule
                || (
                    encounter.FromSchedule
                    && encounter.EncounterStudents.Any(es =>
                        !es.StudentTherapySchedule.StudentTherapy.Archived
                    )
                )
            );

            cspFull.AddedWhereClause.Add(encounter =>
                !encounter.EncounterStudents.Any(es =>
                    es.EncounterStatusId == (int)EncounterStatuses.Invoiced
                    || es.EncounterStatusId == (int)EncounterStatuses.Invoiced_and_Paid
                )
            );

            if (!IsBlankQuery(csp.Query))
            {
                string[] terms = SplitSearchTerms(csp.Query);
                cspFull.AddedWhereClause.Add(p =>
                    terms.All(t =>
                        (
                            p.EncounterStudents.Any(x =>
                                x.Student.FirstName.StartsWith(t)
                                || (x.Student.LastName.StartsWith(t))
                            )
                        )
                    )
                );
            }

            var isEval = false;
            if (!string.IsNullOrEmpty(csp.extraparams))
            {
                var extraParamLists = SearchStaticMethods.GetBoolListFromExtraParams(
                    csp.extraparams,
                    new[]
                    {
                        "archivedstatus",
                        "returnedOnly",
                        "pendingEvaluationOnly",
                        "pendingTreatmentTherapyOnly",
                        "hideEmptyEncounters",
                    }
                );
                var extras = System.Web.HttpUtility.ParseQueryString(
                    WebUtility.UrlDecode(csp.extraparams)
                );

                var accessStatusList = extraParamLists["archivedstatus"];
                if (accessStatusList.Count > 0)
                    cspFull.AddedWhereClause.Add(encounter =>
                        accessStatusList.Contains(encounter.Archived)
                    );

                var returnedOnlyList = extraParamLists["returnedOnly"];
                if (returnedOnlyList.Count > 0 && returnedOnlyList[0])
                    cspFull.AddedWhereClause.Add(encounter =>
                        encounter.EncounterStudents.Any(es =>
                            es.EncounterStatusId
                                == (int)EncounterStatuses.Returned_ByAdmin_Encounter
                            || es.EncounterStatusId
                                == (int)EncounterStatuses.Returned_BySupervisor_Encounter
                        )
                    );

                var pendingEvaluationOnly = extraParamLists["pendingEvaluationOnly"];
                if (pendingEvaluationOnly.Count > 0 && pendingEvaluationOnly[0])
                {
                    isEval = true;
                    cspFull.AddedWhereClause.Add(encounter =>
                        encounter.EncounterStudents.Any(es =>
                            es.EncounterDate < DateTime.Now
                            && !es.DateESigned.HasValue
                            && !es.Archived
                        )
                        && encounter.ServiceTypeId == (int)ServiceTypes.Evaluation_Assessment
                    );
                }

                var pendingTreatmentTherapyOnly = extraParamLists["pendingTreatmentTherapyOnly"];
                if (pendingTreatmentTherapyOnly.Count > 0 && pendingTreatmentTherapyOnly[0])
                    cspFull.AddedWhereClause.Add(encounter =>
                        encounter.EncounterStudents.Any(es =>
                            es.EncounterDate < DateTime.Now
                            && !es.DateESigned.HasValue
                            && !es.Archived
                        )
                        && encounter.ServiceTypeId == (int)ServiceTypes.Treatment_Therapy
                    );

                var hideEmptyEncounters = extraParamLists["hideEmptyEncounters"];
                if (hideEmptyEncounters.Count > 0 && hideEmptyEncounters[0])
                    cspFull.AddedWhereClause.Add(encounter =>
                        encounter.EncounterStudents.Any(es => !es.Archived)
                    );

                var providerIdParam = SearchStaticMethods.GetIntParametersFromExtraParams(
                    csp.extraparams,
                    "providerId"
                );
                var providerId = providerIdParam["providerId"];

                if (providerId > 0)
                    cspFull.AddedWhereClause.Add(encounter => encounter.ProviderId == providerId);

                var studentidsParamsList = SearchStaticMethods.GetIntListFromExtraParams(
                    csp.extraparams,
                    "studentids"
                );
                var studentids = studentidsParamsList["studentids"];

                if (studentids.Count > 0)
                    cspFull.AddedWhereClause.Add(encounter =>
                        encounter.EncounterStudents.Any(student =>
                            studentids.Contains(student.StudentId)
                        )
                    );

                if (extras["StartDate"] != null)
                {
                    var startDate = DateTime.Parse(extras["StartDate"]);
                    cspFull.AddedWhereClause.Add(encounter =>
                        DbFunctions.TruncateTime(encounter.EncounterDate)
                        >= DbFunctions.TruncateTime(startDate)
                    );
                }
                if (extras["EndDate"] != null)
                {
                    var endDate = DateTime.Parse(extras["EndDate"]);
                    cspFull.AddedWhereClause.Add(encounter =>
                        DbFunctions.TruncateTime(encounter.EncounterDate)
                        <= DbFunctions.TruncateTime(endDate)
                    );
                }

                var districtIdsParamsList = SearchStaticMethods.GetIntListFromExtraParams(
                    csp.extraparams,
                    "districtids"
                );
                var districtIds = districtIdsParamsList["districtids"];
                if (districtIds.Count > 0)
                {
                    cspFull.AddedWhereClause.Add(encounter =>
                        encounter.EncounterStudents.Any(es =>
                            districtIds.Any(id => es.Student.DistrictId == id)
                        )
                    );
                }
            }

            cspFull.SortList.Enqueue(
                new KeyValuePair<string, string>(csp.order, csp.orderdirection)
            );
            cspFull.SortList.Enqueue(new KeyValuePair<string, string>("Id", "desc"));

            return (cspFull, isEval);
        }

        public override IActionResult Search([FromQuery] Model.Core.CRUDSearchParams csp)
        {
            var (cspFull, isEval) = BuildSearchParams(csp);

            if (isEval)
            {
                return Ok(
                    Crudservice
                        .Search(cspFull, out int count)
                        .AsQueryable()
                        .OrderBy(e => e.EncounterStudents.FirstOrDefault().Student.LastName)
                        .ThenBy(e => e.EncounterStudents.FirstOrDefault().Student.FirstName)
                        .ToSearchResults(count)
                        .Respond(this)
                );
            }
            else
            {
                return Ok(
                    Crudservice
                        .Search(cspFull, out int count)
                        .AsQueryable()
                        .OrderByDescending(e => e.EncounterDate)
                        .ThenBy(e => e.EncounterStudents.FirstOrDefault().Student.LastName)
                        .ToSearchResults(count)
                        .Respond(this)
                );
            }
        }

        [HttpPost]
        [Route("student-therapy-schedule")]
        [Restrict(ClaimTypes.Encounters, ClaimValues.ReadOnly | ClaimValues.FullAccess)]
        public IActionResult BuildFromStudentTherapySchedule(
            [FromBody] StudentTherapiesRequestDto dto
        )
        {
            return Ok(
                _encounterService.GetEncounterFromStudentTherapySchedule(dto, this.GetUserId())
            );
        }

        [HttpGet]
        [Route("returned-encounters")]
        public IActionResult GetReturnedEncountersCount()
        {
            return Ok(_encounterService.GetReturnedEncountersCount(this.GetUserId()));
        }

        [HttpGet]
        [Route("pending-approvals")]
        public IActionResult GetPendingApprovalsCount()
        {
            return Ok(_encounterService.GetPendingApprovalsCount(this.GetUserId()));
        }

        [HttpGet]
        [Route("pending-treatment-therapies")]
        public IActionResult GetPendingTreatmentTherapiesCount()
        {
            return Ok(_encounterService.GetPendingTreatmentTherapiesCount(this.GetUserId()));
        }

        [HttpGet]
        [Route("pending-evaluations")]
        public IActionResult GetPendingEvaluationsCount()
        {
            return Ok(_encounterService.GetPendingEvaluationsCount(this.GetUserId()));
        }

        [HttpGet]
        [Route("individual-encounter/{encounterStudentId:int}")]
        public IEnumerable<Encounter> GetByEncounterStudentId(int encounterStudentId)
        {
            var csp = new Model.Core.CRUDSearchParams<Encounter> { };
            csp.AddedWhereClause.Add(e => e.EncounterStudents.Any(es => es.Id == encounterStudentId));
            csp.Includes = Getbyincludes;
            csp.DefaultOrderBy = "Id";
            return Crudservice.GetAll(csp);
        }

        [HttpGet]
        [Route("assistant-encounters")]
        public IActionResult GetAssistantEncounters([FromQuery] Model.Core.CRUDSearchParams csp)
        {
            var searchResults = _encounterService.SearchForAssistantEncounters(
                csp,
                this.GetUserId()
            );
            return Ok(
                searchResults
                    .encounters.AsQueryable()
                    .ToSearchResults(searchResults.count)
                    .Respond(this)
            );
        }

        [HttpPost]
        [Route("overlap")]
        [Restrict(ClaimTypes.Encounters, ClaimValues.ReadOnly | ClaimValues.FullAccess)]
        public IActionResult CheckEncounterStudentOverlap([FromBody] EncounterOverlapDto dto)
        {
            return ExecuteValidatedAction(() =>
            {
                return Ok(_encounterService.CheckEncounterStudentOverlap(dto));
            });
        }

        [HttpGet]
        [Route("return-encounters")]
        public IActionResult GetReturnEncounters([FromQuery] Model.Core.CRUDSearchParams csp)
        {
            var searchResults = _encounterService.SearchForReturnEncounters(csp, this.GetUserId());
            return Ok(
                searchResults
                    .encounters.AsQueryable()
                    .ToSearchResults(searchResults.count)
                    .Respond(this)
            );
        }

        [HttpGet]
        [Route("get-encounter-numbers/{encounterId:int}")]
        public IEnumerable<string> GetEncounterNumbers(int encounterId)
        {
            var csp = new Model.Core.CRUDSearchParams<EncounterStudent> { };
            csp.AddedWhereClause.Add(es => es.EncounterId == encounterId);
            csp.DefaultOrderBy = "Id";
            return Crudservice.GetAll(csp).Select(es => es.EncounterNumber);
        }

        [HttpGet]
        [Route("archive-selected")]
        public IActionResult ArchiveSelected([FromQuery] Model.Core.CRUDSearchParams csp)
        {
            return ExecuteValidatedAction(() =>
            {
                var (cspFull, _) = BuildSearchParams(csp);
                _encounterService.ArchiveAll(cspFull);
                return Ok();
            });
        }
    }
}
