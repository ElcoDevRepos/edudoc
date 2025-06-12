import { IEntity } from './base';

import { IActivitySummaryProvider } from './activity-summary-provider';
import { IActivitySummaryDistrict } from './activity-summary-district';
import { IServiceCode } from './service-code';
import { IUser } from './user';

export interface IActivitySummaryServiceArea extends IEntity {
    ServiceAreaId: number;
    ReferralsPending: number;
    EncountersReturned: number;
    PendingSupervisorCoSign: number;
    PendingEvaluations: number;
    OpenScheduledEncounters: number;
    DateCreated: Date;
    CreatedById?: number;
    ActivitySummaryDistrictId?: number;

    // reverse nav
    ActivitySummaryProviders?: IActivitySummaryProvider[];

    // foreign keys
    ActivitySummaryDistrict?: IActivitySummaryDistrict;
    ServiceCode?: IServiceCode;
    User?: IUser;
}
