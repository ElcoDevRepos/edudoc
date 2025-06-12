using breckhtmltopdf;
using Microsoft.Extensions.Configuration;
using Model;
using Microsoft.AspNetCore.Mvc;
using System.Linq;
using Microsoft.Net.Http.Headers;
using Model.Custom;
using System.Data.Entity;
using System.Net;
using System;
using Service.Utilities;
using System.Collections.Generic;
using Model.DTOs;
using Model.Enums;
using System.Globalization;

namespace Service.HtmlToPdf
{
    public class FiscalRevenueService : BaseService, IFiscalRevenueService
    {

        private ITemplatePdfService _templatePdfService;
        private IConfiguration _configuration;
        private IPrimaryContext _context;

        public FiscalRevenueService(IPrimaryContext context, ITemplatePdfService templatePdfService, IConfiguration configuration) : base(context)
        {
            _templatePdfService = templatePdfService;
            _configuration = configuration;
            _context = context;
        }

        public FileStreamResult GeneratePdf(Model.Core.CRUDSearchParams csp)
        {
            var FiscalRevenueParams = new Templator.Models.FiscalRevenueParams(_configuration);

            var _tableData = GetTableData(csp);
            FiscalRevenueParams.data = _tableData;

            var pdf = _templatePdfService.CreatePdfFromTemplate("FiscalRevenue.cshtml", FiscalRevenueParams);
            return new FileStreamResult(new System.IO.MemoryStream(pdf), new MediaTypeHeaderValue("application/octet-stream"))
            {
                FileDownloadName = "FiscalRevenue"
            };
        }

