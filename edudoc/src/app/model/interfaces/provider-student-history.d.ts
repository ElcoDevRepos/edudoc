import { IEntity } from './base';

import { IProvider } from './provider';
import { IStudent } from './student';

export interface IProviderStudentHistory extends IEntity {
    ProviderId: number;
    StudentId: number;
    DateArchived: Date;

    // foreign keys
    Provider?: IProvider;
    Student?: IStudent;
}
