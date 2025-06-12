using API.Core.Claims;
using API.ControllerBase;
using API.CRUD;
using Microsoft.AspNetCore.Mvc;
using Model;
using Service.Base;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;

namespace API.EncounterReasonsForReturn
{
    [Route("api/v1/reasons-for-return")]
    [Restrict(ClaimTypes.ReturnReasons, ClaimValues.ReadOnly | ClaimValues.FullAccess)]
    public class EncounterReasonsForReturnController : CrudBaseController<EncounterReasonForReturn>
    {
        public EncounterReasonsForReturnController(ICRUDBaseService crudService) : base(crudService)
        {
        }

        /// <summary>
        /// Gets all reasons for return and associated categories 
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        [Route("current-reasons")]
        [Restrict(ClaimTypes.ReturnReasons, ClaimValues.ReadOnly | ClaimValues.FullAccess)]
        public IActionResult GetByUserId()
        {
            var csp = new Model.Core.CRUDSearchParams<EncounterReasonForReturn>
            {
                StronglyTypedIncludes = new Model.Core.IncludeList<EncounterReasonForReturn>
                   {
                       e => e.EncounterReturnReasonCategory,
                   }
            };
            return Ok(Crudservice.GetAll(csp)
                .Where(e => e.HpcUserId == this.GetUserId() && !e.Archived)
                .ToList());
        }

    }
}
