using API.CRUD;
using Microsoft.AspNetCore.Mvc;
using Model;
using Service.Base;

namespace API.Providers
{
    [Route("api/v1/doNotBillReasons")]
    public class ProviderDoNotBillReasonsController : CrudBaseController<ProviderDoNotBillReason>
    {
        public ProviderDoNotBillReasonsController(ICRUDService crudService)
            : base(crudService)
        {

        }
    }
}
