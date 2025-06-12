using API.Core.Claims;
using API.CRUD;
using Microsoft.AspNetCore.Mvc;
using Model;
using Service.Base;

namespace API.EdiErrorCodes
{
    [Route("api/v1/edi-error-codes")]
    [Restrict(ClaimTypes.AppSettings, ClaimValues.ReadOnly | ClaimValues.FullAccess)]
    public class EdiErrorCodesController : CrudBaseController<EdiErrorCode>
    {
        public EdiErrorCodesController(ICRUDService crudService) : base(crudService)
        {
            Getbyincludes = new[] { "EdiFileType" };
        }

    }
}
