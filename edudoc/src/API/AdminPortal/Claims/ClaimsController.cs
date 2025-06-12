using API.Core.Claims;
using API.CRUD;
using Microsoft.AspNetCore.Mvc;
using Model;
using Service.Base;
using Service.Encounters;
using System.Linq;
using API.Common;
using API.ControllerBase;
using Model.DTOs;

namespace API.AdminPortal.Claims
{
    [Route("api/v1/audit-claims")]
    [Restrict(ClaimTypes.Encounters, ClaimValues.ReadOnly | ClaimValues.FullAccess)]
    public class ClaimsAuditController : ApiControllerBase
    {
        private readonly IEncounterService _encounterService;
        public ClaimsAuditController(ICRUDService crudService, IEncounterService encounterService)
        {
            _encounterService = encounterService;
        }

        [Route("get-claims")]
        [HttpGet]
        [Restrict(ClaimTypes.Encounters, ClaimValues.ReadOnly | ClaimValues.FullAccess)]
        public IActionResult GetClaimsForAudit([FromQuery] Model.Core.CRUDSearchParams csp)
        {
            var searchResults = _encounterService.SearchForClaims(csp);
            return Ok(
                        searchResults.claims
                        .AsQueryable()
                        .ToSearchResults(searchResults.count)
                        .Respond(this)
                    );
        }

        [Route("update-status")]
        [HttpPut]
        [Restrict(ClaimTypes.Encounters, ClaimValues.ReadOnly | ClaimValues.FullAccess)]
        public IActionResult UpdateClaimStatus([FromBody] ClaimAuditRequestDto request)
        {
            try
            {
                return ExecuteValidatedAction(() =>
                 {
                     var isProvider = this.GetUserRoleId() == (int)Model.Enums.UserRoles.Provider;
                     _encounterService.UpdateClaimStatus(request, this.GetUserId(), isProvider);
                     return Ok();
                 });

            }
            catch (System.UnauthorizedAccessException uae)
            {
                return Unauthorized(uae.Message.ToString());
            }
        }
    }
}
