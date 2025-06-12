import { NgModule } from '@angular/core';

import { SharedModule } from '@common/shared.module';
import { ModalModule } from '@mt-ng2/modal-module';
import { ProgressReportCaseNotesComponent } from './components/progress-report-case-notes/progress-report-case-notes.component';
import { ProgressReportDetailsComponent } from './components/progress-report-details/progress-report-details.component';
import { ProgressReportBasicInfoComponent } from './components/progress-reports-basic-info/progress-report-basic-info.component';
import { ProgressReportsListComponent } from './components/progress-reports-list/progress-reports-list.component';

@NgModule({
    declarations: [
        ProgressReportDetailsComponent,
        ProgressReportBasicInfoComponent,
        ProgressReportsListComponent,
        ProgressReportCaseNotesComponent,
    ],
    exports: [
        ProgressReportBasicInfoComponent,
        ProgressReportCaseNotesComponent,
    ],
    imports: [SharedModule, ModalModule],
})
export class ProgressReportModule {}
