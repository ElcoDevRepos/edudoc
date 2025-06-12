import { IEntity } from './base';

import { IContact } from './contact';
import { IEsc } from './esc';
import { IMergedStudent } from './merged-student';
import { ISchoolDistrict } from './school-district';
import { IStudent } from './student';
import { IUser } from './user';
import { ICountry } from './country';
import { IState } from './state';

export interface IAddress extends IEntity {
    Address1: string;
    Address2: string;
    City: string;
    StateCode: string;
    Zip: string;
    CountryCode?: string;
    Province: string;
    County?: string;

    // reverse nav
    Contacts?: IContact[];
    Escs?: IEsc[];
    MergedStudents?: IMergedStudent[];
    SchoolDistricts?: ISchoolDistrict[];
    Students?: IStudent[];
    Users?: IUser[];

    // foreign keys
    Country?: ICountry;
    State?: IState;
}
