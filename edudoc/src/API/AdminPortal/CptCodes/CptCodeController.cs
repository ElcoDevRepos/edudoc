using API.Core.Claims;
using API.Common;
using API.CRUD;
using Microsoft.AspNetCore.Mvc;
using Model;
using Model.DTOs;
using Service.Base;
using Service.Utilities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Net;

namespace API.CptCodes
{
    [Route("api/v1/cpt-codes")]
    [Restrict(ClaimTypes.CPTCodes, ClaimValues.ReadOnly | ClaimValues.FullAccess)]
    public class CptCodeController : CrudBaseController<CptCode>
    {
        public CptCodeController(ICRUDService crudService) : base(crudService)
        {
            Getbyincludes = new[] { "CptCodeAssocations" };
            Orderby = "Code";
        }

        public override IActionResult Search([FromQuery] Model.Core.CRUDSearchParams csp)
        {
            var cspFull = new Model.Core.CRUDSearchParams<CptCode>(csp) {
                DefaultOrderBy = "Code"
            };

            cspFull.StronglyTypedIncludes = new Model.Core.IncludeList<CptCode>
            {
                cpt => cpt.CptCodeAssocations,
                cpt => cpt.CptCodeAssocations.Select(cpta => cpta.ServiceCode),
            };

            if (!IsBlankQuery(csp.Query))
            {
                string[] terms = SplitSearchTerms(csp.Query.Trim().ToLower());
                cspFull.AddedWhereClause.Add(code => terms.All(t => code.Description.StartsWith(t.ToLower()) ||
                    code.Code.StartsWith(t.ToLower()) ||
                    code.BillAmount.ToString().StartsWith(t))
                );
            }

            if (!string.IsNullOrEmpty(csp.extraparams))
            {
                var extras = System.Web.HttpUtility.ParseQueryString(WebUtility.UrlDecode(csp.extraparams));
                if (extras["includeArchived"] == "0")
                {
                    cspFull.AddedWhereClause.Add(cpt => !cpt.Archived);
                }

                if (extras["ServiceCodeIds"] != null)
                {
                    var serviceCodeIdsParamsList = CommonFunctions.GetIntListFromExtraParams(csp.extraparams, "ServiceCodeIds");
                    var serviceCodeIds = serviceCodeIdsParamsList["ServiceCodeIds"];

                    if (serviceCodeIds.Count > 0)
                        cspFull.AddedWhereClause.Add(cptCode => cptCode.CptCodeAssocations.Any(association => serviceCodeIds.Contains(association.ServiceCodeId)));
                }
            }

            cspFull.SortList.Enqueue(new KeyValuePair<string, string>(csp.order, csp.orderdirection));

            cspFull.SortList.Enqueue(new KeyValuePair<string, string>("Code", "asc"));

            int ct;
            return Ok(Crudservice.Search(cspFull, out ct).AsQueryable()
                                .ToSearchResults(ct)
                                .Respond(this));

        }

        [HttpGet]
        [Route("select-options")]
        public IEnumerable<SelectOptions> GetAllSelectOptions()
        {
            var cspFull = new Model.Core.CRUDSearchParams<CptCode>
            {
                DefaultOrderBy = "Description"
            };

            return Crudservice.GetAll(cspFull).Select(cptCode =>
                new SelectOptions
                {
                    Id = cptCode.Id,
                    Name = $"{cptCode.Code} - {cptCode.Description}".Length > 25 ? $"{cptCode.Code} - {cptCode.Description}".Substring(0, 25) : $"{cptCode.Code} - {cptCode.Description}",
                    Archived = cptCode.Archived
                }).AsEnumerable();
        }
    }
}
