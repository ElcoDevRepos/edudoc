import { IEntity } from './base';

import { IProviderTraining } from './provider-training';
import { IEsc } from './esc';
import { IMessageFilterType } from './message-filter-type';
import { IProvider } from './provider';
import { IProviderTitle } from './provider-title';
import { ISchoolDistrict } from './school-district';
import { IServiceCode } from './service-code';
import { ITrainingType } from './training-type';
import { IUser } from './user';

export interface IMessageDocument extends IEntity {
    Description: string;
    FilePath: string;
    FileName: string;
    ValidTill?: Date;
    Mandatory: boolean;
    TrainingTypeId?: number;
    DueDate?: Date;
    CreatedById: number;
    ModifiedById?: number;
    DateCreated: Date;
    DateModified?: Date;
    Archived: boolean;
    MessageFilterTypeId: number;
    ServiceCodeId?: number;
    SchoolDistrictId?: number;
    ForDistrictAdmins: boolean;
    ProviderTitleId?: number;
    ProviderId?: number;
    EscId?: number;

    // reverse nav
    ProviderTrainings?: IProviderTraining[];

    // foreign keys
    Esc?: IEsc;
    MessageFilterType?: IMessageFilterType;
    Provider?: IProvider;
    ProviderTitle?: IProviderTitle;
    SchoolDistrict?: ISchoolDistrict;
    ServiceCode?: IServiceCode;
    TrainingType?: ITrainingType;
    CreatedBy?: IUser;
    ModifiedBy?: IUser;
}
