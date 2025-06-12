using System.Data.SqlClient;
using System.Data.SqlClient;

using System.Collections.Generic;

namespace Model.Custom
{
    public class FiscalSummaryData
    {
        public string DistrictName { get; set; }
        public string FiscalYear { get; set; }
        public string PrevYear { get; set; }
        public string TwoYearsPrior { get; set ;}
        public IList<FiscalSummaryReimbursementReasonData> ReimbursementReasonData { get; set; }
        public FiscalSummaryReimbursementReasonData ReimbursementReasonDataTotals { get; set; }
        public string LessAverageApplicableFFP { get; set; }
        public IList<FiscalSummaryServiceCodeData> ServiceCodeData { get; set; }
        public int HistoricalComparisonCurrentYearTotal { get; set; }
        public int HistoricalComparisonPreviousYearTotal { get; set; }
        public int HistoricalComparisonTwoYearsPriorTotal { get; set; }
    }

    public class FiscalSummaryReimbursementReasonData
    {
        public string ReimbursementReason { get; set; }
        public int Count { get; set; }
        public string DollarAmount { get; set; }
        public int Audiology { get; set; }
        public int OccupationalTherapy { get; set; }
        public int PhysicalTherapy { get; set; }
        public int Speech { get; set; }
        public int Psychology { get; set; }
        public int Counseling { get; set; }
        public int Nursing { get; set; }
    }

    public class FiscalSummaryServiceCodeData
    {
        public int ServiceCodeId { get; set; }
        public string ServiceCodeName { get; set; }
        public int CurrentYearTotal { get; set; }
        public int PreviousYearTotal { get; set; }
        public int TwoYearsPriorTotal { get; set; }
    }

}
