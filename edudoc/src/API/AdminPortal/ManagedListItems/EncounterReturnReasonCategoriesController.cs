using API.ManagedListItems.Base;
using Microsoft.AspNetCore.Mvc;
using Model;
using Service.Base;

namespace API.ManagedListItems
{
    [Route("api/v1/return-reason-categories")]
    public class EncounterReturnReasonCategoriesController : ManagedListItemBaseController<EncounterReturnReasonCategory, EncounterReasonForReturn>
    {
        public EncounterReturnReasonCategoriesController(ICRUDService crudService)
            : base("ReturnReasonCategoryId", "EncounterReturnReasonCategory", crudService)
        {
            UpdateFunc = ManagedListItemUtilities.GetDefaultNamedMappingFunction<EncounterReturnReasonCategory>();
        }
    }
}
