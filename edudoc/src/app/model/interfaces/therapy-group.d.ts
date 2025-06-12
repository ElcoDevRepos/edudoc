import { IEntity } from './base';

import { IStudentTherapy } from './student-therapy';
import { IProvider } from './provider';
import { IUser } from './user';

export interface ITherapyGroup extends IEntity {
    Name: string;
    ProviderId: number;
    StartDate: Date;
    EndDate: Date;
    Monday: boolean;
    Tuesday: boolean;
    Wednesday: boolean;
    Thursday: boolean;
    Friday: boolean;
    Archived: boolean;
    CreatedById: number;
    ModifiedById?: number;
    DateCreated: Date;
    DateModified?: Date;

    // reverse nav
    StudentTherapies?: IStudentTherapy[];

    // foreign keys
    Provider?: IProvider;
    CreatedBy?: IUser;
    ModifiedBy?: IUser;
}
