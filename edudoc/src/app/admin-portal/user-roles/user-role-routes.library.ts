import { Data, Routes } from '@angular/router';
import { ClaimTypes } from '@model/ClaimTypes';
import { AuthGuard, ClaimValues, IRoleGuarded } from '@mt-ng2/auth-module';
import { UserRoleDetailComponent } from './user-role-detail/user-role-detail.component';
import { UserRoleHeaderComponent } from './user-role-header/user-role-header.component';
import { UserRolesComponent } from './user-role-list/user-roles.component';
import { UserRoleService } from './user-role.service';

const userRoleEntityConfig = {
    addressesPath: '',
    claimType: ClaimTypes.HPCUserAccess,
    documentsPath: '',
    entityIdParam: 'userRoleId',
    notesPath: '',
    service: UserRoleService,
    title: 'User Role Detail',
};

const userRoleListRoleGuard: Data = {
    claimType: ClaimTypes.HPCUserAccess,
    claimValues: [ClaimValues.ReadOnly, ClaimValues.FullAccess],
    title: 'User Roles',
};

const userRoleAddRoleGuard: IRoleGuarded = {
    claimType: ClaimTypes.HPCUserAccess,
    claimValues: [ClaimValues.FullAccess],
};

export const userRolePaths = {
    roles: 'roles',
    rolesAdd: 'roles/add',
};

export const userRoleRoutes: Routes = [
    { path: userRolePaths.roles, component: UserRolesComponent, canActivate: [AuthGuard], data: userRoleListRoleGuard },
    {
        canActivate: [AuthGuard],
        children: [{ path: '', component: UserRoleDetailComponent, pathMatch: 'full' }],
        component: UserRoleHeaderComponent,
        data: userRoleAddRoleGuard,
        path: userRolePaths.rolesAdd,
    },
    {
        canActivate: [AuthGuard],
        children: [{ path: '', component: UserRoleDetailComponent, pathMatch: 'full' }],
        component: UserRoleHeaderComponent,
        data: userRoleEntityConfig,
        path: `roles/:${userRoleEntityConfig.entityIdParam}`,
    },
];
