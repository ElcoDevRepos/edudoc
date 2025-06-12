using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Net;
using API.Core.Claims;
using API.ControllerBase;
using API.CRUD;
using Microsoft.AspNetCore.Mvc;
using Model;
using Service.ActivitySummaries;
using Service.Base;

namespace API.Common.ActivitySummaryDistrict
{
    [Route("api/v1/summary-district")]
    [Restrict(ClaimTypes.DistrictActivitySummaryByServiceArea, ClaimValues.ReadOnly | ClaimValues.FullAccess)]
    public class ActivitySummaryDistrictController : CrudBaseController<Model.ActivitySummaryDistrict>
    {
        private readonly IActivitySummaryService _activitySummaryService;
        public ActivitySummaryDistrictController(ICRUDBaseService crudservice, IActivitySummaryService activitySummaryService)
            : base(crudservice)
        {
            _activitySummaryService = activitySummaryService;
            Searchchildincludes = new[] { "SchoolDistrict" };
        }

        public override IActionResult Search([FromQuery] Model.Core.CRUDSearchParams csp)
        {
            var cspFull = new Model.Core.CRUDSearchParams<Model.ActivitySummaryDistrict>(csp);
            cspFull.Includes = Searchchildincludes;

            if (!string.IsNullOrEmpty(csp.extraparams))
            {
                var extras = System.Web.HttpUtility.ParseQueryString(WebUtility.UrlDecode(csp.extraparams));

                if (extras["ActivitySummaryId"] != null)
                {
                    var activitySummaryId = int.Parse(extras["ActivitySummaryId"]);
                    cspFull.AddedWhereClause.Add(s => s.ActivitySummaryId == activitySummaryId);
                }
            }

            int ct;
            return Ok(Crudservice.Search(cspFull, out ct).OrderBy(x => x.SchoolDistrict.Name)
                    .AsQueryable()
                    .ToSearchResults(ct)
                    .Respond(this));
        }

        [Route("district-id/{id:int}")]
        [Restrict(ClaimTypes.DistrictActivitySummaryByServiceArea, ClaimValues.ReadOnly | ClaimValues.FullAccess)]
        [HttpGet]
        public IActionResult GetActivitySummaryDistrictByDistrictId([FromRoute] int id)
        {
            return Ok(_activitySummaryService.GetActivitySummaryDistrictByDistrictId(id));
        }
    }
}
