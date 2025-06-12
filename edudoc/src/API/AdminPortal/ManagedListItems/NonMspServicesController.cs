using API.ManagedListItems.Base;
using Microsoft.AspNetCore.Mvc;
using Model;
using Service.Base;

namespace API.ManagedListItems
{
    [Route("api/v1/nonmspservices")]
    public class NonMspServicesController : ManagedListItemBaseController<NonMspService, Encounter>
    {
        public NonMspServicesController(ICRUDService crudService)
            : base("NonMspServiceTypeId", "NonMspService", crudService)
        {
            UpdateFunc = ManagedListItemUtilities.GetDefaultNamedMappingFunction<NonMspService>();
        }
    }
}
