import { IEntity } from './base';

import { IProvider } from './provider';
import { IStudent } from './student';
import { IUser } from './user';

export interface IProviderStudentSupervisor extends IEntity {
    AssistantId: number;
    SupervisorId: number;
    StudentId: number;
    EffectiveStartDate: Date;
    EffectiveEndDate?: Date;
    CreatedById: number;
    ModifiedById?: number;
    DateCreated?: Date;
    DateModified?: Date;

    // foreign keys
    Assistant?: IProvider;
    Supervisor?: IProvider;
    Student?: IStudent;
    CreatedBy?: IUser;
    ModifiedBy?: IUser;
}
