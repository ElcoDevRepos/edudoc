import { IEntity } from './base';

import { IReadMessage } from './read-message';
import { IEsc } from './esc';
import { IMessageFilterType } from './message-filter-type';
import { IProvider } from './provider';
import { IProviderTitle } from './provider-title';
import { ISchoolDistrict } from './school-district';
import { IServiceCode } from './service-code';
import { IUser } from './user';

export interface IMessage extends IEntity {
    Description: string;
    Body: string;
    ValidTill?: Date;
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
    SortOrder?: number;

    // reverse nav
    ReadMessages?: IReadMessage[];

    // foreign keys
    Esc?: IEsc;
    MessageFilterType?: IMessageFilterType;
    Provider?: IProvider;
    ProviderTitle?: IProviderTitle;
    SchoolDistrict?: ISchoolDistrict;
    ServiceCode?: IServiceCode;
    CreatedBy?: IUser;
    ModifiedBy?: IUser;
}
