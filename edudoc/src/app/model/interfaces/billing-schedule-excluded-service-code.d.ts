import { IEntity } from './base';

import { IBillingSchedule } from './billing-schedule';
import { IServiceCode } from './service-code';
import { IUser } from './user';

export interface IBillingScheduleExcludedServiceCode extends IEntity {
    ServiceCodeId: number;
    BillingScheduleId: number;
    CreatedById: number;
    DateCreated?: Date;

    // foreign keys
    BillingSchedule?: IBillingSchedule;
    ServiceCode?: IServiceCode;
    CreatedBy?: IUser;
}
