using Model;
using Model.Custom;
using Model.DTOs;
using System.Collections.Generic;
using System.Linq;

namespace Service.ActivitySummaries
{
    public interface IActivitySummaryLibrary
    {
        IQueryable<Student> GetPendingReferrals(ActivityReportFilters filter, int entityId);
        int GetPendingReferralsCount(ActivityReportFilters filter, int entityId);

        IQueryable<Student> GetCompletedReferrals(ActivityReportFilters filter, int entityId);
        int GetCompletedReferralsCount(ActivityReportFilters filter, int entityId);

        IQueryable<EncounterStudent> GetReturnedEncounters(ActivityReportFilters filter, int entityId);
        int GetReturnedEncountersCount(ActivityReportFilters filter, int entityId);

        IQueryable<EncounterStudent> GetPendingSupervisorEsign(ActivityReportFilters filter, int entityId);
        int GetPendingSupervisorEsignCount(ActivityReportFilters filter, int entityId);

        IQueryable<StudentTherapiesDto> GetEncountersReadyForYou(ActivityReportFilters filter, int entityId);
        int GetEncountersReadyForYouCount(ActivityReportFilters filter, int entityId);

        IQueryable<EncounterStudent> GetCompletedEncounters(ActivityReportFilters filter, int entityId);
        int GetCompletedEncountersCount(ActivityReportFilters filter, int entityId);
        IQueryable<EncounterStudent> GetPendingEvaluations(ActivityReportFilters filter, int entityId);
        int GetPendingEvaluationsCount(ActivityReportFilters filter, int districtId);
        IQueryable<Student> GetStudentsWithNoAddress(ActivityReportFilters filter, int entityId);
        int GetStudentsWithNoAddressCount(ActivityReportFilters filter, int entityId);
    }
}
