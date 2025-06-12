import { Routes } from '@angular/router';
import { AuthGuard } from '@mt-ng2/auth-module';
import { DistrictAdminCompletedActivityReportComponent } from './completed-activity-report.component';

export const completedActivityReportRoutes: Routes = [
    {
        canActivate: [AuthGuard],
        component: DistrictAdminCompletedActivityReportComponent,
        path: 'completed-activity-report',
    },
];
