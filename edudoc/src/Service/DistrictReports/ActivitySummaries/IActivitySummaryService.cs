using Model;
using Model.DTOs;
using System.Collections.Generic;

namespace Service.ActivitySummaries
{
    public interface IActivitySummaryService
    {
        DistrictSummaryResponseDTO SearchForActivitySummaries(Model.Core.CRUDSearchParams csp);
        DistrictSummaryTotalsResponseDTO SearchForActivitySummariesTotals(Model.Core.CRUDSearchParams csp);
        (IEnumerable<ReadyForFinalESignDTO> summaries, int count) GetReadyForFinalESignActivitySummaries(Model.Core.CRUDSearchParams csp);
        (IEnumerable<ReadyForSchedulingDTO> summaries, int count) GetReadyForSchedulingActivitySummaries(Model.Core.CRUDSearchParams csp);
        (IEnumerable<EncountersReturnedDTO> summaries, int count) GetEncountersReturnedActivitySummaries(Model.Core.CRUDSearchParams csp);
        (IEnumerable<ReferralsPendingDTO> summaries, int count) GetReferralsPendingActivitySummaries(Model.Core.CRUDSearchParams csp);
        int UpdateActivitySummaryTables();
        ActivitySummary GetMostRecentSummary();
        ActivitySummaryDistrict GetActivitySummaryDistrictByDistrictId(int districtId);
    }
}
