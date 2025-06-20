import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '@common/shared.module';
import { AuthModule } from '@mt-ng2/auth-module';
import { AdminNotFoundComponent } from './admin-common/admin-not-found/not-found.component';
import { AdminPortalGuard } from './admin-common/admin-portal.guard';
import { AdminRoutingModule } from './admin-routing.module';
import { AdminComponent } from './admin.component';
import { V5WrapperComponent } from './v5-wrapper/v5-wrapper.component';
import { AnnualEntriesModule } from './annual-entries/annual-entries.module';
import { AuditsModule } from './audits/audits.module';
import { BillingFailuresModule } from './billing-failures/billing-failures.module';
import { BillingReversalsModule } from './billing-reversals/billing-reversals.module';
import { BillingScheduleModule } from './billing-schedules/billing-schedule.module';
import { ClaimsModule } from './claims/claims.module';
import { CptCodeModule } from './cpt-codes/cpt-code.module';
import { DiagnosisCodeModule } from './diagnosis-codes/diagnosis-code.module';
import { EdiResponseErrorCodesModule } from './edi-response-error-codes-management/edi-response-error-codes.module';
import { EncountersModule } from './encounters/encounter.module';
import { EscModule } from './escs/esc.module';
import { EvaluationTypesModule } from './evaluation-type-management/evaluation-types.module';
import { GoalModule } from './goals/goal.module';
import { ManagedListItemsModule } from './managed-list-items/managed-list-items.module';
import { MessageDocumentModule } from './message/message-documents/message-document.module';
import { MessageLinkModule } from './message/message-links/message-link.module';
import { MessageModule } from './message/messages/messages.module';
import { MyReasonsForReturnModule } from './my-reasons-for-return-management/my-reasons-for-return.module';
import { AppNavModule } from './nav/admin-nav.module';
import { ProviderAttestationsModule } from './provider-attestations/provider-attestations.module';
import { ProviderTitleModule } from './provider-titles/provider-title.module';
import { ProviderModule } from './providers/provider.module';
import { ReportsModule } from './reports/reports.module';
import { RosterValidationModule } from './roster-validations/roster-validation.module';
import { DistrictAdminSchoolDistrictModule } from './school-district-admins/district-admin-school-district.module';
import { SchoolDistrictModule } from './school-districts/school-district.module';
import { ServiceUnitRuleModule } from './service-unit-rules/service-unit-rules.module';
import { AppSettingsComponent } from './settings/app-settings.component';
import { StudentModule } from './students/student.module';
import { SummaryReportModule } from './summary-report/summary-report.module';
import { UserRoleModule } from './user-roles/user-roles.module';
import { UserModule } from './users/user.module';
import { VoucherModule } from './vouchers/voucher.module';
import { CaseLoadModule } from '@provider/case-load/case-load.module';
import { NursingGoalResultModule } from './nurse-progress-quick-text/nursing-goal-result.module';
import { DataImportModule } from './data-import/data-import.module';

@NgModule({
    declarations: [
        AdminComponent, 
        AppSettingsComponent, 
        AdminNotFoundComponent,
        V5WrapperComponent
    ],
    imports: [
        CommonModule,
        UserRoleModule,
        UserModule,
        CptCodeModule,
        DiagnosisCodeModule,
        EscModule,
        EvaluationTypesModule,
        ClaimsModule,
        GoalModule,
        EncountersModule,
        BillingReversalsModule,
        AuditsModule,
        ManagedListItemsModule,
        MessageLinkModule,
        MessageDocumentModule,
        MessageModule,
        ProviderTitleModule,
        ProviderModule,
        DistrictAdminSchoolDistrictModule,
        SchoolDistrictModule,
        StudentModule,
        ReportsModule,
        MyReasonsForReturnModule,
        EdiResponseErrorCodesModule,
        BillingScheduleModule,
        BillingFailuresModule,
        RosterValidationModule,
        AdminRoutingModule,
        ServiceUnitRuleModule,
        ProviderAttestationsModule,
        AppNavModule.forRoot(),
        SharedModule,
        ReportsModule,
        SummaryReportModule,
        VoucherModule,
        AnnualEntriesModule,
        AuthModule,
        CaseLoadModule,
        NursingGoalResultModule,
        DataImportModule
    ],
    providers: [AdminPortalGuard],
})
export class AdminModule {}
