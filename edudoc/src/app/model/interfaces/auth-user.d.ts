import { IEntity } from './base';

import { IAuthToken } from './auth-token';
import { IUser } from './user';
import { IUserRole } from './user-role';

export interface IAuthUser extends IEntity {
    Username: string;
    Password: number[];
    Salt: number[];
    ResetKey: number[];
    ResetKeyExpirationUtc: Date;
    RoleId: number;
    HasAccess: boolean;
    IsEditable: boolean;
    HasLoggedIn: boolean;

    // reverse nav
    AuthTokens?: IAuthToken[];
    Users?: IUser[];

    // foreign keys
    UserRole?: IUserRole;
}
