using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Data.SqlClient;

namespace Model.Custom
{
    public class CompletedActivityData
    {
        public string DistrictName { get; set; }
        public DateTime Date { get; set; }
        public IList<CompletedActivityDistrictServiceAreaData> DistrictData { get; set; }
        public IList<CompletedActivityContractServiceAreaData> ContractData { get; set; }
    }

    public class CompletedActivityDistrictServiceAreaData
    {
        public string ServiceAreaName { get; set; }
        public bool ShouldShowPendingCosign { get; set; }
        public int JulyTotal { get; set; }
        public int AugustTotal { get; set; }
        public int SeptemberTotal { get; set; }
        public int OctoberTotal { get; set; }
        public int NovemberTotal { get; set; }
        public int DecemberTotal { get; set; }
        public int JanuaryTotal { get; set; }
        public int FebruaryTotal { get; set; }
        public int MarchTotal { get; set; }
        public int AprilTotal { get; set; }
        public int MayTotal { get; set; }
        public int JuneTotal { get; set; }
        public int CompleteTotal { get; set; }
        public IList<ServiceAreaDistrictTitleData> TitleData { get; set; }
    }

    public class ServiceAreaDistrictTitleData
    {
        public string ProviderTitleName { get; set; }
        public IList<DistrictLineData> LineData { get; set; }
    }

    public class CompletedActivityContractServiceAreaData
    {
        public string ServiceAreaName { get; set; }
        public bool ShouldShowPendingCosign { get; set; }
        public int JulyTotal { get; set; }
        public int AugustTotal { get; set; }
        public int SeptemberTotal { get; set; }
        public int OctoberTotal { get; set; }
        public int NovemberTotal { get; set; }
        public int DecemberTotal { get; set; }
        public int JanuaryTotal { get; set; }
        public int FebruaryTotal { get; set; }
        public int MarchTotal { get; set; }
        public int AprilTotal { get; set; }
        public int MayTotal { get; set; }
        public int JuneTotal { get; set; }
        public int CompleteTotal { get; set; }
        public IList<ServiceAreaContractTitleData> TitleData { get; set; }
    }

    public class ServiceAreaContractTitleData
    {
        public string ProviderTitleName { get; set; }
        public int TotalCount { get; set; }
        public IList<ContractLineData> LineData { get; set; }
    }

    public class DistrictLineData
    {
        public string ProviderName { get; set; }
        public MonthData July { get; set; }
        public MonthData August { get; set; }
        public MonthData September { get; set; }
        public MonthData October { get; set; }
        public MonthData November { get; set; }
        public MonthData December { get; set; }
        public MonthData January { get; set; }
        public MonthData February { get; set; }
        public MonthData March { get; set; }
        public MonthData April { get; set; }
        public MonthData May { get; set; }
        public MonthData June { get; set; }
        public MonthData Total { get; set; }
    }

    public class ContractLineData
    {
        public string ProviderName { get; set; }
        public string AgencyName { get; set; }
        public MonthData July { get; set; }
        public MonthData August { get; set; }
        public MonthData September { get; set; }
        public MonthData October { get; set; }
        public MonthData November { get; set; }
        public MonthData December { get; set; }
        public MonthData January { get; set; }
        public MonthData February { get; set; }
        public MonthData March { get; set; }
        public MonthData April { get; set; }
        public MonthData May { get; set; }
        public MonthData June { get; set; }
        public MonthData Total { get; set; }
    }

    public class MonthData
    {
        public int TreatmentTherapyCount { get; set; }
        public int EvalCount { get; set; }
        public int PendingCoSignCount { get; set; }
        public int TotalCount { get; set; }
        public string AbsenceReason { get; set; }
    }
}
