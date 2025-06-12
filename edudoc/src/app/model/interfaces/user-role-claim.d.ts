import { IClaimType } from './claim-type';
import { IClaimValue } from './claim-value';
import { IUserRole } from './user-role';

export interface IUserRoleClaim {
    RoleId: number;
    ClaimTypeId: number;
    ClaimValueId: number;

    // foreign keys
    ClaimType?: IClaimType;
    ClaimValue?: IClaimValue;
    UserRole?: IUserRole;
}
