using API.Core.Claims;
using API.CRUD;
using Microsoft.AspNetCore.Mvc;
using Model;
using Service.Base;
using System.Collections.Generic;


namespace API.Providers
{
    [Route("api/v1/providerOdes")]
    [Restrict(ClaimTypes.ProviderMaintenance, ClaimValues.ReadOnly | ClaimValues.FullAccess)]
    public class ProviderOdesController : CrudBaseController<ProviderOdeCertification>
    {
        public ProviderOdesController(ICRUDService crudService) : base(crudService)
        {

        }

        [HttpGet]
        [Route("provider/{providerId:int}")]
        [Restrict(ClaimTypes.ProviderMaintenance, ClaimValues.ReadOnly | ClaimValues.FullAccess)]
        public IEnumerable<ProviderOdeCertification> GetProviderOdes(int providerId)
        {
            var cspFull = new Model.Core.CRUDSearchParams<ProviderOdeCertification>();
            cspFull.AddedWhereClause.Add(pl => pl.ProviderId == providerId);

            cspFull.order = "ExpirationDate";
            cspFull.orderdirection = "Desc";

            return Crudservice.GetAll(cspFull);
        }
    }
}
