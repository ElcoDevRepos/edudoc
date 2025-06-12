import { IEntity } from './base';

import { IStudent } from './student';
import { IUser } from './user';

export interface IProgressReport extends IEntity {
    StudentId: number;
    StartDate?: Date;
    EndDate?: Date;
    Progress?: boolean;
    ProgressNotes?: string;
    MedicalStatusChange?: boolean;
    MedicalStatusChangeNotes?: string;
    TreatmentChange?: boolean;
    TreatmentChangeNotes?: string;
    ESignedById?: number;
    SupervisorESignedById?: number;
    DateESigned?: Date;
    SupervisorDateESigned?: Date;
    Quarter?: number;
    CreatedById: number;
    ModifiedById?: number;
    DateCreated?: Date;
    DateModified?: Date;

    // foreign keys
    Student?: IStudent;
    CreatedBy?: IUser;
    ESignedBy?: IUser;
    ModifiedBy?: IUser;
    SupervisorESignedBy?: IUser;
}
