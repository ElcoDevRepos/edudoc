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

namespace Service.HtmlToPdf
{
    public class CompletedActivityService : BaseService, ICompletedActivityService
    {

        private ITemplatePdfService _templatePdfService;
        private IConfiguration _configuration;
        private IPrimaryContext _context;

        public CompletedActivityService(IPrimaryContext context, ITemplatePdfService templatePdfService, IConfiguration configuration) : base(context)
        {
            _templatePdfService = templatePdfService;
            _configuration = configuration;
            _context = context;
        }

        public FileStreamResult GeneratePdf(Model.Core.CRUDSearchParams csp)
        {
            var completedActivityParams = new Templator.Models.CompletedActivityParams(_configuration);

            var _tableData = GetTableData(csp);
            completedActivityParams.data = _tableData;

            var pdf = _templatePdfService.CreatePdfFromTemplate("CompletedActivity.cshtml", completedActivityParams);
            return new FileStreamResult(new System.IO.MemoryStream(pdf), new MediaTypeHeaderValue("application/octet-stream"))
            {
                FileDownloadName = "CompletedActivity"
            };
        }

        private CompletedActivityData GetTableData(Model.Core.CRUDSearchParams csp)
        {
            DateTime fiscalYearStart = CommonFunctions.GetFiscalYearStart();
            DateTime fiscalYearEnd = CommonFunctions.GetFiscalYearEnd();

            var providersQuery = _context.Providers.Where(provider => !provider.Archived);
            int districtId = 0;
            var districtName = "";

            if (!string.IsNullOrEmpty(csp.extraparams))
            {
                var extras = System.Web.HttpUtility.ParseQueryString(WebUtility.UrlDecode(csp.extraparams));

                if(extras["fiscalYear"] != null) {
                    var fiscalYear = Int32.Parse(extras["fiscalYear"]);
                    (fiscalYearStart, fiscalYearEnd) = CommonFunctions.GetFiscalYearDateRange(fiscalYear);
                }
            }


            // The fiscal year is typically 9 months, from september to march. We want to get data for the other months as well, april through august, so we expand the view.
            var extraMonths = ((fiscalYearStart.Month - fiscalYearEnd.Month) % 12) - 1;
            var extraMonthsBack = (int)Math.Floor(extraMonths / 2f);
            var extraMonthsForward = (int)Math.Ceiling(extraMonths / 2f);

            fiscalYearStart = fiscalYearStart.AddMonths(-extraMonthsBack);
            fiscalYearEnd = fiscalYearEnd.AddMonths(extraMonthsForward);

            if(!string.IsNullOrEmpty(csp.extraparams)) {
                var extras = System.Web.HttpUtility.ParseQueryString(WebUtility.UrlDecode(csp.extraparams));
                if(extras["providerId"] != null) {
                    var providerId = Int32.Parse(extras["providerId"]);
                    providersQuery = providersQuery.Where(p => p.Id == providerId);
                }

                if (extras["districtId"] != null && extras["districtId"] != "0")
                {
                    districtId = int.Parse(extras["districtId"]);
                    districtName = _context.SchoolDistricts.AsNoTracking().FirstOrDefault(sd => sd.Id == districtId).Name;

                    providersQuery = providersQuery.Where(provider => provider.ProviderEscAssignments.Any(pea =>
                        !pea.Archived && pea.ProviderEscSchoolDistricts.Any(pesd => pesd.SchoolDistrictId == districtId) &&
                        (pea.EndDate == null || pea.EndDate >= fiscalYearEnd))
                    );
                }
                if (extras["serviceCodeIds"] != null)
                {
                    var serviceCodeIdsParamsList = CommonFunctions.GetIntListFromExtraParams(csp.extraparams, "serviceCodeIds");
                    var serviceCodeIds = serviceCodeIdsParamsList["serviceCodeIds"];

                    if (serviceCodeIds.Count > 0)
                       providersQuery = providersQuery.Where(provider => serviceCodeIds.Contains(provider.ProviderTitle.ServiceCodeId));
                }
            }

            var data = new CompletedActivityData() { };
            data.DistrictName = districtName;
            var timeZone = CommonFunctions.GetTimeZone();
            data.Date = TimeZoneInfo.ConvertTime(DateTime.UtcNow, timeZone);

            var finalQuery = providersQuery
                .Include(p => p.ProviderUser)
                .Include(p => p.ProviderTitle)
                .Include(p => p.ProviderTitle.ServiceCode)
                .Include(p => p.ProviderEscAssignments)
                .Include(p => p.ProviderEscAssignments.Select(pes => pes.ProviderEscSchoolDistricts))
                .Include(p => p.ProviderEscAssignments.Select(pes => pes.Agency))
                .Include(p => p.ProviderInactivityDates)
                .Include(p => p.ProviderInactivityDates.Select(pid => pid.ProviderDoNotBillReason))
                .Select(p => new
                {
                    DocumentationDate = p.DocumentationDate,
                    ProviderEmploymentTypeId = p.ProviderEmploymentTypeId,
                    ProviderInactivityDates = p.ProviderInactivityDates.Where(pid => !pid.Archived).Select(pid => new
                    {
                        ProviderInactivityStartDate = pid.ProviderInactivityStartDate,
                        ProviderInactivityEndDate = pid.ProviderInactivityEndDate,
                        ProviderInactivityReason = pid.ProviderDoNotBillReason,
                    }),
                    ProviderTitle = p.ProviderTitle,
                    ProviderUser = p.ProviderUser,
                    AgencyName = p.ProviderEscAssignments.Where(pesc => pesc.AgencyId > 0 && pesc.ProviderEscSchoolDistricts.Any(pesd => pesd.SchoolDistrictId == districtId)).Any() ? p.ProviderEscAssignments.FirstOrDefault(pesc => pesc.AgencyId > 0 && pesc.ProviderEscSchoolDistricts.Any(pesd => pesd.SchoolDistrictId == districtId)).Agency.Name : "",
                    ServiceCode = p.ProviderTitle.ServiceCode,
                    Encounters = p.Encounters.Where(e => !e.Archived && e.EncounterStudents.Any(es => es.Student.DistrictId == districtId
                        && es.EncounterDate > fiscalYearStart && es.EncounterDate < fiscalYearEnd && es.ESignedById.HasValue && !es.Archived))
                        .Select(e => new
                        {
                            ServiceTypeId = e.ServiceTypeId,
                            EncounterStudents = e.EncounterStudents.Where(es => es.Student.DistrictId == districtId && es.EncounterDate > fiscalYearStart && es.EncounterDate <= fiscalYearEnd && es.ESignedById.HasValue && !es.Archived),
                        }),

                }).ToList();

            data.DistrictData = finalQuery
                .Where(p => p.ProviderEmploymentTypeId == (int)ProviderEmploymentTypes.DistrictEmployed)
                .GroupBy(p => new
                {
                    ServiceArea = p.ServiceCode.Name,
                    ServiceAreaId = p.ServiceCode.Id
                },
                (k, g) => new CompletedActivityDistrictServiceAreaData
                {
                    ServiceAreaName = k.ServiceArea,
                    ShouldShowPendingCosign = k.ServiceAreaId == (int)ServiceCodes.Physical_Therapy || k.ServiceAreaId == (int)ServiceCodes.Occupational_Therapy,
                    JulyTotal = g.SelectMany(x => x.Encounters.SelectMany(e => e.EncounterStudents.Where(es => es.EncounterDate.Month == 7))).Count(),
                    AugustTotal = g.SelectMany(x => x.Encounters.SelectMany(e => e.EncounterStudents.Where(es => es.EncounterDate.Month == 8))).Count(),
                    SeptemberTotal = g.SelectMany(x => x.Encounters.SelectMany(e => e.EncounterStudents.Where(es => es.EncounterDate.Month == 9))).Count(),
                    OctoberTotal = g.SelectMany(x => x.Encounters.SelectMany(e => e.EncounterStudents.Where(es => es.EncounterDate.Month == 10))).Count(),
                    NovemberTotal = g.SelectMany(x => x.Encounters.SelectMany(e => e.EncounterStudents.Where(es => es.EncounterDate.Month == 11))).Count(),
                    DecemberTotal = g.SelectMany(x => x.Encounters.SelectMany(e => e.EncounterStudents.Where(es => es.EncounterDate.Month == 12))).Count(),
                    JanuaryTotal = g.SelectMany(x => x.Encounters.SelectMany(e => e.EncounterStudents.Where(es => es.EncounterDate.Month == 1))).Count(),
                    FebruaryTotal = g.SelectMany(x => x.Encounters.SelectMany(e => e.EncounterStudents.Where(es => es.EncounterDate.Month == 2))).Count(),
                    MarchTotal = g.SelectMany(x => x.Encounters.SelectMany(e => e.EncounterStudents.Where(es => es.EncounterDate.Month == 3))).Count(),
                    AprilTotal = g.SelectMany(x => x.Encounters.SelectMany(e => e.EncounterStudents.Where(es => es.EncounterDate.Month == 4))).Count(),
                    MayTotal = g.SelectMany(x => x.Encounters.SelectMany(e => e.EncounterStudents.Where(es => es.EncounterDate.Month == 5))).Count(),
                    JuneTotal = g.SelectMany(x => x.Encounters.SelectMany(e => e.EncounterStudents.Where(es => es.EncounterDate.Month == 6))).Count(),
                    CompleteTotal = g.SelectMany(x => x.Encounters.SelectMany(e => e.EncounterStudents)).Count(),
                    TitleData = g.GroupBy(p => new
                    {
                        providerTitle = p.ProviderTitle.Name,
                    },
                    (k, g) => new ServiceAreaDistrictTitleData
                    {
                        ProviderTitleName = k.providerTitle,
                        LineData = g.Select(p => new DistrictLineData
                        {
                            ProviderName = p.ProviderUser.LastName + ", " + p.ProviderUser.FirstName,
                            //JulyTotal = g.SelectMany(x => x.Encounters.SelectMany(e => e.EncounterStudents.Where(es => es.EncounterDate.Month == 7))).Count(),
                            July = new MonthData
                            {
                                TreatmentTherapyCount = p.Encounters.Where(e => e.ServiceTypeId == (int)ServiceTypes.Treatment_Therapy).SelectMany(e => e.EncounterStudents).Where(es => es.EncounterDate.Month == 7).Count(),
                                EvalCount = p.Encounters.Where(e => e.ServiceTypeId == (int)ServiceTypes.Evaluation_Assessment).SelectMany(e => e.EncounterStudents).Where(es => es.EncounterDate.Month == 7).Count(),
                                PendingCoSignCount = p.Encounters.SelectMany(e => e.EncounterStudents).Where(es => es.EncounterStatusId == (int)EncounterStatuses.READY_FOR_SUPERVISOR_ESIGN).Where(es => es.EncounterDate.Month == 7).Count(),
                                TotalCount = p.Encounters.SelectMany(e => e.EncounterStudents).Where(es => es.EncounterDate.Month == 7).Count(),
                                AbsenceReason = p.DocumentationDate.GetValueOrDefault() > fiscalYearStart.AddMonths(1) ? "N/A" :
                                    String.Join(", ", p.ProviderInactivityDates.Where(pid => pid.ProviderInactivityEndDate > fiscalYearStart && pid.ProviderInactivityStartDate < fiscalYearStart.AddMonths(1)).Select(pid => pid.ProviderInactivityReason.Name)),
                            },
                            August = new MonthData
                            {
                                TreatmentTherapyCount = p.Encounters.Where(e => e.ServiceTypeId == (int)ServiceTypes.Treatment_Therapy).SelectMany(e => e.EncounterStudents).Where(es => es.EncounterDate.Month == 8).Count(),
                                EvalCount = p.Encounters.Where(e => e.ServiceTypeId == (int)ServiceTypes.Evaluation_Assessment).SelectMany(e => e.EncounterStudents).Where(es => es.EncounterDate.Month == 8).Count(),
                                PendingCoSignCount = p.Encounters.SelectMany(e => e.EncounterStudents).Where(es => es.EncounterStatusId == (int)EncounterStatuses.READY_FOR_SUPERVISOR_ESIGN).Where(es => es.EncounterDate.Month == 8).Count(),
                                TotalCount = p.Encounters.SelectMany(e => e.EncounterStudents).Where(es => es.EncounterDate.Month == 8).Count(),
                                AbsenceReason = p.DocumentationDate.GetValueOrDefault() > fiscalYearStart.AddMonths(2) ? "N/A" :
                                    String.Join(", ", p.ProviderInactivityDates.Where(pid => pid.ProviderInactivityEndDate > fiscalYearStart.AddMonths(1) && pid.ProviderInactivityStartDate < fiscalYearStart.AddMonths(2)).Select(pid => pid.ProviderInactivityReason.Name)),
                            },
                            September = new MonthData
                            {
                                TreatmentTherapyCount = p.Encounters.Where(e => e.ServiceTypeId == (int)ServiceTypes.Treatment_Therapy).SelectMany(e => e.EncounterStudents).Where(es => es.EncounterDate.Month == 9).Count(),
                                EvalCount = p.Encounters.Where(e => e.ServiceTypeId == (int)ServiceTypes.Evaluation_Assessment).SelectMany(e => e.EncounterStudents).Where(es => es.EncounterDate.Month == 9).Count(),
                                PendingCoSignCount = p.Encounters.SelectMany(e => e.EncounterStudents).Where(es => es.EncounterStatusId == (int)EncounterStatuses.READY_FOR_SUPERVISOR_ESIGN).Where(es => es.EncounterDate.Month == 9).Count(),
                                TotalCount = p.Encounters.SelectMany(e => e.EncounterStudents).Where(es => es.EncounterDate.Month == 9).Count(),
                                AbsenceReason = p.DocumentationDate.GetValueOrDefault() > fiscalYearStart.AddMonths(3) ? "N/A" :
                                    String.Join(", ", p.ProviderInactivityDates.Where(pid => pid.ProviderInactivityEndDate > fiscalYearStart.AddMonths(2) && pid.ProviderInactivityStartDate < fiscalYearStart.AddMonths(3)).Select(pid => pid.ProviderInactivityReason.Name)),
                            },
                            October = new MonthData
                            {
                                TreatmentTherapyCount = p.Encounters.Where(e => e.ServiceTypeId == (int)ServiceTypes.Treatment_Therapy).SelectMany(e => e.EncounterStudents).Where(es => es.EncounterDate.Month == 10).Count(),
                                EvalCount = p.Encounters.Where(e => e.ServiceTypeId == (int)ServiceTypes.Evaluation_Assessment).SelectMany(e => e.EncounterStudents).Where(es => es.EncounterDate.Month == 10).Count(),
                                PendingCoSignCount = p.Encounters.SelectMany(e => e.EncounterStudents).Where(es => es.EncounterStatusId == (int)EncounterStatuses.READY_FOR_SUPERVISOR_ESIGN).Where(es => es.EncounterDate.Month == 10).Count(),
                                TotalCount = p.Encounters.SelectMany(e => e.EncounterStudents).Where(es => es.EncounterDate.Month == 10).Count(),
                                AbsenceReason = p.DocumentationDate.GetValueOrDefault() > fiscalYearStart.AddMonths(4) ? "N/A" :
                                    String.Join(", ", p.ProviderInactivityDates.Where(pid => pid.ProviderInactivityEndDate > fiscalYearStart.AddMonths(3) && pid.ProviderInactivityStartDate < fiscalYearStart.AddMonths(4)).Select(pid => pid.ProviderInactivityReason.Name)),
                            },
                            November = new MonthData
                            {
                                TreatmentTherapyCount = p.Encounters.Where(e => e.ServiceTypeId == (int)ServiceTypes.Treatment_Therapy).SelectMany(e => e.EncounterStudents).Where(es => es.EncounterDate.Month == 11).Count(),
                                EvalCount = p.Encounters.Where(e => e.ServiceTypeId == (int)ServiceTypes.Evaluation_Assessment).SelectMany(e => e.EncounterStudents).Where(es => es.EncounterDate.Month == 11).Count(),
                                PendingCoSignCount = p.Encounters.SelectMany(e => e.EncounterStudents).Where(es => es.EncounterStatusId == (int)EncounterStatuses.READY_FOR_SUPERVISOR_ESIGN).Where(es => es.EncounterDate.Month == 11).Count(),
                                TotalCount = p.Encounters.SelectMany(e => e.EncounterStudents).Where(es => es.EncounterDate.Month == 11).Count(),
                                AbsenceReason = p.DocumentationDate.GetValueOrDefault() > fiscalYearStart.AddMonths(5) ? "N/A" :
                                    String.Join(", ", p.ProviderInactivityDates.Where(pid => pid.ProviderInactivityEndDate > fiscalYearStart.AddMonths(4) && pid.ProviderInactivityStartDate < fiscalYearStart.AddMonths(5)).Select(pid => pid.ProviderInactivityReason.Name)),
                            },
                            December = new MonthData
                            {
                                TreatmentTherapyCount = p.Encounters.Where(e => e.ServiceTypeId == (int)ServiceTypes.Treatment_Therapy).SelectMany(e => e.EncounterStudents).Where(es => es.EncounterDate.Month == 12).Count(),
                                EvalCount = p.Encounters.Where(e => e.ServiceTypeId == (int)ServiceTypes.Evaluation_Assessment).SelectMany(e => e.EncounterStudents).Where(es => es.EncounterDate.Month == 12).Count(),
                                PendingCoSignCount = p.Encounters.SelectMany(e => e.EncounterStudents).Where(es => es.EncounterStatusId == (int)EncounterStatuses.READY_FOR_SUPERVISOR_ESIGN).Where(es => es.EncounterDate.Month == 12).Count(),
                                TotalCount = p.Encounters.SelectMany(e => e.EncounterStudents).Where(es => es.EncounterDate.Month == 12).Count(),
                                AbsenceReason = p.DocumentationDate.GetValueOrDefault() > fiscalYearStart.AddMonths(6) ? "N/A" :
                                    String.Join(", ", p.ProviderInactivityDates.Where(pid => pid.ProviderInactivityEndDate > fiscalYearStart.AddMonths(5) && pid.ProviderInactivityStartDate < fiscalYearStart.AddMonths(6)).Select(pid => pid.ProviderInactivityReason.Name)),
                            },
                            January = new MonthData
                            {
                                TreatmentTherapyCount = p.Encounters.Where(e => e.ServiceTypeId == (int)ServiceTypes.Treatment_Therapy).SelectMany(e => e.EncounterStudents).Where(es => es.EncounterDate.Month == 1).Count(),
                                EvalCount = p.Encounters.Where(e => e.ServiceTypeId == (int)ServiceTypes.Evaluation_Assessment).SelectMany(e => e.EncounterStudents).Where(es => es.EncounterDate.Month == 1).Count(),
                                PendingCoSignCount = p.Encounters.SelectMany(e => e.EncounterStudents).Where(es => es.EncounterStatusId == (int)EncounterStatuses.READY_FOR_SUPERVISOR_ESIGN).Where(es => es.EncounterDate.Month == 1).Count(),
                                TotalCount = p.Encounters.SelectMany(e => e.EncounterStudents).Where(es => es.EncounterDate.Month == 1).Count(),
                                AbsenceReason = p.DocumentationDate.GetValueOrDefault() > fiscalYearStart.AddMonths(7) ? "N/A" :
                                    String.Join(", ", p.ProviderInactivityDates.Where(pid => pid.ProviderInactivityEndDate > fiscalYearStart.AddMonths(6) && pid.ProviderInactivityStartDate < fiscalYearStart.AddMonths(7)).Select(pid => pid.ProviderInactivityReason.Name)),
                            },
                            February = new MonthData
                            {
                                TreatmentTherapyCount = p.Encounters.Where(e => e.ServiceTypeId == (int)ServiceTypes.Treatment_Therapy).SelectMany(e => e.EncounterStudents).Where(es => es.EncounterDate.Month == 2).Count(),
                                EvalCount = p.Encounters.Where(e => e.ServiceTypeId == (int)ServiceTypes.Evaluation_Assessment).SelectMany(e => e.EncounterStudents).Where(es => es.EncounterDate.Month == 2).Count(),
                                PendingCoSignCount = p.Encounters.SelectMany(e => e.EncounterStudents).Where(es => es.EncounterStatusId == (int)EncounterStatuses.READY_FOR_SUPERVISOR_ESIGN).Where(es => es.EncounterDate.Month == 2).Count(),
                                TotalCount = p.Encounters.SelectMany(e => e.EncounterStudents).Where(es => es.EncounterDate.Month == 2).Count(),
                                AbsenceReason = p.DocumentationDate.GetValueOrDefault() > fiscalYearStart.AddMonths(8) ? "N/A" :
                                    String.Join(", ", p.ProviderInactivityDates.Where(pid => pid.ProviderInactivityEndDate > fiscalYearStart.AddMonths(7) && pid.ProviderInactivityStartDate < fiscalYearStart.AddMonths(8)).Select(pid => pid.ProviderInactivityReason.Name)),
                            },
                            March = new MonthData
                            {
                                TreatmentTherapyCount = p.Encounters.Where(e => e.ServiceTypeId == (int)ServiceTypes.Treatment_Therapy).SelectMany(e => e.EncounterStudents).Where(es => es.EncounterDate.Month == 3).Count(),
                                EvalCount = p.Encounters.Where(e => e.ServiceTypeId == (int)ServiceTypes.Evaluation_Assessment).SelectMany(e => e.EncounterStudents).Where(es => es.EncounterDate.Month == 3).Count(),
                                PendingCoSignCount = p.Encounters.SelectMany(e => e.EncounterStudents).Where(es => es.EncounterStatusId == (int)EncounterStatuses.READY_FOR_SUPERVISOR_ESIGN).Where(es => es.EncounterDate.Month == 3).Count(),
                                TotalCount = p.Encounters.SelectMany(e => e.EncounterStudents).Where(es => es.EncounterDate.Month == 3).Count(),
                                AbsenceReason = p.DocumentationDate.GetValueOrDefault() > fiscalYearStart.AddMonths(9) ? "N/A" :
                                    String.Join(", ", p.ProviderInactivityDates.Where(pid => pid.ProviderInactivityEndDate > fiscalYearStart.AddMonths(8) && pid.ProviderInactivityStartDate < fiscalYearStart.AddMonths(9)).Select(pid => pid.ProviderInactivityReason.Name)),
                            },
                            April = new MonthData
                            {
                                TreatmentTherapyCount = p.Encounters.Where(e => e.ServiceTypeId == (int)ServiceTypes.Treatment_Therapy).SelectMany(e => e.EncounterStudents).Where(es => es.EncounterDate.Month == 4).Count(),
                                EvalCount = p.Encounters.Where(e => e.ServiceTypeId == (int)ServiceTypes.Evaluation_Assessment).SelectMany(e => e.EncounterStudents).Where(es => es.EncounterDate.Month == 4).Count(),
                                PendingCoSignCount = p.Encounters.SelectMany(e => e.EncounterStudents).Where(es => es.EncounterStatusId == (int)EncounterStatuses.READY_FOR_SUPERVISOR_ESIGN).Where(es => es.EncounterDate.Month == 4).Count(),
                                TotalCount = p.Encounters.SelectMany(e => e.EncounterStudents).Where(es => es.EncounterDate.Month == 4).Count(),
                                AbsenceReason = p.DocumentationDate.GetValueOrDefault() > fiscalYearStart.AddMonths(10) ? "N/A" :
                                    String.Join(", ", p.ProviderInactivityDates.Where(pid => pid.ProviderInactivityEndDate > fiscalYearStart.AddMonths(9) && pid.ProviderInactivityStartDate < fiscalYearStart.AddMonths(10)).Select(pid => pid.ProviderInactivityReason.Name)),
                            },
                            May = new MonthData
                            {
                                TreatmentTherapyCount = p.Encounters.Where(e => e.ServiceTypeId == (int)ServiceTypes.Treatment_Therapy).SelectMany(e => e.EncounterStudents).Where(es => es.EncounterDate.Month == 5).Count(),
                                EvalCount = p.Encounters.Where(e => e.ServiceTypeId == (int)ServiceTypes.Evaluation_Assessment).SelectMany(e => e.EncounterStudents).Where(es => es.EncounterDate.Month == 5).Count(),
                                PendingCoSignCount = p.Encounters.SelectMany(e => e.EncounterStudents).Where(es => es.EncounterStatusId == (int)EncounterStatuses.READY_FOR_SUPERVISOR_ESIGN).Where(es => es.EncounterDate.Month == 5).Count(),
                                TotalCount = p.Encounters.SelectMany(e => e.EncounterStudents).Where(es => es.EncounterDate.Month == 5).Count(),
                                AbsenceReason = p.DocumentationDate.GetValueOrDefault() > fiscalYearStart.AddMonths(11) ? "N/A" :
                                    String.Join(", ", p.ProviderInactivityDates.Where(pid => pid.ProviderInactivityEndDate > fiscalYearStart.AddMonths(10) && pid.ProviderInactivityStartDate < fiscalYearStart.AddMonths(11)).Select(pid => pid.ProviderInactivityReason.Name)),
                            },
                            June = new MonthData
                            {
                                TreatmentTherapyCount = p.Encounters.Where(e => e.ServiceTypeId == (int)ServiceTypes.Treatment_Therapy).SelectMany(e => e.EncounterStudents).Where(es => es.EncounterDate.Month == 6).Count(),
                                EvalCount = p.Encounters.Where(e => e.ServiceTypeId == (int)ServiceTypes.Evaluation_Assessment).SelectMany(e => e.EncounterStudents).Where(es => es.EncounterDate.Month == 6).Count(),
                                PendingCoSignCount = p.Encounters.SelectMany(e => e.EncounterStudents).Where(es => es.EncounterStatusId == (int)EncounterStatuses.READY_FOR_SUPERVISOR_ESIGN).Where(es => es.EncounterDate.Month == 6).Count(),
                                TotalCount = p.Encounters.SelectMany(e => e.EncounterStudents).Where(es => es.EncounterDate.Month == 6).Count(),
                                AbsenceReason = p.DocumentationDate.GetValueOrDefault() > fiscalYearStart.AddMonths(12) ? "N/A" :
                                    String.Join(", ", p.ProviderInactivityDates.Where(pid => pid.ProviderInactivityEndDate > fiscalYearStart.AddMonths(11) && pid.ProviderInactivityStartDate < fiscalYearStart.AddMonths(12)).Select(pid => pid.ProviderInactivityReason.Name)),
                            },
                            Total = new MonthData {
                                TreatmentTherapyCount = p.Encounters.Where(e => e.ServiceTypeId == (int)ServiceTypes.Treatment_Therapy).SelectMany(e => e.EncounterStudents).Count(),
                                EvalCount = p.Encounters.Where(e => e.ServiceTypeId == (int)ServiceTypes.Evaluation_Assessment).SelectMany(e => e.EncounterStudents).Count(),
                                PendingCoSignCount = p.Encounters.SelectMany(e => e.EncounterStudents).Where(es => es.EncounterStatusId == (int)EncounterStatuses.READY_FOR_SUPERVISOR_ESIGN).Count(),
                                TotalCount = p.Encounters.SelectMany(e => e.EncounterStudents).Count()
                            }
                        })
                        .OrderBy(g => g.ProviderName)
                        .ToList()
                    })
                    .OrderBy(g => g.ProviderTitleName)
                    .ToList()
                })
                .OrderBy(g => g.ServiceAreaName)
                .ToList();

            // Grab District Employed Data
            data.ContractData = finalQuery
                .Where(p => p.ProviderEmploymentTypeId == (int)ProviderEmploymentTypes.Contract)
                .ToList()
                .GroupBy(p => new
                {
                    ServiceArea = p.ServiceCode.Name,
                    ServiceAreaId = p.ServiceCode.Id,
                },
                (k, g) => new CompletedActivityContractServiceAreaData
                {
                    ServiceAreaName = k.ServiceArea,
                    ShouldShowPendingCosign = k.ServiceAreaId == (int)ServiceCodes.Physical_Therapy || k.ServiceAreaId == (int)ServiceCodes.Occupational_Therapy,
                    JulyTotal = g.SelectMany(x => x.Encounters.SelectMany(e => e.EncounterStudents.Where(es => es.EncounterDate.Month == 7))).Count(),
                    AugustTotal = g.SelectMany(x => x.Encounters.SelectMany(e => e.EncounterStudents.Where(es => es.EncounterDate.Month == 8))).Count(),
                    SeptemberTotal = g.SelectMany(x => x.Encounters.SelectMany(e => e.EncounterStudents.Where(es => es.EncounterDate.Month == 9))).Count(),
                    OctoberTotal = g.SelectMany(x => x.Encounters.SelectMany(e => e.EncounterStudents.Where(es => es.EncounterDate.Month == 10))).Count(),
                    NovemberTotal = g.SelectMany(x => x.Encounters.SelectMany(e => e.EncounterStudents.Where(es => es.EncounterDate.Month == 11))).Count(),
                    DecemberTotal = g.SelectMany(x => x.Encounters.SelectMany(e => e.EncounterStudents.Where(es => es.EncounterDate.Month == 12))).Count(),
                    JanuaryTotal = g.SelectMany(x => x.Encounters.SelectMany(e => e.EncounterStudents.Where(es => es.EncounterDate.Month == 1))).Count(),
                    FebruaryTotal = g.SelectMany(x => x.Encounters.SelectMany(e => e.EncounterStudents.Where(es => es.EncounterDate.Month == 2))).Count(),
                    MarchTotal = g.SelectMany(x => x.Encounters.SelectMany(e => e.EncounterStudents.Where(es => es.EncounterDate.Month == 3))).Count(),
                    AprilTotal = g.SelectMany(x => x.Encounters.SelectMany(e => e.EncounterStudents.Where(es => es.EncounterDate.Month == 4))).Count(),
                    MayTotal = g.SelectMany(x => x.Encounters.SelectMany(e => e.EncounterStudents.Where(es => es.EncounterDate.Month == 5))).Count(),
                    JuneTotal = g.SelectMany(x => x.Encounters.SelectMany(e => e.EncounterStudents.Where(es => es.EncounterDate.Month == 6))).Count(),
                    CompleteTotal = g.SelectMany(x => x.Encounters.SelectMany(e => e.EncounterStudents)).Count(),
                    TitleData = g.GroupBy(p => new
                    {
                        providerTitle = p.ProviderTitle.Name,
                    },
                    (k, g) => new ServiceAreaContractTitleData
                    {
                        ProviderTitleName = k.providerTitle,
                        LineData = g.Select(p => new ContractLineData
                        {
                            ProviderName = p.ProviderUser.LastName + ", " + p.ProviderUser.FirstName,
                            AgencyName = p.AgencyName,
                            July = new MonthData
                            {
                                TreatmentTherapyCount = p.Encounters.Where(e => e.ServiceTypeId == (int)ServiceTypes.Treatment_Therapy).SelectMany(e => e.EncounterStudents).Where(es => es.EncounterDate.Month == 7).Count(),
                                EvalCount = p.Encounters.Where(e => e.ServiceTypeId == (int)ServiceTypes.Evaluation_Assessment).SelectMany(e => e.EncounterStudents).Where(es => es.EncounterDate.Month == 7).Count(),
                                TotalCount = p.Encounters.SelectMany(e => e.EncounterStudents).Where(es => es.EncounterDate.Month == 7).Count(),
                                AbsenceReason = p.DocumentationDate.GetValueOrDefault() > fiscalYearStart.AddMonths(1) ? "N/A" :
                                    String.Join(", ", p.ProviderInactivityDates.Where(pid => pid.ProviderInactivityEndDate > fiscalYearStart && pid.ProviderInactivityEndDate > fiscalYearStart && pid.ProviderInactivityStartDate < fiscalYearStart.AddMonths(1)).Select(pid => pid.ProviderInactivityReason.Name)),
                            },
                            August = new MonthData
                            {
                                TreatmentTherapyCount = p.Encounters.Where(e => e.ServiceTypeId == (int)ServiceTypes.Treatment_Therapy).SelectMany(e => e.EncounterStudents).Where(es => es.EncounterDate.Month == 8).Count(),
                                EvalCount = p.Encounters.Where(e => e.ServiceTypeId == (int)ServiceTypes.Evaluation_Assessment).SelectMany(e => e.EncounterStudents).Where(es => es.EncounterDate.Month == 8).Count(),
                                TotalCount = p.Encounters.SelectMany(e => e.EncounterStudents).Where(es => es.EncounterDate.Month == 8).Count(),
                                AbsenceReason = p.DocumentationDate.GetValueOrDefault() > fiscalYearStart.AddMonths(2) ? "N/A" :
                                    String.Join(", ", p.ProviderInactivityDates.Where(pid => pid.ProviderInactivityEndDate > fiscalYearStart.AddMonths(1) && pid.ProviderInactivityStartDate < fiscalYearStart.AddMonths(2)).Select(pid => pid.ProviderInactivityReason.Name)),
                            },
                            September = new MonthData
                            {
                                TreatmentTherapyCount = p.Encounters.Where(e => e.ServiceTypeId == (int)ServiceTypes.Treatment_Therapy).SelectMany(e => e.EncounterStudents).Where(es => es.EncounterDate.Month == 9).Count(),
                                EvalCount = p.Encounters.Where(e => e.ServiceTypeId == (int)ServiceTypes.Evaluation_Assessment).SelectMany(e => e.EncounterStudents).Where(es => es.EncounterDate.Month == 9).Count(),
                                TotalCount = p.Encounters.SelectMany(e => e.EncounterStudents).Where(es => es.EncounterDate.Month == 9).Count(),
                                AbsenceReason = p.DocumentationDate.GetValueOrDefault() > fiscalYearStart.AddMonths(3) ? "N/A" :
                                    String.Join(", ", p.ProviderInactivityDates.Where(pid => pid.ProviderInactivityEndDate > fiscalYearStart.AddMonths(2) && pid.ProviderInactivityStartDate < fiscalYearStart.AddMonths(3)).Select(pid => pid.ProviderInactivityReason.Name)),
                            },
                            October = new MonthData
                            {
                                TreatmentTherapyCount = p.Encounters.Where(e => e.ServiceTypeId == (int)ServiceTypes.Treatment_Therapy).SelectMany(e => e.EncounterStudents).Where(es => es.EncounterDate.Month == 10).Count(),
                                EvalCount = p.Encounters.Where(e => e.ServiceTypeId == (int)ServiceTypes.Evaluation_Assessment).SelectMany(e => e.EncounterStudents).Where(es => es.EncounterDate.Month == 10).Count(),
                                TotalCount = p.Encounters.SelectMany(e => e.EncounterStudents).Where(es => es.EncounterDate.Month == 10).Count(),
                                AbsenceReason = p.DocumentationDate.GetValueOrDefault() > fiscalYearStart.AddMonths(4) ? "N/A" :
                                    String.Join(", ", p.ProviderInactivityDates.Where(pid => pid.ProviderInactivityEndDate > fiscalYearStart.AddMonths(3) && pid.ProviderInactivityStartDate < fiscalYearStart.AddMonths(4)).Select(pid => pid.ProviderInactivityReason.Name)),
                            },
                            November = new MonthData
                            {
                                TreatmentTherapyCount = p.Encounters.Where(e => e.ServiceTypeId == (int)ServiceTypes.Treatment_Therapy).SelectMany(e => e.EncounterStudents).Where(es => es.EncounterDate.Month == 11).Count(),
                                EvalCount = p.Encounters.Where(e => e.ServiceTypeId == (int)ServiceTypes.Evaluation_Assessment).SelectMany(e => e.EncounterStudents).Where(es => es.EncounterDate.Month == 11).Count(),
                                TotalCount = p.Encounters.SelectMany(e => e.EncounterStudents).Where(es => es.EncounterDate.Month == 11).Count(),
                                AbsenceReason = p.DocumentationDate.GetValueOrDefault() > fiscalYearStart.AddMonths(5) ? "N/A" :
                                    String.Join(", ", p.ProviderInactivityDates.Where(pid => pid.ProviderInactivityEndDate > fiscalYearStart.AddMonths(4) && pid.ProviderInactivityStartDate < fiscalYearStart.AddMonths(5)).Select(pid => pid.ProviderInactivityReason.Name)),
                            },
                            December = new MonthData
                            {
                                TreatmentTherapyCount = p.Encounters.Where(e => e.ServiceTypeId == (int)ServiceTypes.Treatment_Therapy).SelectMany(e => e.EncounterStudents).Where(es => es.EncounterDate.Month == 12).Count(),
                                EvalCount = p.Encounters.Where(e => e.ServiceTypeId == (int)ServiceTypes.Evaluation_Assessment).SelectMany(e => e.EncounterStudents).Where(es => es.EncounterDate.Month == 12).Count(),
                                TotalCount = p.Encounters.SelectMany(e => e.EncounterStudents).Where(es => es.EncounterDate.Month == 12).Count(),
                                AbsenceReason = p.DocumentationDate.GetValueOrDefault() > fiscalYearStart.AddMonths(6) ? "N/A" :
                                    String.Join(", ", p.ProviderInactivityDates.Where(pid => pid.ProviderInactivityEndDate > fiscalYearStart.AddMonths(5) && pid.ProviderInactivityStartDate < fiscalYearStart.AddMonths(6)).Select(pid => pid.ProviderInactivityReason.Name)),
                            },
                            January = new MonthData
                            {
                                TreatmentTherapyCount = p.Encounters.Where(e => e.ServiceTypeId == (int)ServiceTypes.Treatment_Therapy).SelectMany(e => e.EncounterStudents).Where(es => es.EncounterDate.Month == 1).Count(),
                                EvalCount = p.Encounters.Where(e => e.ServiceTypeId == (int)ServiceTypes.Evaluation_Assessment).SelectMany(e => e.EncounterStudents).Where(es => es.EncounterDate.Month == 1).Count(),
                                TotalCount = p.Encounters.SelectMany(e => e.EncounterStudents).Where(es => es.EncounterDate.Month == 1).Count(),
                                AbsenceReason = p.DocumentationDate.GetValueOrDefault() > fiscalYearStart.AddMonths(7) ? "N/A" :
                                    String.Join(", ", p.ProviderInactivityDates.Where(pid => pid.ProviderInactivityEndDate > fiscalYearStart.AddMonths(6) && pid.ProviderInactivityStartDate < fiscalYearStart.AddMonths(7)).Select(pid => pid.ProviderInactivityReason.Name)),
                            },
                            February = new MonthData
                            {
                                TreatmentTherapyCount = p.Encounters.Where(e => e.ServiceTypeId == (int)ServiceTypes.Treatment_Therapy).SelectMany(e => e.EncounterStudents).Where(es => es.EncounterDate.Month == 2).Count(),
                                EvalCount = p.Encounters.Where(e => e.ServiceTypeId == (int)ServiceTypes.Evaluation_Assessment).SelectMany(e => e.EncounterStudents).Where(es => es.EncounterDate.Month == 2).Count(),
                                TotalCount = p.Encounters.SelectMany(e => e.EncounterStudents).Where(es => es.EncounterDate.Month == 2).Count(),
                                AbsenceReason = p.DocumentationDate.GetValueOrDefault() > fiscalYearStart.AddMonths(8) ? "N/A" :
                                    String.Join(", ", p.ProviderInactivityDates.Where(pid => pid.ProviderInactivityEndDate > fiscalYearStart.AddMonths(7) && pid.ProviderInactivityStartDate < fiscalYearStart.AddMonths(8)).Select(pid => pid.ProviderInactivityReason.Name)),
                            },
                            March = new MonthData
                            {
                                TreatmentTherapyCount = p.Encounters.Where(e => e.ServiceTypeId == (int)ServiceTypes.Treatment_Therapy).SelectMany(e => e.EncounterStudents).Where(es => es.EncounterDate.Month == 3).Count(),
                                EvalCount = p.Encounters.Where(e => e.ServiceTypeId == (int)ServiceTypes.Evaluation_Assessment).SelectMany(e => e.EncounterStudents).Where(es => es.EncounterDate.Month == 3).Count(),
                                TotalCount = p.Encounters.SelectMany(e => e.EncounterStudents).Where(es => es.EncounterDate.Month == 3).Count(),
                                AbsenceReason = p.DocumentationDate.GetValueOrDefault() > fiscalYearStart.AddMonths(9) ? "N/A" :
                                    String.Join(", ", p.ProviderInactivityDates.Where(pid => pid.ProviderInactivityEndDate > fiscalYearStart.AddMonths(8) && pid.ProviderInactivityStartDate < fiscalYearStart.AddMonths(9)).Select(pid => pid.ProviderInactivityReason.Name)),
                            },
                            April = new MonthData
                            {
                                TreatmentTherapyCount = p.Encounters.Where(e => e.ServiceTypeId == (int)ServiceTypes.Treatment_Therapy).SelectMany(e => e.EncounterStudents).Where(es => es.EncounterDate.Month == 4).Count(),
                                EvalCount = p.Encounters.Where(e => e.ServiceTypeId == (int)ServiceTypes.Evaluation_Assessment).SelectMany(e => e.EncounterStudents).Where(es => es.EncounterDate.Month == 4).Count(),
                                TotalCount = p.Encounters.SelectMany(e => e.EncounterStudents).Where(es => es.EncounterDate.Month == 4).Count(),
                                AbsenceReason = p.DocumentationDate.GetValueOrDefault() > fiscalYearStart.AddMonths(10) ? "N/A" :
                                    String.Join(", ", p.ProviderInactivityDates.Where(pid => pid.ProviderInactivityEndDate > fiscalYearStart.AddMonths(9) && pid.ProviderInactivityStartDate < fiscalYearStart.AddMonths(10)).Select(pid => pid.ProviderInactivityReason.Name)),
                            },
                            May = new MonthData
                            {
                                TreatmentTherapyCount = p.Encounters.Where(e => e.ServiceTypeId == (int)ServiceTypes.Treatment_Therapy).SelectMany(e => e.EncounterStudents).Where(es => es.EncounterDate.Month == 5).Count(),
                                EvalCount = p.Encounters.Where(e => e.ServiceTypeId == (int)ServiceTypes.Evaluation_Assessment).SelectMany(e => e.EncounterStudents).Where(es => es.EncounterDate.Month == 5).Count(),
                                TotalCount = p.Encounters.SelectMany(e => e.EncounterStudents).Where(es => es.EncounterDate.Month == 5).Count(),
                                AbsenceReason = p.DocumentationDate.GetValueOrDefault() > fiscalYearStart.AddMonths(11) ? "N/A" :
                                    String.Join(", ", p.ProviderInactivityDates.Where(pid => pid.ProviderInactivityEndDate > fiscalYearStart.AddMonths(10) && pid.ProviderInactivityStartDate < fiscalYearStart.AddMonths(11)).Select(pid => pid.ProviderInactivityReason.Name)),
                            },
                            June = new MonthData
                            {
                                TreatmentTherapyCount = p.Encounters.Where(e => e.ServiceTypeId == (int)ServiceTypes.Treatment_Therapy).SelectMany(e => e.EncounterStudents).Where(es => es.EncounterDate.Month == 6).Count(),
                                EvalCount = p.Encounters.Where(e => e.ServiceTypeId == (int)ServiceTypes.Evaluation_Assessment).SelectMany(e => e.EncounterStudents).Where(es => es.EncounterDate.Month == 6).Count(),
                                TotalCount = p.Encounters.SelectMany(e => e.EncounterStudents).Where(es => es.EncounterDate.Month == 6).Count(),
                                AbsenceReason = p.DocumentationDate.GetValueOrDefault() > fiscalYearStart.AddMonths(12) ? "N/A" :
                                    String.Join(", ", p.ProviderInactivityDates.Where(pid => pid.ProviderInactivityEndDate > fiscalYearStart.AddMonths(11) && pid.ProviderInactivityStartDate < fiscalYearStart.AddMonths(12)).Select(pid => pid.ProviderInactivityReason.Name)),
                            },
                            Total = new MonthData {
                                TreatmentTherapyCount = p.Encounters.Where(e => e.ServiceTypeId == (int)ServiceTypes.Treatment_Therapy).SelectMany(e => e.EncounterStudents).Count(),
                                EvalCount = p.Encounters.Where(e => e.ServiceTypeId == (int)ServiceTypes.Evaluation_Assessment).SelectMany(e => e.EncounterStudents).Count(),
                                TotalCount = p.Encounters.SelectMany(e => e.EncounterStudents).Count(),
                            }
                        })
                        .OrderBy(g => g.ProviderName)
                        .ToList()
                    })
                    .OrderBy(g => g.ProviderTitleName)
                    .ToList()
                })
                .OrderBy(g => g.ServiceAreaName)
                .ToList();

            return data;
        }

    }
}
