import { IStudent } from '../student';
import { IDistrictSummaryDto } from './district-summary-dto.dto';


export interface IDistrictSummaryResponseDTO {
    Summaries: IDistrictSummaryDto[];
    Total: number;
}

export interface IDistrictSummaryTotalsResponseDTO {
    TotalPendingReferrals: number;
    TotalReturnedEncounters: number;
    TotalEncountersReadyForFinalESign: number;
    TotalScheduledEncounters: number;
    TotalPendingEvaluations: number;
    TotalMissingAddresses: number;
    StudentMissingAddresses: IStudent[];
}
