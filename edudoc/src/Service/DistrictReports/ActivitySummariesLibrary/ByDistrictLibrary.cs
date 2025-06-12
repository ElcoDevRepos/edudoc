using Model;
using Model.Custom;
using Model.DTOs;
using Model.Enums;
using Service.Utilities;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;

namespace Service.ActivitySummaries
{
    public class ByDistrictLibrary : BaseService, IActivitySummaryLibrary
    {
        private readonly IPrimaryContext _context;
        public ByDistrictLibrary(
            IPrimaryContext context
            ) : base(context)
        {
            _context = context;
        }

        #region Pending Referrals
        public IQueryable<Student> GetPendingReferrals(ActivityReportFilters filter, int districtId)
        {
            DateTime today = DateTime.Now;
            return _context.Students.Where(s => s.DistrictId == districtId &&
                    !s.SupervisorProviderStudentReferalSignOffs.Any(referral =>
                        (!referral.EffectiveDateTo.HasValue || referral.EffectiveDateTo.Value >= today) &&
                        referral.EffectiveDateFrom.HasValue &&
                        referral.Supervisor.VerifiedOrp && referral.Supervisor.OrpApprovalDate != null &&
                        referral.EffectiveDateFrom.Value >= DbFunctions.AddYears(referral.Supervisor.OrpApprovalDate, -1)) &&
                    s.CaseLoads.Any(c => c.StudentType.IsBillable && !c.Archived)).AsNoTracking();
        }
        public int GetPendingReferralsCount(ActivityReportFilters filter, int districtId)
        {
            DateTime yearAgo = DateTime.UtcNow.AddYears(-1).Date;
            DateTime today = DateTime.Now;
            var referralList = CommonFunctions.GetServiceCodesWithReferrals();

            var grp = _context.Providers
                .Where(p => referralList.Contains(p.ProviderTitle.ServiceCodeId)
                    && p.ProviderEscAssignments.Any(pea =>
                        !pea.Archived && (pea.EndDate == null || pea.EndDate >= today) &&
                        pea.ProviderEscSchoolDistricts.Any(pesd => pesd.SchoolDistrictId == districtId)))
                .Select(p => new
                {
                    ProviderId = p.Id,
                    Total = p.Encounters
                        .SelectMany(e => e.EncounterStudents.Select(es => es.Student).Where(s =>
                            !s.Archived && s.DistrictId == districtId
                            && s.CaseLoads.Any(c => c.StudentType.IsBillable && !c.Archived)
                            && !s.SupervisorProviderStudentReferalSignOffs
                            .Any(r => r.ServiceCodeId == p.ProviderTitle.ServiceCodeId
                                && (!r.EffectiveDateTo.HasValue || r.EffectiveDateTo.Value >= today)
                                && r.EffectiveDateFrom.HasValue && r.Supervisor.VerifiedOrp && r.Supervisor.OrpApprovalDate != null
                                && r.EffectiveDateFrom >= DbFunctions.AddYears(r.Supervisor.OrpApprovalDate, -1)))).Distinct().Count()
                });

            return grp.Count() > 0 ? grp.Sum(g => g.Total) : 0;
        }
        #endregion

        #region Completed Referrals
        public IQueryable<Student> GetCompletedReferrals(ActivityReportFilters filter, int districtId)
        {
            var monthBegin = new DateTime(filter.year, filter.month, 01);
            var monthEnd = new DateTime(filter.month < 12 ? filter.year : filter.year + 1, filter.month < 12 ? filter.month + 1 : 1, 01);

            return _context.Students.Where(student => student.DistrictId == districtId &&
                student.SupervisorProviderStudentReferalSignOffs
                    .Any(referral => referral.SignOffDate.HasValue
                        && referral.SignOffDate.Value >= monthBegin
                        && referral.SignOffDate.Value < monthEnd)).AsNoTracking();

        }
        public int GetCompletedReferralsCount(ActivityReportFilters filter, int districtId)
        {
            return GetCompletedReferrals(filter, districtId).Count();
        }
        #endregion

        #region Returned Encounters
        public IQueryable<EncounterStudent> GetReturnedEncounters(ActivityReportFilters filter, int districtId)
        {
            var today = DateTime.Now;
            return _context.EncounterStudents.Where(es =>
                es.Encounter.Provider.ProviderTitle.ServiceCodeId != (int)ServiceCodes.Non_Msp_Service &&
                es.Student.DistrictId == districtId &&
                !es.Archived &&
                !es.Encounter.Archived &&
                es.Encounter.Provider.ProviderEscAssignments.Any(pea =>
                    !pea.Archived &&
                    pea.ProviderEscSchoolDistricts.Any(pesd => pesd.SchoolDistrictId == districtId)
                ) &&
                (es.EncounterStatusId == (int)EncounterStatuses.Returned_ByAdmin_Encounter ||
                es.EncounterStatusId == (int)EncounterStatuses.Returned_BySupervisor_Encounter)
            ).AsNoTracking();
        }
        public int GetReturnedEncountersCount(ActivityReportFilters filter, int districtId)
        {
            return GetReturnedEncounters(filter, districtId).Count();
        }
        #endregion

