import { IEntity } from './base';

import { ICaseLoadScriptGoal } from './case-load-script-goal';
import { ICaseLoad } from './case-load';
import { IDiagnosisCode } from './diagnosis-code';
import { IUser } from './user';

export interface ICaseLoadScript extends IEntity {
    Npi: string;
    DiagnosisCodeId?: number;
    DoctorFirstName: string;
    DoctorLastName: string;
    InitiationDate: Date;
    ExpirationDate?: Date;
    FileName: string;
    FilePath: string;
    CaseLoadId: number;
    Archived: boolean;
    UploadedById?: number;
    ModifiedById?: number;
    DateUpload: Date;
    DateModified?: Date;

    // reverse nav
    CaseLoadScriptGoals?: ICaseLoadScriptGoal[];

    // foreign keys
    CaseLoad?: ICaseLoad;
    DiagnosisCode?: IDiagnosisCode;
    ModifiedBy?: IUser;
    UploadedBy?: IUser;
}
