using API.Core.Claims;
using API.Common;
using API.ControllerBase;
using API.CRUD;
using Microsoft.AspNetCore.Mvc;
using Model;
using Model.Enums;
using Service.Base;
using Service.CaseLoads.CaseLoadOptions;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Net;

namespace API.ProviderPortal.CaseLoads
{

    [Route("api/v1/case-load-cpt-codes")]
    [Restrict(ClaimTypes.MyCaseload, ClaimValues.ReadOnly | ClaimValues.FullAccess)]

    public class CaseLoadCptCodesController : CrudBaseController<CaseLoadCptCode>
    {
        private readonly ICaseLoadCptCodeService _cptService;

        public CaseLoadCptCodesController(ICaseLoadCptCodeService cptService, ICRUDService crudService) : base(crudService)
        {
            _cptService = cptService;
        }

        public override IActionResult Search([FromQuery] Model.Core.CRUDSearchParams csp)
        {
            var cspFull = new Model.Core.CRUDSearchParams<CaseLoadCptCode>(csp);
            cspFull.StronglyTypedIncludes = new Model.Core.IncludeList<CaseLoadCptCode>
            {
                clc => clc.CptCode,
            };

            if (!string.IsNullOrEmpty(csp.extraparams))
            {
                var extras = System.Web.HttpUtility.ParseQueryString(WebUtility.UrlDecode(csp.extraparams));
                if (extras["includeArchived"] == "0")
                {
                    cspFull.AddedWhereClause.Add(caseLoadCptCode => !caseLoadCptCode.Archived);
                }

                int caseLoadId = Int32.Parse(extras["CaseLoadId"]);
                cspFull.AddedWhereClause.Add(caseLoadCptCode => caseLoadCptCode.CaseLoadId == caseLoadId);
            }

            cspFull.SortList.Enqueue(new KeyValuePair<string, string>(csp.order, csp.orderdirection));

            int ct;
            return Ok(Crudservice.Search(cspFull, out ct).AsQueryable()
                                .ToSearchResults(ct)
                                .Respond(this));
        }

        [HttpGet]
        [Route("cptCodeOptions")]
        public IEnumerable<CptCode> GetCPTCodes()
        {
            return _cptService.GetCPTCodes(this.GetUserId()).Where(cpt => cpt.CptCodeAssocations.Any(c => c.ServiceTypeId == (int)ServiceTypes.Treatment_Therapy));
        }

    }
}
