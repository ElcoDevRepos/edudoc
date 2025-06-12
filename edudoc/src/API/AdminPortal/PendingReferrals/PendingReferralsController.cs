using System.Collections.Generic;
using System.Linq;
using System.Net;
using API.Core.Claims;
using API.Common;
using API.ControllerBase;
using API.CRUD;
using Microsoft.AspNetCore.Mvc;
using Model;
using Service.Base;
using Service.PendingReferrals;
using Service.Utilities;

namespace API.PendingReferrals
{
    [Route("api/v1/pending-referrals")]
    [Restrict(ClaimTypes.Encounters, ClaimValues.FullAccess | ClaimValues.ReadOnly)]
    public class PendingReferralsController : CrudBaseController<PendingReferral>
    {
        private readonly IPendingReferralService _pendingReferralService;

        public PendingReferralsController(ICRUDBaseService crudservice, IPendingReferralService pendingReferralService) : base(crudservice)
        {
            _pendingReferralService = pendingReferralService;
        }

        [HttpGet]
        [Route("update-table")]
        public IActionResult UpdatePendingReferralTable()
        {
            return Ok(_pendingReferralService.UpdatePendingReferralTable(jobRunById: this.GetUserId()));
        }

        public override IActionResult Search([FromQuery] Model.Core.CRUDSearchParams csp)
        {
            var cspFull = new Model.Core.CRUDSearchParams<PendingReferral>(csp)
            {
                AsNoTrackingGetList = true,
            };

            if (!CommonFunctions.IsBlankSearch(csp.Query))
            {
                var terms = CommonFunctions.SplitTerms(csp.Query.Trim().ToLower());
                foreach (var t in terms)
                {
                    cspFull.AddedWhereClause
                        .Add(pr => pr.StudentFirstName.ToLower().StartsWith(t)
                                || pr.StudentLastName.ToLower().StartsWith(t)
                                || pr.ProviderFirstName.ToLower().StartsWith(t)
                                || pr.ProviderLastName.ToLower().StartsWith(t));
                }
            }

            if (!string.IsNullOrEmpty(csp.extraparams))
            {
                var extras = System.Web.HttpUtility.ParseQueryString(WebUtility.UrlDecode(csp.extraparams));

                if (extras["districtId"] != null)
                {
                    int.TryParse(extras["districtId"], out int districtId);
                    if (districtId != 0)
                    {
                        cspFull.AddedWhereClause
                            .Add(pr => pr.DistrictId == districtId);
                    }
                }

                if (extras["providerId"] != null)
                {
                    int.TryParse(extras["providerId"], out int providerId);
                    if (providerId != 0)
                    {
                        cspFull.AddedWhereClause
                                .Add(pr => pr.ProviderId == providerId);
                    }
                }

                if (extras["lastJobRunId"] != null)
                {
                    int.TryParse(extras["lastJobRunId"], out int lastJobRunId);
                    if (lastJobRunId != 0)
                    {
                        cspFull.AddedWhereClause
                            .Add(pr => pr.PendingReferralJobRunId == lastJobRunId);
                    }
                }

                var providerTitleIdsParamsList = CommonFunctions.GetIntListFromExtraParams(csp.extraparams, "ProviderTitleIds");
                var providerTitleIds = providerTitleIdsParamsList["ProviderTitleIds"];
                if (providerTitleIds.Any())
                {
                    cspFull.AddedWhereClause
                        .Add(pr => providerTitleIds.Any(titleId => pr.Provider.TitleId == titleId));
                }

                var studentIdsParamsList = CommonFunctions.GetIntListFromExtraParams(csp.extraparams, "StudentIds");
                var studentIds = studentIdsParamsList["StudentIds"];
                if (studentIds.Any())
                {
                    cspFull.AddedWhereClause
                        .Add(pr => studentIds.Any(sId => pr.StudentId == sId));
                }
            }

            cspFull.SortList.Enqueue(new KeyValuePair<string, string>("ProviderLastName", "asc"));
            cspFull.SortList.Enqueue(new KeyValuePair<string, string>("StudentLastName", "asc"));

            int ct;
            return Ok(Crudservice.Search(cspFull, out ct)
                                .AsQueryable()
                                .ToSearchResults(ct)
                                .Respond(this));
        }

        [HttpGet]
        [Route("last-job-run")]
        public IActionResult GetLastJobRun()
        {
            return Ok(_pendingReferralService.GetLastJobRun());
        }

    }
}
