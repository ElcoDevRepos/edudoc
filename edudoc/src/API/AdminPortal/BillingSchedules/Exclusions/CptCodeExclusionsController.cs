using API.Core.Claims;
using API.CRUD;
using Microsoft.AspNetCore.Mvc;
using Model;
using Service.Base;

namespace API.BillingSchedules
{
    [Route("api/v1/cpt-code-exclusions")]
    [Restrict(ClaimTypes.BillingSchedules, ClaimValues.ReadOnly | ClaimValues.FullAccess)]
    public class CptCodeExclusionsController : CrudBaseController<BillingScheduleExcludedCptCode>
    {
        public CptCodeExclusionsController(ICRUDService crudService) : base(crudService)
        {
        }

    }
}
