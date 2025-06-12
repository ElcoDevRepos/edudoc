using API.Core.Claims;
using API.CRUD;
using Microsoft.AspNetCore.Mvc;
using Model;
using Service.Base;

namespace API.BillingSchedules
{
    [Route("api/v1/school-district-inclusions")]
    [Restrict(ClaimTypes.BillingSchedules, ClaimValues.ReadOnly | ClaimValues.FullAccess)]
    public class SchoolDistrictInclusionsController : CrudBaseController<BillingScheduleDistrict>
    {
        public SchoolDistrictInclusionsController(ICRUDService crudService) : base(crudService)
        {
        }

    }
}
