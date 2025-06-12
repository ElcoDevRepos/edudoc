using API.ManagedListItems.Base;
using Microsoft.AspNetCore.Mvc;
using Model;
using Service.Base;

namespace API.ManagedListItems
{
    [Route("api/v1/methods")]
    public class MethodsController : ManagedListItemBaseController<Method, CaseLoadMethod>
    {
        public MethodsController(ICRUDService crudService)
            : base("MethodId", "Method", crudService)
        {
            UpdateFunc = ManagedListItemUtilities.GetDefaultNamedMappingFunction<Method>();
        }
    }
}
