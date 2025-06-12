using API.Core.Claims;
using API.Common;
using API.ControllerBase;
using API.CRUD;
using Microsoft.AspNetCore.Mvc;
using Model;
using Service.Base;
using Service.Goals;
using System.Collections.Generic;
using System.Linq;
using System.Net;

namespace API.Goals
{
    [Route("api/v1/goals")]
    [Restrict(ClaimTypes.ProviderGoals, ClaimValues.ReadOnly | ClaimValues.FullAccess)]
    public class GoalController : CrudBaseController<Goal>
    {
        private readonly IGoalService _goalService;
        public GoalController(ICRUDService crudService, IGoalService goalService) : base(crudService)
        {
            Getbyincludes = new[] { "ServiceCodes", "NursingGoalResponse", "NursingGoalResponse.NursingGoalResults" };
            Searchchildincludes = new[] { "ServiceCodes", "NursingGoalResponse", "NursingGoalResponse.NursingGoalResults" };
            _goalService = goalService;
        }

        public override IActionResult Create([FromBody] Goal data)
        {
            return ExecuteValidatedAction(() =>
            {
                var newId = _goalService.Create(data, this.GetUserId());
                return Ok(newId);
            });

        }

        public override IActionResult Update(int id, [FromBody] Goal data)
        {
            return ExecuteValidatedAction(() =>
            {
                _goalService.Update(data, this.GetUserId());
                return Ok();
            });
        }

        public override IActionResult Search([FromQuery] Model.Core.CRUDSearchParams csp)
        {
            var cspFull = new Model.Core.CRUDSearchParams<Goal>(csp);
            cspFull.Includes = Searchchildincludes;
            if (!IsBlankQuery(csp.Query))
            {
                string[] terms = SplitSearchTerms(csp.Query.Trim().ToLower());
                cspFull.AddedWhereClause.Add(goal => terms.All(t => goal.Description.StartsWith(t.ToLower()) ||
                    goal.ServiceCodes.Any(sc => sc.Name.StartsWith(t.ToLower())))
                );
            }

            if (!string.IsNullOrEmpty(csp.extraparams))
            {
                var extras = System.Web.HttpUtility.ParseQueryString(WebUtility.UrlDecode(csp.extraparams));
                if (extras["includeArchived"] == "0")
                {
                    cspFull.AddedWhereClause.Add(goal => !goal.Archived);
                }
                if (extras["ServiceCodeIds"] != null)
                {
                    IEnumerable<int> serviceCodeIds = extras["ServiceCodeIds"].Split(',').Select(System.Int32.Parse).ToList();
                    cspFull.AddedWhereClause.Add(goal => goal.ServiceCodes.Select(sc => sc.Id).Any(code => serviceCodeIds.Contains(code)));
                }
            }

            cspFull.SortList.Enqueue(new KeyValuePair<string, string>(csp.order, csp.orderdirection));

            cspFull.SortList.Enqueue(new KeyValuePair<string, string>("Description", "asc"));

            int ct;
            return Ok(Crudservice.Search(cspFull, out ct).AsQueryable()
                                .ToSearchResults(ct)
                                .Respond(this));

        }

    }
}
