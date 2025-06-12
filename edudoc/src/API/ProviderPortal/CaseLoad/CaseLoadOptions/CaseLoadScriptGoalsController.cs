using API.Core.Claims;
using API.Common;
using API.CRUD;
using Microsoft.AspNetCore.Mvc;
using Model;
using Service.Base;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Net;

namespace API.ProviderPortal.CaseLoads
{

    [Route("api/v1/case-load-script-goals")]
    [Restrict(ClaimTypes.MyCaseload, ClaimValues.ReadOnly | ClaimValues.FullAccess)]

    public class CaseLoadScriptGoalsController : CrudBaseController<CaseLoadScriptGoal>
    {
        public CaseLoadScriptGoalsController(ICRUDService crudService) : base(crudService)
        {
        }

        public override IActionResult Search([FromQuery] Model.Core.CRUDSearchParams csp)
        {
            var cspFull = new Model.Core.CRUDSearchParams<CaseLoadScriptGoal>(csp);
            cspFull.StronglyTypedIncludes = new Model.Core.IncludeList<CaseLoadScriptGoal>
            {
                clsg => clsg.Goal,
            };

            if (!string.IsNullOrEmpty(csp.extraparams))
            {
                var extras = System.Web.HttpUtility.ParseQueryString(WebUtility.UrlDecode(csp.extraparams));
                if (extras["includeArchived"] == "0")
                {
                    cspFull.AddedWhereClause.Add(caseLoadScriptGoal => !caseLoadScriptGoal.Archived);
                }

                int caseLoadScriptId = Int32.Parse(extras["CaseLoadScriptId"]);
                cspFull.AddedWhereClause.Add(caseLoadScriptGoal => caseLoadScriptGoal.CaseLoadScriptId == caseLoadScriptId);
            }

            cspFull.SortList.Enqueue(new KeyValuePair<string, string>(csp.order, csp.orderdirection));

            int ct;
            return Ok(Crudservice.Search(cspFull, out ct).AsQueryable()
                                .ToSearchResults(ct)
                                .Respond(this));
        }

    }
}
