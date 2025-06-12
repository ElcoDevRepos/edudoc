using API.Core.Claims;
using API.ControllerBase;
using Microsoft.AspNetCore.Mvc;
using Model;
using Service.Common.Phone;
using Service.SchoolDistricts.SchoolDistrictContacts.Phones;

namespace API.SchoolDistricts.SchoolDistrictContacts.Phones
{
    [Route("api/v1/school-districts/{districtId:int}/contacts/{contactId:int}/phones")]
    [Restrict(ClaimTypes.SchoolDistricts, ClaimValues.FullAccess | ClaimValues.ReadOnly)]

    public class SchoolDistrictContactPhonesController : ApiControllerBase
    {
        private readonly ISchoolDistrictContactPhonesService _service;

        public SchoolDistrictContactPhonesController(ISchoolDistrictContactPhonesService service)
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
