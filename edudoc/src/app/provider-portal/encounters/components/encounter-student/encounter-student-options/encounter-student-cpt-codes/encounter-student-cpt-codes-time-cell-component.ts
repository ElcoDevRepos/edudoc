import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { IEncounterStudentCptCode } from '@model/interfaces/encounter-student-cpt-code';
import { NotificationsService } from '@mt-ng2/notifications-module';
import { EncounterStudentCptCodesService } from '@provider/encounters/services/encounter-student-cpt-codes.service';

@Component({
    selector: 'app-encounter-student-cpt-codes-time-cell',
    styles: [],
    templateUrl: 'encounter-student-cpt-codes-time-cell-component.html',
})
export class EncounterStudentCptCodesTimeCellComponent {
    @Input() encounterStudentCptCode: IEncounterStudentCptCode;

    @ViewChild('timeInput') timeInput: ElementRef;

    isEditing = false;
    time: number;

    constructor(private encounterStudentCptCodesService: EncounterStudentCptCodesService, private notificationService: NotificationsService) {}

    edit(): void {
        this.isEditing = true;
        this.time = this.encounterStudentCptCode ? this.encounterStudentCptCode.Minutes : null;
        setTimeout(() => this.timeInput.nativeElement.focus());
    }

    cancel(): void {
        this.isEditing = false;
        this.time = null;
    }

    save(): void {
        if (this.time != null) {
            this.encounterStudentCptCode.Minutes = this.time;
            if (this.encounterStudentCptCode.Id > 0) {
                this.encounterStudentCptCodesService
                    .update(this.encounterStudentCptCode)
                    .subscribe(() => this.notificationService.success('Procedure time updated successfully.'));
            } else {
                this.notificationService.success('Procedure time saved successfully.');
            }
            this.isEditing = false;
        } else {
            this.notificationService.error('Save failed.  Please check the field and try again.');
        }
    }
}
