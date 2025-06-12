import { IEntity } from './base';

import { IClaimType } from './claim-type';
import { IUserRole } from './user-role';

export interface IUserType extends IEntity {
    Name: string;

    // reverse nav
    ClaimTypes?: IClaimType[];
    UserRoles?: IUserRole[];
}
