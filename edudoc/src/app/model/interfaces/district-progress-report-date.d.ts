import { IEntity } from './base';

import { ISchoolDistrict } from './school-district';

export interface IDistrictProgressReportDate extends IEntity {
    DistrictId: number;
    FirstQuarterStartDate: Date;
    FirstQuarterEndDate: Date;
    SecondQuarterStartDate: Date;
    SecondQuarterEndDate: Date;
    ThirdQuarterStartDate: Date;
    ThirdQuarterEndDate: Date;
    FourthQuarterStartDate: Date;
    FourthQuarterEndDate: Date;

    // foreign keys
    SchoolDistrict?: ISchoolDistrict;
}
