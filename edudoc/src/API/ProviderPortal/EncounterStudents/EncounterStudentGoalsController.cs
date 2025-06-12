using API.Core.Claims;
using API.Common;
using API.ControllerBase;
using API.CRUD;
using Microsoft.AspNetCore.Mvc;
using Model;
using Service.Base;
using Service.CaseLoads.CaseLoadOptions;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Net;

namespace API.ProviderPortal.EncounterStudents
{

    [Route("api/v1/encounter-student-goals")]
    [Restrict(ClaimTypes.Revise, ClaimValues.ReadOnly | ClaimValues.FullAccess)]

    public class EncounterStudentGoalsController : CrudBaseController<EncounterStudentGoal>
    {
        private readonly ICaseLoadGoalService _caseLoadGoalService;
        public EncounterStudentGoalsController(ICaseLoadGoalService caseLoadGoalService, ICRUDService crudService) : base(crudService)
        {
            _caseLoadGoalService = caseLoadGoalService;
        }

        public override IActionResult Search([FromQuery] Model.Core.CRUDSearchParams csp)
        {
            var cspFull = new Model.Core.CRUDSearchParams<EncounterStudentGoal>(csp);
            cspFull.StronglyTypedIncludes = new Model.Core.IncludeList<EncounterStudentGoal>
            {
                eg => eg.Goal,
                eg => eg.Goal.NursingGoalResponse,
                eg => eg.NursingGoalResult,
                eg => eg.CaseLoadScriptGoal,
                eg => eg.CaseLoadScriptGoal.CaseLoadScript
            };

            if (!string.IsNullOrEmpty(csp.extraparams))
            {
                var extras = System.Web.HttpUtility.ParseQueryString(WebUtility.UrlDecode(csp.extraparams));
                if (extras["includeArchived"] == "0")
                {
                    cspFull.AddedWhereClause.Add(EncounterStudentGoal => !EncounterStudentGoal.Archived);
                }

                int encounterStudentId = Int32.Parse(extras["EncounterStudentId"]);
                cspFull.AddedWhereClause.Add(EncounterStudentGoal => EncounterStudentGoal.EncounterStudentId == encounterStudentId);
            }

            cspFull.SortList.Enqueue(new KeyValuePair<string, string>(csp.order, csp.orderdirection));

            int ct;
            return Ok(Crudservice.Search(cspFull, out ct).AsQueryable()
                                .ToSearchResults(ct)
                                .Respond(this));
        }

        public override IActionResult Create(EncounterStudentGoal encounterStudentGoal)
        {
            if (encounterStudentGoal == null) return BadRequest();
            var userId = this.GetUserId();

            _caseLoadGoalService.AddEncounterGoals(encounterStudentGoal, userId);

            return base.Create(encounterStudentGoal);
        }
    }
}
