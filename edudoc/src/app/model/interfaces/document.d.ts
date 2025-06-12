import { IEntity } from './base';

import { ISchoolDistrict } from './school-district';
import { IUser } from './user';

export interface IDocument extends IEntity {
    Name: string;
    DateUpload: Date;
    UploadedBy?: number;
    FilePath: string;

    // reverse nav
    SchoolDistricts?: ISchoolDistrict[];
    Users?: IUser[];

    // foreign keys
    User?: IUser;
}
