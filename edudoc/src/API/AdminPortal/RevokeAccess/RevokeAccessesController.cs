using API.Core.Claims;
using API.CRUD;
using Microsoft.AspNetCore.Mvc;
using Model;
using Service.Base;

namespace API.Providers
{
    [Route("api/v1/revokeAccesses")]
    public class RevokeAccessesController : CrudBaseController<RevokeAccess>
    {
        public RevokeAccessesController(ICRUDService crudService)
            : base(crudService)
        {
            Searchchildincludes = new[] { "ProviderDoNotBillReason" };
            Getbyincludes = new[] { "ProviderDoNotBillReason" };
        }

        [HttpGet]
        [Route("getAccessLogs/{providerId:int}")]
        [Restrict(ClaimTypes.ProviderMaintenance, ClaimValues.FullAccess)]
        public IActionResult GetAccessLogs(int providerId, [FromQuery] Model.Core.CRUDSearchParams csp)
        {
            var cspFull = new Model.Core.CRUDSearchParams<RevokeAccess>(csp) { Includes = Searchchildincludes, DefaultOrderBy = Orderby };
            string extraparams = csp.extraparams;

            cspFull.AddedWhereClause.Add(r => r.ProviderId == providerId);

            return Ok(base.BaseSearch(cspFull));
        }
    }

}
