import { Routes } from '@angular/router';
import { ClaimTypes } from '@model/ClaimTypes';
import { AuthGuard, ClaimValues } from '@mt-ng2/auth-module';
import { ProviderDashboardComponent } from './provider-dashboard-component/provider-dashboard.component';
import { ProviderDashboardHeaderComponent } from './provider-dashboard-header/provider-dashboard-header.component';

const dashboardRoleGuard = {
    claimType: ClaimTypes.MyCaseload,
    claimValues: [ClaimValues.ReadOnly, ClaimValues.FullAccess],
    title: 'Dashboard',
};

export const dashboardRoutes: Routes = [
    {
        canActivate: [AuthGuard],
        children: [{ path: '', component: ProviderDashboardComponent, pathMatch: 'full' }],
        component: ProviderDashboardHeaderComponent,
        data: dashboardRoleGuard,
        path: 'dashboard',
    },
];
