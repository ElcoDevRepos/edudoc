using API.Core.Claims;
using API.ControllerBase;
using Microsoft.AspNetCore.Mvc;
using Model;
using Service.Base;
using System.Collections.Generic;

namespace API.Providers
{
    [Route("api/v1/providerEmploymentTypes")]
    [Restrict(ClaimTypes.ProviderMaintenance, ClaimValues.FullAccess | ClaimValues.ReadOnly)]
    public class ProviderEmploymentTypesController : ApiControllerBase
    {
        private readonly ICRUDService _crudService;

        public ProviderEmploymentTypesController(ICRUDService crudService)
        {
            _crudService = crudService;
        }

        [HttpGet]
        public IEnumerable<ProviderEmploymentType> GetProviderEmploymentTypes()
        {
            return _crudService.GetAll(new Model.Core.CRUDSearchParams<ProviderEmploymentType>());
        }
    }
}
