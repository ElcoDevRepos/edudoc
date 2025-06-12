using System.Data.SqlClient;
using System.Data.SqlClient;
using System;
using System.Collections.Generic;
using System.Security.Policy;

namespace Model.DTOs
{
    public class EscReportDataDto
    {
        public string SchoolDistrict { get; set; }
        public string ProviderFirstName { get; set; }
        public string ProviderLastName { get; set; }
        public string ProviderTitle { get; set; }
        public string ServiceArea { get; set; }
        public string EncounterType { get; set; }
        public DateTime EncounterDate { get; set; }
        public TimeSpan EncounterStartTime { get; set; }
        public TimeSpan EncounterEndTime { get; set; }
        public int TotalMinutes { get; set; }
        public string StudentFirstName { get; set; }
        public string StudentLastName { get; set; }
        public DateTime StudentDateOfBirth { get; set; }
        public int StudentId { get; set; }
    }
}
