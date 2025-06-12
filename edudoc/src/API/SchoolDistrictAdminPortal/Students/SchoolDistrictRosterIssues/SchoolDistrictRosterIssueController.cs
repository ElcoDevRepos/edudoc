using API.Core.Claims;
using API.Common;
using API.ControllerBase;
using API.CRUD;
using Microsoft.AspNetCore.Components.Routing;
using Microsoft.AspNetCore.Mvc;
using Model;
using Model.DTOs;
using Service.Base;
using Service.SchoolDistricts.Rosters;
using Service.Utilities;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Net;

namespace API.Students.SchoolDistrictRosterIssues
{
    /// <summary>
    /// Handles temporary rosters before being commited to students table
    /// </summary>
    [Route("api/v1/students/issues")]
    [Restrict(ClaimTypes.RosterIssues, ClaimValues.FullAccess | ClaimValues.ReadOnly)]
    public class SchoolDistrictRosterIssueController : CrudBaseController<SchoolDistrictRoster>
    {
        private readonly ISchoolDistrictRosterService _rosterService;
        public SchoolDistrictRosterIssueController(ICRUDBaseService crudservice, ISchoolDistrictRosterService rosterService) : base(crudservice)
        {
            _rosterService = rosterService;

        }

        [Restrict(ClaimTypes.Students, ClaimValues.FullAccess)]
        public override IActionResult Search([FromQuery] Model.Core.CRUDSearchParams csp)
        {
            var cspFull = new Model.Core.CRUDSearchParams<SchoolDistrictRoster>(csp);
            var userId = this.GetUserId();
            cspFull.AddedWhereClause.Add(r =>
                r.SchoolDistrict.Users_DistrictAdminId.Any(u => u.Id == userId) &&
                r.StudentId == null && !r.Archived && (bool)r.HasDuplicates && !(bool)r.HasDataIssues);

            cspFull.SortList.Enqueue(new KeyValuePair<string, string>(csp.order, csp.orderdirection));

            int ct;
            return Ok(Crudservice.Search(cspFull, out ct)
                    .AsQueryable()
                    .ToSearchResults(ct)
                    .Respond(this));

        }

        [HttpGet]
        [Route("{rosterId:int}")]
        [Restrict(ClaimTypes.RosterIssues, ClaimValues.FullAccess)]
        public override IActionResult GetById(int rosterId)
        {
            var userId = this.GetUserId();

            return Ok(_rosterService.GetRosterById(rosterId, userId));

        }

        [HttpGet]
        [Route("{rosterId:int}/duplicates")]
        [Restrict(ClaimTypes.RosterIssues, ClaimValues.FullAccess)]
        public List<Student> GeDuplicatesByRosterId(int rosterId)
        {
            var userId = this.GetUserId();
            return _rosterService.GetDuplicates(rosterId, userId);
        }

        [HttpPut]
        [Route("{rosterId:int}")]
        [Restrict(ClaimTypes.RosterIssues, ClaimValues.FullAccess)]
        public override IActionResult Update(int id, [FromBody] SchoolDistrictRoster roster)
        {
            return ExecuteValidatedAction(() =>
            {

                roster.ModifiedById = this.GetUserId();
                var rosterList = new List<SchoolDistrictRoster> { roster };

                _rosterService.ValidateRoster(roster, roster.SchoolDistrictId);
                var districtStudents = _rosterService.GetDistrictStudents(roster.SchoolDistrictId);
                var validRosters = _rosterService.GetValidRosters(rosterList); // returns valid rosters if any
                var matchedRosters = _rosterService.MatchRostersToStudents(validRosters, districtStudents); //returns rosters that have matching conditions
                _rosterService.SetMatchingStudentProperties(matchedRosters, districtStudents); // updates rosters based on matching conditions
                _rosterService.CreateStudentsFromRosters(matchedRosters, validRosters);// if they don't match then a new studetnt is created

                return Ok(_rosterService.UpdateRoster(roster));
            });

        }

        [HttpDelete]
        [Route("{rosterId:int}")]
        [Restrict(ClaimTypes.RosterIssues, ClaimValues.FullAccess)]
        public override IActionResult Delete(int rosterId)
        {
            return ExecuteValidatedAction(() =>
            {

                _rosterService.ArchiveRoster(rosterId, this.GetUserId());

                return Ok();
            });

        }

        [HttpPut]
        [Route("merge")]
        [Restrict(ClaimTypes.RosterIssues, ClaimValues.FullAccess)]
        public IActionResult MergeRoster([FromBody] MergeDTO mergeDto)
        {

            return ExecuteValidatedAction(() =>
            {
                mergeDto.Roster.ModifiedById = this.GetUserId();

                _rosterService.MergeRoster(mergeDto);

                return Ok();
            });

        }

        [HttpDelete]
        [Route("remove-all")]
        [Restrict(ClaimTypes.RosterIssues, ClaimValues.FullAccess)]
        public IActionResult RemoveAllIssues()
        {
            return ExecuteValidatedAction(() =>
            {
                _rosterService.RemoveAllIssues(this.GetUserId());
                return Ok();
            });
        }

        [HttpPost]
        [Route("next")]
        [Restrict(ClaimTypes.RosterIssues, ClaimValues.FullAccess)]
        public IActionResult GetNextRosterIssueId([FromBody] NextRosterIssueCallDto dto)
        {
            int userId = this.GetUserId();
            return Ok(_rosterService.GetNextRosterIssueId(dto, userId));
        }
    }
}
