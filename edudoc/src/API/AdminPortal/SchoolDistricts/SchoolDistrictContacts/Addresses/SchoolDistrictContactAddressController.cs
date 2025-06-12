using API.Core.Claims;
using API.ControllerBase;
using Microsoft.AspNetCore.Mvc;
using Model;
using Service.Addresses;

namespace API.SchoolDistricts.SchoolDistrictContacts.Addresses
{
    [Route("api/v1/school-districts/{districtId:int}/contacts/{contactId:int}/address")]
    [Restrict(ClaimTypes.SchoolDistricts, ClaimValues.FullAccess | ClaimValues.ReadOnly)]

    public class SchoolDistrictContactAddressController : ApiControllerBase
    {
        private readonly IAddressService _addressService;

        public SchoolDistrictContactAddressController(IAddressService addressService)
        {
            _addressService = addressService;
        }

        [HttpPost]
        [Route("")]

        [Restrict(ClaimTypes.SchoolDistricts, ClaimValues.FullAccess)]
        public IActionResult PostContactAddress(int districtId, int contactId, [FromBody] Address address)
        {
            return ExecuteValidatedAction(() =>
                Ok(_addressService.CreateEntityAddress<Contact>(contactId, address)));
        }

        [HttpPut]
        [Route("")]
        [Restrict(ClaimTypes.SchoolDistricts, ClaimValues.FullAccess)]
        public IActionResult PutContactAddress(int districtId, int contactId, [FromBody] Address address)
        {
            return ExecuteValidatedAction(() =>
            {
                _addressService.UpdateEntityAddress(address);
                return Ok();
            });
        }

        [HttpDelete]
        [Route("{addressId:int}")]
        [Restrict(ClaimTypes.SchoolDistricts, ClaimValues.FullAccess)]
        public IActionResult DeleteContactAddress(int contactId, int addressId)
        {
            return ExecuteValidatedAction(() =>
            {
                _addressService.DeleteEntityAddress<Contact>(addressId);
                return Ok();
            });
        }

    }
}
