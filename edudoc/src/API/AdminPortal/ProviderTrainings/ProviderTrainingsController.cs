using API.Core.Claims;
using API.Common;
using API.ControllerBase;
using API.CRUD;
using Microsoft.AspNetCore.Mvc;
using Model;
using Model.DTOs;
using Service.Base;
using Service.ProviderTrainings;
using Service.Utilities;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Linq.Expressions;
using System.Net;

namespace API.ProviderTrainings
{
    [Route("api/v1/provider-trainings")]
    [Restrict(ClaimTypes.ProviderMaintenance, ClaimValues.ReadOnly | ClaimValues.FullAccess)]
    public class ProviderTrainingsController : CrudBaseController<ProviderTraining>
    {
        private readonly IProviderTrainingService _providerTrainingService;

        public ProviderTrainingsController(
            IProviderTrainingService providerTrainingService,
            ICRUDService crudService) : base(crudService)
        {
            Getbyincludes = new[] { "MessageDocument", "MessageLink", "MessageDocument.MessageFilterType", "MessageLink.MessageFilterType", "Provider", "Provider.ProviderUser" };
            Searchchildincludes = new[] { "MessageDocument", "MessageLink", "MessageDocument.MessageFilterType", "MessageLink.MessageFilterType", "Provider", "Provider.ProviderUser" };

            _providerTrainingService = providerTrainingService;
        }

        public override IActionResult Search([FromQuery] Model.Core.CRUDSearchParams csp)
        {
            var cspFull = new Model.Core.CRUDSearchParams<ProviderTraining>(csp);
            cspFull.StronglyTypedIncludes = new Model.Core.IncludeList<ProviderTraining>
            {
                pt => pt.MessageDocument,
                pt => pt.MessageDocument.MessageFilterType,
                pt => pt.MessageLink,
                pt => pt.MessageLink.MessageFilterType,
                pt => pt.Provider,
                pt => pt.Provider.ProviderUser
            };

            if (!IsBlankQuery(csp.Query))
            {
                string[] terms = SplitSearchTerms(csp.Query.Trim().ToLower());
                cspFull.AddedWhereClause.Add(pt => terms.Any(t =>
                    pt.Provider.ProviderUser.LastName.StartsWith(t.ToLower()) ||
                    pt.Provider.ProviderUser.FirstName.StartsWith(t.ToLower()) ||
                    pt.MessageDocument.Description.StartsWith(t.ToLower()) ||
                    pt.MessageLink.Description.StartsWith(t.ToLower()))
                );
            }

            if (!string.IsNullOrEmpty(csp.extraparams))
            {
                var extras = System.Web.HttpUtility.ParseQueryString(WebUtility.UrlDecode(cspFull.extraparams));

                if (extras["completedOnly"] == "0")
                {
                    cspFull.AddedWhereClause.Add(training => training.DateCompleted == null);
                } else
                {
                    cspFull.AddedWhereClause.Add(training => training.DateCompleted != null);
                }

                if (extras["StartDate"] != null)
                {
                    var startDate = DateTime.Parse(extras["StartDate"]);
                    cspFull.AddedWhereClause.Add(pt => DbFunctions.TruncateTime(pt.DueDate) >= DbFunctions.TruncateTime(startDate));
                }
                if (extras["EndDate"] != null)
                {
                    var endDate = DateTime.Parse(extras["EndDate"]);
                    cspFull.AddedWhereClause.Add(pt => DbFunctions.TruncateTime(pt.DueDate) <= DbFunctions.TruncateTime(endDate));
                }
            }
            cspFull.AddedWhereClause.Add(pt => !pt.Provider.Archived);
            cspFull.AddedWhereClause.Add(pt => !pt.Archived && (!pt.MessageLink.Archived || !pt.MessageDocument.Archived));

            cspFull.SortList.Enqueue(new KeyValuePair<string, string>(csp.order, csp.orderdirection));

            int ct;
            return Ok(Crudservice.Search(cspFull, out ct).AsQueryable()
                                .ToSearchResults(ct)
                                .Respond(this));
        }

        [HttpPost]
        [Route("remind")]
        public IActionResult ProviderTrainingReminder([FromBody] int providerTrainingId)
        {
            _providerTrainingService.RemindProvider(providerTrainingId);
            return Ok();
        }

        [HttpGet]
        [Route("remindAll")]
        [Restrict(ClaimTypes.BillingSchedules, ClaimValues.FullAccess)]
        public IActionResult ProviderTrainingRemindAll()
        {
            _providerTrainingService.RemindAllProviders();
            return Ok();
        }
    }
}
