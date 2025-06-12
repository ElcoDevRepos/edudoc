import { IEntity } from './base';

import { IBillingSchedule } from './billing-schedule';
import { IUser } from './user';

export interface IBillingScheduleAdminNotification extends IEntity {
    AdminId: number;
    BillingScheduleId: number;
    CreatedById: number;
    DateCreated?: Date;

    // foreign keys
    BillingSchedule?: IBillingSchedule;
    Admin?: IUser;
    CreatedBy?: IUser;
}
