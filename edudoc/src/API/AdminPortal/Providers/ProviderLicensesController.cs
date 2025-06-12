using API.Core.Claims;
using API.CRUD;
using Microsoft.AspNetCore.Mvc;
using Model;
using Service.Base;
using System.Collections.Generic;

namespace API.Providers
{
    [Route("api/v1/providerLicenses")]
    [Restrict(ClaimTypes.ProviderMaintenance, ClaimValues.ReadOnly | ClaimValues.FullAccess)]
    public class ProviderLicensesController : CrudBaseController<ProviderLicens>
    {
        public ProviderLicensesController(ICRUDService crudService) : base(crudService)
        {

        }

        [HttpGet]
        [Route("provider/{providerId:int}")]
        [Restrict(ClaimTypes.ProviderMaintenance, ClaimValues.ReadOnly | ClaimValues.FullAccess)]
        public IEnumerable<ProviderLicens> GetProviderLicenses(int providerId)
        {
            var cspFull = new Model.Core.CRUDSearchParams<ProviderLicens>();
            cspFull.AddedWhereClause.Add(pl => pl.ProviderId == providerId);

            cspFull.order = "ExpirationDate";
            cspFull.orderdirection = "Asc";

            return Crudservice.GetAll(cspFull);
        }
    }
}
