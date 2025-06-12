import { IEntity } from './base';

import { ICaseLoadCptCode } from './case-load-cpt-code';
import { ICaseLoadGoal } from './case-load-goal';
import { ICaseLoadMethod } from './case-load-method';
import { ICaseLoadScript } from './case-load-script';
import { IEncounterStudent } from './encounter-student';
import { IStudentTherapy } from './student-therapy';
import { IDiagnosisCode } from './diagnosis-code';
import { IDisabilityCode } from './disability-code';
import { IServiceCode } from './service-code';
import { IStudent } from './student';
import { IStudentType } from './student-type';
import { IUser } from './user';

export interface ICaseLoad extends IEntity {
    StudentTypeId: number;
    ServiceCodeId?: number;
    StudentId: number;
    DiagnosisCodeId?: number;
    DisabilityCodeId?: number;
    IepStartDate?: Date;
    IepEndDate?: Date;
    Archived: boolean;
    CreatedById: number;
    ModifiedById?: number;
    DateCreated?: Date;
    DateModified?: Date;

    // reverse nav
    CaseLoadCptCodes?: ICaseLoadCptCode[];
    CaseLoadGoals?: ICaseLoadGoal[];
    CaseLoadMethods?: ICaseLoadMethod[];
    CaseLoadScripts?: ICaseLoadScript[];
    EncounterStudents?: IEncounterStudent[];
    StudentTherapies?: IStudentTherapy[];

    // foreign keys
    DiagnosisCode?: IDiagnosisCode;
    DisabilityCode?: IDisabilityCode;
    ServiceCode?: IServiceCode;
    Student?: IStudent;
    StudentType?: IStudentType;
    CreatedBy?: IUser;
    ModifiedBy?: IUser;
}
