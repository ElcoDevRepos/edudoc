using System.Data.SqlClient;
using System.Data.SqlClient;
using System;
using System.Collections.Generic;

namespace Model.DTOs
{
    public class EncounterForCalendarDto
    {
        public int EncounterId { get; set; }
        public bool IsEsigned { get; set; }
        public bool IsDeviated { get; set; }
        public bool IsSchedule { get; set; }
        public bool IsGroup { get; set; }
        public bool IsFuture { get; set; }
        public DateTime EncounterDate { get; set; }
        public DateTime StartTime { get; set; }
        public DateTime EndTime { get; set; }
        public DateTime DateESigned { get; set; }
        public IEnumerable<string> Students { get; set; }
        public int StudentTherapyScheduleId { get; set; }
        public int TherapyGroupId { get; set; }
        public string SessionName { get; set; }
        public int EncounterServiceTypeId { get; set; }
        public int EncounterStatusId { get; set; }
    }
}
