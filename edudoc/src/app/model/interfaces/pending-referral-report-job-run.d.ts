import { IEntity } from './base';

import { IPendingReferral } from './pending-referral';
import { IUser } from './user';

export interface IPendingReferralReportJobRun extends IEntity {
    JobRunDate: Date;
    JobRunById: number;

    // reverse nav
    PendingReferrals?: IPendingReferral[];

    // foreign keys
    User?: IUser;
}
