import { IActivitySummaryProvider } from "../activity-summary-provider";

export interface IActivitySummaryProviderResponseDTO {
    Results: IActivitySummaryProvider[];
    Total: number;
}