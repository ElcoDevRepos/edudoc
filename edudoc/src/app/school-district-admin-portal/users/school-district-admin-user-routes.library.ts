import { Routes } from '@angular/router';
import { AuthGuard } from '@mt-ng2/auth-module';
import { appPaths } from './../../default-routes/app-paths.library';
import { SchoolDistrictAdminUserDetailComponent } from './components/school-district-admin-user-detail/school-district-admin-user-detail.component';

// const userEntityConfig = {
//     addressesPath: 'addresses',
//     documentsPath: 'documents',
//     entityIdParam: 'userId',
//     notesPath: '',
//     path: 'users',
//     prefix: 'User',
//     service: SchoolDistrictAdminUserService,
//     title: 'User Detail',
// };

// export const userPaths = {
//     users: 'users',
// };

export const schoolDistrictAdminUserRoutes: Routes = [
    {
        canActivate: [AuthGuard],
        component: SchoolDistrictAdminUserDetailComponent,
        path: appPaths.myProfile,
        pathMatch: 'full',
    },
];
