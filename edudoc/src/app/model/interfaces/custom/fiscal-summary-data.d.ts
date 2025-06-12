export interface IFiscalSummaryData {
    DistrictName: string;
    ReimbursementReasonData: IFiscalSummaryReimbursementReasonData[];
    ReimbursementReasonDataTotals: IFiscalSummaryReimbursementReasonData;
    LessAverageApplicableFFP: string;
    ServiceCodeData: IFiscalSummaryServiceCodeData[];
    HistoricalComparisonCurrentYearTotal: number;
    HistoricalComparisonPreviousYearTotal: number;
    HistoricalComparisonTwoYearsPriorTotal: number;
}

export interface IFiscalSummaryReimbursementReasonData {
    ReimbursementReason: string;
    Count: number;
    DollarAmount: string;
    Audiology: number;
    OccupationalTherapy: number;
    PhysicalTherapy: number;
    Speech: number;
    Psychology: number;
    Counseling: number;
    Nursing: number;
}

export interface IFiscalSummaryServiceCodeData {
    ServiceCodeId: number;
    CurrentYearTotal: number;
    PreviousYearTotal: number;
    TwoYearsPriorTotal: number;
}