        #region Pending Supervisor Esign
        public IQueryable<EncounterStudent> GetPendingSupervisorEsign(ActivityReportFilters filter, int districtId)
        {
            var today = DateTime.Now;
            return _context.EncounterStudents.Where(es =>
                es.Student.DistrictId == districtId &&
                !es.Archived
                && es.Encounter.Provider.ProviderEscAssignments.Any(pea =>
                    !pea.Archived &&
                    pea.ProviderEscSchoolDistricts.Any(pesd => pesd.SchoolDistrictId == districtId)) &&
                es.SupervisorESignedById != null &&
                es.SupervisorDateESigned == null &&
                es.EncounterStatusId == (int)EncounterStatuses.READY_FOR_SUPERVISOR_ESIGN &&
                !es.Encounter.Archived
            ).AsNoTracking();
        }
        public int GetPendingSupervisorEsignCount(ActivityReportFilters filter, int districtId)
        {
            return GetPendingSupervisorEsign(filter, districtId).Count();
        }
        #endregion


        public IQueryable<StudentTherapiesDto> GetEncountersReadyForYou(ActivityReportFilters filter, int districtId)
        {
            return null;
        }

        public int GetEncountersReadyForYouCount(ActivityReportFilters filter, int districtId)
        {
            return 0;
        }

        #region CompletedEncounters
        public IQueryable<EncounterStudent> GetCompletedEncounters(ActivityReportFilters filter, int districtId)
        {
            var monthBegin = new DateTime(filter.year, filter.month, 01);
            var monthEnd = new DateTime(filter.month < 12 ? filter.year : filter.year + 1, filter.month < 12 ? filter.month + 1 : 1, 01);
            var today = DateTime.Now;
            return _context.EncounterStudents
                .Where(es =>
                    es.Student.DistrictId == districtId &&
                    !es.Archived
                    && es.Encounter.Provider.ProviderEscAssignments.Any(pea =>
                        !pea.Archived && (pea.EndDate == null || pea.EndDate >= today) &&
                        pea.ProviderEscSchoolDistricts.Any(pesd => pesd.SchoolDistrictId == districtId)) &&
                    es.ESignedById != null && es.EncounterDate >= monthBegin && es.EncounterDate < monthEnd
                    && !es.Encounter.Archived
                ).AsNoTracking();
        }
        public int GetCompletedEncountersCount(ActivityReportFilters filter, int districtId)
        {
            return GetCompletedEncounters(filter, districtId).Count();
        }
        #endregion

        #region Pending Evaluations
        public IQueryable<EncounterStudent> GetPendingEvaluations(ActivityReportFilters filter, int districtId)
        {
            var today = DateTime.Now;
            return _context.EncounterStudents
                .Where(es =>
                    es.Student.DistrictId == districtId &&
                    !es.Archived
                    && es.Encounter.Provider.ProviderEscAssignments.Any(pea =>
                        !pea.Archived && (pea.EndDate == null || pea.EndDate >= today) &&
                        pea.ProviderEscSchoolDistricts.Any(pesd => pesd.SchoolDistrictId == districtId)) &&
                    !es.DateESigned.HasValue && es.EncounterDate < today &&
                    es.Encounter.ServiceTypeId == (int)ServiceTypes.Evaluation_Assessment &&
                    !es.Encounter.Archived
                ).AsNoTracking();
        }
        public int GetPendingEvaluationsCount(ActivityReportFilters filter, int districtId)
        {
            return GetPendingEvaluations(filter, districtId).Count();
        }
        #endregion

        public IQueryable<Student> GetStudentsWithNoAddress(ActivityReportFilters filter, int districtId)
        {
            return _context.Students.Where(student => student.School.SchoolDistrictsSchools.Any
                                                                (y => y.SchoolDistrictId == districtId) &&
                                                     (student.Address == null || student.AddressId == null)).AsNoTracking();
        }

        public int GetStudentsWithNoAddressCount(ActivityReportFilters filter, int entityId)
        {
           return GetStudentsWithNoAddress(filter, entityId).Count();
        }
    }
}
