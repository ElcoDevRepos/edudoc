using API.Core.Claims;
using API.CRUD;
using Microsoft.AspNetCore.Mvc;
using Model;
using Service.Base;
using System.Collections.Generic;
using System.Linq;
using API.ControllerBase;
using System;
using Service.Encounters.ServiceOutcomes;
using System.Net;

namespace API.ProviderPortal.EncounterStudents.ServiceOutcomes
{
    [Route("api/v1/service-outcomes")]
    [Restrict(ClaimTypes.Encounters, ClaimValues.FullAccess)]
    public class ServiceOutcomesController : CrudBaseController<ServiceOutcome>
    {
        private readonly IServiceOutcomeService _serviceOutcomeService;
        public ServiceOutcomesController(ICRUDService crudService, IServiceOutcomeService serviceOutcomeService) : base(crudService)
        {
            _serviceOutcomeService = serviceOutcomeService;
        }

        [HttpPut]
        [Route("update")]
        public IActionResult Update([FromBody] IEnumerable<ServiceOutcome> outcomes)
        {

                return ExecuteValidatedAction(() =>
                {
                    _serviceOutcomeService.Update(outcomes, this.GetUserId());
                    return Ok();
                });


        }

        public override IActionResult Create([FromBody] ServiceOutcome data)
        {
            data.CreatedById = this.GetUserId();
            return base.Create(data);
        }

        public override IActionResult GetAll()
        {
            var csp = new Model.Core.CRUDSearchParams();
            var cspFull = new Model.Core.CRUDSearchParams<ServiceOutcome>(csp) {
                order = "Notes",
            };
            
            return Ok(BaseSearch(cspFull));
        }
  
    }

}
