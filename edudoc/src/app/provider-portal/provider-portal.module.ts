import { NgModule } from '@angular/core';
import { SharedModule } from '@common/shared.module';
import { ModalModule } from '@mt-ng2/modal-module';
import { AcknowledgmentsModule } from './acknowledgments/acknowledgments.module';
import { CaseLoadModule } from './case-load/case-load.module';
import { ElectronicSignatureModalComponent } from './common/electronic-signature-modal/electronic-signature-modal.component';
import { SupervisorApprovalModalComponent } from './common/supervisor-approval-modal/supervisor-approval-modal.component';
import { ProviderDashboardModule } from './dashboard/provider-dashboard.module';
import { EncounterModule } from './encounters/encounter.module';
import { MissingReferralsModule } from './missing-referrals/missing-referrals.module';
import { ProviderNavModule } from './nav/provider-nav.module';
import { ProviderNotFoundComponent } from './provider-common/provider-not-found/not-found.component';
import { ProviderPortalGuard } from './provider-common/provider-portal.guard';
import { ProviderSharedModule } from './provider-common/provider-shared.module';
import { ProviderPortalRoutingModule } from './provider-portal-routing.module';
import { ProviderPortalComponent } from './provider-portal.component';
import { ProgressReportModule } from './provider-progress-reports/progress-report.module';
import { ProviderReportsModule } from './provider-reports/provider-reports.module';
import { SupervisorApproveAssistantEncountersComponent } from './supervisor-approve-assistant-encounters/supervisor-approve-assistant-encounters.component';
import { ProviderUserModule } from './users/provider-user.module';
import { AdminModule } from '../admin-portal/admin.module';


@NgModule({
    declarations: [
        ProviderPortalComponent,
        ProviderNotFoundComponent,
        ElectronicSignatureModalComponent,
        SupervisorApprovalModalComponent,
        SupervisorApproveAssistantEncountersComponent,

    ],
    imports: [
        AcknowledgmentsModule,
        ProviderSharedModule,
        ModalModule,
        ProviderPortalRoutingModule,
        EncounterModule,
        CaseLoadModule,
        ProviderReportsModule,
        ProgressReportModule,
        ProviderDashboardModule,
        ProviderNavModule.forRoot(),
        ProviderUserModule,
        MissingReferralsModule,
        SharedModule,
        AdminModule,
    ],
    providers: [ProviderPortalGuard]
})
export class ProviderPortalModule {}
