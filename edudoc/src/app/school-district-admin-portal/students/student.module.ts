import { ModuleWithProviders, NgModule } from '@angular/core';

import { SharedModule } from '@common/shared.module';

import { StudentBasicInfoComponent } from './student-basic-info/student-basic-info.component';
import { StudentDetailComponent } from './student-detail/student-detail.component';
import { StudentHeaderComponent } from './student-header/student-header.component';
import { StudentsComponent } from './student-list/students.component';

import { DistrictManagementReportComponent } from '@school-district-admin/reports/district-management-report/district-management-report.component';
import { DistrictAdminStudentReferralsComponent } from './district-admin-student-referrals/district-admin-student-referrals.component';
import { MergeStudentsBasicInfoComponent } from './merge-students/merge-students-basic-info/merge-students-basic-info.component';
import { MergeStudentsDetailComponent } from './merge-students/merge-students-detail/merge-students-detail.component';
import { MergeStudentsHeaderComponent } from './merge-students/merge-students-header/merge-students-header.component';
import { MergeStudentsComponent } from './merge-students/merge-students-list/merge-students.component';
import { MergeStudentsMergeComponent } from './merge-students/merge-students-merge/merge-students-merge.component';
import { ProviderCaseUploadIssuesBasicInfoComponent } from './provider-case-upload-issues/provider-case-upload-basic-info/provider-case-upload-issues-basic-info.component';
import { ProviderCaseUploadIssuesHeaderComponent } from './provider-case-upload-issues/provider-case-upload-header/provider-case-upload-issues-header.component';
import { ProviderCaseUploadIssuesDetailComponent } from './provider-case-upload-issues/provider-case-upload-issues-detail/provider-case-upload-issues-detail.component';
import { ProviderCaseUploadIssuesComponent } from './provider-case-upload-issues/provider-case-upload-issues-list/provider-case-upload-issues.component';
import { ProviderCaseUploadIssuesService } from './provider-case-upload-issues/provider-case-upload-issues.service';
import { SchoolDistrictRosterIssuesBasicInfoComponent } from './school-district-roster-issues/school-district-roster-issues-basic-info/school-district-roster-issues-basic-info.component';
import { SchoolDistrictRosterIssuesDetailComponent } from './school-district-roster-issues/school-district-roster-issues-detail/school-district-roster-issues-detail.component';
import { SchoolDistrictRosterIssuesHeaderComponent } from './school-district-roster-issues/school-district-roster-issues-header/school-district-roster-issues-header.component';
import { SchoolDistrictRosterIssuesComponent } from './school-district-roster-issues/school-district-roster-issues-list/school-district-roster-issues.component';
import { SchoolDistrictRosterIssuesMergeComponent } from './school-district-roster-issues/school-district-roster-issues-merge/school-district-roster-issues-merge.component';
import { SchoolDistrictRosterIssuesService } from './school-district-roster-issues/school-district-roster-issues.service';
import { StudentIepServicesComponent } from './student-iep-services/student-iep-services.component';
import { StudentParentalConsentComponent } from './student-parental-consent/student-parental-consent.component';
import { StudentParentalConsentTypeService } from './studentparentalconsenttype.service';

@NgModule({
    declarations: [
        StudentsComponent,
        StudentHeaderComponent,
        StudentDetailComponent,
        StudentBasicInfoComponent,
        StudentIepServicesComponent,
        SchoolDistrictRosterIssuesComponent,
        SchoolDistrictRosterIssuesBasicInfoComponent,
        StudentParentalConsentComponent,
        SchoolDistrictRosterIssuesDetailComponent,
        SchoolDistrictRosterIssuesHeaderComponent,
        SchoolDistrictRosterIssuesMergeComponent,
        MergeStudentsComponent,
        MergeStudentsBasicInfoComponent,
        MergeStudentsDetailComponent,
        MergeStudentsHeaderComponent,
        MergeStudentsMergeComponent,
        DistrictAdminStudentReferralsComponent,
        ProviderCaseUploadIssuesComponent,
        ProviderCaseUploadIssuesHeaderComponent,
        ProviderCaseUploadIssuesBasicInfoComponent,
        ProviderCaseUploadIssuesDetailComponent,
        DistrictManagementReportComponent,
    ],
    exports: [StudentIepServicesComponent],
    imports: [SharedModule],
})
export class StudentModule {
    static forRoot(): ModuleWithProviders<StudentModule> {
        return {
            ngModule: StudentModule,
            providers: [StudentParentalConsentTypeService, SchoolDistrictRosterIssuesService, ProviderCaseUploadIssuesService],
        };
    }
}
