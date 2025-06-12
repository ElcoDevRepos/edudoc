using System.Linq;
using System.Net;
using API.Core.Claims;
using API.CRUD;
using Microsoft.AspNetCore.Mvc;
using Model;
using Service.ActivitySummaries;
using Service.Base;

namespace API.Common.ActivitySummaryServiceArea
{
    [Route("api/v1/summary-service-area")]
    [Restrict(ClaimTypes.DistrictActivitySummaryByServiceArea, ClaimValues.ReadOnly | ClaimValues.FullAccess)]
    public class ActivitySummaryServiceAreaController : CrudBaseController<Model.ActivitySummaryServiceArea>
    {
        private readonly IActivitySummaryService _activitySummaryService;
        public ActivitySummaryServiceAreaController(ICRUDBaseService crudservice, IActivitySummaryService activitySummaryService) : base(crudservice)
        {
            _activitySummaryService = activitySummaryService;
            Searchchildincludes = new[] { "ServiceCode" };
        }

        public override IActionResult Search([FromQuery] Model.Core.CRUDSearchParams csp)
        {
            var cspFull = new Model.Core.CRUDSearchParams<Model.ActivitySummaryServiceArea>(csp);
            cspFull.Includes = Searchchildincludes;

            if (!string.IsNullOrEmpty(csp.extraparams))
            {
                var extras = System.Web.HttpUtility.ParseQueryString(WebUtility.UrlDecode(csp.extraparams));

                if (extras["ActivitySummaryDistrictId"] != null && extras["ActivitySummaryDistrictId"] != "0")
                {
                    var activitySummaryDistrictId = int.Parse(extras["ActivitySummaryDistrictId"]);
                    cspFull.AddedWhereClause.Add(s => s.ActivitySummaryDistrictId == activitySummaryDistrictId);
                }
                if (extras["districtId"] != null && extras["districtId"] != "0")
                {
                    var districtId = int.Parse(extras["districtId"]);
                    cspFull.AddedWhereClause.Add(s => s.ActivitySummaryDistrict.DistrictId == districtId);
                }
            }

            int ct;
            return Ok(Crudservice.Search(cspFull, out ct).AsQueryable()
                    .ToSearchResults(ct)
                    .Respond(this));
        }

        [Route("completed/_search")]
        [Restrict(ClaimTypes.DistrictActivitySummaryByServiceArea, ClaimValues.ReadOnly | ClaimValues.FullAccess)]
        [HttpGet]
        public IActionResult SearchCompleted([FromQuery] Model.Core.CRUDSearchParams csp)
        {
            return Ok(_activitySummaryService.SearchForActivitySummaries(csp));
        }
    }

}
