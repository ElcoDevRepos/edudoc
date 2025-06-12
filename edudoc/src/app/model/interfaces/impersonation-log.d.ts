import { IEntity } from './base';

import { IUser } from './user';

export interface IImpersonationLog extends IEntity {
    AuthTokenId: number;
    DateCreated?: Date;
    ImpersonaterId: number;

    // foreign keys
    User?: IUser;
}
