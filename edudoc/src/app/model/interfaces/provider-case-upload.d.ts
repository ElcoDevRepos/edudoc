import { IEntity } from './base';

import { IProvider } from './provider';
import { IProviderCaseUploadDocument } from './provider-case-upload-document';
import { ISchoolDistrict } from './school-district';
import { IStudent } from './student';
import { IUser } from './user';

export interface IProviderCaseUpload extends IEntity {
    ProviderId?: number;
    DistrictId: number;
    FirstName?: string;
    MiddleName?: string;
    LastName?: string;
    Grade?: string;
    DateOfBirth?: string;
    School?: string;
    ModifiedById?: number;
    DateCreated: Date;
    DateModified?: Date;
    ProviderCaseUploadDocumentId: number;
    HasDuplicates?: boolean;
    HasDataIssues?: boolean;
    Archived: boolean;
    StudentId?: number;

    // foreign keys
    Provider?: IProvider;
    ProviderCaseUploadDocument?: IProviderCaseUploadDocument;
    SchoolDistrict?: ISchoolDistrict;
    Student?: IStudent;
    ModifiedBy?: IUser;
}
