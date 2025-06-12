
export interface IFiscalRevenueData {
    DistrictName: string;
    CurrentYearReimbursement: string;
    DirectServices: string;
    MSPSettlements: string;
    FiscalRevenuePerServiceCodeData: IFiscalRevenueServiceCodeData[];
    FiscalRevenuePerYearDataTotals: IFiscalRevenueServiceCodeData;
    HistoricalComparisonData: IFiscalRevenueHistoricalData[];
    HistoricalComparisonDataTotals: IFiscalRevenueHistoricalData;
    AnnualEntriesData: IFiscalRevenueAnnualEntriesData[];
    AnnualEntriesDataTotals: IFiscalRevenueAnnualEntriesData;
}

export interface IFiscalRevenueServiceCodeData {
    ServiceCodeId: number;
    Total: string,
    SelectedYearTotal: string,
    PriorYearTotal: string,
}

export interface IFiscalRevenueHistoricalData {
    ServiceCodeId: number;
    CurrentYearTotal: string,
    PreviousYearTotal: string,
    TwoYearsPriorTotal: string,
}

export interface IFiscalRevenueAnnualEntriesData {
    Year: number;
    Status: string;
    AllowableCosts: string;
    InterimPayments: string;
    SettlementAmount: string;
}
