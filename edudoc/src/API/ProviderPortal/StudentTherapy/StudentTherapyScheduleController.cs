using API.Core.Claims;
using API.Common.SearchUtilities;
using API.CRUD;
using Microsoft.AspNetCore.Mvc;
using Model;
using Service.Base;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Net;
using API.ControllerBase;
using Model.DTOs;
using Service.Utilities;
using API.Common;
using Service.Encounters.StudentTherapies;
using Model.Enums;

namespace API.ProviderPortal.StudentTherapies
{
    [Route("api/v1/student-therapy-schedule")]

    [Restrict(ClaimTypes.CreateTherapyEncounter, ClaimValues.ReadOnly | ClaimValues.FullAccess)]

    public class StudentTherapyScheduleController : CrudBaseController<StudentTherapySchedule>
    {
        private readonly IStudentTherapyScheduleService _studentTherapyScheduleService;
        public StudentTherapyScheduleController(ICRUDService crudService,
            IStudentTherapyScheduleService studentTherapyScheduleService) : base(crudService)
        {
            _studentTherapyScheduleService = studentTherapyScheduleService;
        }

        private IEnumerable<StudentTherapiesDto> BaseStudentTherapySearch(Model.Core.CRUDSearchParams csp)
        {
            var cspFull = new Model.Core.CRUDSearchParams<StudentTherapySchedule>(csp)
            {
                StronglyTypedIncludes = new Model.Core.IncludeList<StudentTherapySchedule>
                {
                    sts => sts.StudentTherapy.CaseLoad.Student,
                    sts => sts.StudentTherapy.EncounterLocation,
                    sts => sts.StudentTherapy.TherapyGroup,
                    sts => sts.EncounterStudents
                }
            };
            cspFull.skip = 0;
            cspFull.take = null;

            var userId = this.GetUserId();
            cspFull.AddedWhereClause.Add(sts => sts.DeviationReasonId == null);

            if (!string.IsNullOrEmpty(csp.extraparams))
            {
                var extras = System.Web.HttpUtility.ParseQueryString(WebUtility.UrlDecode(cspFull.extraparams));

                var extraParamLists = SearchStaticMethods.GetBoolListFromExtraParams(csp.extraparams, "IncludeArchived");
                var includeArchived = extraParamLists["IncludeArchived"].ElementAtOrDefault(0);

                cspFull.AddedWhereClause.Add(sts => !sts.Archived || sts.Archived == includeArchived);

                var weekdayParamList = SearchStaticMethods.GetIntListFromExtraParams(csp.extraparams, "WeekdayIds");
                var weekdayIds = weekdayParamList["WeekdayIds"];
                if (weekdayIds.Any())
                {
                    var firstSunday = new DateTime(2009, 1, 4);
                    cspFull.AddedWhereClause.Add(sts => weekdayIds.Contains((int)DbFunctions.DiffDays(firstSunday, sts.ScheduleDate) % 7));
                }

                if (extras["StartDate"] != null)
                {
                    var startDate = DateTime.Parse(extras["StartDate"]);
                    cspFull.AddedWhereClause.Add(sts => DbFunctions.TruncateTime(sts.ScheduleDate) >= DbFunctions.TruncateTime(startDate));
                }
                if (extras["EndDate"] != null)
                {
                    var endDate = DateTime.Parse(extras["EndDate"]);
                    cspFull.AddedWhereClause.Add(sts => DbFunctions.TruncateTime(sts.ScheduleDate) <= DbFunctions.TruncateTime(endDate));
                }

                var calendarParamList = SearchStaticMethods.GetBoolListFromExtraParams(csp.extraparams, "ForDocumentationCalendar");
                var calendarParam = calendarParamList["ForDocumentationCalendar"];
                if (!calendarParam.Any())
                {
                    cspFull.AddedWhereClause.Add(sts =>
                        (sts.EncounterStudents.Any() && sts.EncounterStudents.All(es => es.Archived)) ||
                        sts.EncounterStudents.Where(es => !es.Archived).Any(es => es.EncounterStatusId == (int)EncounterStatuses.OPEN_ENCOUNTER_READY_FOR_YOU));
                }
                else
                {
                    cspFull.AddedWhereClause.Add(sts => (sts.EncounterStudents.Any() && sts.EncounterStudents.All(es => es.Archived))
                        || sts.EncounterStudents.Any(es => !es.Archived));
                }
            }

            cspFull.AddedWhereClause.Add(sts => sts.StudentTherapy.CreatedById == userId);

            cspFull.SortList.Enqueue(
                new KeyValuePair<string, string>(nameof(StudentTherapySchedule.ScheduleDate), "desc"));

            var baseSearch = Crudservice.Search(cspFull, out int count);

            var groupTherapies = baseSearch
                .GroupBy(s => new
                {
                    date = s.ScheduleDate.GetValueOrDefault().Date,
                    groupId = s.StudentTherapy.TherapyGroupId > 0 ? s.StudentTherapy.TherapyGroupId : -s.Id
                })
                .Select(grp => new StudentTherapiesDto
                {
                    Id = grp.FirstOrDefault().Id,
                    StartTime = DateTime.Parse((grp.Key.date + grp.OrderBy(therapy => therapy.ScheduleStartTime).FirstOrDefault().ScheduleStartTime).GetValueOrDefault().ToString("g")),
                    EndTime = DateTime.Parse((grp.Key.date + grp.OrderByDescending(therapy => therapy.ScheduleEndTime).FirstOrDefault().ScheduleEndTime).GetValueOrDefault().ToString("g")),
                    Name = grp.Select(s => s.StudentTherapy.TherapyGroup?.Name).FirstOrDefault() != null ? grp.Select(s => s.StudentTherapy.TherapyGroup?.Name).FirstOrDefault() : grp.Select(s => s.StudentTherapy.SessionName).FirstOrDefault(),
                    Location = grp.Select(s => s.StudentTherapy.EncounterLocation.Name).Distinct(new CommonFunctions.StringComparer()),
                    Students = grp.OrderBy(s => s.StudentTherapy.CaseLoad.Student.LastName).Select(s => $"{s.StudentTherapy.CaseLoad.Student.LastName}, {s.StudentTherapy.CaseLoad.Student.FirstName}"),
                    TherapySchedules = grp,
                    GroupId = grp.Key.groupId,
                    IsEsigned = grp.SelectMany(s => s.EncounterStudents).All(es => es.ESignedById != null)
                        && !grp.SelectMany(s => s.EncounterStudents).Any(es => (es.EncounterStatusId == (int)EncounterStatuses.Returned_BySupervisor_Encounter
                            || es.EncounterStatusId == (int)EncounterStatuses.Returned_ByAdmin_Encounter)),
                });

            if (!IsBlankQuery(csp.Query))
            {
                string[] terms = SplitSearchTerms(csp.Query.Trim().ToLower());
                foreach (string t in terms)
                {
                    groupTherapies = groupTherapies.Where(gt =>
                                                        gt.Students.Any(student => student.ToLower().StartsWith(t)) ||
                                                        (gt.Name != null && gt.Name.ToLower().StartsWith(t))
                                                    );
                }
            }

            if (!string.IsNullOrEmpty(csp.extraparams))
            {
                var extras = System.Web.HttpUtility.ParseQueryString(WebUtility.UrlDecode(cspFull.extraparams));

                var studentTypeIdParamList = SearchStaticMethods.GetIntListFromExtraParams(csp.extraparams, "StudentTypeIds");
                var studentTypeIds = studentTypeIdParamList["StudentTypeIds"];
                if (studentTypeIds.Any())
                    groupTherapies = groupTherapies.Where(gt => gt.TherapySchedules.Any(sts => studentTypeIds.Contains(sts.StudentTherapy.CaseLoad.StudentTypeId)));

                if (extras["StudentTherapyId"] != null)
                {
                    var studentTherapyId = int.Parse(extras["StudentTherapyId"]);
                    groupTherapies = groupTherapies.Where(gt => gt.TherapySchedules.Any(sts => sts.StudentTherapyId == studentTherapyId));
                }

            }

            groupTherapies = CommonFunctions.OrderByDynamic(groupTherapies.AsQueryable(), csp.order ?? "StartTime", csp.orderdirection == "desc");

            var ct = groupTherapies.Count();

            if (csp.take.GetValueOrDefault() > 0)
            {
                groupTherapies = groupTherapies
                        .Skip(csp.skip.GetValueOrDefault())
                        .Take(csp.take.GetValueOrDefault());
            }

            return groupTherapies
                        .AsQueryable()
                        .OrderBy(t => t.IsEsigned)
                        .ThenBy(t => t.StartTime)
                        .ToSearchResults(ct)
                        .Respond(this);
        }

