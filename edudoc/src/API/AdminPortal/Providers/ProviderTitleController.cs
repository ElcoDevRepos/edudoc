using API.Core.Claims;
using API.Common;
using API.CRUD;
using Microsoft.AspNetCore.Mvc;
using Model;
using Model.DTOs;
using Service.Base;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Net;

namespace API.Providers
{
    [Route("api/v1/providertitles")]
    // DO NOT add controller level claim since we are using GetAll to populate drop downs.

    public class ProviderTitleController : CrudBaseController<ProviderTitle>
    {
        public ProviderTitleController(ICRUDService crudService)
            : base(crudService)
        {
            Getbyincludes = new[] { "ProviderTitles" };
        }

        [HttpGet]
        [Route("select-options")]
        public IEnumerable<SelectOptions> GetAllSelectOptions()
        {
            var csp = new Model.Core.CRUDSearchParams<ProviderTitle> { order = "Code" };
            return Crudservice.GetAll(csp).Select(providerTitle =>
               new SelectOptions
               {
                   Id = providerTitle.Id,
                   Name = providerTitle.Name,
                   Archived = providerTitle.Archived
               }).AsEnumerable();
        }

        [HttpGet]
        [Route("message-options")]
        public IEnumerable<ProviderTitle> GetAllForMessages()
        {
            var csp = new Model.Core.CRUDSearchParams<ProviderTitle> { order = "Code" };

            return Crudservice.GetAll(csp).Where(sd => !sd.Archived).AsEnumerable();
        }

        [Restrict(ClaimTypes.ProviderTitles, ClaimValues.ReadOnly | ClaimValues.FullAccess)]
        public override IActionResult Search([FromQuery] Model.Core.CRUDSearchParams csp)
        {
            var cspFull = new Model.Core.CRUDSearchParams<ProviderTitle>(csp)
            {
                StronglyTypedIncludes = new Model.Core.IncludeList<ProviderTitle>
            {
                pt => pt.ServiceCode,
                pt => pt.SupervisorTitle,
            }
            };


            if (!IsBlankQuery(csp.Query))
            {
                string[] terms = SplitSearchTerms(csp.Query.Trim().ToLower());
                cspFull.AddedWhereClause.Add(code => terms.All(t => code.Name.StartsWith(t.ToLower()) ||
                    code.Code.StartsWith(t.ToLower()))
                );
            }

            if (!string.IsNullOrEmpty(csp.extraparams))
            {
                var extras = System.Web.HttpUtility.ParseQueryString(WebUtility.UrlDecode(csp.extraparams));
                if (extras["includeArchived"] == "0")
                {
                    cspFull.AddedWhereClause.Add(cpt => !cpt.Archived);
                }

                if (extras["ServiceCodeIds"] != null)
                {
                    IEnumerable<int> serviceCodeIds = extras["ServiceCodeIds"].Split(',').Select(System.Int32.Parse).ToList();
                    cspFull.AddedWhereClause.Add(cpt => serviceCodeIds.Contains(cpt.ServiceCodeId));
                }
            }

            cspFull.SortList.Enqueue(new KeyValuePair<string, string>(csp.order, csp.orderdirection));

            cspFull.SortList.Enqueue(new KeyValuePair<string, string>("Name", "asc"));

            int ct;
            return Ok(Crudservice.Search(cspFull, out ct).AsQueryable()
                                .ToSearchResults(ct)
                                .Respond(this));

        }
    }
}
