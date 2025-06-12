using System.Data.SqlClient;
using System.Data.SqlClient;
using System.Collections.Generic;

namespace Model.DTOs
{
    public class DistrictSummaryResponseDTO
    {
        public IEnumerable<DistrictSummaryDTO> Summaries { get; set; }
        public int Total { get; set; }
    }

    public class DistrictSummaryTotalsResponseDTO
    {
        public int TotalPendingReferrals { get; set; }
        public int TotalReturnedEncounters { get; set; }
        public int TotalEncountersReadyForFinalESign { get; set; }
        public int TotalScheduledEncounters { get; set; }
        public int TotalPendingEvaluations { get; set; }
        public int TotalMissingAddresses { get; set; }
        public IEnumerable<Student> StudentMissingAddresses { get; set; }
    }
}
