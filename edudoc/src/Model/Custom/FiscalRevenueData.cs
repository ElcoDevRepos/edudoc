using System.Data.SqlClient;
using System.Data.SqlClient;

using System.Collections.Generic;

namespace Model.Custom
{
    public class FiscalRevenueData
    {
        public string DistrictName { get; set; }
        public string FiscalYear { get; set; }
        public string PreviousYear { get; set; }
        public string TwoYearsPrior { get; set; }
        public string CurrentYearReimbursement { get; set; }
        public string DirectServices { get; set; }
        public string MSPSettlements { get; set; }
        public IList<FiscalRevenueServiceCodeData> FiscalRevenuePerServiceCodeData { get; set; }
        public FiscalRevenueServiceCodeData FiscalRevenuePerYearDataTotals { get; set; }
        public IList<FiscalRevenueHistoricalData> HistoricalComparisonData { get; set; }
        public FiscalRevenueHistoricalData HistoricalComparisonDataTotals { get; set; }
        public IList<IFiscalRevenueAnnualEntriesData> AnnualEntriesData { get; set; }
        public IFiscalRevenueAnnualEntriesData AnnualEntriesDataTotals { get; set; }
    }

    public class FiscalRevenueServiceCodeData
    {
        public int ServiceCodeId { get; set; }
        public string ServiceCodeName { get; set; }
        public string Total { get; set; }
        public string SelectedYearTotal { get; set; }
        public string PriorYearTotal { get; set; }
    }

    public class FiscalRevenueHistoricalData
    {
        public int ServiceCodeId { get; set; }
        public string ServiceCodeName { get; set; }
        public string CurrentYearTotal { get; set; }
        public string PreviousYearTotal { get; set; }
        public string TwoYearsPriorTotal { get; set; }
    }

    public class IFiscalRevenueAnnualEntriesData
    {
        public int Year { get; set; }
        public string Status { get; set; }
        public string AllowableCosts { get; set; }
        public string InterimPayments { get; set; }
        public string SettlementAmount { get; set; }
    }
}
