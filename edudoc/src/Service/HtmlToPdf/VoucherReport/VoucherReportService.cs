using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using breckhtmltopdf;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Net.Http.Headers;
using Model;
using Model.Custom;
using Model.DTOs;
using Service.Utilities;
using Service.Vouchers;
using Templator.Models;

namespace Service.HtmlToPdf
{
    public class VoucherReportService : BaseService, IVoucherReportService
    {
        private ITemplatePdfService _templatePdfService;
        private IConfiguration _configuration;
        private IVoucherService _voucherService;
        private IPrimaryContext _context;

        public VoucherReportService(
            IPrimaryContext context,
            ITemplatePdfService templatePdfService,
            IConfiguration configuration,
            IVoucherService voucherService
        )
            : base(context)
        {
            _templatePdfService = templatePdfService;
            _configuration = configuration;
            _voucherService = voucherService;
            _context = context;
        }

        public FileStreamResult GeneratePdf(Model.Core.CRUDSearchParams csp)
        {
            VoucherReportParams VoucherReportParams = new VoucherReportParams(_configuration);

            if (!string.IsNullOrEmpty(csp.extraparams))
            {
                var extras = System.Web.HttpUtility.ParseQueryString(
                    WebUtility.UrlDecode(csp.extraparams)
                );
                if (extras["SchoolDistrictIds"] != null && extras["SchoolDistrictIds"] != "0")
                {
                    var schoolDistrictIdsParamList = CommonFunctions.GetIntListFromExtraParams(
                        csp.extraparams,
                        "SchoolDistrictIds"
                    );
                    var schoolDistrictId = schoolDistrictIdsParamList["SchoolDistrictIds"]
                        .FirstOrDefault();
                    ThrowIfNull(schoolDistrictId);

                    VoucherReportParams.DistrictName = _context
                        .SchoolDistricts.FirstOrDefault(sd => sd.Id == schoolDistrictId)
                        .Name;
                }
            }

            int FiscalYearStartMonth = 7;
            DateTime currentDate = DateTime.Now;
            int fiscalYear =
                (currentDate.Month >= FiscalYearStartMonth)
                    ? currentDate.Year + 1
                    : currentDate.Year;

            VoucherReportParams.SchoolYear = $"{fiscalYear}";

            IEnumerable<ClaimVoucherDTO> vouchers = _voucherService
                .SearchForVouchers(csp)
                .vouchers.ToList();

            VoucherReportParams.Total = vouchers
                .GroupBy(v => (v.VoucherDate, v.VoucherAmount))
                .Sum(v => decimal.Parse(v.FirstOrDefault().VoucherAmount))
                .ToString("C", System.Globalization.CultureInfo.GetCultureInfo("en-us"));

            VoucherReportParams.Data = vouchers
                .Where(v => v.ServiceCode != null)
                .GroupBy(
                    v => new { v.VoucherDate, v.VoucherAmount },
                    (date, vouchers) =>
                        new VoucherReportData
                        {
                            VoucherDate = date.VoucherDate,
                            VoucherAmount = decimal.Parse(vouchers.FirstOrDefault().VoucherAmount)
                                .ToString(
                                    "C",
                                    System.Globalization.CultureInfo.GetCultureInfo("en-us")
                                ),
                            ServiceCodeData = vouchers
                                .GroupBy(
                                    v => new { v.ServiceCode, v.SchoolYear },
                                    (serviceCodes, vouchers) =>
                                        new VoucherServiceCodeData
                                        {
                                            ServiceCodeName = serviceCodes.ServiceCode,
                                            PaidAmount = vouchers
                                                .Sum(v => decimal.Parse(v.PaidAmount))
                                                .ToString(
                                                    "C",
                                                    System.Globalization.CultureInfo.GetCultureInfo(
                                                        "en-us"
                                                    )
                                                ),
                                            SchoolYear = serviceCodes.SchoolYear,
                                        }
                                )
                                .OrderBy(v => v.ServiceCodeName)
                                .ToList(),
                        }
                )
                .OrderByDescending(v => v.VoucherDate)
                .ToList();

            var pdf = _templatePdfService.CreatePdfFromTemplate(
                "VoucherReport.cshtml",
                VoucherReportParams
            );
            return new FileStreamResult(
                new System.IO.MemoryStream(pdf),
                new MediaTypeHeaderValue("application/octet-stream")
            )
            {
                FileDownloadName = "VoucherReport",
            };
        }
    }
}
