import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HCPCLoginComponent } from '@common/login/HCPC-login.component';
import { appPaths } from './default-routes/app-paths.library';

import { AdminAccessComponent } from '@common/login/admin-access.component';
import { ForgotPasswordComponent } from '@common/login/forgot-password.component';
import { ResetPasswordComponent } from '@common/login/reset-password.component';
import { RouteResolverComponent } from './default-routes/route-resolver.component';
import { SignOutComponent } from '@common/sign-out/sign-out.component';

const appRoutes: Routes = [
    { path: appPaths.login, component: HCPCLoginComponent, title: 'Login' },
    
    { path: appPaths.forgotPassword, component: ForgotPasswordComponent , title: 'Forgot Password' },
    
    { path: appPaths.resetPassword, component: ResetPasswordComponent , title: 'Reset Password' },
    
    { path: appPaths.adminAccess, component: AdminAccessComponent , title: 'Admin Access' },
    { path: appPaths.signOut, component: SignOutComponent },
    { path: 'provider', loadChildren: () => import('./provider-portal/provider-portal.module').then(m => m.ProviderPortalModule) },
    { path: 'school-district-admin', loadChildren: () => import('./school-district-admin-portal/school-district-admin.module').then(m => m.SchoolDistrictAdminModule) },
    { path: 'admin', loadChildren: () => import('./admin-portal/admin.module').then(m => m.AdminModule) },
    { path: '**', component: RouteResolverComponent },
];

@NgModule({
    exports: [RouterModule],
    imports: [RouterModule.forRoot(appRoutes, { onSameUrlNavigation: 'reload' })],
})
export class AppRoutingModule {}
