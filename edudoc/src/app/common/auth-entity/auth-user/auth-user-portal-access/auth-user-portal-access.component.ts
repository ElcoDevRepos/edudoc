import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NotificationsService } from '@mt-ng2/notifications-module';

import { ClaimTypeService } from '@admin/user-roles/claimtype.service';
import { ClaimValueService } from '@admin/user-roles/claimvalue.service';
import { Permission } from '@admin/user-roles/user-role-permissions/permissions.library';
import { UserRole } from '@admin/user-roles/user-role.library';
import { UserRoleService } from '@admin/user-roles/user-role.service';
import { ClaimTypes } from '@model/ClaimTypes';
import { UserTypesEnum } from '@model/enums/user-types.enum';
import { IAuthUser } from '@model/interfaces/auth-user';
import { IClaimType } from '@model/interfaces/claim-type';
import { IClaimValue } from '@model/interfaces/claim-value';
import { IUserRole } from '@model/interfaces/user-role';
import { IUserRoleClaim } from '@model/interfaces/user-role-claim';
import { ClaimsService, ClaimValues } from '@mt-ng2/auth-module';
import { forkJoin, Subscription } from 'rxjs';
import { AuthEntityService } from '../../auth-entity.service';

@Component({
    selector: 'app-auth-user-portal-access',
    styles: [
        `
            h4.permissions {
                color: #4e6365;
                font-weight: 700;
                padding-bottom: 5px;
                border-bottom: 0px;
            }
        `,
    ],
    templateUrl: './auth-user-portal-access.html',
})
export class AuthUserPortalAccessComponent implements OnInit {
    @Input('AuthUser') authUser: IAuthUser;
    @Input('canEdit') canEdit: boolean;
    @Input('userType') userType: UserTypesEnum;
    @Input('showAccessButton') showAccessButton = true;
    @Input('isMyProfile') isMyProfile = false;
    isEditing: boolean;
    userRolePermissions: IUserRoleClaim[] = [];
    userId: number;

    subscriptions: Subscription;
    selectedRoleId: number;

    // New Permissions Layout
    canEditPermissions: boolean;
    claimTypes: IClaimType[];
    claimValues: IClaimValue[];
    permissions: Permission[];
    roleId: number;
    userRole: IUserRole;
    showPortalAccess = false;

    get noPermissions(): boolean {
        return !this.userRolePermissions.length;
    }

    constructor(
        private route: ActivatedRoute,
        private authEntityService: AuthEntityService,
        private userRoleService: UserRoleService,
        private notificationsService: NotificationsService,
        private claimsService: ClaimsService,
        private claimValueService: ClaimValueService,
        private claimTypeService: ClaimTypeService,
    ) {
        this.subscriptions = new Subscription;
    }

    ngOnInit(): void {
        this.isEditing = false;
        this.userId = +this.route.snapshot.params.userId;

        this.canEditPermissions = this.claimsService.hasClaim(ClaimTypes.HPCUserAccess, [ClaimValues.FullAccess]);
        this.roleId = this.authUser.RoleId;

        this.userRoleService.getById(this.roleId).subscribe((userRole) => {
            forkJoin(this.claimValueService.getItems(), this.claimTypeService.getClaimTypesByUserType(userRole.UserTypeId)).subscribe(
                (forkJoinReturns) => {
                    const [claimValues, claimTypes] = forkJoinReturns;
                    // set the claimValues
                    this.claimValues = [...claimValues];
                    this.claimValues.push({ Name: 'No Access', Id: 0 });
                    // set the claimTypes
                    this.claimTypes = [...claimTypes];
                    // set the user role
                    this.setUserRole(userRole);
                    this.setPermissions();
                },
            );
        });
    }

    ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    changeAccess(): void {
        this.authUser.HasAccess = !this.authUser.HasAccess;
        this.authEntityService.changeAccess(this.authUser.Id, this.authUser.HasAccess).subscribe(() => {
            this.isEditing = false;
            this.success();
        });
    }

    edit(): void {
        if (this.canEdit) {
            this.isEditing = true;
        }
    }

    cancel(): void {
        this.isEditing = false;
        this.setPermissions();
    }

    success(): void {
        this.notificationsService.success('Saved Successfully');
    }

    setPermissions(): void {
        setTimeout(() => {
            this.userRolePermissions = this.userRole.UserRoleClaims
                                            .filter((urc) => urc.ClaimValueId > 0 && urc.ClaimType?.IsVisible)
                                            .sort(function(a, b): number {
                                                if (a.ClaimType.Name < b.ClaimType.Name) { return -1; }
                                                if (a.ClaimType.Name > b.ClaimType.Name) { return 1; }
                                                return 0;
                                            });
        });
    }

    setUserRole(userRole: IUserRole): void {
        this.userRole = userRole;
        // set canEdit based on first whether the userRole can be edited
        // then by the claims for this user
        this.canEdit = userRole.IsEditable ? this.canEditPermissions : false;
        // using user role, set the permissions array
        if (this.userRole && this.userRole.UserRoleClaims) {
            this.permissions = this.claimTypes.map((claimType) => new Permission(this.userRole, claimType));
        }
    }

    savePermission(permissions: Permission[]): void {
        // since we have certain roles that cannot be edited (i.e. admin role)
        // we check here to be sure
        const userRoleUpdate = new UserRole({ ...this.userRole });
        userRoleUpdate.updateUserRoleClaims(permissions);
        this.userRoleService.updateClaims(userRoleUpdate.Id, userRoleUpdate.UserRoleClaims).subscribe(() => {
            this.notificationsService.success('Saved Succesfully');
            this.setUserRole(userRoleUpdate);
        });
    }

    togglePortalAccess(): void {
        this.showPortalAccess = !this.showPortalAccess;
    }
}
