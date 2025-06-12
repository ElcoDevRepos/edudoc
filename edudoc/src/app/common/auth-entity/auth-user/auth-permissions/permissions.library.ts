import { IClaimType } from '@model/interfaces/claim-type';
import { IUserRole } from '@model/interfaces/user-role';

/** a permission is the UI representation of the UserRoleClaims object */
export class Permission {
    public claimType: IClaimType;
    public value: number;

    constructor(userRole: IUserRole, claimType: IClaimType) {
        this.claimType = claimType;
        this.value = this.getValue(userRole, claimType);
    }

    private getValue(userRole: IUserRole, claimType: IClaimType): number {
        if (userRole.UserRoleClaims && userRole.UserRoleClaims.length) {
            if (userRole.UserRoleClaims.find((userRoleClaim) => userRoleClaim.ClaimTypeId === claimType.Id)) {
                const cvId = userRole.UserRoleClaims.find((userRoleClaim) => userRoleClaim.ClaimTypeId === claimType.Id).ClaimValueId;
                return cvId;
            } else {
                return 0;
            }
        } else {
            return 0;
        }
    }
}
