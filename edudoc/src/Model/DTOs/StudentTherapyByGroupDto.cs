using System.Data.SqlClient;
using System.Data.SqlClient;
using System;
using System.Collections.Generic;

namespace Model.DTOs
{
    public class StudentTherapyByGroupDto
    {
        public int TherapyGroupId { get; set; }
        public DateTime ScheduleDate { get; set; }
        public StudentTherapyProviderData Provider { get; set; }
        public IEnumerable<StudentTherapySchedulesData> Schedules { get; set; }
    }

    public class StudentTherapyProviderData
    {
        public int ProviderId { get; set; }
        public int ProviderTitleId { get; set; }
        public string ProviderTitleName { get; set; }
        public int ServiceCodeId { get; set; }
    }

    public class StudentTherapySchedulesData
    {
        public int StudentTherapyScheduleId { get; set; }
        public int StudentTherapyId { get; set; }
        public int StudentId { get; set; }
        public int DistrictId { get; set; }
        public int CaseloadId { get; set; }
        public int EncounterLocationId { get; set; }
        public DateTime ScheduleDate { get; set; }
        public TimeSpan StartTime { get; set; }
        public TimeSpan EndTime { get; set; }
        public IEnumerable<CaseLoadCptCode> CptCodes { get; set; }
        public IEnumerable<CaseLoadMethod> Methods { get; set; }
    }

    public class TherapyScheduleSignedEncounterDto
    {
        public int StudentId { get; set; }
        public int ProviderId { get; set; }
        public TimeSpan StartTime { get; set; }
        public TimeSpan EndTime { get; set; }
    }
}
