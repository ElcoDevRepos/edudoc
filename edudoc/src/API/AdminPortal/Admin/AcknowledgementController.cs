using API.Core.Claims;
using API.CRUD;
using Microsoft.AspNetCore.Mvc;
using Model;
using Service.Base;
using ClaimTypes = API.Core.Claims.ClaimTypes;


namespace API.Admin
{
    [Route("api/v1/acknowledgments")]
    [Restrict(ClaimTypes.ProviderAcknowledgements, ClaimValues.ReadOnly | ClaimValues.FullAccess)]
    public class AcknowledgementController : CrudBaseController<Acknowledgement>
    {
        public AcknowledgementController(ICRUDService crudservice)
            : base(crudservice)
        {
        }

    }
}
