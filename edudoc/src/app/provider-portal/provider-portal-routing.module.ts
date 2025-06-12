import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { encountersRoutes, encounterTreatmentTherapyRoutes, encounterEvaluationRoutes, encounterNonMspRoutes } from './encounters/encounter-routes.library';

import { AuthGuard } from '@mt-ng2/auth-module';
import { PathNotFoundResolveService } from '../default-routes/path-not-found-resolve.service';
import { acknowledgmentsRoutes } from './acknowledgments/acknowledgments-routes.library';
import { caseLoadstudentRoutes } from './case-load/case-load-routes.library';
import { dashboardRoutes } from './dashboard/provider-dashboard-routes.library';
import { missingReferralsRoutes } from './missing-referrals/missing-referrals-routes.library';
import { ProviderNotFoundComponent } from './provider-common/provider-not-found/not-found.component';
import { ProviderPortalGuard } from './provider-common/provider-portal.guard';
import { ProviderPortalComponent } from './provider-portal.component';
import { progressReportRoutes } from './provider-progress-reports/progress-reports-routes.library';
import { providerReportsRoutes } from './provider-reports/provider-reports-routes.library';
import { supervisorApproveAssistanteEncountersRoute } from './supervisor-approve-assistant-encounters/supervisor-approve-assistant-encounters-routes.library';
import { providerUserRoutes } from './users/provider-user-routes.library';

const providerRoutes: Routes = [
    {
        canActivate: [AuthGuard, ProviderPortalGuard],
        children: [
            {
                path: 'provider/',
                pathMatch: 'full',
                redirectTo: 'provider/dashboard',
            },
            ...acknowledgmentsRoutes,
            ...caseLoadstudentRoutes,
            ...dashboardRoutes,
            ...encountersRoutes,
            ...encounterTreatmentTherapyRoutes,
            ...encounterEvaluationRoutes,
            ...encounterNonMspRoutes,
            ...providerUserRoutes,
            ...missingReferralsRoutes,
            ...supervisorApproveAssistanteEncountersRoute,
            ...providerReportsRoutes,
            ...progressReportRoutes,
            { path: '**', component: ProviderNotFoundComponent, resolve: { path: PathNotFoundResolveService } },
        ],
        component: ProviderPortalComponent,
        path: '',
    },
];

@NgModule({
    exports: [RouterModule],
    imports: [RouterModule.forChild(providerRoutes)],
})
export class ProviderPortalRoutingModule {}
