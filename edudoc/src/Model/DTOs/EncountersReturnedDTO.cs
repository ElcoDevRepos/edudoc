using System.Data.SqlClient;
using System.Data.SqlClient;
using System;

namespace Model.DTOs
{
    public class EncountersReturnedDTO
    {
        public int Id { get; set; }
        public string EncounterNumber { get; set; }
        public DateTime EndTime { get; set; }
        public string ServiceType { get; set; }
        public string SessionName { get; set; }
        public DateTime StartTime { get; set; }
        public string Student { get; set; }
    }
}
