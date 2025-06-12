import { IEntity } from './base';

import { IAnnualEntryStatus } from './annual-entry-status';
import { ISchoolDistrict } from './school-district';

export interface IAnnualEntry extends IEntity {
    Year: string;
    StatusId: number;
    AllowableCosts: string;
    InterimPayments: string;
    SettlementAmount: string;
    Mer?: string;
    Rmts?: string;
    SchoolDistrictId: number;
    Archived: boolean;

    // foreign keys
    AnnualEntryStatus?: IAnnualEntryStatus;
    SchoolDistrict?: ISchoolDistrict;
}
