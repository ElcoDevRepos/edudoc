using System.Data.SqlClient;
using System.Data.SqlClient;
using System.Collections;
using System.Collections.Generic;

namespace Model.DTOs
{
    public class DistrictSummaryDTO
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public int OpenPendingReferrals { get; set; }
        public int CompletedPendingReferrals { get; set; }
        public int OpenReturnedEncounters { get; set; }
        public int OpenEncountersReadyForFinalESign { get; set; }
        public int OpenScheduledEncounters { get; set; }
        public int CompletedEncounters { get; set; }
        public int PendingEvaluations { get; set; }
        public string ProviderTitle { get; set; }

    }
}
