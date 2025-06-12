using System.Data.SqlClient;
using System.Data.SqlClient;

using System;

namespace Model.DTOs
{
    public class ClaimsSummaryDTO
    {
        public int SchoolDistrictAdminId { get; set; }
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
