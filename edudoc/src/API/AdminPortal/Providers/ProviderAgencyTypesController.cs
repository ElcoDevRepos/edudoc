using API.Core.Claims;
using API.CRUD;
using Microsoft.AspNetCore.Mvc;
using Model;
using Service.Base;

namespace API.Providers
{
    [Route("api/v1/agencyTypes")]
    [Restrict(ClaimTypes.ProviderMaintenance, ClaimValues.ReadOnly | ClaimValues.FullAccess)]
    public class ProviderAgencyTypesController : CrudBaseController<AgencyType>
    {
        public ProviderAgencyTypesController(ICRUDService crudService)
            : base(crudService)
        {

        }
    }
}
