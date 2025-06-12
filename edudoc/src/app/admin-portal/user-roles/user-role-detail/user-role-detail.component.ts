import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { ClaimsService, ClaimValues } from '@mt-ng2/auth-module';
import { NotificationsService } from '@mt-ng2/notifications-module';

import { ClaimTypes } from '@model/ClaimTypes';
import { IClaimType } from '@model/interfaces/claim-type';
import { IClaimValue } from '@model/interfaces/claim-value';
import { IUserRole } from '@model/interfaces/user-role';
import { forkJoin, Observable, of } from 'rxjs';
import { ClaimTypeService } from '../claimtype.service';
import { ClaimValueService } from '../claimvalue.service';
import { Permission } from '../user-role-permissions/permissions.library';
import { UserRole } from '../user-role.library';
import { UserRoleService } from '../user-role.service';

@Component({
    selector: 'app-user-role-detail',
    templateUrl: './user-role-detail.component.html',
})
export class UserRoleDetailComponent implements OnInit {
    canEditUserRoles: boolean;
    canEdit: boolean;
    canEditPermission: boolean;
    userRole: IUserRole;
    claimTypes: IClaimType[];
    claimValues: IClaimValue[];
    permissions: Permission[];
    roleId: number;

    constructor(
        private userRoleService: UserRoleService,
        private claimsService: ClaimsService,
        private claimTypeService: ClaimTypeService,
        private claimValueService: ClaimValueService,
        private route: ActivatedRoute,
        private notificationsService: NotificationsService,
        private router: Router,
    ) {}

    ngOnInit(): void {
        this.canEditUserRoles = this.claimsService.hasClaim(ClaimTypes.HPCUserAccess, [ClaimValues.FullAccess]);
        const id = +this.route.snapshot.paramMap.get('userRoleId');
        this.roleId = id;

        const userRoles = [1, 4, 5]; // Admin, School District Admin, Provider
        this.canEditPermission = !userRoles.includes(id);

        this.getUserRoleById(id).subscribe((userRole) => {
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
                },
            );
        });
    }

    getUserRoleById(id: number): Observable<IUserRole> {
        if (id > 0) {
            return this.userRoleService.getById(id);
        } else {
            return of(this.userRoleService.getEmptyUserRole());
        }
    }

    setUserRole(userRole: IUserRole): void {
        this.userRole = userRole;
        // set canEdit based on first whether the userRole can be edited
        // then by the claims for this user
        this.canEdit = userRole.IsEditable ? this.canEditUserRoles : false;
        // using user role, set the permissions array
        if (this.userRole && this.userRole.UserRoleClaims) {
            this.permissions = this.claimTypes.map((claimType) => new Permission(this.userRole, claimType));
        }
    }

    deleteRole(): void {
        this.userRoleService.deleteRole(this.userRole.Id).subscribe(() => {
            void this.router.navigate(['/roles']);
            this.notificationsService.success('Role Deleted');
        });
    }

    savePermission(permission: Permission): void {
        // since we have certain roles that cannot be edited (i.e. admin role)
        // we check here to be sure
        const userRoleUpdate = new UserRole({ ...this.userRole });
        userRoleUpdate.updateUserRoleClaims([permission]);
        this.userRoleService.updateClaims(userRoleUpdate.Id, userRoleUpdate.UserRoleClaims).subscribe(() => {
            this.notificationsService.success('Saved Succesfully');
            this.setUserRole(userRoleUpdate);
        });
    }
}
