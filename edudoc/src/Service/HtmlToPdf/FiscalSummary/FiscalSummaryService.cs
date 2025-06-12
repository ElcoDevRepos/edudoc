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
using Model.Enums;
using Service.Utilities;
using System.Collections.Generic;
using Service.HealthCareClaims;
using DocumentFormat.OpenXml.Drawing.Charts;

namespace Service.HtmlToPdf
{
    public class FiscalSummaryService : BaseService, IFiscalSummaryService
    {

        private ITemplatePdfService _templatePdfService;
        private IConfiguration _configuration;
        private IPrimaryContext _context;
        private IHealthCareClaimService _healthCareClaimService;

        public FiscalSummaryService(IPrimaryContext context, ITemplatePdfService templatePdfService, IConfiguration configuration,
            IHealthCareClaimService healthCareClaimService) : base(context)
        {
            _templatePdfService = templatePdfService;
            _configuration = configuration;
            _context = context;
            _healthCareClaimService = healthCareClaimService;
        }

        public FileStreamResult GeneratePdf(Model.Core.CRUDSearchParams csp)
        {
            var FiscalSummaryParams = new Templator.Models.FiscalSummaryParams(_configuration);

            var _tableData = GetTableData(csp);
            FiscalSummaryParams.data = _tableData;

            var pdf = _templatePdfService.CreatePdfFromTemplate("FiscalSummary.cshtml", FiscalSummaryParams);
            return new FileStreamResult(new System.IO.MemoryStream(pdf), new MediaTypeHeaderValue("application/octet-stream"))
            {
                FileDownloadName = "FiscalSummary"
            };
        }

