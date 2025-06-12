using API.Core.Claims;
using API.ControllerBase;
using Microsoft.AspNetCore.Mvc;
using Model;
using Model.Custom;
using Service.HtmlToPdf;
using Model.DTOs;
using System.Collections.Generic;
using System.Linq;

namespace API.HtmlToPdf
{
    [Route("api/v1/html-to-pdf")]
    [Restrict(ClaimTypes.Students, ClaimValues.ReadOnly | ClaimValues.FullAccess)]

    public class HtmlToPdfController : ApiControllerBase
    {
        private IBasicEncounterService _basicEncounterService;
        private IDetailedEncounterService _detailedEncounterService;
        private IProgressReportService _progressReportService;
        private ICompletedActivityService _completedActivityService;
        private IFiscalRevenueService _fiscalRevenueService;
        private IFiscalSummaryService _fiscalSummaryService;
        private IVoucherReportService _voucherReportService;
        private readonly IAupAuditService _aupAuditService;

        public HtmlToPdfController(
            IBasicEncounterService basicEncounterService,
            IDetailedEncounterService detailedEncounterService,
            IProgressReportService progressReportService,
            ICompletedActivityService completedActivityService,
            IFiscalRevenueService fiscalRevenueService,
            IFiscalSummaryService fiscalSummaryService,
            IVoucherReportService voucherReportService,
            IAupAuditService aupAuditService
            ) : base()
        {
            _basicEncounterService = basicEncounterService;
            _detailedEncounterService = detailedEncounterService;
            _progressReportService = progressReportService;
            _completedActivityService = completedActivityService;
            _fiscalRevenueService = fiscalRevenueService;
            _fiscalSummaryService = fiscalSummaryService;
            _voucherReportService = voucherReportService;
            _aupAuditService = aupAuditService;
        }

        [HttpGet]
        [Route("basic-encounter/{timeZoneOffsetMinutes:int}")]
        [Restrict(ClaimTypes.Students, ClaimValues.FullAccess)]
        public IActionResult BasicEncounterPdf([FromQuery] Model.Core.CRUDSearchParams csp, int timezoneOffsetMinutes)
        {
            return _basicEncounterService.GeneratePdf(csp, timezoneOffsetMinutes, this.GetUserId());
        }

        [HttpGet]
        [Route("basic-encounter/{timeZoneOffsetMinutes:int}/csv")]
        [Restrict(ClaimTypes.Students, ClaimValues.FullAccess)]
        public IActionResult BasicEncounterCsv([FromQuery] Model.Core.CRUDSearchParams csp, int timezoneOffsetMinutes)
        {
            return Ok(_basicEncounterService.GetTableData(csp, timezoneOffsetMinutes, this.GetUserId()));
        }

        [HttpGet]
        [Route("detailed-encounter/{timeZoneOffsetMinutes:int}")]
        [Restrict(ClaimTypes.Students, ClaimValues.FullAccess)]
        public IActionResult DetailedEncounterPdf([FromQuery] Model.Core.CRUDSearchParams csp, int timezoneOffsetMinutes)
        {
            return _detailedEncounterService.GeneratePdf(csp, timezoneOffsetMinutes, this.GetUserId());
        }

        [HttpGet]
        [Route("detailed-encounter/{timeZoneOffsetMinutes:int}/csv")]
        [Restrict(ClaimTypes.Students, ClaimValues.FullAccess)]
        public IActionResult DetailedEncounterCsv([FromQuery] Model.Core.CRUDSearchParams csp, int timezoneOffsetMinutes)
        {
            return Ok(_detailedEncounterService.GetTableData(csp, timezoneOffsetMinutes, this.GetUserId()));
        }

        [HttpGet]
        [Route("{progressReportId:int}/progress-report")]
        [Restrict(ClaimTypes.Students, ClaimValues.FullAccess)]
        public IActionResult ProgressReportPdf(int progressReportId)
        {
            return _progressReportService.GeneratePdf(progressReportId);
        }

        [HttpGet]
        [Route("completed-activity")]
        [Restrict(ClaimTypes.DistrictActivitySummaryByServiceArea, ClaimValues.FullAccess)]
        public IActionResult CompletedActivityPdf([FromQuery] Model.Core.CRUDSearchParams csp)
        {
            return (_completedActivityService.GeneratePdf(csp));
        }

        [HttpGet]
        [Route("fiscal-revenue")]
        [Restrict(ClaimTypes.DistrictActivitySummaryByServiceArea, ClaimValues.FullAccess)]
        public IActionResult FiscalRevenuePdf([FromQuery] Model.Core.CRUDSearchParams csp)
        {
            return (_fiscalRevenueService.GeneratePdf(csp));
        }

        [HttpGet]
        [Route("fiscal-revenue-data")]
        [Restrict(ClaimTypes.DistrictActivitySummaryByServiceArea, ClaimValues.FullAccess)]
        public FiscalRevenueData FiscalRevenueData([FromQuery] Model.Core.CRUDSearchParams csp)
        {
            return (_fiscalRevenueService.GetTableData(csp));
        }

        [HttpGet]
        [Route("fiscal-summary")]
        [Restrict(ClaimTypes.DistrictActivitySummaryByServiceArea, ClaimValues.FullAccess)]
        public IActionResult FiscalSummaryPdf([FromQuery] Model.Core.CRUDSearchParams csp)
        {
            return (_fiscalSummaryService.GeneratePdf(csp));
        }

        [HttpGet]
        [Route("fiscal-summary-data")]
        [Restrict(ClaimTypes.DistrictActivitySummaryByServiceArea, ClaimValues.FullAccess)]
        public FiscalSummaryData FiscalSummaryData([FromQuery] Model.Core.CRUDSearchParams csp)
        {
            return (_fiscalSummaryService.GetTableData(csp));
        }

        [HttpGet]
        [Route("voucher")]
        [Restrict(ClaimTypes.Vouchers, ClaimValues.FullAccess)]
        public IActionResult VoucherPdf([FromQuery] Model.Core.CRUDSearchParams csp)
        {
            return _voucherReportService.GeneratePdf(csp);
        }

        [HttpPost]
        [Route("aup-audit")]
        [Restrict(ClaimTypes.EncounterReportingByTherapist, ClaimValues.FullAccess)]
        public IActionResult AupAuditPdf([FromBody] List<EncounterResponseDto> data)
        {
            return _aupAuditService.GeneratePdf(data);
        }
    }
}
