import { IEntity } from './base';

import { IActivitySummaryDistrict } from './activity-summary-district';
import { IUser } from './user';

export interface IActivitySummary extends IEntity {
    ReferralsPending: number;
    EncountersReturned: number;
    PendingSupervisorCoSign: number;
    PendingEvaluations: number;
    DateCreated: Date;
    CreatedById: number;

    // reverse nav
    ActivitySummaryDistricts?: IActivitySummaryDistrict[];

    // foreign keys
    User?: IUser;
}
