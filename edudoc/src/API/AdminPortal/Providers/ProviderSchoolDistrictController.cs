using API.Common;
using API.Common.SearchUtilities;
using API.CRUD;
using Microsoft.AspNetCore.Mvc;
using Model;
using Model.Enums;
using Service.Base;
using Service.Providers;
using System;
using System.Collections.Generic;
using System.Linq;

namespace API.Providers
{
    [Route("api/v1/providerSchoolDistricts")]
    public class ProviderSchoolDistrictController : CrudBaseController<ProviderEscAssignment>
    {
        private readonly IProviderSchoolDistrictService _providerSchoolDistrictService;
        public ProviderSchoolDistrictController(
            ICRUDService crudService,
            IProviderSchoolDistrictService providerSchoolDistrictService
        ) : base(crudService)
        {
            _providerSchoolDistrictService = providerSchoolDistrictService;
        }

        public override IActionResult Search([FromQuery] Model.Core.CRUDSearchParams csp)
        {
            var cspFull = new Model.Core.CRUDSearchParams<ProviderEscAssignment>(csp);
            cspFull.StronglyTypedIncludes = new Model.Core.IncludeList<ProviderEscAssignment>
            {
                pe => pe.ProviderEscSchoolDistricts,
                pe => pe.ProviderEscSchoolDistricts.Select(pesd => pesd.SchoolDistrict),
                pe => pe.Esc,
                pe => pe.Agency,
            };

            if (!string.IsNullOrEmpty(csp.extraparams))
            {
                var extraParamLists = SearchStaticMethods.GetIntListFromExtraParams(csp.extraparams,
                    "providerIds");

                var providerIdList = extraParamLists["providerIds"];
                if (providerIdList.Count > 0)
                {
                    cspFull.AddedWhereClause.Add(psd => providerIdList.Contains(psd.ProviderId));
                }

                var boolLists = SearchStaticMethods.GetBoolListFromExtraParams(csp.extraparams, "archivedStatus");
                var archivedStatusList = boolLists["archivedStatus"];
                cspFull.AddedWhereClause.Add(psd => archivedStatusList.Contains(psd.Archived));
            }

            cspFull.SortList.Enqueue(new KeyValuePair<string, string>(csp.order, csp.orderdirection));
            int ct;

            return Ok(Crudservice.Search(cspFull, out ct).AsQueryable()
                .ToSearchResults(ct)
                .Respond(this));
        }

        public override IActionResult Update(int id, [FromBody] ProviderEscAssignment data)
        {
            if (data.Provider.ProviderEmploymentTypeId == (int)ProviderEmploymentTypes.DistrictEmployed)
            {
                data.AgencyTypeId = null;
                data.AgencyType = null;
                data.AgencyId = null;
                data.Agency = null;
            }
            return base.Update(id, data);
        }

        public override IActionResult Delete(int id)
        {
            return Ok(_providerSchoolDistrictService.DeleteEscAssignment(id));
        }

    }
}
