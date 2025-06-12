import { IEntity } from './base';

import { IBillingFile } from './billing-file';
import { IClaimsDistrict } from './claims-district';
import { IClaimsEncounter } from './claims-encounter';
import { IBillingSchedule } from './billing-schedule';

export interface IHealthCareClaim extends IEntity {
    DateCreated: Date;
    PageCount: number;
    BillingScheduleId?: number;

    // reverse nav
    BillingFiles?: IBillingFile[];
    ClaimsDistricts?: IClaimsDistrict[];
    ClaimsEncounters?: IClaimsEncounter[];

    // foreign keys
    BillingSchedule?: IBillingSchedule;
}
