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

namespace API.ProviderPortal.CaseLoads
{

    [Route("api/v1/case-load-goals")]
    [Restrict(ClaimTypes.MyCaseload, ClaimValues.ReadOnly | ClaimValues.FullAccess)]

    public class CaseLoadGoalsController : CrudBaseController<CaseLoadGoal>
    {
        private readonly ICaseLoadGoalService _goalService;
        private readonly ICRUDService _crudService;

        public CaseLoadGoalsController(ICaseLoadGoalService goalService, ICRUDService crudService) : base(crudService)
        {
            _goalService = goalService;
            _crudService = crudService;
        }

        public override IActionResult Search([FromQuery] Model.Core.CRUDSearchParams csp)
        {
            var cspFull = new Model.Core.CRUDSearchParams<CaseLoadGoal>(csp);
            cspFull.StronglyTypedIncludes = new Model.Core.IncludeList<CaseLoadGoal>
            {
                clg => clg.Goal,
            };

            if (!string.IsNullOrEmpty(csp.extraparams))
            {
                var extras = System.Web.HttpUtility.ParseQueryString(WebUtility.UrlDecode(csp.extraparams));
                if (extras["includeArchived"] == "0")
                {
                    cspFull.AddedWhereClause.Add(caseLoadGoal => !caseLoadGoal.Archived);
                }

                int caseLoadId = Int32.Parse(extras["CaseLoadId"]);
                cspFull.AddedWhereClause.Add(caseLoadGoal => caseLoadGoal.CaseLoadId == caseLoadId);

                int serviceCodeId = Int32.Parse(extras["ServiceCodeId"]);
                cspFull.AddedWhereClause.Add(clg => clg.Goal.ServiceCodes.Any(sc => sc.Id == serviceCodeId));
            }

            cspFull.SortList.Enqueue(new KeyValuePair<string, string>(csp.order, csp.orderdirection));

            int ct;
            return Ok(Crudservice.Search(cspFull, out ct).AsQueryable()
                                .ToSearchResults(ct)
                                .Respond(this));
        }


        [HttpGet]
        [Route("goalOptions")]
        public IEnumerable<Goal> GetGoals()
        {
            return _goalService.GetGoals(this.GetUserId());
        }

        [HttpGet]
        [Route("nursing-goal-options")]
        public IEnumerable<Goal> GetNursingGoals()
        {
            return _goalService.GetNursingGoals();
        }

        [HttpGet]
        [Route("resultOptions")]
        public IEnumerable<NursingGoalResult> GetResults()
        {
            var csp = new Model.Core.CRUDSearchParams<NursingGoalResult> { };
            csp.StronglyTypedIncludes = new Model.Core.IncludeList<NursingGoalResult>
            {
                ngr => ngr.NursingGoalResponses,
            };
            return _crudService.GetAll(csp);
        }

    }
}
