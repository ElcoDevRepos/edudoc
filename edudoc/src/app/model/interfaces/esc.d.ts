import { IEntity } from './base';

import { IEscSchoolDistrict } from './esc-school-district';
import { IMessage } from './message';
import { IMessageDocument } from './message-document';
import { IMessageLink } from './message-link';
import { IProviderEscAssignment } from './provider-esc-assignment';
import { IStudent } from './student';
import { IAddress } from './address';
import { IUser } from './user';

export interface IEsc extends IEntity {
    Name: string;
    Code: string;
    Notes?: string;
    CreatedById: number;
    ModifiedById?: number;
    DateCreated?: Date;
    DateModified?: Date;
    Archived: boolean;
    AddressId?: number;

    // reverse nav
    EscSchoolDistricts?: IEscSchoolDistrict[];
    Messages?: IMessage[];
    MessageDocuments?: IMessageDocument[];
    MessageLinks?: IMessageLink[];
    ProviderEscAssignments?: IProviderEscAssignment[];
    Students?: IStudent[];

    // foreign keys
    Address?: IAddress;
    CreatedBy?: IUser;
    ModifiedBy?: IUser;
}
