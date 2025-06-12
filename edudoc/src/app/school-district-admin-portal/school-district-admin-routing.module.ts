import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { studentParentalConsentRoutes } from '@common/student-parental-consents-list/student-parental-consent-routes.library';
import { studentMissingAddressesRoutes } from '@common/students-missing-addresses/student-missing-addresses-routes.library';
import { AuthGuard } from '@mt-ng2/auth-module';
import { appPaths } from '../default-routes/app-paths.library';
import { PathNotFoundResolveService } from '../default-routes/path-not-found-resolve.service';
import { DistrictAdminDashboardComponent } from './dashboard/district-admin-dashboard-component/district-admin-dashboard.component';
import { activitySummaryRoutes } from './reports/activity-summary-report/activity-summary-routes.library';
import { districtAdminEncountersRoutes } from './reports/district-admin-encounters/district-admin-encounter-routing.library';
import { districtProgressReportRoutes } from './reports/district-admin-progress-report/district-admin-progress-report-routes.library';
import { providerActivityDetailReportRoutes } from './reports/provider-activity-detail-report/provider-activity-detail-report-routes.library';
import { serviceAreaActivitySummaryRoutes } from './reports/service-area-activity-report/service-area-activity-summary-routes.library';
import { SchoolDistrictAdminNotFoundComponent } from './school-district-admin-common/school-district-admin-not-found/not-found.component';
import { SchoolDistrictAdminPortalGuard } from './school-district-admin-common/school-district-admin-portal.guard';
import { SchoolDistrictAdminComponent } from './school-district-admin.component';
import { districtAdminSchoolDistrictRoutes } from './school-district-admins/district-admin-school-district-routes.library';
import { studentRoutes } from './students/student-routes.library';
import { schoolDistrictAdminUserRoutes } from './users/school-district-admin-user-routes.library';
import { completedActivityReportRoutes } from './reports/completed-activity-report/completed-activity-report-routes.library';



const schoolDistrictAdminRoutes: Routes = [
    {
        canActivate: [AuthGuard, SchoolDistrictAdminPortalGuard],
        children: [
            {
                path: '',
                pathMatch: 'full',
                redirectTo: appPaths.home,
            },
            {
                component: DistrictAdminDashboardComponent,
                path: appPaths.home,
            },
            ...activitySummaryRoutes,
            ...districtAdminEncountersRoutes,
            ...serviceAreaActivitySummaryRoutes,
            ...providerActivityDetailReportRoutes,
            ...districtAdminSchoolDistrictRoutes,
            ...studentRoutes,
            ...schoolDistrictAdminUserRoutes,
            ...studentParentalConsentRoutes,
            ...studentMissingAddressesRoutes,
            ...districtProgressReportRoutes,
            ...completedActivityReportRoutes,
            { path: '**', component: SchoolDistrictAdminNotFoundComponent, resolve: { path: PathNotFoundResolveService } },
        ],
        component: SchoolDistrictAdminComponent,
        path: '',
    },
];

@NgModule({
    exports: [RouterModule],
    imports: [RouterModule.forChild(schoolDistrictAdminRoutes)],
})
export class SchoolDistrictAdminRoutingModule {}
