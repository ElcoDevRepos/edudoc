import { IEntity } from './base';

import { IDiagnosisCode } from './diagnosis-code';
import { IServiceCode } from './service-code';
import { IServiceType } from './service-type';
import { IUser } from './user';

export interface IDiagnosisCodeAssociation extends IEntity {
    DiagnosisCodeId: number;
    ServiceCodeId: number;
    ServiceTypeId: number;
    Archived: boolean;
    CreatedById: number;
    ModifiedById?: number;
    DateCreated?: Date;
    DateModified?: Date;

    // foreign keys
    DiagnosisCode?: IDiagnosisCode;
    ServiceCode?: IServiceCode;
    ServiceType?: IServiceType;
    CreatedBy?: IUser;
    ModifiedBy?: IUser;
}
