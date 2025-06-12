using Model;
using Model.Custom;
using Model.DTOs;
using Model.Enums;
using Service.Utilities;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Linq.Dynamic.Core;

namespace Service.ActivitySummaries
{
    public class ByServiceAreaLibrary : BaseService, IActivitySummaryLibrary
    {
        private readonly IPrimaryContext _context;
        public ByServiceAreaLibrary(
            IPrimaryContext context
            ) : base(context)
        {
            _context = context;
        }

        #region Pending Referrals
        public IQueryable<Student> GetPendingReferrals(ActivityReportFilters filter, int serviceAreaId)
        {
            var today = DateTime.Now;
            return _context.Students.Where(student => student.School.SchoolDistrictsSchools.Any
                                                                (y => y.SchoolDistrictId == filter.districtId) &&
                                                     !student.SupervisorProviderStudentReferalSignOffs.Any(referral =>
                                                        (!referral.EffectiveDateTo.HasValue || referral.EffectiveDateTo.Value >= today) &&
                                                        referral.EffectiveDateFrom.HasValue &&
                                                        referral.Supervisor.VerifiedOrp && referral.Supervisor.OrpApprovalDate != null &&
                                                        referral.EffectiveDateFrom.Value >= DbFunctions.AddYears(referral.Supervisor.OrpApprovalDate, -1) &&
                                                        referral.ServiceCodeId == serviceAreaId) &&
                                                     student.CaseLoads.Any(c =>
                                                        c.StudentType.IsBillable &&
                                                        !c.Archived &&
                                                        c.ServiceCodeId == serviceAreaId)
                                    ).AsNoTracking();
        }

        public int GetPendingReferralsCount(ActivityReportFilters filter, int serviceAreaId)
        {
            DateTime yearAgo = DateTime.UtcNow.AddYears(-1).Date;
            DateTime today = DateTime.Now;
            var referralList = CommonFunctions.GetServiceCodesWithReferrals();

            var grp = _context.Providers
                .Where(p => p.ProviderTitle.ServiceCodeId == serviceAreaId
                    && p.ProviderEscAssignments.Any(pea =>
                        !pea.Archived && (pea.EndDate == null || pea.EndDate >= today) &&
                        pea.ProviderEscSchoolDistricts.Any(pesd => pesd.SchoolDistrictId == filter.districtId)))
                .Select(p => new
                {
                    ProviderId = p.Id,
                    Total = p.Encounters
                        .SelectMany(e => e.EncounterStudents.Select(es => es.Student).Where(s =>
                            !s.Archived && s.DistrictId == filter.districtId
                            && s.CaseLoads.Any(c => c.StudentType.IsBillable && !c.Archived)
                            && !s.SupervisorProviderStudentReferalSignOffs
                            .Any(r => r.ServiceCodeId == serviceAreaId
                                && (!r.EffectiveDateTo.HasValue || r.EffectiveDateTo.Value >= today)
                                && r.EffectiveDateFrom.HasValue && r.Supervisor.VerifiedOrp && r.Supervisor.OrpApprovalDate != null
                                && r.EffectiveDateFrom >= DbFunctions.AddYears(r.Supervisor.OrpApprovalDate, -1)))).Distinct().Count()
                });

            return grp.Count() > 0 ? grp.Sum(g => g.Total) : 0;
        }
        #endregion

        #region Completed Referrals
        public IQueryable<Student> GetCompletedReferrals(ActivityReportFilters filter, int serviceAreaId)
        {
            var monthBegin = new DateTime(filter.year, filter.month, 01);
            var monthEnd = new DateTime(filter.month < 12 ? filter.year : filter.year + 1, filter.month < 12 ? filter.month + 1 : 1, 01);

            return _context.Students.Where(student => student.DistrictId == filter.districtId &&
                student.SupervisorProviderStudentReferalSignOffs
                            .Any(referral => referral.SignOffDate.HasValue &&
                                referral.SignOffDate.Value >= monthBegin &&
                                referral.SignOffDate.Value < monthEnd &&
                                referral.ServiceCodeId == serviceAreaId)).AsNoTracking();

        }

        public int GetCompletedReferralsCount(ActivityReportFilters filter, int serviceAreaId)
        {
            return GetCompletedReferrals(filter, serviceAreaId).Count();
        }
        #endregion

