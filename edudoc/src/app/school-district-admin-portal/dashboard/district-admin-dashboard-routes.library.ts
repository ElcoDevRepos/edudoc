import { Routes } from '@angular/router';
import { ClaimTypes } from '@model/ClaimTypes';
import { AuthGuard, ClaimValues } from '@mt-ng2/auth-module';
import { DistrictAdminDashboardComponent } from './district-admin-dashboard-component/district-admin-dashboard.component';
import { DistrictAdminDashboardHeaderComponent } from './district-admin-dashboard-header/district-admin-dashboard-header.component';

const dashboardRoleGuard = {
    claimType: ClaimTypes.ReviewParentConsent,
    claimValues: [ClaimValues.ReadOnly, ClaimValues.FullAccess],
    title: 'Dashboard',
};

export const dashboardRoutes: Routes = [
    {
        canActivate: [AuthGuard],
        children: [{ path: '', component: DistrictAdminDashboardComponent, pathMatch: 'full' }],
        component: DistrictAdminDashboardHeaderComponent,
        data: dashboardRoleGuard,
        path: '/school-district-admin/home',
    },
];
