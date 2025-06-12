import { IEntity } from './base';

import { ICptCode } from './cpt-code';
import { IEvaluationType } from './evaluation-type';
import { IProviderTitle } from './provider-title';
import { IServiceCode } from './service-code';
import { IServiceType } from './service-type';
import { IUser } from './user';

export interface ICptCodeAssocation extends IEntity {
    CptCodeId: number;
    ServiceCodeId: number;
    ServiceTypeId: number;
    ProviderTitleId: number;
    EvaluationTypeId?: number;
    IsGroup: boolean;
    Default: boolean;
    IsTelehealth: boolean;
    Archived: boolean;
    CreatedById: number;
    ModifiedById?: number;
    DateCreated?: Date;
    DateModified?: Date;

    // foreign keys
    CPTCode?: ICptCode;
    EvaluationType?: IEvaluationType;
    ProviderTitle?: IProviderTitle;
    ServiceCode?: IServiceCode;
    ServiceType?: IServiceType;
    CreatedBy?: IUser;
    ModifiedBy?: IUser;
}
