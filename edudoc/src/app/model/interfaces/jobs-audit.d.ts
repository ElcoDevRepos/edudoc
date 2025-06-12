import { IEntity } from './base';

import { IBillingSchedule } from './billing-schedule';
import { IUser } from './user';

export interface IJobsAudit extends IEntity {
    FileType: number;
    StartDate: Date;
    EndDate?: Date;
    BillingScheduleId?: number;
    CreatedById?: number;

    // foreign keys
    BillingSchedule?: IBillingSchedule;
    CreatedBy?: IUser;
}
