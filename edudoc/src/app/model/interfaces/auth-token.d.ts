import { IEntity } from './base';

import { IAuthClient } from './auth-client';
import { IAuthUser } from './auth-user';

export interface IAuthToken extends IEntity {
    IdentifierKey: number[];
    Salt: number[];
    AuthUserId: number;
    AuthClientId: number;
    IssuedUtc: Date;
    ExpiresUtc: Date;
    Token: string;

    // foreign keys
    AuthClient?: IAuthClient;
    AuthUser?: IAuthUser;
}
