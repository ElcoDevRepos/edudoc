using System.Data.SqlClient;
using System.Data.SqlClient;
using System;
using System.Collections.Generic;

namespace Model.DTOs
{
    public class IneligibleClaimsSummaryDTO
    {
        public int TotalIneligibleClaims { get; set; }
        public int SpeechTherapy { get; set; }
        public int Psychology { get; set; }
        public int OccupationalTherapy { get; set; }
        public int PhysicalTherapy { get; set; }
        public int Nursing { get; set; }
        public int NonMSPService { get; set; }
        public int Counseling { get; set; }
        public int Audiology { get; set; }
    }
}
