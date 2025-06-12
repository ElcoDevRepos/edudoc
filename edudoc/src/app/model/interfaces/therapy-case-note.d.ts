import { IEntity } from './base';

import { IProvider } from './provider';
import { IUser } from './user';

export interface ITherapyCaseNote extends IEntity {
    Notes: string;
    CreatedById: number;
    ProviderId: number;
    DateCreated: Date;

    // foreign keys
    Provider?: IProvider;
    User?: IUser;
}
