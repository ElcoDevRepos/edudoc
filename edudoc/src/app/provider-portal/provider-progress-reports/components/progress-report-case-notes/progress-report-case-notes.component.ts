import { Component, Input } from '@angular/core';
import { IProgressReportCaseNotesDto } from '@model/interfaces/custom/progress-report-case-notes.dto';

@Component({
    selector: 'app-progress-report-case-notes',
    templateUrl: './progress-report-case-notes.component.html',
})
export class ProgressReportCaseNotesComponent {
    @Input() caseNotes: IProgressReportCaseNotesDto[];

    

}
