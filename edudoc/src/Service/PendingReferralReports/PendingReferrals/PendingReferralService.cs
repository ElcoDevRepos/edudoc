using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using Model;
using Model.DTOs;
using Model.Enums;
using Service.ReferralReports;
using Service.Utilities;

namespace Service.PendingReferrals
{
    public class PendingReferralService : BaseService, IPendingReferralService
    {
        private readonly IReferralReportsService _pendingReferralReportService;
        private readonly IPrimaryContext _context;

        public PendingReferralService(IPrimaryContext context, IReferralReportsService pendingReferralReportService) : base(context)
        {
            _pendingReferralReportService = pendingReferralReportService;
            _context = context;
        }

        public PendingReferralReportJobRun GetLastJobRun()
        {
            return Context.PendingReferralReportJobRuns
                        .OrderByDescending(j => j.JobRunDate)
                        .FirstOrDefault();

        }

        public PendingReferralReportJobRun UpdatePendingReferralTable(int jobRunById = 1)
        {
            var pendingReferralReport = GetPendingReferralReportList();

            var jobRun = AddPendingReferralJobRunLog(jobRunById);

            // add pending referrals
            var pendingReferralsToAdd = new List<PendingReferral>();
            foreach (var pendingReferral in pendingReferralReport)
            {
                pendingReferralsToAdd.Add(new PendingReferral()
                {
                    StudentId = pendingReferral.StudentId,
                    StudentFirstName = pendingReferral.StudentFirstName,
                    StudentLastName = pendingReferral.StudentLastName,
                    DistrictId = pendingReferral.DistrictId,
                    DistrictCode = pendingReferral.DistrictCode,
                    ProviderId = pendingReferral.ProviderId,
                    ProviderFirstName = pendingReferral.ProviderFirstName,
                    ProviderLastName = pendingReferral.ProviderLastName,
                    ProviderTitle = pendingReferral.ProviderTitle,
                    ServiceTypeId = pendingReferral.ServiceTypeId,
                    ServiceName = pendingReferral.ServiceType,
                    PendingReferralJobRunId = jobRun.Id
                });
            }

            Context.PendingReferrals.AddRange(pendingReferralsToAdd);
            Context.SaveChanges();

            return jobRun;
        }

        private List<PendingReferralReportDto> GetPendingReferralReportList()
        {
            var currentSchoolYearStart = CommonFunctions.GetCurrentSchoolYearStart();

            var referralList = CommonFunctions.GetServiceCodesWithReferrals();

            var invoicedStatusList = CommonFunctions.GetInvoicedEncounterStatuses();

            // Get students that have an encounter documented within the school year with a provider that requires referral
            return _context.EncounterStudents
                .Where(es =>
                    es.Student.DistrictId.HasValue &&
                    !es.Student.Archived &&
                    es.Student.CaseLoads.Any(c => c.StudentType.IsBillable && !c.Archived) &&
                    es.EncounterDate >= currentSchoolYearStart &&
                    !es.Archived &&
                    !es.Encounter.Provider.Archived &&
                    es.EncounterStatusId != (int)EncounterStatuses.Abandoned &&
                    !invoicedStatusList.Contains(es.EncounterStatusId) &&
                    referralList.Contains(es.Encounter.Provider.ProviderTitle.ServiceCodeId) &&
                    !es.Student.SupervisorProviderStudentReferalSignOffs.Any(r =>
                            r.ServiceCodeId == es.Encounter.Provider.ProviderTitle.ServiceCodeId &&
                            (
                                !r.EffectiveDateTo.HasValue ||
                                r.EffectiveDateTo.Value >= DateTime.Now
                            ) &&
                            r.EffectiveDateFrom.HasValue
                            // SD 03JUL24: Removed associations to ORPApprovalDate
                            //r.Provider.VerifiedOrp &&
                            //r.Provider.OrpApprovalDate != null &&
                            //r.EffectiveDateFrom >= DbFunctions.AddYears(r.Provider.OrpApprovalDate, -1)
                        )
                )
                .GroupBy(es => new {
                    serviceCodeId = es.Encounter.Provider.ProviderTitle.ServiceCodeId,
                    providerId = es.Encounter.ProviderId,
                    studentId = es.Student.Id
                })
                .Select(grp => grp.FirstOrDefault())
                .Select(es => new PendingReferralReportDto
                {
                    StudentId = es.Student.Id,
                    StudentFirstName = es.Student.FirstName,
                    StudentLastName = es.Student.LastName,
                    DistrictId = es.Student.DistrictId ?? 0,
                    DistrictCode = es.Student.SchoolDistrict.Code ?? "",
                    ProviderId = es.Encounter.Provider.Id,
                    ProviderFirstName = es.Encounter.Provider.ProviderUser.FirstName,
                    ProviderLastName = es.Encounter.Provider.ProviderUser.LastName,
                    ProviderTitleId = es.Encounter.Provider.TitleId,
                    ProviderTitle = es.Encounter.Provider.ProviderTitle.Name,
                    ServiceTypeId = es.Encounter.ServiceTypeId,
                    ServiceType = es.Encounter.ServiceType.Name
                })
                .Distinct()
                .AsNoTracking()
                .ToList();
        }

        private PendingReferralReportJobRun AddPendingReferralJobRunLog(int jobRunById = 1)
        {
            var pendingReferralJobRun = new PendingReferralReportJobRun()
            {
                JobRunDate = DateTime.UtcNow,
                JobRunById = jobRunById
            };

            Context.PendingReferralReportJobRuns.Add(pendingReferralJobRun);
            Context.SaveChanges();

            return pendingReferralJobRun;
        }

    }
}
