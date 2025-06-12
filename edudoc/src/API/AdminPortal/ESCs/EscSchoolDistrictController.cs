using API.Core.Claims;
using API.Common;
using API.CRUD;
using Microsoft.AspNetCore.Mvc;
using Model;
using Service.Base;
using Service.SchoolDistricts;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Net;

namespace API.ESCs
{
    [Route("api/v1/esc-school-districts")]
    [Restrict(ClaimTypes.ESCs, ClaimValues.ReadOnly | ClaimValues.FullAccess)]
    public class EscSchoolDistrictController : CrudBaseController<EscSchoolDistrict>
    {
        private readonly IEscService _escService;
        public EscSchoolDistrictController(ICRUDService crudservice, IEscService escService)
            : base(crudservice)
        {
            _escService = escService;
        }

        public override IActionResult Search([FromQuery] Model.Core.CRUDSearchParams csp)
        {
            var cspFull = new Model.Core.CRUDSearchParams<EscSchoolDistrict>(csp);
            cspFull.StronglyTypedIncludes = new Model.Core.IncludeList<EscSchoolDistrict>
            {
                esd => esd.Esc,
                esd => esd.SchoolDistrict
            };

            if (!string.IsNullOrEmpty(csp.extraparams))
            {
                var extras = System.Web.HttpUtility.ParseQueryString(WebUtility.UrlDecode(csp.extraparams));
                if (extras["escId"] != null)
                {
                    var escId = int.Parse(extras["escId"]);
                    cspFull.AddedWhereClause.Add(esd => esd.EscId == escId);
                }
                if (extras["districtId"] != null)
                {
                    var districtId = int.Parse(extras["districtId"]);
                    cspFull.AddedWhereClause.Add(esd => esd.SchoolDistrictId == districtId);
                }
                if (extras["includeArchived"] != null && extras["includeArchived"] == "0")
                {
                    cspFull.AddedWhereClause.Add(esd => !esd.Archived);
                }
            }

            cspFull.SortList.Enqueue(new KeyValuePair<string, string>(csp.order, csp.orderdirection));
            int ct;
            return Ok(Crudservice.Search(cspFull, out ct).AsQueryable()
                                .ToSearchResults(ct)
                                .Respond(this));
        }

        [HttpPost]
        [Route("archive/{escId:int}/{districtId:int}")]
        public IActionResult ArchiveEscSchoolDistrict([FromRoute] int escId, int districtId)
        {
            return Ok(_escService.ArchiveEscSchoolDistrict(escId, districtId));
        }
    }
}
