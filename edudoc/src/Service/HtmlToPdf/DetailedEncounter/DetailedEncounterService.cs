using breckhtmltopdf;
using Microsoft.Extensions.Configuration;
using Model;
using Service.Users;
using Microsoft.AspNetCore.Mvc;
using System.Linq;
using Microsoft.Net.Http.Headers;
using Model.Custom;
using System.Collections.Generic;
using System.Data.Entity;
using System.Net;
using System;
using Model.Enums;
using Service.Utilities;
using Model.DTOs;

namespace Service.HtmlToPdf
{

    using DetailedEncounterDistrictData = EncounterDistrictData<DetailedEncounterLineData>;
    using DetailedEncounterGroupData = EncounterGroupData<DetailedEncounterLineData>;

    public class DetailedEncounterService : BaseService, IDetailedEncounterService
    {

        private ITemplatePdfService _templatePdfService;
        private IConfiguration _configuration;
        private IUserService _userService;
        private IPrimaryContext _context;

        public DetailedEncounterService(IPrimaryContext context, ITemplatePdfService templatePdfService, IConfiguration configuration, IUserService userService) : base(context)
        {
            _templatePdfService = templatePdfService;
            _configuration = configuration;
            _userService = userService;
            _context = context;
        }

        public FileStreamResult GeneratePdf(Model.Core.CRUDSearchParams csp, int timezoneOffsetMinutes, int userId)
        {
            var DetailedEncounterParams = new Templator.Models.DetailedEncounterParams(_configuration);

            var _tableData = GetTableData(csp, timezoneOffsetMinutes, userId);
            DetailedEncounterParams.districtData = _tableData;

            var pdf = _templatePdfService.CreatePdfFromTemplate("DetailedEncounter.cshtml", DetailedEncounterParams);
            return new FileStreamResult(new System.IO.MemoryStream(pdf), new MediaTypeHeaderValue("application/octet-stream"))
            {
                FileDownloadName = "DetailedEncounter"
            };
        }

