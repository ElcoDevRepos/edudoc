using API.Core.Claims;
using Microsoft.AspNetCore.Mvc;
using Model;
using Service.Base;
using API.ControllerBase;
using Service.Providers;

namespace API.ProviderPortal.EncounterStudents.ServiceOutcomes
{
    [Route("api/v1/provider-profile")]
    [Restrict(ClaimTypes.Encounters, ClaimValues.FullAccess)]
    public class ProviderProfileController : ApiControllerBase
    {
        private readonly ICRUDService _crudService;
        private readonly IProviderService _providerService;

        public ProviderProfileController(IProviderService providerService, ICRUDService crudService)
        {
            _crudService = crudService;
            _providerService = providerService;
        }

        [Route("{providerId:int}")]
        [HttpGet]
        public Provider GetProviderForProfile(int providerId)
        {
            return _crudService.GetById<Provider>(providerId, new[] { "ProviderTitle", "ProviderLicens", "ProviderOdeCertifications",
                "ProviderEscAssignments", "ProviderEscAssignments.ProviderEscSchoolDistricts", "ProviderEscAssignments.ProviderEscSchoolDistricts.SchoolDistrict" });
        }

        [HttpPut]
        [Route("request-medicaid-approval")]
        public IActionResult ProviderApprovalRequest([FromBody] int providerId)
        {
            var approval = _providerService.RequestProviderApproval(providerId);
            return Ok(approval);
        }

        [HttpPut]
        [Route("update-basic-info")]
        public IActionResult UpdateProviderBasicInfo([FromBody] Provider provider)
        {
            _providerService.UpdateBasicInfo(provider);
            return Ok();
        }


    }

}
