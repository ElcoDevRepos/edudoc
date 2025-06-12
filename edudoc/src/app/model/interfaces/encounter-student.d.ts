import { IEntity } from './base';

import { IBillingFailure } from './billing-failure';
import { IClaimsEncounter } from './claims-encounter';
import { IEncounterStudentCptCode } from './encounter-student-cpt-code';
import { IEncounterStudentGoal } from './encounter-student-goal';
import { IEncounterStudentMethod } from './encounter-student-method';
import { IEncounterStudentStatus } from './encounter-student-status';
import { ICaseLoad } from './case-load';
import { IDiagnosisCode } from './diagnosis-code';
import { IDocumentType } from './document-type';
import { IEncounter } from './encounter';
import { IEncounterLocation } from './encounter-location';
import { IEncounterStatus } from './encounter-status';
import { IStudent } from './student';
import { IStudentDeviationReason } from './student-deviation-reason';
import { IStudentTherapySchedule } from './student-therapy-schedule';
import { IUser } from './user';

export interface IEncounterStudent extends IEntity {
    EncounterId: number;
    StudentId: number;
    EncounterStatusId: number;
    EncounterLocationId: number;
    ReasonForReturn?: string;
    EncounterNumber?: string;
    CaseLoadId?: number;
    StudentTherapyScheduleId?: number;
    EncounterStartTime: string;
    EncounterEndTime: string;
    EncounterDate: Date;
    SupervisorComments?: string;
    ESignatureText?: string;
    ESignedById?: number;
    SupervisorESignatureText?: string;
    SupervisorESignedById?: number;
    DateESigned?: Date;
    SupervisorDateESigned?: Date;
    StudentDeviationReasonId?: number;
    TherapyCaseNotes?: string;
    AbandonmentNotes?: string;
    IsTelehealth: boolean;
    DiagnosisCodeId?: number;
    DocumentTypeId?: number;
    Archived: boolean;
    CreatedById: number;
    ModifiedById?: number;
    DateCreated?: Date;
    DateModified?: Date;

    // reverse nav
    BillingFailures?: IBillingFailure[];
    ClaimsEncounters?: IClaimsEncounter[];
    EncounterStudentCptCodes?: IEncounterStudentCptCode[];
    EncounterStudentGoals?: IEncounterStudentGoal[];
    EncounterStudentMethods?: IEncounterStudentMethod[];
    EncounterStudentStatus?: IEncounterStudentStatus[];

    // foreign keys
    CaseLoad?: ICaseLoad;
    DiagnosisCode?: IDiagnosisCode;
    DocumentType?: IDocumentType;
    Encounter?: IEncounter;
    EncounterLocation?: IEncounterLocation;
    EncounterStatus?: IEncounterStatus;
    Student?: IStudent;
    StudentDeviationReason?: IStudentDeviationReason;
    StudentTherapySchedule?: IStudentTherapySchedule;
    CreatedBy?: IUser;
    ESignedBy?: IUser;
    ModifiedBy?: IUser;
    SupervisorESignedBy?: IUser;
}
