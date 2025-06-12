using API.Core.Claims;
using API.CRUD;
using Microsoft.AspNetCore.Mvc;
using Model;
using Service.Base;

namespace API.AdminPortal.AnnualEntryStatuses
{
    [Route("api/v1/annual-entry-statuses")]
    [Restrict(ClaimTypes.BillingSchedules, ClaimValues.ReadOnly | ClaimValues.FullAccess)]
    public class AnnualEntryStatusesController : CrudBaseController<AnnualEntryStatus>
    {
        public AnnualEntryStatusesController(ICRUDService crudService) : base(crudService)
        {
            
        }
    }
}