        #region Returned Encounters
        public IQueryable<EncounterStudent> GetReturnedEncounters(ActivityReportFilters filter, int serviceAreaId)
        {
            return _context.EncounterStudents.Where(es => es.Student.DistrictId == filter.districtId &&
                es.Encounter.Provider.ProviderTitle.ServiceCodeId == serviceAreaId &&
                !es.Archived && !es.Encounter.Archived &&
                es.Encounter.Provider.ProviderEscAssignments.Any(esc =>
                    esc.ProviderEscSchoolDistricts.Any(districts =>
                        districts.SchoolDistrictId == filter.districtId) && !esc.Archived) &&
                (es.EncounterStatusId == (int)EncounterStatuses.Returned_ByAdmin_Encounter ||
                es.EncounterStatusId == (int)EncounterStatuses.Returned_BySupervisor_Encounter)
            ).AsNoTracking();
        }

        public int GetReturnedEncountersCount(ActivityReportFilters filter, int serviceAreaId)
        {
            return GetReturnedEncounters(filter, serviceAreaId).Count();
        }
        #endregion

        #region Pending Supervisor Esign
        public IQueryable<EncounterStudent> GetPendingSupervisorEsign(ActivityReportFilters filter, int serviceAreaId)
        {
            return _context.EncounterStudents.Where(es => es.Student.DistrictId == filter.districtId &&
                !es.Encounter.Archived && !es.Archived &&
                es.Encounter.Provider.ProviderTitle.ServiceCodeId == serviceAreaId &&
                es.Encounter.Provider.ProviderEscAssignments.Any(esc =>
                    esc.ProviderEscSchoolDistricts.Any(districts =>
                        districts.SchoolDistrictId == filter.districtId) &&
                    !esc.Archived) &&
                es.EncounterStatusId == (int)EncounterStatuses.READY_FOR_SUPERVISOR_ESIGN &&
                es.SupervisorESignedById != null && es.SupervisorDateESigned == null).AsNoTracking();
        }

        public int GetPendingSupervisorEsignCount(ActivityReportFilters filter, int serviceAreaId)
        {
            return GetPendingSupervisorEsign(filter, serviceAreaId).Count();
        }
        #endregion

        #region ERFY
        public IQueryable<StudentTherapiesDto> GetEncountersReadyForYou(ActivityReportFilters filter, int serviceAreaId)
        {
            var today = DateTime.UtcNow;
            var therapySchedules = _context.StudentTherapySchedules
                                    .Include(sts => sts.StudentTherapy)
                                    .Include(sts => sts.StudentTherapy.CaseLoad)
                                    .Where(sts => !sts.Archived &&
                                            (sts.StudentTherapy.CaseLoad.Student.DistrictId == filter.districtId ||
                                            sts.StudentTherapy.CaseLoad.Student.School.SchoolDistrictsSchools.Any
                                                                (y => y.SchoolDistrictId == filter.districtId)) &&
                                            sts.StudentTherapy.Provider.ProviderTitle.ServiceCodeId == serviceAreaId &&
                                            sts.StudentTherapy.Provider.ProviderEscAssignments.Any(esc =>
                                                esc.ProviderEscSchoolDistricts.Any(districts =>
                                                    districts.SchoolDistrictId == filter.districtId) &&
                                                !esc.Archived) &&
                                            !sts.EncounterStudents.Any(e => !e.Archived) &&
                                            sts.ScheduleDate <= today)
                                    .OrderByDescending(sts => sts.ScheduleDate)
                                    .GroupBy(s => new
                                    {
                                        date = s.ScheduleDate,
                                        groupId = s.StudentTherapy.TherapyGroupId > 0 ? s.StudentTherapy.TherapyGroupId : -s.Id,
                                        providerId = s.StudentTherapy.ProviderId,
                                    })
                                    .Select(grp => new StudentTherapiesDto
                                    {
                                        GroupId = grp.Key.groupId,
                                    });
            return therapySchedules;
        }
        public IQueryable<StudentTherapiesDto> GetERFY(ActivityReportFilters filter, int serviceAreaId)
        {
            var today = DateTime.UtcNow;
            var therapySchedules = _context.StudentTherapySchedules
                                    .Where(sts => !sts.Archived &&
                                            (sts.StudentTherapy.CaseLoad.Student.DistrictId == filter.districtId ||
                                            sts.StudentTherapy.CaseLoad.Student.School.SchoolDistrictsSchools.Any
                                                                (y => y.SchoolDistrictId == filter.districtId)) &&
                                            sts.StudentTherapy.Provider.ProviderTitle.ServiceCodeId == serviceAreaId &&
                                            sts.StudentTherapy.Provider.ProviderEscAssignments.Any(esc =>
                                                esc.ProviderEscSchoolDistricts.Any(districts =>
                                                    districts.SchoolDistrictId == filter.districtId) &&
                                                !esc.Archived) &&
                                            !sts.EncounterStudents.Any(e => !e.Archived) &&
                                            sts.ScheduleDate <= today)
                                    .AsNoTracking()
                                    .GroupBy(s => new
                                    {
                                        date = s.ScheduleDate,
                                        groupId = s.StudentTherapy.TherapyGroupId > 0 ? s.StudentTherapy.TherapyGroupId : -s.Id,
                                        providerId = s.StudentTherapy.ProviderId,
                                    })
                                    .Select(grp => new StudentTherapiesDto
                                    {
                                        GroupId = grp.Key.groupId,
                                    });
            return therapySchedules;
        }

