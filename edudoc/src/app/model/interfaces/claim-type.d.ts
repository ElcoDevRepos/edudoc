import { IEntity } from './base';

import { IUserRoleClaim } from './user-role-claim';
import { IUserType } from './user-type';

export interface IClaimType extends IEntity {
    Name: string;
    Alias?: string;
    ParentId?: number;
    IsVisible: boolean;

    // reverse nav
    UserRoleClaims?: IUserRoleClaim[];
    UserTypes?: IUserType[];
}
