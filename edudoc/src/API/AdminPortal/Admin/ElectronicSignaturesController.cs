using API.Core.Claims;
using API.CRUD;
using Microsoft.AspNetCore.Mvc;
using Model;
using Service.Base;


namespace API.Admin
{
    [Route("api/v1/admin/electronic-signatures")]
    [Restrict(ClaimTypes.ProviderAcknowledgements, ClaimValues.ReadOnly | ClaimValues.FullAccess)]
    public class ElectronicSignaturesController : CrudBaseController<ESignatureContent>
    {
        public ElectronicSignaturesController(ICRUDService crudservice)
            : base(crudservice)
        {
        }

    }
}
