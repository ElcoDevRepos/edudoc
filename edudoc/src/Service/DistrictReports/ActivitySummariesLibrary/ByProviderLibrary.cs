using DocumentFormat.OpenXml.Spreadsheet;
using Model;
using Model.Custom;
using Model.DTOs;
using Model.Enums;
using Service.Utilities;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Data.Entity.Core.Objects;
using System.Linq;

namespace Service.ActivitySummaries
{
    public class ByProviderLibrary : BaseService, IActivitySummaryLibrary
    {
        private readonly IPrimaryContext _context;
        public ByProviderLibrary(
            IPrimaryContext context
            ) : base(context)
        {
            _context = context;
        }

        #region Pending Referrals
        public IQueryable<Student> GetPendingReferrals(ActivityReportFilters filter, int providerId)
        {
            DateTime yearAgo = DateTime.UtcNow.AddYears(-1).Date;
            DateTime today = DateTime.Now;
            var referralList = CommonFunctions.GetServiceCodesWithReferrals();
            int serviceCodeId = filter.serviceAreaId != 0 ? filter.serviceAreaId
                : _context.Providers.Include(p => p.ProviderTitle).FirstOrDefault(p => p.Id == providerId).ProviderTitle.ServiceCodeId;

            var grp = filter.studentId == 0 ?
                _context.Students.Where(s => !s.Archived && s.DistrictId == filter.districtId
                    && s.CaseLoads.Any(c => c.StudentType.IsBillable && !c.Archived)
                    && s.EncounterStudents.Any(es => es.Encounter.ProviderId == providerId
                        && es.EncounterDate > yearAgo && !es.Archived))
                .Select(s => new
                {
                    Student = s,
                    HasReferrals = s.SupervisorProviderStudentReferalSignOffs
                        .Any(r => r.ServiceCodeId == serviceCodeId
                            && (!r.EffectiveDateTo.HasValue || r.EffectiveDateTo.Value >= today)
                            && r.EffectiveDateFrom.HasValue && r.Supervisor.VerifiedOrp && r.Supervisor.OrpApprovalDate != null
                            && r.EffectiveDateFrom >= DbFunctions.AddYears(r.Supervisor.OrpApprovalDate, -1)) 
                }).AsNoTracking()
                :
                _context.Students
                .Where(s => s.Id == filter.studentId)
                .Select(s => new
                {
                    Student = s,
                    HasReferrals = s.EncounterStudents.Any(es => es.Encounter.Provider.ProviderTitle.ServiceCodeId == serviceCodeId
                        && es.Encounter.ProviderId == providerId && es.EncounterDate > yearAgo && !es.Archived) ?
                        s.SupervisorProviderStudentReferalSignOffs
                            .Any(r => r.ServiceCodeId == serviceCodeId
                                && (!r.EffectiveDateTo.HasValue || r.EffectiveDateTo.Value >= today)
                                && r.EffectiveDateFrom.HasValue && r.Supervisor.VerifiedOrp && r.Supervisor.OrpApprovalDate != null
                                && r.EffectiveDateFrom >= DbFunctions.AddYears(r.Supervisor.OrpApprovalDate, -1)) : true
                }).AsNoTracking();
            return grp.Where(grp => !grp.HasReferrals).Select(grp => grp.Student);
        }

        public int GetPendingReferralsCount(ActivityReportFilters filter, int providerId)
        {
            return GetPendingReferrals(filter, providerId).Count();
        }
        #endregion


        public IQueryable<Student> GetCompletedReferrals(ActivityReportFilters filter, int providerId)
        {
            DateTime schoolYearStart = CommonFunctions.GetCurrentSchoolYearStart();
            return _context.Students.Where(student => student.DistrictId == filter.districtId &&
                student.SupervisorProviderStudentReferalSignOffs
                    .Any(referral => referral.SignOffDate.HasValue &&
                    (filter.startDate != null ? referral.SignOffDate.Value >= filter.startDate
                        : referral.SignOffDate.Value >= schoolYearStart) &&
                    (filter.endDate != null ? referral.SignOffDate < filter.endDate : true) &&
                        referral.SupervisorId == providerId)
                    ).AsNoTracking();
        }

        public int GetCompletedReferralsCount(ActivityReportFilters filter, int providerId)
        {
            return GetCompletedReferrals(filter, providerId).Count();
        }

        public IQueryable<EncounterStudent> GetReturnedEncounters(ActivityReportFilters filter, int providerId)
        {
            return _context.EncounterStudents.Where(es =>
                (filter.studentId == 0 || es.StudentId == filter.studentId) &&
                (es.Encounter.ServiceTypeId == filter.serviceTypeId || filter.serviceTypeId == 0) &&
                (filter.startDate == null || DbFunctions.TruncateTime(es.EncounterDate) >= DbFunctions.TruncateTime(filter.startDate)) &&
                (filter.endDate == null || DbFunctions.TruncateTime(es.EncounterDate) <= DbFunctions.TruncateTime(filter.endDate)) &&
                es.Student.DistrictId == filter.districtId &&
                es.Encounter.ProviderId == providerId &&
                !es.Encounter.Archived &&
                (es.EncounterStatusId == (int)EncounterStatuses.Returned_ByAdmin_Encounter ||
                es.EncounterStatusId == (int)EncounterStatuses.Returned_BySupervisor_Encounter) &&
                !es.Archived
            ).AsNoTracking();
        }

