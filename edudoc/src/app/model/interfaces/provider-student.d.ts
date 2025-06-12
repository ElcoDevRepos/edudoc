import { IEntity } from './base';

import { IProvider } from './provider';
import { IStudent } from './student';
import { IUser } from './user';

export interface IProviderStudent extends IEntity {
    ProviderId: number;
    StudentId: number;
    CreatedById: number;
    DateCreated?: Date;

    // foreign keys
    Provider?: IProvider;
    Student?: IStudent;
    CreatedBy?: IUser;
}
