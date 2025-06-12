using API.Core.Claims;
using API.Common;
using API.ControllerBase;
using Microsoft.AspNetCore.Mvc;
using Model;
using Model.DTOs;
using Service.Base;
using Service.ReferralReports;
using System;
using System.Collections.Generic;
using System.Linq;

namespace API.ReferralReports
{
    [Route("api/v1/referral-report")]
    [Restrict(ClaimTypes.Encounters, ClaimValues.FullAccess | ClaimValues.ReadOnly)]
    public class ReferralReportsController : ApiControllerBase
    {
        private readonly IReferralReportsService _referralReportsService;
        public ReferralReportsController(IReferralReportsService referralReportsService)
        {
            _referralReportsService = referralReportsService;
        }

        [HttpGet]
        [Route("pending")]
        public IEnumerable<PendingReferralReportDto> GetPendingReferralReport([FromQuery] Model.Core.CRUDSearchParams csp)
        {
            var search = _referralReportsService.GetPendingReferralReport(csp);
            return search.result.ToSearchResults(search.count).Respond(this);
        }
        [HttpGet]
        [Route("completed")]
        public (IEnumerable<CompletedReferralReportDto> reports, List<int> reportIds) GetCompletedReferralReport([FromQuery] Model.Core.CRUDSearchParams csp)
        {
            var search = _referralReportsService.GetCompletedReferralReport(csp);
            return (search.result.AsQueryable().ToSearchResults(search.count).Respond(this).ToList(), search.reportIds);
        }
    }
}
