using System.Data.SqlClient;
using System.Data.SqlClient;

using System;
using System.Collections.Generic;
using Model.DTOs;

namespace Model.Custom
{

    public class EncounterDistrictData<TLineData>
    {
        public string DistrictName { get; set; }
        public IList<EncounterGroupData<TLineData>> GroupData { get; set; }
    }

    public class EncounterGroupData<TLineData>
    {
        public string ProviderName { get; set; }
        public string StudentInfo { get; set; }
        public string IEPStartDate { get; set; }
        public int TotalMinutes { get; set; }
        public IList<TLineData> LineData { get; set; }
    }

    public class BasicEncounterLineData
    {
        public string Kind {get;set;} = "basic";
        public string EncounterNumber { get; set; }
        public string Status { get; set; }
        public int Grouping { get; set; }
        public int AdditionalStudents { get; set; }
        public string EncounterDate { get; set; }
        public string ServiceType { get; set; }
        public string StartTime { get; set; }
        public string EndTime { get; set; }
        public int TotalMinutes { get; set; }
        public bool IsTelehealth { get; set; }

    }

    public class DetailedEncounterLineData : BasicEncounterLineData
    {
        public new string Kind {get;set;} = "detailed";
        public string ReasonForService { get; set; }
        public string ReasonForDeviation { get; set; }
        public List<Method> Methods { get; set; }
        public List<Goal> Goals { get; set; }
        public List<CptCodeWithMinutesDto> ProcedureCodes { get; set; }
        public string Notes { get; set; }
        public string EntryDate { get; set; }

    }
}
