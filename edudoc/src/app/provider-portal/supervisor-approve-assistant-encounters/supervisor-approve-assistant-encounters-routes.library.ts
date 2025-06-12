import { Routes } from '@angular/router';

import { ClaimTypes } from '@model/ClaimTypes';
import { AuthGuard, ClaimValues } from '@mt-ng2/auth-module';
import { SupervisorApproveAssistantEncountersComponent } from './supervisor-approve-assistant-encounters.component';

const supervisorApproveAssistantEncountersRoleGuard = {
    claimType: ClaimTypes.Encounters,
    claimValues: [ClaimValues.FullAccess],
    title: 'Assistant Encounters',
};

export const supervisorApproveAssistanteEncountersRoute: Routes = [
    {
        canActivate: [AuthGuard],
        component: SupervisorApproveAssistantEncountersComponent,
        data: supervisorApproveAssistantEncountersRoleGuard,
        path: 'approve-assistant-encounters',
    },
];
