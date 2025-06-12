import { IEntity } from './base';

import { IBillingSchedule } from './billing-schedule';
import { IProvider } from './provider';
import { IUser } from './user';

export interface IBillingScheduleExcludedProvider extends IEntity {
    ProviderId: number;
    BillingScheduleId: number;
    CreatedById: number;
    DateCreated?: Date;

    // foreign keys
    BillingSchedule?: IBillingSchedule;
    Provider?: IProvider;
    CreatedBy?: IUser;
}
