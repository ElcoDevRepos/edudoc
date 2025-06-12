using API.Core.Claims;
using API.CRUD;
using Microsoft.AspNetCore.Mvc;
using Model;
using Service.Base;

namespace API.BillingSchedules
{
    [Route("api/v1/provider-exclusions")]
    [Restrict(ClaimTypes.BillingSchedules, ClaimValues.ReadOnly | ClaimValues.FullAccess)]
    public class ProviderExclusionsController : CrudBaseController<BillingScheduleExcludedProvider>
    {
        public ProviderExclusionsController(ICRUDService crudService) : base(crudService)
        {
        }

    }
}
