using API.Core.Claims;
using Microsoft.AspNetCore.Mvc;
using Model;
using Service.Base;
using System.Linq;
using Service.ActivitySummaries;
using API.ControllerBase;

namespace API.Common.ActivitySummaries
{
    [Route("api/v1/district-activity-summary")]
    [Restrict(ClaimTypes.DistrictActivitySummaryByServiceArea, ClaimValues.ReadOnly | ClaimValues.FullAccess)]
    public class ActivitySummaryController : ApiControllerBase
    {
        private readonly IActivitySummaryService _activitySummaryService;
        private readonly ICRUDService _crudService;

        public ActivitySummaryController(ICRUDService crudService, IActivitySummaryService activitySummaryService)
        {
            _activitySummaryService = activitySummaryService;
            _crudService = crudService;
        }

        [Route("get-summaries")]
        [Restrict(ClaimTypes.DistrictActivitySummaryByServiceArea, ClaimValues.ReadOnly | ClaimValues.FullAccess)]
        [HttpGet]
        public IActionResult GetEncounters([FromQuery] Model.Core.CRUDSearchParams csp)
        {
            return Ok(_activitySummaryService.SearchForActivitySummaries(csp));
        }

        [Route("update-summary-tables")]
        [Restrict(ClaimTypes.DistrictActivitySummaryByServiceArea, ClaimValues.ReadOnly | ClaimValues.FullAccess)]
        [HttpGet]
        public IActionResult UpdateSummaryTables()
        {
            _activitySummaryService.UpdateActivitySummaryTables();
            return Ok();
        }

        [Route("get-summaries-totals")]
        [Restrict(ClaimTypes.DistrictActivitySummaryByServiceArea, ClaimValues.ReadOnly | ClaimValues.FullAccess)]
        [HttpGet]
        public IActionResult GetEncountersTotals([FromQuery] Model.Core.CRUDSearchParams csp)
        {
            return Ok(_activitySummaryService.SearchForActivitySummariesTotals(csp));
        }

        [Route("get-most-recent-summary")]
        [Restrict(ClaimTypes.DistrictActivitySummaryByServiceArea, ClaimValues.ReadOnly | ClaimValues.FullAccess)]
        [HttpGet]
        public IActionResult GetMostRecentSummaryTotal()
        {
            return Ok(_activitySummaryService.GetMostRecentSummary());
        }

        [Route("get-ready-for-esign-summaries")]
        [Restrict(ClaimTypes.ProviderActivityDetailReport, ClaimValues.ReadOnly | ClaimValues.FullAccess)]
        [HttpGet]
        public IActionResult GetReadyForFinalESignActivitySummaries([FromQuery] Model.Core.CRUDSearchParams csp)
        {
            var searchResults = _activitySummaryService.GetReadyForFinalESignActivitySummaries(csp);

            return Ok(
              searchResults.summaries
              .AsQueryable()
              .ToSearchResults(searchResults.count)
              .Respond(this)
          );
        }

        [Route("get-ready-for-scheduling-summaries")]
        [Restrict(ClaimTypes.ProviderActivityDetailReport, ClaimValues.ReadOnly | ClaimValues.FullAccess)]
        [HttpGet]
        public IActionResult GetReadyForSchedulingActivitySummaries([FromQuery] Model.Core.CRUDSearchParams csp)
        {
            var searchResults = _activitySummaryService.GetReadyForSchedulingActivitySummaries(csp);

            return Ok(
              searchResults.summaries
              .AsQueryable()
              .ToSearchResults(searchResults.count)
              .Respond(this)
          );
        }

        [Route("get-encounters-returned-summaries")]
        [Restrict(ClaimTypes.ProviderActivityDetailReport, ClaimValues.ReadOnly | ClaimValues.FullAccess)]
        [HttpGet]
        public IActionResult GetEncountersReturnedActivitySummaries([FromQuery] Model.Core.CRUDSearchParams csp)
        {
            var searchResults = _activitySummaryService.GetEncountersReturnedActivitySummaries(csp);

            return Ok(
              searchResults.summaries
              .AsQueryable()
              .ToSearchResults(searchResults.count)
              .Respond(this)
          );
        }

        [Route("get-referrals-pending-summaries")]
        [Restrict(ClaimTypes.ProviderActivityDetailReport, ClaimValues.ReadOnly | ClaimValues.FullAccess)]
        [HttpGet]
        public IActionResult GetReferralsPendingActivitySummaries([FromQuery] Model.Core.CRUDSearchParams csp)
        {
            var searchResults = _activitySummaryService.GetReferralsPendingActivitySummaries(csp);

            return Ok(
              searchResults.summaries
              .AsQueryable()
              .ToSearchResults(searchResults.count)
              .Respond(this)
          );
        }

    }
}
