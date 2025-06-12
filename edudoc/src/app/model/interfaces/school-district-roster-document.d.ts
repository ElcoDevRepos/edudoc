import { IEntity } from './base';

import { ISchoolDistrictRoster } from './school-district-roster';
import { ISchoolDistrict } from './school-district';
import { IUser } from './user';

export interface ISchoolDistrictRosterDocument extends IEntity {
    Name: string;
    SchoolDistrictId: number;
    DateUpload: Date;
    UploadedBy?: number;
    FilePath: string;
    DateProcessed?: Date;
    DateError?: Date;

    // reverse nav
    SchoolDistrictRosters?: ISchoolDistrictRoster[];

    // foreign keys
    SchoolDistrict?: ISchoolDistrict;
    User?: IUser;
}
