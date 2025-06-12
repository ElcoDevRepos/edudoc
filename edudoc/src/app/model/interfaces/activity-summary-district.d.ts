import { IEntity } from './base';

import { IActivitySummaryServiceArea } from './activity-summary-service-area';
import { IActivitySummary } from './activity-summary';
import { ISchoolDistrict } from './school-district';
import { IUser } from './user';

export interface IActivitySummaryDistrict extends IEntity {
    DistrictId: number;
    ReferralsPending: number;
    EncountersReturned: number;
    PendingSupervisorCoSign: number;
    EncountersReadyForScheduling: number;
    PendingEvaluations: number;
    DateCreated: Date;
    CreatedById?: number;
    ActivitySummaryId?: number;

    // reverse nav
    ActivitySummaryServiceAreas?: IActivitySummaryServiceArea[];

    // foreign keys
    ActivitySummary?: IActivitySummary;
    SchoolDistrict?: ISchoolDistrict;
    User?: IUser;
}
