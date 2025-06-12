import { IEntity } from './base';

import { IAddress } from './address';
import { ISchool } from './school';
import { IStudent } from './student';
import { IUser } from './user';

export interface IMergedStudent extends IEntity {
    FirstName: string;
    MiddleName?: string;
    LastName: string;
    StudentCode: string;
    Grade: string;
    DateOfBirth: Date;
    AddressId?: number;
    SchoolId: number;
    CreatedById: number;
    DateCreated?: Date;
    MergedToStudentId: number;

    // foreign keys
    Address?: IAddress;
    School?: ISchool;
    Student?: IStudent;
    CreatedBy?: IUser;
}
