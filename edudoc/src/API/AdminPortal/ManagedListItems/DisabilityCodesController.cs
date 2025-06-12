using API.ManagedListItems.Base;
using Microsoft.AspNetCore.Mvc;
using Model;
using Service.Base;

namespace API.ManagedListItems
{
    [Route("api/v1/disability-codes")]
    public class DisabilityCodesController : ManagedListItemBaseController<DisabilityCode, StudentDisabilityCode>
    {
        public DisabilityCodesController(ICRUDService crudService)
            : base("DisabilityCodeId", "DisabilityCode", crudService)
        {
            UpdateFunc = ManagedListItemUtilities.GetDefaultNamedMappingFunction<DisabilityCode>();
        }
    }
}
