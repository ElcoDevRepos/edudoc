using API.ManagedListItems.Base;
using Microsoft.AspNetCore.Mvc;
using Model;
using Service.Base;

namespace API.ManagedListItems
{
    [Route("api/v1/encounter-locations")]
    public class EncounterLocationsController : ManagedListItemBaseController<EncounterLocation, EncounterStudent>
    {
        public EncounterLocationsController(ICRUDService crudService) : base("EncounterLocationId", "Encounter Location", crudService)
        {
            UpdateFunc = ManagedListItemUtilities.GetDefaultNamedMappingFunction<EncounterLocation>();
        }
    }
}
