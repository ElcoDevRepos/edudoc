import { IEntity } from './base';

import { ISchoolDistrict } from './school-district';
import { ISchoolDistrictRosterDocument } from './school-district-roster-document';
import { IStudent } from './student';
import { IUser } from './user';

export interface ISchoolDistrictRoster extends IEntity {
    SchoolDistrictId: number;
    FirstName?: string;
    MiddleName?: string;
    LastName?: string;
    StudentCode?: string;
    Grade?: string;
    DateOfBirth?: string;
    Address1?: string;
    Address2?: string;
    City?: string;
    StateCode?: string;
    Zip: string;
    SchoolBuilding?: string;
    ModifiedById?: number;
    DateCreated: Date;
    DateModified?: Date;
    SchoolDistrictRosterDocumentId: number;
    HasDuplicates?: boolean;
    HasDataIssues?: boolean;
    Archived: boolean;
    StudentId?: number;

    // foreign keys
    SchoolDistrict?: ISchoolDistrict;
    SchoolDistrictRosterDocument?: ISchoolDistrictRosterDocument;
    Student?: IStudent;
    ModifiedBy?: IUser;
}
