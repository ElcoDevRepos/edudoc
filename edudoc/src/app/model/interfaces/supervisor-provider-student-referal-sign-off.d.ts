import { IEntity } from './base';

import { IProvider } from './provider';
import { IServiceCode } from './service-code';
import { IStudent } from './student';
import { IUser } from './user';

export interface ISupervisorProviderStudentReferalSignOff extends IEntity {
    SupervisorId: number;
    StudentId: number;
    SignOffText?: string;
    SignOffDate?: Date;
    SignedOffById?: number;
    ServiceCodeId?: number;
    EffectiveDateFrom?: Date;
    EffectiveDateTo?: Date;
    CreatedById: number;
    ModifiedById?: number;
    DateCreated?: Date;
    DateModified?: Date;

    // foreign keys
    Supervisor?: IProvider;
    ServiceCode?: IServiceCode;
    Student?: IStudent;
    CreatedBy?: IUser;
    ModifiedBy?: IUser;
    SignedOffBy?: IUser;
}
