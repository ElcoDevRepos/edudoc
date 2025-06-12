using API.ManagedListItems.Base;
using Microsoft.AspNetCore.Mvc;
using Model;
using Service.Base;

namespace API.ManagedListItems
{
    [Route("api/v1/student-deviation-reasons")]
    public class StudentDeviationReasonsController : ManagedListItemBaseController<StudentDeviationReason, EncounterStudent>
    {
        public StudentDeviationReasonsController(ICRUDService crudService)
            : base("StudentDeviationReasonId", "StudentDeviationReason", crudService)
        {
            UpdateFunc = ManagedListItemUtilities.GetDefaultNamedMappingFunction<StudentDeviationReason>();
        }
    }
}
