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

    [Route("api/v1/case-load-methods")]
    [Restrict(ClaimTypes.MyCaseload, ClaimValues.ReadOnly | ClaimValues.FullAccess)]

    public class CaseLoadMethodsController : CrudBaseController<CaseLoadMethod>
    {

        public CaseLoadMethodsController(ICRUDService crudService) : base(crudService)
        {
        }

        public override IActionResult Search([FromQuery] Model.Core.CRUDSearchParams csp)
        {
            var cspFull = new Model.Core.CRUDSearchParams<CaseLoadMethod>(csp);
            cspFull.StronglyTypedIncludes = new Model.Core.IncludeList<CaseLoadMethod>
            {
                clm => clm.Method,
            };

            if (!string.IsNullOrEmpty(csp.extraparams))
            {
                var extras = System.Web.HttpUtility.ParseQueryString(WebUtility.UrlDecode(csp.extraparams));
                if (extras["includeArchived"] == "0")
                {
                    cspFull.AddedWhereClause.Add(caseLoadMethod => !caseLoadMethod.Archived);
                }

                int caseLoadId = Int32.Parse(extras["CaseLoadId"]);
                cspFull.AddedWhereClause.Add(caseLoadMethod => caseLoadMethod.CaseLoadId == caseLoadId);
            }

            cspFull.SortList.Enqueue(new KeyValuePair<string, string>(csp.order, csp.orderdirection));

            int ct;
            return Ok(Crudservice.Search(cspFull, out ct).AsQueryable()
                                .ToSearchResults(ct)
                                .Respond(this));
        }

    }
}
