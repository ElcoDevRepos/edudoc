using API.ManagedListItems.Base;
using Microsoft.AspNetCore.Mvc;
using Model;
using Service.Base;

namespace API.ManagedListItems
{
    [Route("api/v1/providerAgencies")]
    public class ProviderAgencyController : ManagedListItemBaseController<Agency, ProviderEscAssignment>
    {
        public ProviderAgencyController(ICRUDService crudService)
            : base("AgencyId", "Provider Agency", crudService)
        {
            UpdateFunc = ManagedListItemUtilities.GetDefaultNamedMappingFunction<Agency>();
        }
    }
}
