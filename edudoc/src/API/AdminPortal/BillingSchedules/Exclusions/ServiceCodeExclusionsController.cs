using API.Core.Claims;
using API.CRUD;
using Microsoft.AspNetCore.Mvc;
using Model;
using Service.Base;

namespace API.BillingSchedules
{
    [Route("api/v1/service-code-exclusions")]
    [Restrict(ClaimTypes.BillingSchedules, ClaimValues.ReadOnly | ClaimValues.FullAccess)]
    public class ServiceCodeExclusionsController : CrudBaseController<BillingScheduleExcludedServiceCode>
    {
        public ServiceCodeExclusionsController(ICRUDService crudService) : base(crudService)
        {
        }

    }
}
