import { IEntity } from './base';

import { IProvider } from './provider';
import { IUser } from './user';

export interface IProviderLicens extends IEntity {
    ProviderId: number;
    License: string;
    AsOfDate: Date;
    ExpirationDate: Date;
    CreatedById: number;
    DateCreated?: Date;

    // foreign keys
    Provider?: IProvider;
    CreatedBy?: IUser;
}
