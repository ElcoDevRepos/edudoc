using System.Linq;
using System.Net;
using API.Core.Claims;
using API.CRUD;
using Microsoft.AspNetCore.Mvc;
using Model;
using Service.ActivitySummaries;
using Service.Base;

namespace API.Common.ActivitySummaryProvider
{
    [Route("api/v1/summary-provider")]
    [Restrict(ClaimTypes.DistrictActivitySummaryByServiceArea, ClaimValues.ReadOnly | ClaimValues.FullAccess)]
    public class ActivitySummaryProviderController : CrudBaseController<Model.ActivitySummaryProvider>
    {
        private readonly IActivitySummaryService _activitySummaryService;
        public ActivitySummaryProviderController(ICRUDBaseService crudservice, IActivitySummaryService activitySummaryService) : base(crudservice)
        {
            _activitySummaryService = activitySummaryService;
        }

        public override IActionResult Search([FromQuery] Model.Core.CRUDSearchParams csp)
        {
            var cspFull = new Model.Core.CRUDSearchParams<Model.ActivitySummaryProvider>(csp);

            if (!string.IsNullOrEmpty(csp.extraparams))
            {
                var extras = System.Web.HttpUtility.ParseQueryString(WebUtility.UrlDecode(csp.extraparams));

                if (extras["activitySummaryServiceAreaId"] != null && extras["activitySummaryServiceAreaId"] != "0")
                {
                    var activitySummaryServiceAreaId = int.Parse(extras["activitySummaryServiceAreaId"]);
                    cspFull.AddedWhereClause.Add(s => s.ActivitySummaryServiceAreaId == activitySummaryServiceAreaId);
                }
                if (extras["districtId"] != null && extras["districtId"] != "0")
                {
                    var districtId = int.Parse(extras["districtId"]);
                    cspFull.AddedWhereClause.Add(s => s.ActivitySummaryServiceArea.ActivitySummaryDistrict.DistrictId == districtId);
                }
            }

            int ct;
            var searchResults = Crudservice.Search(cspFull, out ct).AsQueryable().ToSearchResults(ct);
            return Ok(new { Results = searchResults.Results, Total = ct });
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
