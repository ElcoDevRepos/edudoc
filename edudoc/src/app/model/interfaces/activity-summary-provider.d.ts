import { IEntity } from './base';

import { IActivitySummaryServiceArea } from './activity-summary-service-area';
import { IProvider } from './provider';
import { IUser } from './user';

export interface IActivitySummaryProvider extends IEntity {
    ProviderId: number;
    ProviderName: string;
    ReferralsPending: number;
    EncountersReturned: number;
    PendingSupervisorCoSign: number;
    PendingEvaluations: number;
    DateCreated: Date;
    CreatedById?: number;
    ActivitySummaryServiceAreaId?: number;

    // foreign keys
    ActivitySummaryServiceArea?: IActivitySummaryServiceArea;
    Provider?: IProvider;
    User?: IUser;
}