        public int GetReturnedEncountersCount(ActivityReportFilters filter, int providerId)
        {
            return GetReturnedEncounters(filter, providerId).Count();
        }

        public IQueryable<EncounterStudent> GetPendingSupervisorEsign(ActivityReportFilters filter, int providerId)
        {
            return _context.EncounterStudents.Where(es =>
                (filter.studentId == 0 || es.StudentId == filter.studentId) &&
                (es.Encounter.ServiceTypeId == filter.serviceTypeId || filter.serviceTypeId == 0) &&
                es.EncounterStatusId == (int)EncounterStatuses.READY_FOR_SUPERVISOR_ESIGN &&
                (filter.startDate == null || DbFunctions.TruncateTime(es.EncounterDate) >= DbFunctions.TruncateTime(filter.startDate)) &&
                (filter.endDate == null || DbFunctions.TruncateTime(es.EncounterDate) <= DbFunctions.TruncateTime(filter.endDate)) &&
                es.Student.DistrictId == filter.districtId &&
                es.SupervisorESignedBy.Providers_ProviderUserId.FirstOrDefault().Id == providerId &&
                es.SupervisorESignedById != null &&
                es.SupervisorDateESigned == null &&
                !es.Encounter.Archived &&
                !es.Archived
            ).AsNoTracking();
        }

        public int GetPendingSupervisorEsignCount(ActivityReportFilters filter, int providerId)
        {
            return GetPendingSupervisorEsign(filter, providerId).Count();
        }

        public IQueryable<StudentTherapiesDto> GetEncountersReadyForYou(ActivityReportFilters filter, int providerId)
        {
            var today = DateTime.Today;
            var startTime = today;
            var endTime = today.AddDays(1); // Assuming you want the end time to be the next day

            var groupTherapiesDto = _context.StudentTherapySchedules
                .Include(sts => sts.StudentTherapy.CaseLoad.Student)
                .Include(sts => sts.StudentTherapy.Provider)
                .Include(sts => sts.StudentTherapy.EncounterLocation)
                .Where(sts => !sts.Archived &&
                    (filter.studentId == 0 || sts.StudentTherapy.CaseLoad.StudentId == filter.studentId) &&
                    (!filter.startDate.HasValue || DbFunctions.TruncateTime(sts.ScheduleDate) >= DbFunctions.TruncateTime(filter.startDate.Value)) &&
                    (!filter.endDate.HasValue || DbFunctions.TruncateTime(sts.ScheduleDate) <= DbFunctions.TruncateTime(filter.endDate.Value)) &&
                    sts.StudentTherapy.CaseLoad.Student.DistrictId == filter.districtId &&
                    sts.StudentTherapy.ProviderId == providerId &&
                    !sts.EncounterStudents.Any(e => !e.Archived) &&
                    sts.ScheduleDate >= startTime && sts.ScheduleDate < endTime) // Filtering based on start and end times
                .OrderByDescending(sts => sts.ScheduleDate)
                .AsNoTracking()
                .ToList() // Materialize the query to prevent issues with LINQ to Entities
                .GroupBy(s => new
                {
                    Date = s.ScheduleDate.GetValueOrDefault().Date,
                    GroupId = s.StudentTherapy.TherapyGroupId ?? -s.Id,
                    Therapy = s.StudentTherapy // Retain StudentTherapy
                })
                .Select(grp => new StudentTherapiesDto
                {
                    Id = grp.FirstOrDefault().Id,
                    StartTime = DateTime.Today + (grp.Min(therapy => therapy.ScheduleStartTime) ?? TimeSpan.Zero),
                    EndTime = DateTime.Today + (grp.Max(therapy => therapy.ScheduleEndTime) ?? TimeSpan.Zero),
                    Name = GetName(grp.Key.Therapy as IEnumerable<StudentTherapy>),
                    Location = new List<string> { GetLocations(grp.Key.Therapy as IEnumerable<StudentTherapy>) },
                    Students = new List<string> { GetStudents(grp.Key.Therapy as IEnumerable<StudentTherapy>) },
                    TherapySchedules = grp.ToList(), // Retain all therapy schedules in the group
                    GroupId = grp.Key.GroupId,
                })
                .AsQueryable();

            return groupTherapiesDto;
        }

