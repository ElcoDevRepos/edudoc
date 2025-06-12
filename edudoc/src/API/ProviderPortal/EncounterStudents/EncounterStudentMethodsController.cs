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

namespace API.ProviderPortal.EncounterStudents
{

    [Route("api/v1/encounter-student-methods")]
    [Restrict(ClaimTypes.Revise, ClaimValues.ReadOnly | ClaimValues.FullAccess)]

    public class EncounterStudentMethodsController : CrudBaseController<EncounterStudentMethod>
    {

        public EncounterStudentMethodsController(ICRUDService crudService) : base(crudService)
        {
        }

        public override IActionResult Search([FromQuery] Model.Core.CRUDSearchParams csp)
        {
            var cspFull = new Model.Core.CRUDSearchParams<EncounterStudentMethod>(csp);
            cspFull.StronglyTypedIncludes = new Model.Core.IncludeList<EncounterStudentMethod>
            {
                em => em.Method,
            };

            if (!string.IsNullOrEmpty(csp.extraparams))
            {
                var extras = System.Web.HttpUtility.ParseQueryString(WebUtility.UrlDecode(csp.extraparams));
                if (extras["includeArchived"] == "0")
                {
                    cspFull.AddedWhereClause.Add(encounterStudentMethod => !encounterStudentMethod.Archived);
                }

                int encounterStudentId = Int32.Parse(extras["EncounterStudentId"]);
                cspFull.AddedWhereClause.Add(encounterStudentMethod => encounterStudentMethod.EncounterStudentId == encounterStudentId);
            }

            cspFull.SortList.Enqueue(new KeyValuePair<string, string>(csp.order, csp.orderdirection));

            int ct;
            return Ok(Crudservice.Search(cspFull, out ct).AsQueryable()
                                .ToSearchResults(ct)
                                .Respond(this));
        }

    }
}
