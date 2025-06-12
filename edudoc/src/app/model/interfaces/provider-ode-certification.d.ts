import { IEntity } from './base';

import { IProvider } from './provider';
import { IUser } from './user';

export interface IProviderOdeCertification extends IEntity {
    ProviderId: number;
    AsOfDate: Date;
    ExpirationDate: Date;
    CertificationNumber: string;
    CreatedById: number;
    DateCreated?: Date;

    // foreign keys
    Provider?: IProvider;
    CreatedBy?: IUser;
}