        // Helper methods
        private string GetName(IEnumerable<StudentTherapy> therapies)
        {
            if (therapies == null)
                return "N/A";

            var therapyNames = new List<string>();
            foreach (var therapy in therapies)
            {
                var name = therapy?.TherapyGroup?.Name;
                if (!string.IsNullOrEmpty(name))
                    therapyNames.Add(name);
            }
            return therapyNames.Any() ? string.Join(", ", therapyNames) : "N/A";
        }

        private string GetLocations(IEnumerable<StudentTherapy> therapies)
        {
            if (therapies == null)
                return "N/A";

            var locationNames = new HashSet<string>();
            foreach (var therapy in therapies)
            {
                var location = therapy?.EncounterLocation?.Name;
                if (!string.IsNullOrEmpty(location))
                    locationNames.Add(location);
            }
            return locationNames.Any() ? string.Join(", ", locationNames) : "N/A";
        }

        private string GetStudents(IEnumerable<StudentTherapy> therapies)
        {
            if (therapies == null)
                return "N/A";

            var studentNames = new List<string>();
            foreach (var therapy in therapies)
            {
                var studentName = $"{therapy?.CaseLoad?.Student?.LastName}, {therapy?.CaseLoad?.Student?.FirstName}";
                if (!string.IsNullOrEmpty(studentName))
                    studentNames.Add(studentName);
            }
            return studentNames.Any() ? string.Join(", ", studentNames) : "N/A";
        }

        public int GetEncountersReadyForYouCount(ActivityReportFilters filter, int providerId)
        {
            var therapySchedules = GetEncountersReadyForYou(filter, providerId).ToList(); // Materialize the query
            return therapySchedules.Count();
        }

        public IQueryable<EncounterStudent> GetCompletedEncounters(ActivityReportFilters filter, int providerId)
        {
            DateTime schoolYearStart = CommonFunctions.GetCurrentSchoolYearStart();
            return _context.EncounterStudents.Where(es =>
                (filter.studentId == 0 || es.StudentId == filter.studentId) &&
                (es.Encounter.ServiceTypeId == filter.serviceTypeId || filter.serviceTypeId == 0) &&
                es.Student.DistrictId == filter.districtId &&
                es.Encounter.ProviderId == providerId &&
                es.ESignedById != null &&
                (filter.startDate != null ? es.EncounterDate >= filter.startDate
                        : es.EncounterDate >= schoolYearStart) &&
                (filter.endDate != null ? es.EncounterDate < filter.endDate : true) &&
                !es.Encounter.Archived &&
                !es.Archived
            ).AsNoTracking();
        }

        public int GetCompletedEncountersCount(ActivityReportFilters filter, int providerId)
        {
            return GetCompletedEncounters(filter, providerId).Count();
        }

        public IQueryable<EncounterStudent> GetPendingEvaluations(ActivityReportFilters filter, int providerId)
        {
            return _context.EncounterStudents
                .Where(es =>
                        es.Student.DistrictId == filter.districtId &&
                        es.Encounter.Provider.ProviderEscAssignments.Any(esc =>
                            esc.ProviderEscSchoolDistricts.Any(districts =>
                                districts.SchoolDistrictId == filter.districtId) &&
                            !esc.Archived) &&
                        es.Encounter.Provider.ProviderTitle.ServiceCodeId == filter.serviceAreaId &&
                        es.Encounter.ProviderId == providerId &&
                        !es.DateESigned.HasValue &&
                        es.EncounterDate < DateTime.Now &&
                        es.Encounter.ServiceTypeId == (int)ServiceTypes.Evaluation_Assessment &&
                        !es.Encounter.Archived &&
                        !es.Archived
                    ).AsNoTracking();
        }

        public int GetPendingEvaluationsCount(ActivityReportFilters filter, int providerId)
        {
            return GetPendingEvaluations(filter, providerId).Count();
        }

        public IQueryable<Student> GetStudentsWithNoAddress(ActivityReportFilters filter, int providerId)
        {
            return _context.Students.Where(student => (student.Id == filter.studentId || filter.studentId == 0) &&
                                                        (
                                                            student.SchoolDistrict.ProviderEscSchoolDistricts.Any(y => y.ProviderEscAssignment.ProviderId == providerId
                                                                && (y.ProviderEscAssignment.EndDate == null || y.ProviderEscAssignment.EndDate >= DateTime.Now)
                                                                && y.SchoolDistrictId == filter.districtId
                                                            ) ||
                                                            (
                                                                student.ProviderStudentSupervisors.Any(z => z.SupervisorId == providerId && z.EffectiveEndDate == null) &&
                                                                student.School.SchoolDistrictsSchools.Any(sds => sds.SchoolDistrictId == filter.districtId)
                                                            )
                                                        ) &&
                                                        (student.Address == null && student.AddressId == null) &&
                                                        student.ProviderStudents.Any(ps => ps.ProviderId == providerId)).AsNoTracking();
        }

        public int GetStudentsWithNoAddressCount(ActivityReportFilters filter, int entityId)
        {
            return GetStudentsWithNoAddress(filter, entityId).Count();
        }
    }
}
