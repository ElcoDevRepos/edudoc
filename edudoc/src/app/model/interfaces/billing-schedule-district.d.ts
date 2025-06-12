import { IEntity } from './base';

import { IBillingSchedule } from './billing-schedule';
import { ISchoolDistrict } from './school-district';
import { IUser } from './user';

export interface IBillingScheduleDistrict extends IEntity {
    SchoolDistrictId: number;
    BillingScheduleId: number;
    CreatedById: number;
    DateCreated?: Date;

    // foreign keys
    BillingSchedule?: IBillingSchedule;
    SchoolDistrict?: ISchoolDistrict;
    CreatedBy?: IUser;
}
