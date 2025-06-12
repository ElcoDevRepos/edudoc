using API.Core.Claims;
using API.Common;
using API.ControllerBase;
using API.CRUD;
using Microsoft.AspNetCore.Mvc;
using Model;
using Model.DTOs;
using Service.Base;
using Service.ServiceUnitRules;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Net;

namespace API.Messages
{
    [Route("api/v1/service-unit-rules")]
    [Restrict(ClaimTypes.CPTCodes, ClaimValues.ReadOnly | ClaimValues.FullAccess)]

    public class ServiceUnitRulesController : CrudBaseController<ServiceUnitRule>
    {
        private readonly IServiceUnitRuleService _service;

        public ServiceUnitRulesController(ICRUDBaseService crudservice, IServiceUnitRuleService service) : base(crudservice)
        {
            Getbyincludes = new[] { "ServiceUnitTimeSegments", "CptCode" };
            _service = service;
        }

        public override IActionResult Search([FromQuery] Model.Core.CRUDSearchParams csp)
        {
            var cspFull = new Model.Core.CRUDSearchParams<ServiceUnitRule>(csp);

            cspFull.StronglyTypedIncludes = new Model.Core.IncludeList<ServiceUnitRule>
            {
                rule => rule.CptCode,
                rule => rule.ServiceUnitTimeSegments,
            };

            if (!IsBlankQuery(csp.Query))
            {
                string[] terms = SplitSearchTerms(csp.Query.Trim().ToLower());
                cspFull.AddedWhereClause.Add(rule => terms.All(t => rule.Name.StartsWith(t.ToLower()) || rule.Description.StartsWith(t.ToLower())));
            }

            if (!string.IsNullOrEmpty(csp.extraparams))
            {
                var extras = System.Web.HttpUtility.ParseQueryString(WebUtility.UrlDecode(csp.extraparams));
                if (extras["includeArchived"] == "0")
                {
                    cspFull.AddedWhereClause.Add(cpt => !cpt.Archived);
                }
            }

            cspFull.SortList.Enqueue(new KeyValuePair<string, string>(csp.order, csp.orderdirection));

            cspFull.SortList.Enqueue(new KeyValuePair<string, string>("Description", "asc"));

            int ct;
            return Ok(Crudservice.Search(cspFull, out ct).AsQueryable()
                                .ToSearchResults(ct)
                                .Respond(this));

        }

        [HttpPut]
        [Route("time-segments/update-and-create")]
        public IActionResult UpdateAndCreateServiceUnitTimeSegments([FromBody] IEnumerable<ServiceUnitTimeSegment> segments)
        {
            return ExecuteValidatedAction(() =>
            {
                return Ok(_service.UpdateTimeSegments(segments, this.GetUserId()));
            });
        }

        [HttpDelete]
        [Route("time-segments/{segmentId:int}")]
        public IActionResult DeleteServiceUnitTimeSegment(int segmentId)
        {
            return ExecuteValidatedAction(() =>
            {
                _service.DeleteTimeSegment(segmentId);
                return Ok();
            });
        }

        [HttpGet]
        [Route("select-options")]
        public IEnumerable<SelectOptions> GetAllSelectOptions()
        {
            var cspFull = new Model.Core.CRUDSearchParams<ServiceUnitRule>
            {
                DefaultOrderBy = "Name"
            };

            return Crudservice.GetAll(cspFull).Where(rule => !rule.Archived).Select(rule =>
                new SelectOptions
                {
                    Id = rule.Id,
                    Name = rule.Name,
                    Archived = rule.Archived
                }).AsEnumerable();
        }
    }
}
