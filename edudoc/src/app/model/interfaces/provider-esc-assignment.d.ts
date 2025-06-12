import { IEntity } from './base';

import { IProviderEscSchoolDistrict } from './provider-esc-school-district';
import { IAgency } from './agency';
import { IAgencyType } from './agency-type';
import { IEsc } from './esc';
import { IProvider } from './provider';
import { IUser } from './user';

export interface IProviderEscAssignment extends IEntity {
    ProviderId: number;
    EscId?: number;
    StartDate: Date;
    EndDate?: Date;
    CreatedById?: number;
    ModifiedById?: number;
    DateCreated?: Date;
    DateModified?: Date;
    Archived: boolean;
    AgencyTypeId?: number;
    AgencyId?: number;

    // reverse nav
    ProviderEscSchoolDistricts?: IProviderEscSchoolDistrict[];

    // foreign keys
    Agency?: IAgency;
    AgencyType?: IAgencyType;
    Esc?: IEsc;
    Provider?: IProvider;
    CreatedBy?: IUser;
    ModifiedBy?: IUser;
}