        // This method was initially setup to accept calls from Admin users, but that logical flow was not implemented in the front end.
        // If it does then we will need to revaluate this method.
        public List<EncounterDistrictData<DetailedEncounterLineData>> GetTableData(Model.Core.CRUDSearchParams csp, int timezoneOffsetMinutes, int userId)
        {
            //var user = Context.Users
            //.Include(user => user.Providers_ProviderUserId)
            //.Include(user => user.Providers_ProviderUserId.Select(provider => provider.ProviderTitle))
            //.Include(user => user.AuthUser)
            //.Include(user => user.AuthUser.UserRole)
            //.FirstOrDefault(user => user.Id == userId);
            //var notAdmin = user.AuthUser.UserRole.UserTypeId != (int)UserTypeEnums.Admin;

            var serviceAreaWithMethods = new int[] { (int)ServiceCodes.Speech_Therapy, (int)ServiceCodes.Audiology };
            var districtIds = new List<int>();
            var provider = _context.Providers.Include(provider => provider.ProviderTitle).FirstOrDefault(p => p.ProviderUserId == userId);
            var providerIds = new List<int>();
            if (provider != null) { providerIds.Add(provider.Id); }
            var startDate = DateTime.MinValue;
            var endDate = DateTime.MaxValue;

            var today = DateTime.UtcNow;

            var encounterStudentsQuery = _context.EncounterStudents.Where(es => es.DateESigned.HasValue
                                                                             && !es.Archived
                                                                             && es.EncounterStatusId != (int)EncounterStatuses.Abandoned);

            if (!string.IsNullOrEmpty(csp.extraparams))
            {
                var extras = System.Web.HttpUtility.ParseQueryString(WebUtility.UrlDecode(csp.extraparams));
                var serviceCodeIds = new List<int>();

                if (extras["ProviderIds"] != null)
                {
                    var providerIdsParamsList = CommonFunctions.GetIntListFromExtraParams(csp.extraparams, "ProviderIds");
                    providerIds = providerIdsParamsList["ProviderIds"];
                }

                if (extras["OtherProviders"] == "1")
                {
                    providerIds = _context.Providers.Where(p =>
                        p.ProviderTitle.ServiceCodeId == provider.ProviderTitle.ServiceCodeId &&
                        p.Id != provider.Id)
                        .Select(p => p.Id)
                        .ToList();
                }

                if (extras["DistrictIds"] != null)
                {
                    var districtIdsParamsList = CommonFunctions.GetIntListFromExtraParams(csp.extraparams, "DistrictIds");
                    districtIds = districtIdsParamsList["DistrictIds"];
                }
                if (extras["ServiceCodeIds"] != null)
                {
                    var serviceCodeIdsParamList = CommonFunctions.GetIntListFromExtraParams(csp.extraparams, "ServiceCodeIds");
                    serviceCodeIds = serviceCodeIdsParamList["ServiceCodeIds"];
                    providerIds = _context.Providers.Where(p => serviceCodeIds.Contains(p.ProviderTitle.ServiceCodeId)).Select(p => p.Id).ToList();
                }
                if (extras["IsDistrictAdminReport"] == "1")
                {
                    providerIds = _context.Providers
                                    .Where(p => serviceCodeIds.Contains(p.ProviderTitle.ServiceCodeId))
                                    .Select(p => p.Id)
                                    .ToList();
                    districtIds = new List<int>() { _context.Users.Where(u => u.Id == userId).Select(u => u.SchoolDistrictId).Single().Value };
                }

                if (extras["StudentIds"] != null)
                {
                    var studentIdsParamsList = CommonFunctions.GetIntListFromExtraParams(csp.extraparams, "StudentIds");
                    var studentIds = studentIdsParamsList["StudentIds"];

                    encounterStudentsQuery = encounterStudentsQuery.Where(encounterStudent => studentIds.Contains(encounterStudent.StudentId));
                }

                if (extras["ServiceTypeIds"] != null)
                {
                    var serviceTypeIdsParamsList = CommonFunctions.GetIntListFromExtraParams(csp.extraparams, "ServiceTypeIds");
                    var serviceTypeIds = serviceTypeIdsParamsList["ServiceTypeIds"];

                    encounterStudentsQuery = encounterStudentsQuery.Where(encounterStudent => serviceTypeIds.Contains(encounterStudent.Encounter.ServiceTypeId));
                }

                if (extras["StartDate"] != null)
                {
                    startDate = DateTime.Parse(extras["StartDate"]);
                }

                if (extras["EndDate"] != null)
                {
                    endDate = DateTime.Parse(extras["EndDate"]);
                }
            }

            //if (user.AuthUser.UserRole.UserTypeId == (int)UserTypeEnums.DistrictAdmin)
            //{
            //    encounterStudentsQuery = encounterStudentsQuery.Where(encounterStudent => encounterStudent.Student.School.SchoolDistrictsSchools.Any(sds => sds.SchoolDistrictId == user.SchoolDistrictId) || encounterStudent.Student.DistrictId == user.SchoolDistrictId);
            //}

            encounterStudentsQuery = encounterStudentsQuery
                .Where(encounterStudent => DbFunctions.TruncateTime(encounterStudent.EncounterDate) >= DbFunctions.TruncateTime(startDate) &&
                    DbFunctions.TruncateTime(encounterStudent.EncounterDate) <= DbFunctions.TruncateTime(endDate) &&
                    providerIds.Contains(encounterStudent.Encounter.ProviderId));

            // Grab all districts the user is assigned to. Also works with Other Providers since they would need to share districts
            if (districtIds.Count == 0)
            {
                districtIds = _context.SchoolDistricts
                    .Where(schoolDistrict => !schoolDistrict.Archived &&
                        schoolDistrict.ProviderEscSchoolDistricts.Any(psd =>
                            psd.ProviderEscAssignment.Provider.ProviderUserId == userId &&
                            !psd.ProviderEscAssignment.Archived &&
                            (psd.ProviderEscAssignment.EndDate == null || psd.ProviderEscAssignment.EndDate >= DateTime.Now)))
                    .AsNoTracking()
                    .Select(schoolDistrict => schoolDistrict.Id)
                    .ToList();
            }

            if (districtIds.Count > 0)
            {
                encounterStudentsQuery = encounterStudentsQuery.Where(encounterStudent => districtIds
                    .Contains((int)encounterStudent.Student.DistrictId) || districtIds
                    .Contains((int)encounterStudent.Student.DistrictId));
            }

            var encounterData = encounterStudentsQuery
                .Select(es => new
                {
                    es.Id,
                    Number = es.EncounterNumber,
                    StatusId = es.EncounterStatusId,
                    NonDeviatedStudentCount = es.Encounter.EncounterStudents.Where(es => !es.Archived && es.EncounterStatusId != (int)EncounterStatuses.DEVIATED).Count(),
                    StartTime = es.EncounterStartTime,
                    EndTime = es.EncounterEndTime,
                    Date = es.EncounterDate,
                    es.Encounter.AdditionalStudents,
                    es.Encounter.ServiceTypeId,
                    ServiceTypeName = es.Encounter.ServiceType.Name,
                    ProviderFirstName = es.Encounter.Provider.ProviderUser.FirstName,
                    ProviderLastName = es.Encounter.Provider.ProviderUser.LastName,
                    es.DiagnosisCode,
                    es.TherapyCaseNotes,
                    es.IsTelehealth,
                    es.DateCreated
                })
                .AsEnumerable();
            var studentData = encounterStudentsQuery.Select(es => new
            {
                es.Id,
                SchoolDistrictName = es.Student.SchoolDistrict.Name ?? es.Student.School.SchoolDistrictsSchools.FirstOrDefault().SchoolDistrict.Name ?? "Unknown",
                es.Student.LastName,
                es.Student.FirstName,
                es.Student.StudentCode,
                es.Student.DateOfBirth,
                DeviationReasonName = es.StudentDeviationReason.Name ?? ""

            }).AsEnumerable();
            var caseloadData = encounterStudentsQuery.Select(es => new
            {
                es.Id,
                es.CaseLoadId,
                es.CaseLoad.IepStartDate
            }).AsEnumerable();
            var extraData = encounterStudentsQuery
            .Select(es => new
            {
                Id = es.Id,
                Methods = es.EncounterStudentMethods.Where(esm => !esm.Archived).Select(esm => esm.Method),
                CptCodes = es.EncounterStudentCptCodes.Where(escc => !escc.Archived).Select(escc => new
                {
                    Code = escc.CptCode,
                    Minutes = escc.Minutes
                }),
                Goals = es.EncounterStudentGoals.Where(esg => !esg.Archived).Select(esg => esg.Goal)
            }).AsEnumerable();


            var esData = encounterData.Join(studentData, e => e.Id, s => s.Id, (e, s) => new
            {
                Encounter = e,
                Student = s,
            }).Join(caseloadData, es => es.Encounter.Id, c => c.Id, (es, c) => new
            {
                es.Encounter,
                es.Student,
                CaseLoad = c
            }).Join(extraData, es => es.Encounter.Id, e => e.Id, (es, extra) => new
            {
                es.Encounter,
                es.Student,
                es.CaseLoad,
                Extra = extra
            })
            .ToList();

            TimeZoneInfo tz = CommonFunctions.GetTimeZone();
            return esData
                .GroupBy(es => new
                {
                    districtName = es.Student.SchoolDistrictName,
                },
                (k, g) => new DetailedEncounterDistrictData
                {
                    DistrictName = k.districtName,
                    GroupData = g.GroupBy(es => new
                    {
                        providerName = es.Encounter.ProviderLastName + ", " + es.Encounter.ProviderFirstName,
                        studentName = es.Student.LastName + ", " + es.Student.FirstName + " (" + es.Student.StudentCode + ") DOB " + es.Student.DateOfBirth.ToString("d"),
                        iepStartDate = es.CaseLoad.CaseLoadId > 0 ? es.CaseLoad.IepStartDate.GetValueOrDefault().Equals(DateTime.MinValue) ? "" : es.CaseLoad.IepStartDate.GetValueOrDefault().ToString("d") : ""
                    },
                    (k, g) => new DetailedEncounterGroupData
                    {
                        ProviderName = k.providerName,
                        StudentInfo = k.studentName,
                        IEPStartDate = k.iepStartDate,
                        TotalMinutes = g.Where(es =>
                                es.Encounter.StatusId
                                != (int)EncounterStatuses.DEVIATED
                            )
                            .Sum(es =>
                            {
                                var endTimeDay = DateOnly.FromDateTime(today);
                                if (
                                    es.Encounter.EndTime
                                    < es.Encounter.StartTime
                                )
                                {
                                    endTimeDay = endTimeDay.AddDays(1);
                                }
                                return (int)
                                    (
                                        new DateTime(
                                            endTimeDay,
                                            TimeOnly.FromTimeSpan(es.Encounter.EndTime)
                                        )
                                        - new DateTime(
                                            DateOnly.FromDateTime(today),
                                            TimeOnly.FromTimeSpan(es.Encounter.StartTime)
                                        )
                                    ).TotalMinutes;
                            }),
                        LineData = g.Select(es =>
                        {
                            var endTimeDay = DateOnly.FromDateTime(today);
                            if (
                                es.Encounter.EndTime
                                < es.Encounter.StartTime
                            )
                            {
                                endTimeDay = endTimeDay.AddDays(1);
                            }
                            return new DetailedEncounterLineData
                            {
                                EncounterNumber = es.Encounter.Number,
                                EncounterDate = es.Encounter.Date.ToString("d"),
                                ServiceType = es.Encounter.ServiceTypeName,
                                ReasonForService = es.Encounter.DiagnosisCode != null ? "(" + es.Encounter.DiagnosisCode.Code + ") " + es.Encounter.DiagnosisCode.Description : "",
                                Status = es.Encounter.StatusId == (int)EncounterStatuses.DEVIATED ? "Deviated" : "E-Signed",
                                ReasonForDeviation = es.Student.DeviationReasonName,
                                StartTime = new DateTime(today.Year, today.Month, today.Day, es.Encounter.StartTime.Hours, es.Encounter.StartTime.Minutes, 0).AddMinutes(Convert.ToInt32(tz.GetUtcOffset(es.Encounter.Date).TotalMinutes)).ToString("T"),
                                EndTime = new DateTime(today.Year, today.Month, today.Day, es.Encounter.EndTime.Hours, es.Encounter.EndTime.Minutes, 0).AddMinutes(Convert.ToInt32(tz.GetUtcOffset(es.Encounter.Date).TotalMinutes)).ToString("T"),
                                TotalMinutes =
                                                            es.Encounter.StatusId
                                                            != (int)EncounterStatuses.DEVIATED
                                                                ? (int)
                                                                (new DateTime(endTimeDay, TimeOnly.FromTimeSpan(es.Encounter.EndTime))
                                                                - new DateTime(DateOnly.FromDateTime(today), TimeOnly.FromTimeSpan(es.Encounter.StartTime))

                                                                    ).TotalMinutes
                                                                : 0,
                                Grouping = es.Encounter.NonDeviatedStudentCount,
                                AdditionalStudents = es.Encounter.AdditionalStudents,
                                Methods = (provider == null || serviceAreaWithMethods.Contains(provider.ProviderTitle.ServiceCodeId)) ? es.Extra.Methods.ToList() : new List<Method>(),
                                Goals = es.Extra.Goals.ToList(),
                                ProcedureCodes = es.Extra.CptCodes
                                                            .Select(e => new CptCodeWithMinutesDto { CptCode = e.Code, Minutes = e.Minutes ?? 0 }).ToList(),
                                Notes = "Notes: " + es.Encounter.TherapyCaseNotes,
                                IsTelehealth = es.Encounter.IsTelehealth,
                                EntryDate = es.Encounter.DateCreated.Value.ToString("d")
                            };
                        }).OrderByDescending(g => DateTime.Parse(g.EncounterDate)).ToList()
                    })
                    .OrderBy(g => g.ProviderName)
                    .ThenBy(g => g.StudentInfo)
                    .ToList()
                })
                .OrderBy(g => g.DistrictName)
                .ToList();
        }
    }
}
