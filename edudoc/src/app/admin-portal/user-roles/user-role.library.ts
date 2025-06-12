import { IAuthUser } from '@model/interfaces/auth-user';
import { IUserRole } from '@model/interfaces/user-role';
import { IUserRoleClaim } from '@model/interfaces/user-role-claim';
import { Permission } from './user-role-permissions/permissions.library';

export class UserRole implements IUserRole {
    CreatedById?: number;
    ModifiedById?: number;
    DateCreated?: Date;
    DateModified?: Date;
    Archived: boolean;
    Id: number;
    Name: string;
    Description: string;
    IsEditable: boolean;

    // reverse nav
    AuthUsers?: IAuthUser[];
    UserRoleClaims?: IUserRoleClaim[];
    UserTypeId: number;
    constructor(public userRole: IUserRole) {
        Object.assign(this, userRole);
    }

    /**
     * update the UserRoleClaims using a passed in Permission
     * @param permission
     */
    updateUserRoleClaims(permissions: Permission[]): void {
        for (const permission of permissions) {
            const existing = this.UserRoleClaims.find((urc) => urc.ClaimTypeId === permission.claimType.Id);
            const index = existing ? this.UserRoleClaims.indexOf(existing) : this.UserRoleClaims.length;
            if (permission.value === 0) {
                this.UserRoleClaims.splice(index, 1);
            } else {
                const claim: IUserRoleClaim = {
                    ClaimTypeId: permission.claimType.Id,
                    ClaimValueId: permission.value,
                    RoleId: this.Id,
                };
                this.UserRoleClaims[index] = claim;
            }
        }
    }
}
