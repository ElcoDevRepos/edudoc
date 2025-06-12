import { IEntity } from './base';

import { IProviderCaseUpload } from './provider-case-upload';
import { ISchoolDistrict } from './school-district';
import { IUser } from './user';

export interface IProviderCaseUploadDocument extends IEntity {
    Name: string;
    DistrictId: number;
    DateUpload: Date;
    UploadedBy?: number;
    FilePath: string;
    DateProcessed?: Date;
    DateError?: Date;

    // reverse nav
    ProviderCaseUploads?: IProviderCaseUpload[];

    // foreign keys
    SchoolDistrict?: ISchoolDistrict;
    User?: IUser;
}
