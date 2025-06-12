using API.Core.Claims;
using API.ControllerBase;
using Microsoft.AspNetCore.Mvc;
using Model;
using Service.Common.Phone;
using Service.SchoolDistricts.SchoolDistrictContacts.Phones;

namespace API.ESC.ESCContacts
{
    [Route("api/v1/escs/{districtId:int}/contacts/{contactId:int}/phones")]
    [Restrict(ClaimTypes.ESCs, ClaimValues.FullAccess | ClaimValues.ReadOnly)]

    public class EscContactPhonesController : ApiControllerBase
    {
        private readonly ISchoolDistrictContactPhonesService _service;

        public EscContactPhonesController(ISchoolDistrictContactPhonesService service)
        {
            _service = service;
        }

        [HttpPut]
        [Route("")]
        [Restrict(ClaimTypes.SchoolDistricts, ClaimValues.FullAccess)]
        public IActionResult PutContactPhones(int districtId, int contactId, [FromBody] PhoneCollection<ContactPhone> phones)
        {
            return ExecuteValidatedAction(() =>
            {
                _service.MergeContactPhones(contactId, phones);
                return Ok();
            });
        }


    }
}
