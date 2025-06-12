import { Data, Routes } from '@angular/router';

import { AuthGuard, ClaimValues } from '@mt-ng2/auth-module';

import { ClaimTypes } from '@model/ClaimTypes';
import { MyServiceOutcomesManagementComponent } from '@provider/case-load/components/provider-student-case-loads/case-load-options/student-therapies/therapy-case-note-managed-list/service-outcomes/service-outcomes.component';


const serviceOutcomeRoleGuard: Data = {
    claimType: ClaimTypes.ProviderGoals,
    claimValues: [ClaimValues.ReadOnly, ClaimValues.FullAccess],
    title: 'Service Outcomes',
};

export const serviceOutcomePaths = {
    serviceOutcomes: 'service-outcomes',
};

export const serviceOutcomeRoutes: Routes = [
    {
        canActivate: [AuthGuard],
        component: MyServiceOutcomesManagementComponent,
        data: serviceOutcomeRoleGuard,
        path: serviceOutcomePaths.serviceOutcomes,
    },
];
