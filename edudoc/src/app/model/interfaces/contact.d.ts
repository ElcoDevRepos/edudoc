import { IEntity } from './base';

import { IContactPhone } from './contact-phone';
import { ISchoolDistrict } from './school-district';
import { IAddress } from './address';
import { IContactRole } from './contact-role';
import { IContactStatus } from './contact-status';
import { IUser } from './user';

export interface IContact extends IEntity {
    FirstName: string;
    LastName: string;
    Title: string;
    Email: string;
    AddressId?: number;
    RoleId: number;
    StatusId: number;
    CreatedById?: number;
    ModifiedById?: number;
    DateCreated?: Date;
    DateModified?: Date;
    Archived: boolean;

    // reverse nav
    ContactPhones?: IContactPhone[];
    SchoolDistricts_SchoolDistrictId?: ISchoolDistrict[];
    SchoolDistricts_SpecialEducationDirectorId?: ISchoolDistrict[];
    SchoolDistricts_TreasurerId?: ISchoolDistrict[];

    // foreign keys
    Address?: IAddress;
    ContactRole?: IContactRole;
    ContactStatus?: IContactStatus;
    CreatedBy?: IUser;
    ModifiedBy?: IUser;
}
