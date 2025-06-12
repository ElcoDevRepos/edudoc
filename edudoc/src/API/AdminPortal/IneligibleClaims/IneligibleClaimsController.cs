using API.Core.Claims;
using API.Common;
using API.CRUD;
using Microsoft.AspNetCore.Mvc;
using Model;
using Service.Base;
using Service.IneligibleClaims;
using System.Linq;

namespace API.RejectedEncounters
{
    [Route("api/v1/ineligible-claims")]
    [Restrict(ClaimTypes.Encounters, ClaimValues.ReadOnly | ClaimValues.FullAccess)]
    public class IneligibleClaimsController : CrudBaseController<ClaimsEncounter>
    {
        private readonly IIneligibleClaimsService _ineligibleClaimsService;

        public IneligibleClaimsController(
            ICRUDService crudService,
            IIneligibleClaimsService claimsEncounterService) : base(crudService)
        {
            Getbyincludes = new[] { "ServiceCodes" };
            Searchchildincludes = new[] {
                "EncounterStudent",
                "EncounterStudent.Encounter",
                "EncounterStudent.Encounter.Provider",
                "EdiErrorCode"
            };
            _ineligibleClaimsService = claimsEncounterService;
        }

        public override IActionResult Search([FromQuery] Model.Core.CRUDSearchParams csp)
        {
            var query = _ineligibleClaimsService.GetIneligibleClaims(csp);
            return Ok(query.result.AsQueryable()
                                .ToSearchResults(query.count)
                                .Respond(this));
        }

        [HttpGet]
        [Route("get-summary")]
        public IActionResult GetIneligibleClaimSummary()
        {
            return Ok(_ineligibleClaimsService.GetIneligibleClaimSummary());
        }
    }
}
