import { IStudent } from '../student';

export interface IDistrictSummaryDto {
    Id: number;
    Name: string;
    OpenPendingReferrals: number;
    CompletedPendingReferrals: number;
    OpenReturnedEncounters: number;
    OpenEncountersReadyForFinalESign: number;
    OpenScheduledEncounters: number;
    CompletedEncounters: number;
    PendingEvaluations: number;
    ProviderTitle: string;
}
