import { NgModule } from '@angular/core';
import { SharedModule } from '@common/shared.module';
import { EntityComponentsDocumentsModule } from '@mt-ng2/entity-components-documents';
import { StudentModule } from '@school-district-admin/students/student.module';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { ProviderStudentAddComponent } from './components/provider-student-add/provider-student-add.component';
import { ProviderStudentAssistantComponent } from './components/provider-student-assistant/provider-student-assistant.component';
import { ProviderStudentBasicInfoComponent } from './components/provider-student-basic-info/provider-student-basic-info.component';
import { AddCaseLoadComponent } from './components/provider-student-case-loads/add-case-load.component';
import { CaseLoadCptCodesComponent } from './components/provider-student-case-loads/case-load-options/case-load-cpt-codes/case-load-cpt-codes.component';
import { CaseLoadGoalsComponent } from './components/provider-student-case-loads/case-load-options/case-load-goals/case-load-goals.component';
import { CaseLoadMethodsComponent } from './components/provider-student-case-loads/case-load-options/case-load-methods/case-load-methods.component';
import { AddCaseLoadScriptComponent } from './components/provider-student-case-loads/case-load-options/case-load-scripts/add-case-load-script.component';
import { CaseLoadScriptGoalsComponent } from './components/provider-student-case-loads/case-load-options/case-load-scripts/case-load-script-goals/case-load-script-goals.component';
import { CaseLoadScriptsComponent } from './components/provider-student-case-loads/case-load-options/case-load-scripts/case-load-scripts.component';
import { AddStudentTherapyComponent } from './components/provider-student-case-loads/case-load-options/student-therapies/add-student-therapy/add-student-therapy.component';
import { StudentTherapyScheduleByDayComponent } from './components/provider-student-case-loads/case-load-options/student-therapies/student-therapy-schedule-by-day-list/student-therapy-schedule-by-day-list.component';
import { StudentTherapyScheduleCalendarComponent } from './components/provider-student-case-loads/case-load-options/student-therapies/student-therapy-schedule-list/student-therapy-schedule-calendar/student-therapy-calendar.component';
import { StudentTherapySchedulesComponent } from './components/provider-student-case-loads/case-load-options/student-therapies/student-therapy-schedule-list/student-therapy-schedules.component';
import { StudentTherapiesComponent } from './components/provider-student-case-loads/case-load-options/student-therapies/student-therapy.component';
import { MyServiceOutcomesManagementComponent } from './components/provider-student-case-loads/case-load-options/student-therapies/therapy-case-note-managed-list/service-outcomes/service-outcomes.component';
import { TherapyCaseNoteManagedListComponent } from './components/provider-student-case-loads/case-load-options/student-therapies/therapy-case-note-managed-list/therapy-case-note-managed-list.component';
import { ProviderStudentDetailsComponent } from './components/provider-student-details/provider-student-details.component';
import { ProviderStudentDistrictSelectionComponent } from './components/provider-student-district-selection/provider-student-district-selection.component';
import { ProviderStudentHeaderComponent } from './components/provider-student-header/provider-student-header.component';
import { ProviderStudentReferralsComponent } from './components/provider-student-referrals/provider-student-referrals.component';
import { ProviderStudentSupervisorComponent } from './components/provider-student-supervisor/provider-student-supervisor.component';
import { ProviderCaseloadsComponent } from './components/provider-students-list/provider-caseloads.component';
import { ReferralCellDynamicCellComponent } from './components/provider-students-list/referral-cell/referral-cell.component';
import { ReferralReminderCellDynamicCellComponent } from './components/provider-students-list/referral-reminder-cell/referral-reminder-cell.component';
import { ProviderReferralBasicInfoComponent } from './components/provider-student-referrals-basic-info/provider-student-referrals-basic-info.component';
import { PendingChangesGuard } from './services/case-load.guard';
import { IncompleteProfileCellDynamicCellComponent } from './components/provider-students-list/incomplete-profile-cell/incomplete-profile-cell.component';
import { ProviderStudentAssistantUpdateComponent } from './components/provider-student-assistant-update/provider-student-assistant-update.component';
import { ProviderStudentSupervisorUpdateComponent } from './components/provider-student-supervisor-update/provider-student-supervisor-update.component';

@NgModule({
    declarations: [
        ProviderCaseloadsComponent,
        ProviderStudentDetailsComponent,
        ProviderStudentBasicInfoComponent,
        ProviderStudentHeaderComponent,
        ProviderStudentSupervisorComponent,
        ProviderStudentAssistantComponent,
        ProviderStudentAddComponent,
        AddCaseLoadComponent,
        CaseLoadCptCodesComponent,
        CaseLoadGoalsComponent,
        CaseLoadMethodsComponent,
        CaseLoadScriptsComponent,
        CaseLoadScriptGoalsComponent,
        AddCaseLoadScriptComponent,
        StudentTherapiesComponent,
        AddStudentTherapyComponent,
        StudentTherapyScheduleCalendarComponent,
        StudentTherapySchedulesComponent,
        StudentTherapyScheduleByDayComponent,
        TherapyCaseNoteManagedListComponent,
        MyServiceOutcomesManagementComponent,
        ReferralCellDynamicCellComponent,
        ReferralReminderCellDynamicCellComponent,
        ProviderStudentReferralsComponent,
        ProviderStudentDistrictSelectionComponent,
        ProviderReferralBasicInfoComponent,
        IncompleteProfileCellDynamicCellComponent,
        ProviderStudentAssistantUpdateComponent,
        ProviderStudentSupervisorUpdateComponent
    ],
    exports: [ReferralCellDynamicCellComponent, ReferralReminderCellDynamicCellComponent, MyServiceOutcomesManagementComponent],
    imports: [
        SharedModule,
        CalendarModule.forRoot({
            provide: DateAdapter,
            useFactory: adapterFactory,
        }),
        EntityComponentsDocumentsModule,
        StudentModule,
    ],
    providers: [PendingChangesGuard],
})
export class CaseLoadModule {}
