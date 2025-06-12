using API.Core.Claims;
using Microsoft.AspNetCore.Mvc;
using Model;
using Service.Base;
using Service.Encounters;
using API.CRUD;

namespace API.Common.Encounters
{
    [Route("api/v1/encounter-student-statuses")]
    [Restrict(ClaimTypes.Encounters, ClaimValues.ReadOnly | ClaimValues.FullAccess)]
    public class EncounterStudentStatusesController : CrudBaseController<EncounterStudentStatus>
    {
        private readonly IEncounterStudentStatusService _encounterStudentStatusService;
        public EncounterStudentStatusesController(ICRUDService crudService, IEncounterStudentStatusService encounterStudentStatusService) : base(crudService)
        {
            _encounterStudentStatusService = encounterStudentStatusService;
        }
    }
}
