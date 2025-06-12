using API.ManagedListItems.Base;
using Microsoft.AspNetCore.Mvc;
using Model;
using Service.Base;

namespace API.ManagedListItems
{
    [Route("api/v1/documentTypes")]
    public class DocumentTypesController : ManagedListItemBaseController<DocumentType, EncounterStudent>
    {
        public DocumentTypesController(ICRUDService crudService)
            : base("DocumentTypeId", "DocumentType", crudService)
        {
            UpdateFunc = ManagedListItemUtilities.GetDefaultNamedMappingFunction<DocumentType>();
        }
    }
}
