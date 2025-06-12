import { IEntity } from './base';

import { IAuthToken } from './auth-token';
import { IAuthApplicationType } from './auth-application-type';

export interface IAuthClient extends IEntity {
    Name: string;
    Secret: number[];
    Salt: number[];
    Description?: string;
    AuthApplicationTypeId: number;
    RefreshTokenMinutes: number;
    AllowedOrigin: string;

    // reverse nav
    AuthTokens?: IAuthToken[];

    // foreign keys
    AuthApplicationType?: IAuthApplicationType;
}