        public FiscalSummaryData GetTableData(Model.Core.CRUDSearchParams csp)
        {
            var baseQuery = _context.BillingFailures.Where(bf => !bf.IssueResolved)
                .Include(bf => bf.EncounterStudent)
                .Include(bf => bf.EncounterStudent.Encounter)
                .Include(bf => bf.EncounterStudent.Encounter.Provider)
                .Include(bf => bf.EncounterStudent.Encounter.Provider.ProviderTitle)
                .Include(bf => bf.EncounterStudent.Student)
                .Include(bf => bf.EncounterStudent.Student.School)
                .Include(bf => bf.EncounterStudent.EncounterStudentCptCodes)
                .Include(bf => bf.EncounterStudent.EncounterStudentCptCodes.Select(e => e.CptCode))
                .Include(bf => bf.EncounterStudent.EncounterStudentCptCodes.Select(e => e.CptCode.ServiceUnitRule))
                .Include(bf => bf.EncounterStudent.EncounterStudentCptCodes.Select(e => e.CptCode.ServiceUnitRule.CptCode))
                .Include(bf => bf.EncounterStudent.EncounterStudentCptCodes.Select(e => e.CptCode.ServiceUnitRule.ServiceUnitTimeSegments))
                .AsNoTracking()
                .AsQueryable();
            int districtId = 0;
            var districtName = "";
            int fiscalYear = 0;
            int prevYear = 0;
            int twoYearsPrior = 0;

            if (!string.IsNullOrEmpty(csp.extraparams))
            {
                var extras = System.Web.HttpUtility.ParseQueryString(WebUtility.UrlDecode(csp.extraparams));

                if (extras["districtId"] != null && extras["districtId"] != "0")
                {
                    districtId = int.Parse(extras["districtId"]);
                    districtName = _context.SchoolDistricts.FirstOrDefault(sd => sd.Id == districtId).Name;

                    baseQuery = baseQuery.Where(bf =>
                        bf.EncounterStudent.Student.DistrictId == districtId ||
                        bf.EncounterStudent.Student.DistrictId == districtId);
                }
                if (extras["fiscalYear"] != null && extras["fiscalYear"] != "0")
                {
                    fiscalYear = int.Parse(extras["fiscalYear"]);
                    prevYear = fiscalYear - 1;
                    twoYearsPrior = fiscalYear - 2;

                    baseQuery = baseQuery.Where(bf => bf.EncounterStudent.EncounterDate.Year == fiscalYear);
                }
            }

            var data = new FiscalSummaryData() { };
            data.DistrictName = districtName;
            data.FiscalYear = fiscalYear.ToString();
            data.PrevYear = prevYear.ToString();
            data.TwoYearsPrior = twoYearsPrior.ToString();

            // FiscalSummary ReimbursementReason
            var billingFailureReasons = _context.BillingFailureReasons.AsEnumerable();
            data.ReimbursementReasonData = new List<FiscalSummaryReimbursementReasonData>();
            decimal dollarAmountTotal = 0;

            foreach (var billingFailureReason in billingFailureReasons)
            {
                var billingFailures = baseQuery.Where(bf => bf.BillingFailureReasonId == billingFailureReason.Id);
                var dollarAmount = GetDollarAmount(billingFailures);
                data.ReimbursementReasonData.Add(new FiscalSummaryReimbursementReasonData
                {
                    ReimbursementReason = billingFailureReason.Name,
                    Count = billingFailures.Count(),
                    DollarAmount = string.Format("{0:C2}", dollarAmount),
                    Audiology = billingFailures.Where(bf => bf.EncounterStudent.Encounter.Provider.ProviderTitle.ServiceCodeId == (int)ServiceCodes.Audiology).Count(),
                    OccupationalTherapy = billingFailures.Where(bf => bf.EncounterStudent.Encounter.Provider.ProviderTitle.ServiceCodeId == (int)ServiceCodes.Occupational_Therapy).Count(),
                    PhysicalTherapy = billingFailures.Where(bf => bf.EncounterStudent.Encounter.Provider.ProviderTitle.ServiceCodeId == (int)ServiceCodes.Physical_Therapy).Count(),
                    Speech = billingFailures.Where(bf => bf.EncounterStudent.Encounter.Provider.ProviderTitle.ServiceCodeId == (int)ServiceCodes.Speech_Therapy).Count(),
                    Psychology = billingFailures.Where(bf => bf.EncounterStudent.Encounter.Provider.ProviderTitle.ServiceCodeId == (int)ServiceCodes.Psychology).Count(),
                    Counseling = billingFailures.Where(bf => bf.EncounterStudent.Encounter.Provider.ProviderTitle.ServiceCodeId == (int)ServiceCodes.Counseling_Social_Work).Count(),
                    Nursing = billingFailures.Where(bf => bf.EncounterStudent.Encounter.Provider.ProviderTitle.ServiceCodeId == (int)ServiceCodes.Nursing).Count(),
                });
                dollarAmountTotal = Decimal.Add(dollarAmountTotal, dollarAmount);
            }

            data.ReimbursementReasonDataTotals = new FiscalSummaryReimbursementReasonData
            {
                ReimbursementReason = "",
                Count = baseQuery.Count(),
                DollarAmount = string.Format("{0:C2}", dollarAmountTotal),
                Audiology = data.ReimbursementReasonData.Sum(r => r.Audiology),
                OccupationalTherapy = data.ReimbursementReasonData.Sum(r => r.OccupationalTherapy),
                PhysicalTherapy = data.ReimbursementReasonData.Sum(r => r.PhysicalTherapy),
                Speech = data.ReimbursementReasonData.Sum(r => r.Speech),
                Psychology = data.ReimbursementReasonData.Sum(r => r.Psychology),
                Counseling = data.ReimbursementReasonData.Sum(r => r.Counseling),
                Nursing = data.ReimbursementReasonData.Sum(r => r.Nursing),
            };
            decimal multiplier = 0.4M;
            data.LessAverageApplicableFFP = string.Format("{0:C2}", Decimal.Multiply(dollarAmountTotal, multiplier));

            // FiscalSummary ServiceCodeData
            var serviceCodes = CommonFunctions.GetBillableServiceCodes();
            var currentYear = fiscalYear;
            data.ServiceCodeData = new List<FiscalSummaryServiceCodeData>();
            var currentYearTotal = 0;
            var previousYearTotal = 0;
            var twoYearsPriorTotal = 0;
            foreach (var serviceCode in serviceCodes)
            {
                var encounterStudents = _context.EncounterStudents
                    .Include(es => es.Encounter)
                    .Include(es => es.Encounter.Provider)
                    .Include(es => es.Encounter.Provider.ProviderTitle)
                    .Where(es => !es.Archived && es.EncounterDate.Year >= (currentYear - 2) &&
                        es.Encounter.Provider.ProviderTitle.ServiceCodeId == serviceCode &&
                        (es.Student.DistrictId == districtId ||
                        es.Student.School.SchoolDistrictsSchools.FirstOrDefault().SchoolDistrictId == districtId));
                var currentYearCount = encounterStudents.Where(es => es.EncounterDate.Year == currentYear).Count();
                var previousYearCount = encounterStudents.Where(es => es.EncounterDate.Year == (currentYear - 1)).Count();
                var twoYearsPriorCount = encounterStudents.Where(es => es.EncounterDate.Year == (currentYear - 2)).Count();
                var serviceCodeName = _context.ServiceCodes.FirstOrDefault(sc => sc.Id == serviceCode).Name;
                data.ServiceCodeData.Add(new FiscalSummaryServiceCodeData
                {
                    ServiceCodeId = serviceCode,
                    ServiceCodeName = serviceCodeName,
                    CurrentYearTotal = currentYearCount,
                    PreviousYearTotal = previousYearCount,
                    TwoYearsPriorTotal = twoYearsPriorCount,
                });
                currentYearTotal += currentYearCount;
                previousYearTotal += previousYearCount;
                twoYearsPriorTotal += twoYearsPriorCount;
            }
            data.HistoricalComparisonCurrentYearTotal = currentYearTotal;
            data.HistoricalComparisonPreviousYearTotal = previousYearTotal;
            data.HistoricalComparisonTwoYearsPriorTotal = twoYearsPriorTotal;

            return data;
        }

