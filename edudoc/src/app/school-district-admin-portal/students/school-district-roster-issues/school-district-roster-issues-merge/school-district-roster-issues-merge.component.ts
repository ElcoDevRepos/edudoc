// tslint:disable:member-ordering
import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { AbstractControl, UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ParentalConsentTypesEnum } from '@model/enums/parental-consent-types.enum';
import { ISchoolDistrictRoster } from '@model/interfaces/school-district-roster';
import { IStudent } from '@model/interfaces/student';
import {
    IStudentWithMergeStatus,
    StudentMergeStatuses
} from '../school-district-roster-issues-basic-info/school-district-roster-issues-basic-info.component';

export interface IMergedStudentResult {
    ParentalConsentEffectiveDate?: Date;
    ParentalConsentTypeId?: ParentalConsentTypesEnum;
    MergedRoster?: ISchoolDistrictRoster;
    StudentId?: number;
}

@Component({
    selector: 'app-school-district-roster-issues-merge',
    styles: ['.studentField{text-align: left;}'],
    templateUrl: './school-district-roster-issues-merge.component.html',
})
export class SchoolDistrictRosterIssuesMergeComponent implements OnChanges {
    @Input() schoolDistrictRoster: ISchoolDistrictRoster;

    private _studentToMerge: IStudentWithMergeStatus;
    get studentToMerge(): IStudentWithMergeStatus {
        return this._studentToMerge;
    }
    @Input('studentToMerge')
    set studentToMerge(studentToMerge: IStudentWithMergeStatus) {
        this._studentToMerge = studentToMerge;
        this.mergeResult = {
            StudentId: this.studentToMerge.student.Id,
        };
    }
    @Output() studentProcessed = new EventEmitter();
    @Output() mergeComplete = new EventEmitter();
    @Output() prevConflictEvent = new EventEmitter();
    @Output() nextConflictEvent = new EventEmitter();
    @Input() totalConflicts: number;
    @Input() studentIndex: number;

    get mergeSelected(): boolean {
        return this._studentToMerge.mergeStatus === StudentMergeStatuses.MERGED;
    }
    get keepSelected(): boolean {
        return this._studentToMerge.mergeStatus === StudentMergeStatuses.KEPT;
    }

    mergeResult: IMergedStudentResult;
    consentTypeName = '';

    studentForm: UntypedFormGroup;
    isHovered: boolean;
    doubleClickIsDisabled = false;

    // Fields for merging
    mergingFields = [
        ['StudentCode'],
        ['FirstName'],
        ['MiddleName'],
        ['LastName'],
        ['Grade'],
        ['DateOfBirth'],
        ['Address', 'Address1'],
        ['Address', 'Address2'],
        ['Address', 'City'],
        ['Address', 'StateCode'],
        ['Address', 'Zip'],
        ['School', 'Name', 'SchoolBuilding'],
    ];

    consentFields = [
        ['consent', 'ParentalConsentType'],
    ];

    formCheckboxes = [];
    mergeButtonIsActive = false;
    checkboxFormControls: AbstractControl[] = [];

    constructor(private router: Router, private fb: UntypedFormBuilder) {}

    ngOnChanges(): void {
        if (this.schoolDistrictRoster && this.studentToMerge) {
            this.formCheckboxes = [];
            this.buildForm(this.studentToMerge.student);
        } else {
            void this.router.navigate(['/students/issues']); // if no id found, go back to list
        }
    }

    private buildForm(student: IStudent): void {
        this.studentForm = this.fb.group({
            Form: this.fb.group({}),
        });

        this.loadFormOptions(student);
    }

    private loadFormOptions(student: IStudent): void {
        const merge = this.mergingFields.concat(this.consentFields);

        for (const field of merge) {
            const rosterField = field.slice(-1).toString();
            let fieldValue = '';
            if (field.length > 1) {
                if (field[0] === 'consent') {
                    fieldValue = student.StudentParentalConsents[0]?.StudentParentalConsentType?.Name || '';
                } else if (student[field[0]]) {
                    fieldValue = student[field[0]][field[1]];
                }
            } else {
                fieldValue = student[field[0]];
            }

            if (~rosterField.indexOf('Date') < 0) {
                fieldValue = new DatePipe('en-US').transform(fieldValue, 'MMM d, y').toString();
            }

            this.createFormFields(rosterField, fieldValue);
        }
    }

    private addSpaceToFormField(field: string): string {
        let result = field[0];
        for (let i = 1; i < field.length; i++) {
            if (field[i].toUpperCase() === field[i]) {
                result += ' ' + field[i];
            } else {
                result += field[i];
            }
        }
        return result;
    }

    private createFormFields(rosterField: string, fieldValue: string): void {
        this.formCheckboxes.push({
            label: `${this.addSpaceToFormField(rosterField)}:`,
            merging: false,
            value: fieldValue,
        });
    }

    checkStatus(): void {
        this.mergeButtonIsActive = this.checkboxFormControls.some((c) => c.value);
    }

    mergeStudent(): void {
        this.mergeResult.MergedRoster = this.schoolDistrictRoster;
        this.merge();
    }

    merge(): void {
        this.studentProcessed.emit({ data: this.mergeResult, mergeStatus: StudentMergeStatuses.MERGED });
    }

    keep(): void {
        this.studentProcessed.emit({ data: this.mergeResult, mergeStatus: StudentMergeStatuses.KEPT });
    }

    prevConflict(): void {
        this.prevConflictEvent.emit();
    }

    nextConflict(): void {
        this.nextConflictEvent.emit();
    }
}