        public FiscalRevenueData GetTableData(Model.Core.CRUDSearchParams csp)
        {
            DateTime fiscalStart = CommonFunctions.GetFiscalYearStart();
            DateTime fiscalEnd = CommonFunctions.GetFiscalYearEnd();
            IList<int> billableServiceCodes = CommonFunctions.GetBillableServiceCodes();
            IList<(string, int)> serviceCodeTupleList = CommonFunctions.GetBillableServiceCodesString();

            // Grab vouchers and claims similar to VoucherService
            var baseQuery = _context.Vouchers
               .Include(v => v.VoucherType)
               .Where(v => !v.Archived && v.PaidAmount != null)
               .Select(v => new ClaimVoucherDTO
               {
                   ClaimEncounterId = null,
                   VoucherId = v.Id,
                   VoucherAmount = v.VoucherAmount,
                   PaidAmount = v.PaidAmount,
                   VoucherDate = v.VoucherDate,
                   ServiceCodeId = 0,
                   ServiceCode = v.VoucherTypeId == 1 ? v.ServiceCode : v.VoucherType.Name,
                   SchoolYear = v.SchoolYear,
                   SchoolDistrict = v.SchoolDistrict.Name ?? v.UnmatchedClaimDistrict.DistrictOrganizationName,
                   SchoolDistrictId = v.SchoolDistrictId,
                   Unmatched = v.UnmatchedClaimDistrictId == null,
                   ServiceDate = null,
               });

            int districtId = 0;
            var districtName = "";
            int fiscalYear = DateTime.Now.Year;

            if (!string.IsNullOrEmpty(csp.extraparams))
            {
                var extras = System.Web.HttpUtility.ParseQueryString(WebUtility.UrlDecode(csp.extraparams));

                if (extras["districtId"] != null && extras["districtId"] != "0")
                {
                    districtId = int.Parse(extras["districtId"]);
                    districtName = _context.SchoolDistricts.FirstOrDefault(sd => sd.Id == districtId).Name;

                    baseQuery = baseQuery.Where(voucher => voucher.SchoolDistrictId == districtId);
                }

                if (extras["fiscalYear"] != null && extras["fiscalYear"] != "0")
                {
                    fiscalYear = int.Parse(extras["fiscalYear"]);
                }

            }

            var resultList = baseQuery.ToList();
            foreach(var entry  in resultList)
            {
                entry.ServiceCodeId = serviceCodeTupleList.FirstOrDefault(sc => sc.Item1 == entry.ServiceCode).Item2;
            }

            var data = new FiscalRevenueData() { };
            data.DistrictName = districtName;
            data.FiscalYear = fiscalYear.ToString();
            data.PreviousYear = (fiscalYear - 1).ToString();
            data.TwoYearsPrior = (fiscalYear - 2).ToString();
            data.CurrentYearReimbursement = string.Format("{0:C2}", resultList.Where(v => v.VoucherDate.Date >= fiscalStart && v.VoucherDate.Date <= fiscalEnd).AsEnumerable().Sum(ce => Decimal.Parse(ce.PaidAmount)));
            data.DirectServices = string.Format("{0:C2}", resultList.Where(v => v.ServiceCodeId != 0 && v.VoucherDate.Date >= fiscalStart && v.VoucherDate.Date <= fiscalEnd).AsEnumerable().Sum(ce => Decimal.Parse(ce.PaidAmount)));
            data.MSPSettlements = string.Format("{0:C2}", resultList.Where(v => v.ServiceCodeId == 0 && v.VoucherDate.Date >= fiscalStart && v.VoucherDate.Date <= fiscalEnd).AsEnumerable().Sum(ce => Decimal.Parse(ce.PaidAmount)));

            var fiscalDateRange = CommonFunctions.GetFiscalYearDateRange(fiscalYear);
            var priorFiscalDateRange = CommonFunctions.GetFiscalYearDateRange(fiscalYear - 1);
            var twoYearsPriorFiscalDateRange = CommonFunctions.GetFiscalYearDateRange(fiscalYear - 2);

            // FiscalRevenue ServiceCodeData
            data.FiscalRevenuePerServiceCodeData = new List<FiscalRevenueServiceCodeData>();
            foreach (var serviceCodeId in billableServiceCodes)
            {
                var selectedYearTotal = resultList
                        .Where(v => v.VoucherDate.Year == fiscalYear && v.ServiceCodeId == serviceCodeId)
                        .AsEnumerable().Sum(v => Decimal.Parse(v.PaidAmount));
                var priorYearTotal = resultList
                        .Where(v => v.ClaimEncounterId != null && v.VoucherDate.Year == fiscalYear &&
                            v.ServiceDate != null && (v.ServiceDate.Value.Year == fiscalYear - 1) && v.ServiceCodeId == serviceCodeId)
                        .AsEnumerable().Sum(v => Decimal.Parse(v.PaidAmount));
                data.FiscalRevenuePerServiceCodeData.Add(new FiscalRevenueServiceCodeData
                {
                    ServiceCodeId = serviceCodeId,
                    ServiceCodeName = _context.ServiceCodes.FirstOrDefault(sc => sc.Id == serviceCodeId).Name,
                    SelectedYearTotal = string.Format("{0:C2}", selectedYearTotal),
                    PriorYearTotal = string.Format("{0:C2}", priorYearTotal),
                    Total = string.Format("{0:C2}", selectedYearTotal + priorYearTotal),
                });
            }

            data.FiscalRevenuePerYearDataTotals = new FiscalRevenueServiceCodeData
            {
                ServiceCodeId = 0,
                Total = string.Format("{0:C2}", data.FiscalRevenuePerServiceCodeData.Sum(x => Decimal.Parse(x.Total, NumberStyles.Currency))), // can be running total from above loop
                SelectedYearTotal = string.Format("{0:C2}", data.FiscalRevenuePerServiceCodeData.Sum(x => Decimal.Parse(x.SelectedYearTotal, NumberStyles.Currency))),
                PriorYearTotal = string.Format("{0:C2}", data.FiscalRevenuePerServiceCodeData.Sum(x => Decimal.Parse(x.PriorYearTotal, NumberStyles.Currency))),
            };

            // FiscalRevenue HistoricalComparisonData
            data.HistoricalComparisonData = new List<FiscalRevenueHistoricalData>();
            var dateRange = CommonFunctions.GetFiscalYearDateRange(fiscalYear);
            foreach (var serviceCodeId in billableServiceCodes)
            {
                data.HistoricalComparisonData.Add(new FiscalRevenueHistoricalData
                {
                    ServiceCodeId = serviceCodeId,
                    ServiceCodeName = _context.ServiceCodes.FirstOrDefault(sc => sc.Id == serviceCodeId).Name,
                    CurrentYearTotal = string.Format("{0:C2}", resultList
                        .Where(v => v.VoucherDate.Date >= fiscalDateRange.Start && v.VoucherDate.Date <= fiscalDateRange.End && v.ServiceCodeId == serviceCodeId)
                        .AsEnumerable().Sum(v => Decimal.Parse(v.PaidAmount))),
                    PreviousYearTotal = string.Format("{0:C2}", resultList
                        .Where(v => v.VoucherDate.Date >= priorFiscalDateRange.Start && v.VoucherDate.Date <= priorFiscalDateRange.End && v.ServiceCodeId == serviceCodeId)
                        .AsEnumerable().Sum(v => Decimal.Parse(v.PaidAmount))),
                    TwoYearsPriorTotal = string.Format("{0:C2}", resultList
                        .Where(v => v.VoucherDate.Date >= twoYearsPriorFiscalDateRange.Start && v.VoucherDate.Date <= twoYearsPriorFiscalDateRange.End && v.ServiceCodeId == serviceCodeId)
                        .AsEnumerable().Sum(v => Decimal.Parse(v.PaidAmount))),
                });
            }
            data.HistoricalComparisonDataTotals = new FiscalRevenueHistoricalData
            {
                ServiceCodeId = 0,
                CurrentYearTotal = string.Format("{0:C2}", data.HistoricalComparisonData.Sum(x => Decimal.Parse(x.CurrentYearTotal, NumberStyles.Currency))),
                PreviousYearTotal = string.Format("{0:C2}", data.HistoricalComparisonData.Sum(x => Decimal.Parse(x.PreviousYearTotal, NumberStyles.Currency))),
                TwoYearsPriorTotal = string.Format("{0:C2}", data.HistoricalComparisonData.Sum(x => Decimal.Parse(x.TwoYearsPriorTotal, NumberStyles.Currency))),
            };

            // FiscalRevenue AnnualEntriesData
            int yearAmount = 4;
            data.AnnualEntriesData = new List<IFiscalRevenueAnnualEntriesData>();
            for (int year = fiscalYear - yearAmount; year <= fiscalYear; year++)
            {
                var annualEntry = _context.AnnualEntries.Include(ae => ae.AnnualEntryStatus)
                    .Where(ae => ae.SchoolDistrictId == districtId && ae.Year.Equals(year.ToString())).FirstOrDefault();
                if (annualEntry != null)
                {
                    data.AnnualEntriesData.Add(new IFiscalRevenueAnnualEntriesData
                    {
                        Year = year,
                        Status = annualEntry.AnnualEntryStatus.Name,
                        AllowableCosts = string.Format("{0:C2}", Decimal.Parse(annualEntry.AllowableCosts, NumberStyles.Currency)),
                        InterimPayments = string.Format("{0:C2}", Decimal.Parse(annualEntry.InterimPayments, NumberStyles.Currency)),
                        SettlementAmount = string.Format("{0:C2}", Decimal.Parse(annualEntry.SettlementAmount, NumberStyles.Currency)),
                    });
                }
                else
                {
                    data.AnnualEntriesData.Add(new IFiscalRevenueAnnualEntriesData
                    {
                        Year = year,
                        Status = Enum.GetName(typeof(AnnualEntryStatuses), AnnualEntryStatuses.Paid),
                        AllowableCosts = string.Format("{0:C2}", 0),
                        InterimPayments = string.Format("{0:C2}", 0),
                        SettlementAmount = string.Format("{0:C2}", 0),
                    });
                }
            }
            data.AnnualEntriesDataTotals = new IFiscalRevenueAnnualEntriesData
            {
                Year = 0,
                Status = "",
                AllowableCosts = string.Format("{0:C2}", data.AnnualEntriesData.Sum(ae => Decimal.Parse(ae.AllowableCosts, NumberStyles.Currency))),
                InterimPayments = string.Format("{0:C2}", data.AnnualEntriesData.Sum(ae => Decimal.Parse(ae.InterimPayments, NumberStyles.Currency))),
                SettlementAmount = string.Format("{0:C2}", data.AnnualEntriesData.Sum(ae => Decimal.Parse(ae.SettlementAmount, NumberStyles.Currency))),
            };

            return data;
        }

    }
}
