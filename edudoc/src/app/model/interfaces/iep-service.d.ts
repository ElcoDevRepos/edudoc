import { IEntity } from './base';

import { IStudent } from './student';
import { IUser } from './user';

export interface IIepService extends IEntity {
    StartDate: Date;
    EndDate: Date;
    EtrExpirationDate: Date;
    OtpTotalMinutes?: number;
    PtTotalMinutes?: number;
    StpTotalMinutes?: number;
    AudTotalMinutes?: number;
    NursingTotalMinutes?: number;
    CcTotalMinutes?: number;
    SocTotalMinutes?: number;
    PsyTotalMinutes?: number;
    OtpDate?: Date;
    PtDate?: Date;
    StpDate?: Date;
    AudDate?: Date;
    NursingDate?: Date;
    CcDate?: Date;
    SocDate?: Date;
    PsyDate?: Date;
    StudentId: number;
    CreatedById: number;
    ModifiedById?: number;
    DateCreated?: Date;
    DateModified?: Date;

    // foreign keys
    Student?: IStudent;
    CreatedBy?: IUser;
    ModifiedBy?: IUser;
}
