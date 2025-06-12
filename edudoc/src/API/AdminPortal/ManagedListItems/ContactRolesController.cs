using API.ManagedListItems.Base;
using Microsoft.AspNetCore.Mvc;
using Model;
using Service.Base;

namespace API.ManagedListItems
{
    [Route("api/v1/contactRoles")]
    public class ContactRolesController : ManagedListItemBaseController<ContactRole, Contact>
    {
        public ContactRolesController(ICRUDService crudService)
            : base("RoleId", "Contact Role", crudService)
        {
            UpdateFunc = ManagedListItemUtilities.GetDefaultNamedMappingFunction<ContactRole>();
        }
    }
}
