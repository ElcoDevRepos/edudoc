using API.Core.Claims;
using API.ControllerBase;
using API.CRUD;
using Microsoft.AspNetCore.Mvc;
using Model;
using Service.Base;
using Service.CptCodes;
using System.Collections.Generic;

namespace API.CptCodes
{
    [Route("api/v1/cpt-code-associations")]
    [Restrict(ClaimTypes.CPTCodes, ClaimValues.ReadOnly | ClaimValues.FullAccess)]
    public class CptCodeAssociationController : CrudBaseController<CptCodeAssocation>
    {
        private readonly ICptCodeAssociationService _cptCodeAssociationService;
        public CptCodeAssociationController(ICRUDService crudService, ICptCodeAssociationService cptCodeAssociationService) : base(crudService)
        {
            _cptCodeAssociationService = cptCodeAssociationService;
        }

        [HttpPut]
        [Route("update-and-create")]
        public IActionResult UpdateAndCreateCptCodeAssociations([FromBody] IEnumerable<CptCodeAssocation> associations)
        {
            return ExecuteValidatedAction(() =>
            {
                return Ok(_cptCodeAssociationService.UpdateAssociations(associations, this.GetUserId()));
            });
        }
    }
}
