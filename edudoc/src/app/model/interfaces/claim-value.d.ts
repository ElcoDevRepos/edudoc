import { IEntity } from './base';

import { IUserRoleClaim } from './user-role-claim';

export interface IClaimValue extends IEntity {
    Name: string;

    // reverse nav
    UserRoleClaims?: IUserRoleClaim[];
}
