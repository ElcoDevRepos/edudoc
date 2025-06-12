import { IEntity } from './base';

import { ICptCodeAssocation } from './cpt-code-assocation';
import { IMessage } from './message';
import { IMessageDocument } from './message-document';
import { IMessageLink } from './message-link';
import { IProvider } from './provider';
import { ISchoolDistrictProviderCaseNote } from './school-district-provider-case-note';
import { IServiceCode } from './service-code';
import { IUser } from './user';

export interface IProviderTitle extends IEntity {
    Name: string;
    Code?: string;
    ServiceCodeId: number;
    SupervisorTitleId?: number;
    CreatedById: number;
    ModifiedById?: number;
    DateCreated?: Date;
    DateModified?: Date;
    Archived: boolean;

    // reverse nav
    CptCodeAssocations?: ICptCodeAssocation[];
    Messages?: IMessage[];
    MessageDocuments?: IMessageDocument[];
    MessageLinks?: IMessageLink[];
    Providers?: IProvider[];
    ProviderTitles?: IProviderTitle[];
    SchoolDistrictProviderCaseNotes?: ISchoolDistrictProviderCaseNote[];

    // foreign keys
    SupervisorTitle?: IProviderTitle;
    ServiceCode?: IServiceCode;
    CreatedBy?: IUser;
    ModifiedBy?: IUser;
}
