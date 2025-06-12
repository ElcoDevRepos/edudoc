import { IEntity } from './base';

import { IBillingFailureReason } from './billing-failure-reason';
import { IBillingSchedule } from './billing-schedule';
import { IEncounterStudent } from './encounter-student';
import { IUser } from './user';

export interface IBillingFailure extends IEntity {
    EncounterStudentId: number;
    BillingFailureReasonId: number;
    BillingScheduleId?: number;
    DateOfFailure: Date;
    IssueResolved: boolean;
    DateResolved?: Date;
    ResolvedById?: number;

    // foreign keys
    BillingFailureReason?: IBillingFailureReason;
    BillingSchedule?: IBillingSchedule;
    EncounterStudent?: IEncounterStudent;
    ResolvedBy?: IUser;
}
