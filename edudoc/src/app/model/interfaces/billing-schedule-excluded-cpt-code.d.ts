import { IEntity } from './base';

import { IBillingSchedule } from './billing-schedule';
import { ICptCode } from './cpt-code';
import { IUser } from './user';

export interface IBillingScheduleExcludedCptCode extends IEntity {
    CptCodeId: number;
    BillingScheduleId: number;
    CreatedById: number;
    DateCreated?: Date;

    // foreign keys
    BillingSchedule?: IBillingSchedule;
    CptCode?: ICptCode;
    CreatedBy?: IUser;
}
