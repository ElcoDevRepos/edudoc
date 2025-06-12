using Model;
using Model.DTOs;
using Model.Enums;
using Service.Utilities;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Net;

namespace Service.ReferralReports
{
    public interface IReferralReportsService
    {
        public (IQueryable<PendingReferralReportDto> result, int count) GetPendingReferralReport(Model.Core.CRUDSearchParams csp);
        public (IEnumerable<CompletedReferralReportDto> result, int count, List<int> reportIds) GetCompletedReferralReport(Model.Core.CRUDSearchParams csp);
    }
    public class ReferralReportsService : BaseService, IReferralReportsService
    {
        private readonly IPrimaryContext _context;
        public ReferralReportsService(IPrimaryContext context) : base(context)
        {
            _context = context;
        }

        public (IQueryable<PendingReferralReportDto> result, int count) GetPendingReferralReport(Model.Core.CRUDSearchParams csp)
        {
            var currentSchoolYearStart = CommonFunctions.GetCurrentSchoolYearStart();

            var referralList = CommonFunctions.GetServiceCodesWithReferrals();

            // Get students that have an encounter documented within the school year with a provider that requires referral
            IQueryable<PendingReferralProviderStudentData> grp = _context.Students
                .Where(student =>
                    !student.Archived &&
                    student.CaseLoads.Any(c => c.StudentType.IsBillable && !c.Archived)
                )
                .Select(student => new PendingReferralProviderStudentData
                {
                    PendingReferralsByProvider = student.EncounterStudents
                        .Where(
                            es => es.EncounterDate >= currentSchoolYearStart &&
                            !es.Archived &&
                            !es.Encounter.Provider.Archived &&
                            es.EncounterStatusId != (int)EncounterStatuses.Abandoned &&
                            referralList.Contains(es.Encounter.Provider.ProviderTitle.ServiceCodeId)
                        )
                        .GroupBy(es => new {
                            serviceCodeId = es.Encounter.Provider.ProviderTitle.ServiceCodeId,
                            providerId = es.Encounter.ProviderId
                        }).Select(es => new PendingReferralEncountersByProviderData
                        {
                            ServiceCodeId = es.Key.serviceCodeId,
                            ProviderId = es.Key.providerId,
                            ProviderFirstName = es.FirstOrDefault().Encounter.Provider.ProviderUser.FirstName,
                            ProviderLastName = es.FirstOrDefault().Encounter.Provider.ProviderUser.LastName,
                            ProviderTitleId = es.FirstOrDefault().Encounter.Provider.TitleId,
                            ProviderTitleName = es.FirstOrDefault().Encounter.Provider.ProviderTitle.Name,
                            HasReferral =
                                student.SupervisorProviderStudentReferalSignOffs.Any(r =>
                                    r.ServiceCodeId == es.Key.serviceCodeId &&
                                    (
                                        !r.EffectiveDateTo.HasValue ||
                                        r.EffectiveDateTo.Value >= DateTime.Now
                                    ) &&
                                    r.EffectiveDateFrom.HasValue &&
                                    r.Supervisor.VerifiedOrp &&
                                    r.Supervisor.OrpApprovalDate != null &&
                                    r.EffectiveDateFrom >= DbFunctions.AddYears(r.Supervisor.OrpApprovalDate, -1)
                                ),
                            ServiceTypeId = es.FirstOrDefault().Encounter.ServiceTypeId,
                            ServiceTypeName = es.FirstOrDefault().Encounter.ServiceType.Name,
                            Student = new PendingReferralStudentData
                            {
                                StudentId = student.Id,
                                StudentFirstName = student.FirstName,
                                StudentLastName = student.LastName,
                                DistrictId = student.DistrictId ?? 0,
                                DistrictCode = student.SchoolDistrict.Code ?? "",
                            }
                        })
                }).AsNoTracking();

            IQueryable<PendingReferralReportDto> result = grp
                .Where(g => g.PendingReferralsByProvider.Any(p => !p.HasReferral))
                .SelectMany(s => s.PendingReferralsByProvider)
                .Where(x => !x.HasReferral)
                .Select(g => new PendingReferralReportDto
                {
                    StudentId = g.Student.StudentId,
                    StudentFirstName = g.Student.StudentFirstName,
                    StudentLastName = g.Student.StudentLastName,
                    DistrictId = g.Student.DistrictId,
                    DistrictCode = g.Student.DistrictCode,
                    ProviderId = g.ProviderId,
                    ProviderFirstName = g.ProviderFirstName,
                    ProviderLastName = g.ProviderLastName,
                    ProviderTitleId = g.ProviderTitleId,
                    ProviderTitle = g.ProviderTitleName,
                    ServiceTypeId = g.ServiceTypeId,
                    ServiceType = g.ServiceTypeName,
                }).AsNoTracking();

            if (!CommonFunctions.IsBlankSearch(csp.Query))
            {
                string[] terms = CommonFunctions.SplitTerms(csp.Query.Trim().ToLower());
                foreach (string t in terms)
                {
                    result = result.Where(r =>
                        r.StudentFirstName.ToLower().StartsWith(t) ||
                        r.StudentLastName.ToLower().StartsWith(t) ||
                        r.ProviderFirstName.ToLower().StartsWith(t) ||
                        r.ProviderLastName.ToLower().StartsWith(t));
                }
            }

            if (!string.IsNullOrEmpty(csp.extraparams))
            {
                var extras = System.Web.HttpUtility.ParseQueryString(WebUtility.UrlDecode(csp.extraparams));

                if (extras["districtId"] != null && extras["districtId"] != "0")
                {
                    int districtId = int.Parse(extras["districtId"]);
                    result = result.Where(r => r.DistrictId == districtId);
                }

                if (extras["providerId"] != null && extras["providerId"] != "0")
                {
                    int providerId = int.Parse(extras["providerId"]);
                    result = result.Where(r => r.ProviderId == providerId);
                }

                var providerTitleIdsParamsList = CommonFunctions.GetIntListFromExtraParams(csp.extraparams, "ProviderTitleIds");
                var providerTitleIds = providerTitleIdsParamsList["ProviderTitleIds"];
                if (providerTitleIds.Count > 0)
                    result = result.Where(r => providerTitleIds.Any(p => r.ProviderTitleId == p));

                var studentIdsParamsList = CommonFunctions.GetIntListFromExtraParams(csp.extraparams, "StudentIds");
                var studentIds = studentIdsParamsList["StudentIds"];
                if (studentIds.Count > 0)
                    result = result.Where(r => studentIds.Any(st => r.StudentId == st));
            }

            int count = result.Count();

            return (result, count);
        }
        public (IEnumerable<CompletedReferralReportDto> result, int count, List<int> reportIds) GetCompletedReferralReport(Model.Core.CRUDSearchParams csp)
        {
            var baseQuery = _context.SupervisorProviderStudentReferalSignOffs.Where(r => r.SignOffDate.HasValue).AsQueryable();

            if (!CommonFunctions.IsBlankSearch(csp.Query))
            {
                string[] terms = CommonFunctions.SplitTerms(csp.Query.Trim().ToLower());
                foreach (string t in terms)
                {
                    baseQuery = baseQuery.Where(r =>
                        r.Student.FirstName.ToLower().StartsWith(t) ||
                        r.Student.LastName.ToLower().StartsWith(t) ||
                        r.Supervisor.ProviderUser.FirstName.ToLower().StartsWith(t) ||
                        r.Supervisor.ProviderUser.LastName.ToLower().StartsWith(t));
                }
            }

            if (!string.IsNullOrEmpty(csp.extraparams))
            {
                var extras = System.Web.HttpUtility.ParseQueryString(WebUtility.UrlDecode(csp.extraparams));

                if (extras["districtId"] != null && extras["districtId"] != "0")
                {
                    int districtId = int.Parse(extras["districtId"]);
                    baseQuery = baseQuery.Where(r => r.Student.DistrictId == districtId);
                }

                if (extras["providerId"] != null && extras["providerId"] != "0")
                {
                    int providerId = int.Parse(extras["providerId"]);
                    baseQuery = baseQuery.Where(r => r.Supervisor.Id == providerId);
                }

                var serviceAreaIdsParamsList = CommonFunctions.GetIntListFromExtraParams(csp.extraparams, "ServiceAreaIds");
                var serviceAreaIds = serviceAreaIdsParamsList["ServiceAreaIds"];
                if (serviceAreaIds.Count > 0)
                    baseQuery = baseQuery.Where(r => serviceAreaIds.Any(sa => sa == r.ServiceCodeId));

                var schoolYearIdsParamsList = CommonFunctions.GetIntListFromExtraParams(csp.extraparams, "SchoolYearIds");
                var schoolYearIds = schoolYearIdsParamsList["SchoolYearIds"];
                if (schoolYearIds.Count > 0)
                    baseQuery = baseQuery.Where(r => schoolYearIds.Any(sy => sy.ToString() == r.Student.Grade));

                var studentIdsParamsList = CommonFunctions.GetIntListFromExtraParams(csp.extraparams, "StudentIds");
                var studentIds = studentIdsParamsList["StudentIds"];
                if (studentIds.Count > 0)
                    baseQuery = baseQuery.Where(r => studentIds.Any(st => r.StudentId == st));


                var fiscalYearIdsParamsList = CommonFunctions.GetIntListFromExtraParams(csp.extraparams, "FiscalYearIds");
                var fiscalYearIds = fiscalYearIdsParamsList["FiscalYearIds"];
                if (fiscalYearIds.Count > 0)
                {
                    var ids = FilterByFiscalYear(fiscalYearIds, baseQuery.AsEnumerable());
                    baseQuery = baseQuery.Where(r => ids.Any(p => r.Id == p));
                }
            }

            int count = baseQuery.Count();
            var reportIds = baseQuery.Select(r => r.Id).ToList();

            var finalQuery = baseQuery.Select(r => new CompletedReferralReportDto
            {
                Id = r.Id,
                StudentFirstName = r.Student.FirstName,
                StudentLastName = r.Student.LastName,
                SchoolYear = r.Student.Grade,
                SchoolDistrict = r.Student.SchoolDistrict != null ? r.Student.SchoolDistrict.Name : r.Student.School.SchoolDistrictsSchools.FirstOrDefault().SchoolDistrict.Name,
                ProviderFirstName = r.Supervisor.ProviderUser.FirstName,
                ProviderLastName = r.Supervisor.ProviderUser.LastName,
                ServiceAreaId = r.ServiceCodeId != null ? (int)r.ServiceCodeId : 0,
                ServiceArea = r.ServiceCode.Name ?? null,
                ReferralCompletedDate = (DateTime)r.SignOffDate,
                ReferralEffectiveDateTo = r.EffectiveDateTo,
                ReferralEffectiveDateFrom = r.EffectiveDateFrom,
            });

            var result = finalQuery.OrderByDynamic(csp.order, csp.orderdirection == "desc").Skip(csp.skip.GetValueOrDefault()).Take(csp.take.GetValueOrDefault()).ToList();


            return (result, count, reportIds);
        }

        private List<int> FilterByFiscalYear(List<int> fiscalYears, IEnumerable<SupervisorProviderStudentReferalSignOff> query)
        {
            IEnumerable<SupervisorProviderStudentReferalSignOff> temp = query;
            var result = new List<int>();
            foreach (var fiscalYear in fiscalYears)
            {
                var reports = temp.Where(r =>
                    r.EffectiveDateFrom >= new DateTime(2013 + fiscalYear, 9, 1) && r.EffectiveDateFrom <= new DateTime(2014 + fiscalYear, 3, 31)
                        ||
                    r.EffectiveDateTo >= new DateTime(2013 + fiscalYear, 9, 1) && r.EffectiveDateTo <= new DateTime(2014 + fiscalYear, 3, 31))
                    .Select(r => r.Id);
                result = result.Concat(reports).ToList();
            }
            return result;
        }
    }
}
