using Service.Core.Utilities;
using Service.Core.Utilities;
using API.Core.Claims;
using API.Common;
using API.ControllerBase;
using API.CRUD;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Net.Http.Headers;
using Model;
using Service.Base;
using Service.BillingSchedules;
using Service.Utilities;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Linq.Expressions;
using System.Net;
using System.Threading.Tasks;

namespace API.BillingSchedules
{
    [Route("api/v1/billing-schedules")]
    [Restrict(ClaimTypes.BillingSchedules, ClaimValues.ReadOnly | ClaimValues.FullAccess)]
    public class BillingSchedulesController : CrudBaseController<BillingSchedule>
    {
        private readonly IBillingScheduleService _billingScheduleService;
        private readonly IDocumentHelper _documentHelper;

        public BillingSchedulesController(
            IBillingScheduleService billingScheduleService,
            ICRUDService crudService,
            IDocumentHelper documentHelper) : base(crudService)
        {
            Getbyincludes = new[] {
                "BillingScheduleDistricts",
                "BillingScheduleDistricts.SchoolDistrict",
                "BillingScheduleExcludedCptCodes",
                "BillingScheduleExcludedCptCodes.CptCode",
                "BillingScheduleExcludedProviders",
                "BillingScheduleExcludedProviders.Provider.ProviderUser",
                "BillingScheduleExcludedServiceCodes.ServiceCode",
                "BillingScheduleAdminNotifications",
                "BillingScheduleAdminNotifications.Admin"
            };

            _billingScheduleService = billingScheduleService;
            _documentHelper = documentHelper;
        }

        public override IActionResult Search([FromQuery] Model.Core.CRUDSearchParams csp)
        {
            var cspFull = new Model.Core.CRUDSearchParams<BillingSchedule>(csp);

            if (!IsBlankQuery(csp.Query))
            {
                string[] terms = SplitSearchTerms(csp.Query.Trim().ToLower());
                cspFull.AddedWhereClause.Add(schedule => terms.All(t => schedule.Name.StartsWith(t.ToLower())));
            }

            if (!string.IsNullOrEmpty(csp.extraparams))
            {
                var extras = System.Web.HttpUtility.ParseQueryString(WebUtility.UrlDecode(csp.extraparams));
                if (extras["includeArchived"] == "0")
                {
                    cspFull.AddedWhereClause.Add(schedule => !schedule.Archived);
                }
            }
            cspFull.AddedWhereClause.Add(csp => !csp.Archived);

            cspFull.SortList.Enqueue(new KeyValuePair<string, string>(csp.order, csp.orderdirection));

            cspFull.SortList.Enqueue(new KeyValuePair<string, string>("Name", "asc"));

            int ct;
            return Ok(Crudservice.Search(cspFull, out ct).AsQueryable()
                                .ToSearchResults(ct)
                                .Respond(this));

        }

        [Route("get-files")]
        [HttpGet]
        [Restrict(ClaimTypes.BillingSchedules, ClaimValues.ReadOnly | ClaimValues.FullAccess)]
        public IActionResult GetBillingFiles([FromQuery] Model.Core.CRUDSearchParams csp)
        {
            var cspFull = new Model.Core.CRUDSearchParams<BillingFile>(csp);
            cspFull.StronglyTypedIncludes = new Model.Core.IncludeList<BillingFile>
            {
                bf => bf.HealthCareClaim,
                bf => bf.HealthCareClaim.BillingSchedule,
            };

            if (!IsBlankQuery(csp.Query))
            {
                string[] terms = SplitSearchTerms(csp.Query.Trim().ToLower());
                cspFull.AddedWhereClause.Add(file => terms.All(t => file.Name.StartsWith(t.ToLower())));
            }

            cspFull.SortList.Enqueue(new KeyValuePair<string, string>(csp.order, csp.orderdirection));

            int ct;
            return Ok(Crudservice.Search(cspFull, out ct).AsQueryable()
                                .ToSearchResults(ct)
                                .Respond(this));

        }

        [HttpGet]
        [Route("{billingFileId:int}/download")]
        [Restrict(ClaimTypes.BillingSchedules, ClaimValues.FullAccess)]
        public IActionResult Download([FromRoute] int billingFileId)
        {
            var data = Crudservice.GetById<BillingFile>(billingFileId);
            var absolutePath = _documentHelper.PrependDocsPath(data.FilePath);
            byte[] rosterFile;

            try
            {
                rosterFile = System.IO.File.ReadAllBytes(absolutePath);
            }
            catch (FileNotFoundException)
            {
                return BadRequest("Document record was invalid or file access on disk failed.");
            }

            return new FileStreamResult(new System.IO.MemoryStream(rosterFile), new MediaTypeHeaderValue("application/octet-stream"))
            {
                FileDownloadName = data.Name
            };

        }

        [HttpPost]
        [Route("archive/{id:int}")]
        [Restrict(ClaimTypes.Vouchers, ClaimValues.ReadOnly | ClaimValues.FullAccess)]
        public IActionResult ArchiveBillingSchedule(int id)
        {
            return Ok(_billingScheduleService.ArchiveBillingSchedule(id));
        }

    }
}
