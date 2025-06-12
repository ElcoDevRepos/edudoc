using System.Data.SqlClient;
using System.Data.SqlClient;
using System;
using System.Collections.Generic;
using System.Text;

namespace Model.DTOs
{
    public class EncounterOverlapDto
    {
        public DateTime EncounterDate { get; set; }
        public TimeSpan EncounterStartTime { get; set; }
        public TimeSpan EncounterEndTime { get; set; }
        public int StudentId { get; set; }
        public int EncounterId { get; set; }
        public int TimeZoneOffsetMinutes { get; set; }
    }
}
