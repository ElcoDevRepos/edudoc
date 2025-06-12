import { Data, Routes } from '@angular/router';

import { AuthGuard, ClaimValues } from '@mt-ng2/auth-module';

import { ClaimTypes } from '@model/ClaimTypes';
import { UserTypesEnum } from '@model/enums/user-types.enum';
import { appPaths } from './../../default-routes/app-paths.library';
import { UserDetailComponent } from './components/user-detail/user-detail.component';
import { UserHeaderComponent } from './components/user-header/user-header.component';
import { UsersComponent } from './components/user-list/users.component';
import { UserService } from './services/user.service';

const userEntityConfig = {
    addressesPath: 'addresses',
    claimType: ClaimTypes.Users,
    claimValues: [ClaimValues.ReadOnly, ClaimValues.FullAccess],
    documentsPath: 'documents',
    entityIdParam: 'userId',
    notesPath: '',
    path: 'users',
    prefix: 'User',
    service: UserService,
    title: 'User Detail',
};

const userListRoleGuard: Data = {
    claimType: ClaimTypes.Users,
    claimValues: [ClaimValues.ReadOnly, ClaimValues.FullAccess],
    title: 'HPC Users',
    userTypeFilter: UserTypesEnum.Admin,
};

export const userPaths = {
    users: 'users',
    usersAdd: 'users/add',
};

const userAddRoleGuard: Data = {
    claimType: ClaimTypes.Users,
    claimValues: [ClaimValues.FullAccess],
    path: 'users',
    prefix: 'Users',
    title: 'Users Add',
    userTypeFilter: UserTypesEnum.Admin,
};

export const adminUserRoutes: Routes = [
    {
        canActivate: [AuthGuard],
        component: UsersComponent,
        data: userListRoleGuard,
        path: userPaths.users,
    },
    {
        canActivate: [AuthGuard],
        children: [{ path: '', component: UserDetailComponent, pathMatch: 'full', data: userAddRoleGuard }],
        component: UserHeaderComponent,
        data: userAddRoleGuard,
        path: userPaths.usersAdd,
    },
    {
        canActivate: [AuthGuard],
        children: [{ path: '', component: UserDetailComponent, pathMatch: 'full', data: userEntityConfig }],
        component: UserHeaderComponent,
        data: userEntityConfig,
        path: `users/:${userEntityConfig.entityIdParam}`,
    },
    {
        canActivate: [AuthGuard],
        component: UserDetailComponent,
        path: appPaths.myProfile,
        pathMatch: 'full',
    },
];
