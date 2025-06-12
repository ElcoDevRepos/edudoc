import { NgModule } from '@angular/core';

import { SharedModule } from '@common/shared.module';
import { RtcSignalrModule } from '@mt-ng2/rtc-module';
import { ResponseUploadCellDynamicCellComponent } from './roster-validation-files-list/response-upload-cell/response-upload-cell.component';
import { RosterValidationFilesComponent } from './roster-validation-files-list/roster-validation-files.component';
import { Student271UploadsComponent } from './student-271-uploads/students-271-uploads.component';

@NgModule({
    declarations: [
        RosterValidationFilesComponent,
        ResponseUploadCellDynamicCellComponent,
        Student271UploadsComponent,
    ],
    imports: [SharedModule, RtcSignalrModule],
})
export class RosterValidationModule {}