        [HttpGet]
        [Route("list")]
        public IActionResult SearchForList([FromQuery] Model.Core.CRUDSearchParams csp)
        {
            return Ok(BaseStudentTherapySearch(csp));
        }

        [HttpGet]
        [Route("next")]
        public IActionResult GetNextStudentTherapySchedule([FromQuery] Model.Core.CRUDSearchParams csp)
        {
            return Ok(BaseStudentTherapySearch(csp));
        }

        [HttpPost]
        [Route("set-deviation-reason")]
        public IActionResult SetDeviationReason([FromBody] StudentTherapyScheduleDeviationReasonDto dr)
        {
            return Ok(_studentTherapyScheduleService.SetDeviationReason(dr.StudentTherapyScheduleIds,
                dr.DeviationReasonId, dr.DeviationReasonDate));
        }

        [HttpGet]
        [Route("list-by-day")]
        public IActionResult SearchForListByDay([FromQuery] Model.Core.CRUDSearchParams csp)
        {
            var cspFull = new Model.Core.CRUDSearchParams<StudentTherapy>(csp);
            var weekdayIds = new List<int>();
            if (!string.IsNullOrEmpty(csp.extraparams))
            {
                var extras = System.Web.HttpUtility.ParseQueryString(WebUtility.UrlDecode(cspFull.extraparams));

                var weekdayParamList = SearchStaticMethods.GetIntListFromExtraParams(csp.extraparams, "WeekdayIds");
                weekdayIds = weekdayParamList["WeekdayIds"];
            }
            return Ok(_studentTherapyScheduleService.GetStudentTherapiesByDay(weekdayIds, this.GetUserId()));
        }

        [HttpGet]
        [Route("calendar")]
        public IActionResult GetForCalendar([FromQuery] Model.Core.CRUDSearchParams csp)
        {
            return Ok(_studentTherapyScheduleService.GetForCalendar(csp, this.GetUserId()));
        }

        [HttpPost]
        [Route("toggle-archived")]
        public IActionResult ToggleArchived([FromBody] List<int> scheduleIds) {
            _studentTherapyScheduleService.ToggleArchived(scheduleIds);
            return Ok();
        }
    }
}