        private decimal GetDollarAmount(IQueryable<BillingFailure> billingFailures)
        {
            var list = billingFailures.ToList();
            var cptCodes = billingFailures
                .SelectMany(bf => bf.EncounterStudent.EncounterStudentCptCodes)
                .Include(cpt => cpt.CptCode)
                .AsEnumerable();
            decimal dollarAmounts = 0;

            foreach (var cptCode in cptCodes)
            {
                if (cptCode.CptCode.ServiceUnitRule != null && cptCode.CptCode.ServiceUnitRule.ServiceUnitTimeSegments.Any())
                {
                    var serviceUnitRule = cptCode.CptCode.ServiceUnitRule;
                    var isReplacement = serviceUnitRule.HasReplacement && serviceUnitRule.CptCodeId.HasValue && !serviceUnitRule.Archived;
                    var encounterSegments = serviceUnitRule.ServiceUnitTimeSegments?
                                                .Where(timeSegment => cptCode.Minutes >= timeSegment.StartMinutes && !timeSegment.IsCrossover)
                                                .OrderByDescending(segment => segment.EndMinutes)
                                                .OrderBy(segment => segment.EndMinutes != null);

                    var crossoverSegments = serviceUnitRule.ServiceUnitTimeSegments?
                                                .Where(timeSegment => cptCode.Minutes >= timeSegment.StartMinutes && timeSegment.IsCrossover)
                                                .OrderByDescending(segment => segment.EndMinutes)
                                                .OrderBy(segment => segment.EndMinutes != null);

                    if (crossoverSegments.Any())
                    {
                        // Crossover CPT code is not replacement, include CPT Code in billing
                        if (!isReplacement)
                        {
                            var crossoverCPTCode = serviceUnitRule.CptCode;
                            dollarAmounts += Decimal.Multiply(crossoverCPTCode.BillAmount, CommonFunctions.GetBillingUnits(encounterSegments, cptCode.Minutes));
                        }
                        dollarAmounts += Decimal.Multiply(cptCode.CptCode.BillAmount, CommonFunctions.GetBillingUnits(crossoverSegments, cptCode.Minutes));
                    }
                    else if (encounterSegments.Any())
                    {
                        dollarAmounts += Decimal.Multiply(cptCode.CptCode.BillAmount, CommonFunctions.GetBillingUnits(encounterSegments, cptCode.Minutes));
                    }
                }
                else
                {
                    dollarAmounts += cptCode.CptCode.BillAmount;
                }
            }
            return dollarAmounts;
        }
    }
}
