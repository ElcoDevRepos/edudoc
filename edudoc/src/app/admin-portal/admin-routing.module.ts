import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { studentMissingAddressesRoutes } from '@common/students-missing-addresses/student-missing-addresses-routes.library';
import { studentParentalConsentRoutes } from '@common/student-parental-consents-list/student-parental-consent-routes.library';
import { ClaimTypes } from '@model/ClaimTypes';
import { AuthGuard, ClaimValues, IRoleGuarded } from '@mt-ng2/auth-module';
import { appPaths } from '../default-routes/app-paths.library';
import { PathNotFoundResolveService } from '../default-routes/path-not-found-resolve.service';
import { AdminNotFoundComponent } from './admin-common/admin-not-found/not-found.component';
import { AdminPortalGuard } from './admin-common/admin-portal.guard';
import { AdminComponent } from './admin.component';
import { annualEntryRoutes } from './annual-entries/annual-entries-routes.library';
import { auditsRoutes } from './audits/audits-routing.library';
import { billingFailureRoutes } from './billing-failures/billing-failures-routes.library';
import { billingScheduleRoutes } from './billing-schedules/billing-schedule-routes.library';
import { claimsRoutes } from './claims/claims-routing.library';
import { cptCodeRoutes } from './cpt-codes/cpt-code-routes.library';
import { diagnosisCodeRoutes } from './diagnosis-codes/diagnosis-code-routing.library';
import { ediResponseErrorCodesRoutes } from './edi-response-error-codes-management/edi-response-error-codes-routing.library';
import { encountersRoutes } from './encounters/encounter-routing.library';
import { escRoutes } from './escs/esc-routing.library';
import { evaluationTypesRoutes } from './evaluation-type-management/evaluation-types-routing.library';
import { goalRoutes } from './goals/goal-routing.library';
import { managedListRoutes } from './managed-list-items/managed-list-items-routes.library';
import { messageDocumentRoutes } from './message/message-documents/message-document-routing.library';
import { messageLinkRoutes } from './message/message-links/message-link-routing.library';
import { messageRoutes } from './message/messages/message-routing.library';
import { myReasonsForReturnRoutes } from './my-reasons-for-return-management/my-reasons-for-return-routing.library';
import { attestationsRoutes } from './provider-attestations/provider-attestations-routes.library';
import { providerTitleRoutes } from './provider-titles/provider-title-routing.library';
import { providerTrainingRoutes } from './provider-trainings/provider-trainings-routes.library';
import { providerRoutes } from './providers/provider-routing.library';
import { fiscalReportRoutes } from './reports/reports-routes.library';
import { rosterValidationRoutes } from './roster-validations/roster-validation-routes.library';
import { districtAdminSchoolDistrictRoutes } from './school-district-admins/district-admin-school-district-routing.library';
import { schoolDistrictRoutes } from './school-districts/school-district-routing.library';
import { serviceOutcomeRoutes } from './service-outcomes/service-outcomes-routing.module';
import { serviceUnitRuleRoutes } from './service-unit-rules/service-unit-rules-routing.library';
import { AppSettingsComponent } from './settings/app-settings.component';
import { studentRoutes } from './students/student-routes.library';
import { summaryReportRoutes } from './summary-report/summary-report-route.library';
import { userRoleRoutes } from './user-roles/user-role-routes.library';
import { adminUserRoutes } from './users/admin-user-routes.library';
import { voucherRoutes } from './vouchers/voucher-routes.library';
import { dataImportRoutes } from './data-import/data-import-routes.library';
import { V5WrapperComponent } from './v5-wrapper/v5-wrapper.component';

const homeRoleGuard: IRoleGuarded = {
    claimType: ClaimTypes.Users,
    claimValues: [ClaimValues.ReadOnly, ClaimValues.FullAccess],
    isHomePage: true,
};

const adminRoutes: Routes = [
    {
        canActivate: [AuthGuard, AdminPortalGuard],
        children: [
            {
                component: AppSettingsComponent,
                path: appPaths.settings,
            },
            {
                component: V5WrapperComponent,
                path: 'v5-app',
                data: {
                    title: 'New App (v5)'
                }
            },
            {
                data: homeRoleGuard,
                path: '',
                pathMatch: 'full',
                redirectTo: appPaths.myProfile,
            },
            {
                data: homeRoleGuard,
                path: appPaths.home,
                pathMatch: 'full',
                redirectTo: appPaths.myProfile,
            },
            ...attestationsRoutes,
            ...providerTrainingRoutes,
            ...cptCodeRoutes,
            ...diagnosisCodeRoutes,
            ...escRoutes,
            ...evaluationTypesRoutes,
            ...goalRoutes,
            ...messageDocumentRoutes,
            ...messageLinkRoutes,
            ...messageRoutes,
            ...providerTitleRoutes,
            ...providerRoutes,
            ...schoolDistrictRoutes,
            ...districtAdminSchoolDistrictRoutes,
            ...studentRoutes,
            ...adminUserRoutes,
            ...userRoleRoutes,
            ...managedListRoutes,
            ...claimsRoutes,
            ...myReasonsForReturnRoutes,
            ...encountersRoutes,
            ...billingScheduleRoutes,
            ...rosterValidationRoutes,
            ...serviceUnitRuleRoutes,
            ...ediResponseErrorCodesRoutes,
            ...studentParentalConsentRoutes,
            ...studentMissingAddressesRoutes,
            ...billingFailureRoutes,
            ...summaryReportRoutes,
            ...fiscalReportRoutes,
            ...voucherRoutes,
            ...auditsRoutes,
            ...annualEntryRoutes,
            ...serviceOutcomeRoutes,
            ...dataImportRoutes,
            { path: '**', component: AdminNotFoundComponent, data: homeRoleGuard, resolve: { path: PathNotFoundResolveService } },
        ],
        component: AdminComponent,
        path: '',
    },
];

@NgModule({
    exports: [RouterModule],
    imports: [RouterModule.forChild(adminRoutes)],
})
export class AdminRoutingModule {}
