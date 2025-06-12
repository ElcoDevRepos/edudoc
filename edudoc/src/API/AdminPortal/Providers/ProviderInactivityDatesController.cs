using API.Core.Claims;
using API.ControllerBase;
using API.CRUD;
using Microsoft.AspNetCore.Mvc;
using Model;
using Service.Base;
using Service.ProviderInactivityDates;
using System;
using System.Collections.Generic;

namespace API.Providers
{
    [Route("api/v1/providerinactivitydates")]
    [Restrict(ClaimTypes.ProviderMaintenance, ClaimValues.ReadOnly | ClaimValues.FullAccess)]
    public class ProviderInactivityDatesController : CrudBaseController<ProviderInactivityDate>
    {
        private readonly ICRUDService _crudService;
        private readonly IProviderInactivityDateService _providerInactivityDateService;
        public ProviderInactivityDatesController(ICRUDService crudService,
            IProviderInactivityDateService providerInactivityDateService) : base(crudService)
        {
            _crudService = crudService;
            _providerInactivityDateService = providerInactivityDateService;
        }

        [HttpPost]
        [Restrict(ClaimValues.FullAccess)]
        [Route("")]
        public override IActionResult Create([FromBody] ProviderInactivityDate data)
        {
            int id = _crudService.Create(data);
            _providerInactivityDateService.UpdateEncounterStudentStatus(data.ProviderId, this.GetAuthUserId());
            return Ok(id);
        }

        [HttpPut]
        [Restrict(ClaimValues.FullAccess)]
        [Route("{id:int}")]
        public override IActionResult Update(int id, [FromBody] ProviderInactivityDate data)
        {
            _crudService.Update(data);
            _providerInactivityDateService.UpdateEncounterStudentStatus(data.ProviderId, this.GetAuthUserId());
            return Ok();
        }

        [HttpGet]
        [Route("get-by-provider/{providerId:int}")]
        [Restrict(ClaimTypes.ProviderMaintenance, ClaimValues.ReadOnly | ClaimValues.FullAccess)]
        public IEnumerable<ProviderInactivityDate> GetInactivityDatesByProviderId(int providerId)
        {
            var cspFull = new Model.Core.CRUDSearchParams<ProviderInactivityDate>()
            {
                StronglyTypedIncludes = new Model.Core.IncludeList<ProviderInactivityDate>
                {
                    pid => pid.ProviderDoNotBillReason
                }
            };

            cspFull.AddedWhereClause.Add(pid => pid.ProviderId == providerId);

            cspFull.order = "ProviderInactivityStartDate";
            return _crudService.GetAll(cspFull);
        }
    }
}
