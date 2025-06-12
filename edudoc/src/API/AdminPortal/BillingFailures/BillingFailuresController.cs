using API.Core.Claims;
using API.Common;
using API.Common.SearchUtilities;
using API.ControllerBase;
using API.CRUD;
using Microsoft.AspNetCore.Mvc;
using Model;
using Model.DTOs;
using Service.Base;
using Service.BillingFailureServices;
using Service.Utilities;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Linq.Expressions;
using System.Net;

namespace API.BillingSchedules
{
    [Route("api/v1/billing-failures")]
    [Restrict(ClaimTypes.RejectedEncounters, ClaimValues.ReadOnly | ClaimValues.FullAccess)]
    public class BillingFailuresController : CrudBaseController<BillingFailure>
    {
        private readonly IBillingFailureService _billingFailureService;

        public BillingFailuresController(
            IBillingFailureService billingFailureService,
            ICRUDService crudService) : base(crudService)
        {
            Getbyincludes = new[] { "EncounterStudent", "EncounterStudent.Encounter.Provider",
                "EncounterStudent.Encounter.Provider.ProviderUser", "EncounterStudents.Student", "BillingFailureReason" };
            Searchchildincludes = new[] { "EncounterStudent", "EncounterStudent.Encounter.Provider",
                "EncounterStudent.Encounter.Provider.ProviderUser", "EncounterStudents.Student", "BillingFailureReason" };
            _billingFailureService = billingFailureService;
        }

        public override IActionResult Search([FromQuery] Model.Core.CRUDSearchParams csp)
        {
            var cspFull = new Model.Core.CRUDSearchParams<BillingFailure>(csp);
            cspFull.StronglyTypedIncludes = new Model.Core.IncludeList<BillingFailure>
            {
                bf => bf.EncounterStudent,
                bf => bf.EncounterStudent.Encounter,
                bf => bf.EncounterStudent.Encounter.Provider,
                bf => bf.EncounterStudent.Encounter.Provider.ProviderUser,
                bf => bf.EncounterStudent.Student,
                bf => bf.BillingFailureReason,
                bf => bf.EncounterStudent.Student.School,
                bf => bf.EncounterStudent.Student.SchoolDistrict,
            };

            if (!IsBlankQuery(csp.Query))
            {
                string[] terms = SplitSearchTerms(csp.Query.Trim().ToLower());
                cspFull.AddedWhereClause.Add(BillingFailure => terms.All(t =>
                    BillingFailure.EncounterStudent.Student.LastName.ToLower().StartsWith(t) ||
                    BillingFailure.EncounterStudent.Student.FirstName.ToLower().StartsWith(t))
                );
            }

            if (!string.IsNullOrEmpty(csp.extraparams))
            {
                var extras = System.Web.HttpUtility.ParseQueryString(WebUtility.UrlDecode(csp.extraparams));

                if (extras["FailureReasonIds"] != null)
                {
                    var failureReasonIdsParamsList = CommonFunctions.GetIntListFromExtraParams(csp.extraparams, "FailureReasonIds");
                    var failureReasonIds = failureReasonIdsParamsList["FailureReasonIds"];

                    if (failureReasonIds.Count > 0)
                        cspFull.AddedWhereClause.Add(BillingFailure => failureReasonIds.Contains(BillingFailure.BillingFailureReasonId));
                }

                var providerIdParam = SearchStaticMethods.GetIntParametersFromExtraParams(csp.extraparams, "providerId");
                var providerId = providerIdParam["providerId"];
                if (providerId > 0)
                    cspFull.AddedWhereClause.Add(BillingFailure => BillingFailure.EncounterStudent.Encounter.ProviderId == providerId);

                var schoolDistrictIdParam = SearchStaticMethods.GetIntParametersFromExtraParams(csp.extraparams, "districtId");
                var schoolDistrictId = schoolDistrictIdParam["districtId"];
                if (schoolDistrictId > 0)
                    cspFull.AddedWhereClause.Add(BillingFailure => BillingFailure.EncounterStudent.Student.SchoolDistrict.Id == schoolDistrictId);


                if (extras["FailureStartDate"] != null)
                {
                    var startDate = DateTime.Parse(extras["FailureStartDate"]);
                    cspFull.AddedWhereClause.Add(bf => DbFunctions.TruncateTime(bf.DateOfFailure) >= DbFunctions.TruncateTime(startDate));
                }
                if (extras["FailureEndDate"] != null)
                {
                    var endDate = DateTime.Parse(extras["FailureEndDate"]);
                    cspFull.AddedWhereClause.Add(bf => DbFunctions.TruncateTime(bf.DateOfFailure) <= DbFunctions.TruncateTime(endDate));
                }

                if (extras["ScheduleStartDate"] != null)
                {
                    var startDate = DateTime.Parse(extras["ScheduleStartDate"]);
                    cspFull.AddedWhereClause.Add(bf => DbFunctions.TruncateTime(bf.EncounterStudent.EncounterDate) >= DbFunctions.TruncateTime(startDate));
                }
                if (extras["ScheduleEndDate"] != null)
                {
                    var endDate = DateTime.Parse(extras["ScheduleEndDate"]);
                    cspFull.AddedWhereClause.Add(bf => DbFunctions.TruncateTime(bf.EncounterStudent.EncounterDate) <= DbFunctions.TruncateTime(endDate));
                }
            }

            cspFull.AddedWhereClause.Add(failure => !failure.IssueResolved && !failure.EncounterStudent.Archived);

            cspFull.SortList.Enqueue(new KeyValuePair<string, string>(csp.order, csp.orderdirection));

            cspFull.SortList.Enqueue(new KeyValuePair<string, string>("DateOfFailure", "asc"));

            int ct;
            return Ok(Crudservice.Search(cspFull, out ct).AsQueryable()
                                .ToSearchResults(ct)
                                .Respond(this));
        }

        [HttpPost]
        [Route("resolve")]
        public IActionResult ResolveBillingFailure([FromBody] int billingFailureId)
        {
            var data = Crudservice.GetById<BillingFailure>(billingFailureId);

            data.IssueResolved = true;
            data.ResolvedById = this.GetUserId();
            data.DateResolved = DateTime.UtcNow;
            var id = base.Update(billingFailureId, data);
            return Ok(id);
        }

        [HttpGet]
        [Route("resolveAll")]
        [Restrict(ClaimTypes.BillingSchedules, ClaimValues.FullAccess)]
        public IActionResult ResolveAllIssues()
        {
            return Ok(_billingFailureService.ResolveAllFailures(this.GetUserId()));
        }

        [HttpGet]
        [Route("select-options")]
        public IEnumerable<SelectOptions> GetAllSelectOptions()
        {
            var cspFull = new Model.Core.CRUDSearchParams<BillingFailureReason>
            {
                DefaultOrderBy = "Id"
            };

            return Crudservice.GetAll(cspFull).Select(failureReason =>
                new SelectOptions
                {
                    Id = failureReason.Id,
                    Name = failureReason.Name,
                    Archived = false
                }).AsEnumerable();
        }

    }
}
