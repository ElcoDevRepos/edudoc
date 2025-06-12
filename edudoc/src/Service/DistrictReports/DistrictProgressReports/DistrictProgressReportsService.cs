using Model;
using Model.DTOs;
using Model.Enums;
using Service.Utilities;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Net;

namespace Service.DistrictProgressReports
{
    public interface IDistrictProgressReportsService
    {
        (IEnumerable<DistrictProgressReportDto> result, int count) GetDistrictProgressReports(int districtId, Model.Core.CRUDSearchParams csp);
        (IEnumerable<DistrictProgressReportStudentsDto> result, int count) GetDistrictProgressReportStudents(int providerId, Model.Core.CRUDSearchParams csp);
        Student GetStudentForProgressReport(int studentId);
    }

    public class DistrictProgressReportsService : BaseService, IDistrictProgressReportsService
    {
        private readonly IPrimaryContext _context;
        public DistrictProgressReportsService(IPrimaryContext context) : base(context)
        {
            _context = context;
        }

        public (IEnumerable<DistrictProgressReportDto> result, int count) GetDistrictProgressReports(int districtId, Model.Core.CRUDSearchParams csp)
        {
            // if districtId = 0, then it is HPC admin
            var baseQuery =
                districtId > 0
                    ? _context
                        .Providers.AsQueryable()
                        .Where(p =>
                            p.ProviderEscAssignments.Any(pa =>
                                !pa.Archived
                                && pa.ProviderEscSchoolDistricts.Any(pes =>
                                    pes.SchoolDistrictId == districtId
                                )
                            )
                        )
                    : _context.Providers.AsQueryable();

            baseQuery = baseQuery.Where(p => p.ProviderTitle.ServiceCodeId != (int)ServiceCodes.Nursing);

            if (!CommonFunctions.IsBlankSearch(csp.Query))
            {
                string[] terms = CommonFunctions.SplitTerms(csp.Query.Trim().ToLower());
                foreach (string t in terms)
                {
                    baseQuery = baseQuery.Where(p =>
                        p.ProviderUser.FirstName.ToLower().StartsWith(t) ||
                        p.ProviderUser.LastName.ToLower().StartsWith(t));
                }
            }
            var startDate = (DateTime)DateTime.MinValue;
            var endDate = (DateTime)DateTime.MaxValue;
            if (!string.IsNullOrEmpty(csp.extraparams))
            {
                var extras = System.Web.HttpUtility.ParseQueryString(WebUtility.UrlDecode(csp.extraparams));

                // if dates are not provided, nullify data
                if (extras.Count < 2)
                {
                    baseQuery = baseQuery.Where(p => p.ProviderTitle.ServiceCodeId == 0);
                }
                else
                {
                    if (extras["ServiceAreaId"] != null)
                    {
                        var serviceAreaIdsParamsList = CommonFunctions.GetIntListFromExtraParams(csp.extraparams, "ServiceAreaId");
                        var serviceAreaIds = serviceAreaIdsParamsList["ServiceAreaId"];
                        if (serviceAreaIds.Count > 0)
                        {
                            baseQuery = baseQuery.Where(p => serviceAreaIds.Contains(p.ProviderTitle.ServiceCodeId));
                        }
                    }
                    if (extras["StartDate"] != null)
                    {
                        var date = DateTime.Parse(extras["StartDate"]);
                        startDate = date;
                    }
                    if (extras["EndDate"] != null)
                    {
                        var date = DateTime.Parse(extras["EndDate"]);
                        endDate = date;
                    }
                }
            }
            else
            {
                baseQuery = baseQuery.Where(p => p.ProviderTitle.ServiceCodeId == 0);
            }

            var currentSchoolYearStart = CommonFunctions.GetCurrentSchoolYearStart();
            var count = baseQuery.Count();
            baseQuery = baseQuery.OrderBy(p => p.ProviderUser.LastName);

            if (csp.take > 0)
            {
                baseQuery = baseQuery.Skip(csp.skip.GetValueOrDefault()).Take(csp.take.GetValueOrDefault());
            }


            return (baseQuery.Select(p => new DistrictProgressReportDto
            {
                ProviderId = p.Id,
                FirstName = p.ProviderUser.FirstName,
                LastName = p.ProviderUser.LastName,
                ServiceAreaId = p.ProviderTitle.ServiceCodeId,
                ServiceAreaName = p.ProviderTitle.ServiceCode.Name,
                TotalIEPStudents = p.ProviderStudents.Where(ps => ps.Student.CaseLoads
                    .Any(cl => !cl.Archived && cl.StudentTypeId == (int)StudentTypes.IEP) &&
                        ps.Student.EncounterStudents.Any(es =>
                            (es.ESignedById == p.ProviderUserId || es.SupervisorESignedById == p.ProviderUserId))).Count(),
                TotalEncounters = p.Encounters.Where(e => !e.Archived && e.ServiceTypeId == (int)ServiceTypes.Treatment_Therapy)
                    .SelectMany(e => e.EncounterStudents.Where(es => !es.Archived &&
                        es.CaseLoad.StudentTypeId == (int)StudentTypes.IEP &&
                        !es.CaseLoad.Archived &&
                        es.EncounterDate >= currentSchoolYearStart &&
                        (es.ESignedById == p.ProviderUserId || es.SupervisorESignedById == p.ProviderUserId))
                    ).Count(),
                TotalCompletedReports = _context.ProgressReports.Where(pr =>
                    (pr.ESignedBy.Providers_ProviderUserId.Any(prov => prov.Id == p.Id) ||
                        pr.SupervisorESignedBy.Providers_ProviderUserId.Any(prov => prov.Id == p.Id)) &&
                        (
                            (DbFunctions.TruncateTime(pr.StartDate) >= DbFunctions.TruncateTime(startDate) &&
                                DbFunctions.TruncateTime(pr.StartDate) <= DbFunctions.TruncateTime(endDate))
                                ||
                            (DbFunctions.TruncateTime(pr.EndDate) >= DbFunctions.TruncateTime(startDate) &&
                                DbFunctions.TruncateTime(pr.EndDate) <= DbFunctions.TruncateTime(endDate))
                        )).Count(),
            }).AsEnumerable(), count);
        }
        public (IEnumerable<DistrictProgressReportStudentsDto> result, int count) GetDistrictProgressReportStudents(int providerId, Model.Core.CRUDSearchParams csp)
        {
            var baseQuery = _context.Students
                .Where(s => (s.ProviderStudents.Any(ps => ps.ProviderId == providerId) ||
                    s.ProviderStudentSupervisors.Any(s => s.SupervisorId == providerId))
                    && s.CaseLoads.Any(cl => cl.StudentTypeId == (int)StudentTypes.IEP && !cl.Archived));

            var startDate = (DateTime)DateTime.MinValue;
            var endDate = (DateTime)DateTime.MaxValue;
            if (!string.IsNullOrEmpty(csp.extraparams))
            {
                var extras = System.Web.HttpUtility.ParseQueryString(WebUtility.UrlDecode(csp.extraparams));

                if (extras["StartDate"] != null)
                {
                    var date = DateTime.Parse(extras["StartDate"]);
                    startDate = date;
                }
                if (extras["EndDate"] != null)
                {
                    var date = DateTime.Parse(extras["EndDate"]);
                    endDate = date;
                }
            }

            var currentSchoolYearStart = CommonFunctions.GetCurrentSchoolYearStart();
            var count = baseQuery.Count();
            baseQuery = baseQuery.OrderBy(s => s.LastName)
                .Skip(csp.skip.GetValueOrDefault())
                .Take(csp.take.GetValueOrDefault());
            return (baseQuery.Select(s => new DistrictProgressReportStudentsDto
            {
                ProviderId = providerId,
                StudentId = s.Id,
                FirstName = s.FirstName,
                LastName = s.LastName,
                TotalEncounters = s.EncounterStudents.Where(es => !es.Archived &&
                    (es.ESignedBy.Providers_ProviderUserId.Any(p => p.Id == providerId) ||
                        es.SupervisorESignedBy.Providers_ProviderUserId.Any(p => p.Id == providerId)) &&
                    es.EncounterDate >= currentSchoolYearStart &&
                    !es.CaseLoad.Archived && es.CaseLoad.StudentTypeId == (int)StudentTypes.IEP &&
                    es.Encounter.ServiceTypeId == (int)ServiceTypes.Treatment_Therapy &&
                    !es.Encounter.Archived
                    ).Count(),
                ProgressReports = s.ProgressReports.Where(pr =>
                    (pr.ESignedBy.Providers_ProviderUserId.Any(p => p.Id == providerId) ||
                        pr.SupervisorESignedBy.Providers_ProviderUserId.Any(p => p.Id == providerId)) &&
                        (
                            (DbFunctions.TruncateTime(pr.StartDate) >= DbFunctions.TruncateTime(startDate) &&
                                DbFunctions.TruncateTime(pr.StartDate) <= DbFunctions.TruncateTime(endDate))
                                ||
                            (DbFunctions.TruncateTime(pr.EndDate) >= DbFunctions.TruncateTime(startDate) &&
                                DbFunctions.TruncateTime(pr.EndDate) <= DbFunctions.TruncateTime(endDate))
                        )).OrderBy(pr => pr.StartDate),
            }).AsEnumerable(), count);
        }
        public Student GetStudentForProgressReport(int studentId)
        {
            return _context.Students
                .Include(s => s.School)
                .Include(s => s.SchoolDistrict)
                .Include(s => s.School.SchoolDistrictsSchools)
                .Include(s => s.School.SchoolDistrictsSchools.Select(s => s.SchoolDistrict))
                .FirstOrDefault(s => s.Id == studentId);
        }
    }
}
