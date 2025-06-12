using API.CRUD;
using Microsoft.AspNetCore.Mvc;
using Model;
using Service.Base;

namespace API.Providers
{
    [Route("api/v1/providerinactivityreasons")]
    public class ProviderInactivityReasonsController : CrudBaseController<ProviderInactivityReason>
    {
        public ProviderInactivityReasonsController(ICRUDService crudService)
            : base(crudService)
        {

        }
    }
}
