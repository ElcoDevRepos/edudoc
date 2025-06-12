using API.Core.Claims;
using API.ControllerBase;
using Microsoft.AspNetCore.Mvc;
using Model;
using Service.Base;

namespace API.ProviderPortal.ElectronicSignatures
{
    public class ProviderElectronicSignaturesController : ApiControllerBase
    {
        private readonly ICRUDService _crudService;
        public ProviderElectronicSignaturesController(ICRUDService crudservice)
        {
            _crudService = crudservice;
        }

        [HttpGet]
        [Route("api/v1/provider/electronic-signatures/{signatureId:int}")]
        public IActionResult GetById([FromRoute] int signatureId)
        {
            return Ok(_crudService.GetById<ESignatureContent>(signatureId));
        }

    }
}