        public int GetEncountersReadyForYouCount(ActivityReportFilters filter, int serviceAreaId)
        {
            return GetERFY(filter, serviceAreaId).Count();
        }
        #endregion

        #region Completed Encounters
        public IQueryable<EncounterStudent> GetCompletedEncounters(ActivityReportFilters filter, int serviceAreaId)
        {
            var monthBegin = new DateTime(filter.year, filter.month, 01);
            var monthEnd = new DateTime(filter.month < 12 ? filter.year : filter.year + 1, filter.month < 12 ? filter.month + 1 : 1, 01);

            return _context.EncounterStudents
                .Where(es =>
                        es.Student.DistrictId == filter.districtId &&
                        !es.Encounter.Archived && !es.Archived &&
                        es.Encounter.Provider.ProviderTitle.ServiceCodeId == serviceAreaId &&
                        es.Encounter.Provider.ProviderEscAssignments.Any(esc =>
                            esc.ProviderEscSchoolDistricts.Any(districts =>
                                districts.SchoolDistrictId == filter.districtId) &&
                            !esc.Archived) &&
                        es.ESignedById != null &&
                        es.EncounterDate >= monthBegin &&
                        es.EncounterDate < monthEnd
                    ).AsNoTracking();
        }

        public int GetCompletedEncountersCount(ActivityReportFilters filter, int serviceAreaId)
        {
            return GetCompletedEncounters(filter, serviceAreaId).Count();
        }
        #endregion

        #region Pending Evaluations
        public IQueryable<EncounterStudent> GetPendingEvaluations(ActivityReportFilters filter, int serviceAreaId)
        {
            return _context.EncounterStudents
                    .Where(es =>
                            es.Student.DistrictId == filter.districtId &&
                            !es.Encounter.Archived && !es.Archived &&
                            es.Encounter.Provider.ProviderEscAssignments.Any(esc =>
                                esc.ProviderEscSchoolDistricts.Any(districts =>
                                    districts.SchoolDistrictId == filter.districtId) &&
                                !esc.Archived) &&
                            es.Encounter.Provider.ProviderTitle.ServiceCodeId == serviceAreaId &&
                            !es.DateESigned.HasValue &&
                            es.EncounterDate < DateTime.Now &&
                            es.Encounter.ServiceTypeId == (int)ServiceTypes.Evaluation_Assessment
                        ).AsNoTracking();
        }

        public int GetPendingEvaluationsCount(ActivityReportFilters filter, int serviceAreaId)
        {
            return GetPendingEvaluations(filter, serviceAreaId).Count();
        }
        #endregion

        public IQueryable<Student> GetStudentsWithNoAddress(ActivityReportFilters filter, int serviceAreaId)
        {
            return _context.Students.Where(student => student.School.SchoolDistrictsSchools.Any
                                                                (y => y.SchoolDistrictId == filter.districtId) &&
                                                     (student.Address == null && student.AddressId == null)).AsNoTracking();
        }

        public int GetStudentsWithNoAddressCount(ActivityReportFilters filter, int serviceAreaId)
        {
            return GetStudentsWithNoAddress(filter, serviceAreaId).Count();
        }
    }
}
