import { Routes } from '@angular/router';

import { AuthGuard } from '@mt-ng2/auth-module';

import { appPaths } from './../../default-routes/app-paths.library';
import { ProviderUserDetailComponent } from './components/provider-user-detail/provider-user-detail.component';

// const userEntityConfig: any = {
//     addressesPath: 'addresses',
//     documentsPath: 'documents',
//     entityIdParam: 'userId',
//     notesPath: '',
//     path: 'users',
//     prefix: 'User',
//     service: ProviderUserService,
//     title: 'User Detail',
// };

export const userPaths = {
    users: 'users',
};

export const providerUserRoutes: Routes = [
    {
        canActivate: [AuthGuard],
        component: ProviderUserDetailComponent,
        path: appPaths.myProfile,
        pathMatch: 'full',
    },
];
