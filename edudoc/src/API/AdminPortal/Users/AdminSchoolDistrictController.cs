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

namespace API.Users
{
    [Route("api/v1/admin-school-districts")]
    [Restrict(ClaimTypes.HPCUserAccess, ClaimValues.ReadOnly | ClaimValues.FullAccess)]
    public class AdminSchoolDistrictController : CrudBaseController<AdminSchoolDistrict>
    {
        public AdminSchoolDistrictController(ICRUDService crudservice)
            : base(crudservice)
        {
        }

        public override IActionResult Search([FromQuery] Model.Core.CRUDSearchParams csp)
        {
            var cspFull = new Model.Core.CRUDSearchParams<AdminSchoolDistrict>(csp);
            cspFull.StronglyTypedIncludes = new Model.Core.IncludeList<AdminSchoolDistrict>
            {
                asd => asd.Admin,
                asd => asd.SchoolDistrict
            };

            if (!string.IsNullOrEmpty(csp.extraparams))
            {
                var extras = System.Web.HttpUtility.ParseQueryString(WebUtility.UrlDecode(csp.extraparams));
                if (extras["adminId"] != null)
                {
                    var adminId = int.Parse(extras["adminId"]);
                    cspFull.AddedWhereClause.Add(asd => asd.AdminId == adminId);
                }
                if (extras["districtId"] != null)
                {
                    var districtId = int.Parse(extras["districtId"]);
                    cspFull.AddedWhereClause.Add(asd => asd.SchoolDistrictId == districtId);
                }
                if (extras["includeArchived"] != null && extras["includeArchived"] == "0")
                {
                    cspFull.AddedWhereClause.Add(asd => !asd.Archived);
                }
            }

            cspFull.SortList.Enqueue(new KeyValuePair<string, string>(csp.order, csp.orderdirection));
            int ct;
            return Ok(Crudservice.Search(cspFull, out ct).AsQueryable()
                                .ToSearchResults(ct)
                                .Respond(this));
        }
    }
}
