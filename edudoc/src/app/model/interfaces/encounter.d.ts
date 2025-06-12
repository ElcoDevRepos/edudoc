import { IEntity } from './base';

import { IEncounterStudent } from './encounter-student';
import { IDiagnosisCode } from './diagnosis-code';
import { IEvaluationType } from './evaluation-type';
import { INonMspService } from './non-msp-service';
import { IProvider } from './provider';
import { IServiceType } from './service-type';
import { IUser } from './user';

export interface IEncounter extends IEntity {
    ProviderId: number;
    ServiceTypeId: number;
    NonMspServiceTypeId?: number;
    EvaluationTypeId?: number;
    EncounterDate?: Date;
    EncounterStartTime?: string;
    EncounterEndTime?: string;
    IsGroup: boolean;
    AdditionalStudents: number;
    FromSchedule: boolean;
    DiagnosisCodeId?: number;
    Archived: boolean;
    CreatedById: number;
    ModifiedById?: number;
    DateCreated?: Date;
    DateModified?: Date;

    // reverse nav
    EncounterStudents?: IEncounterStudent[];

    // foreign keys
    DiagnosisCode?: IDiagnosisCode;
    EvaluationType?: IEvaluationType;
    NonMspService?: INonMspService;
    Provider?: IProvider;
    ServiceType?: IServiceType;
    CreatedBy?: IUser;
    ModifiedBy?: IUser;
}
