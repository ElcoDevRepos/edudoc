// tslint:disable:member-ordering
import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ParentalConsentTypesEnum } from '@model/enums/parental-consent-types.enum';
import { IProviderCaseUpload } from '@model/interfaces/provider-case-upload';
import { IStudent } from '@model/interfaces/student';
import { IStudentWithMergeStatus, StudentMergeStatuses } from '@school-district-admin/students/school-district-roster-issues/school-district-roster-issues-basic-info/school-district-roster-issues-basic-info.component';

export interface IMergedStudentResultCaseUpload {
    ParentalConsentEffectiveDate?: Date;
    ParentalConsentTypeId?: ParentalConsentTypesEnum;
    MergedCaseUpload?: IProviderCaseUpload;
    StudentId?: number;
}

@Component({
    selector: 'app-provider-case-upload-issues-merge',
    styles: ['.studentField{text-align: left;}'],
    templateUrl: './provider-case-upload-issues-merge.component.html',
})
export class ProviderCaseUploadIssuesMergeComponent implements OnInit {
    @Input() providerCaseUpload: IProviderCaseUpload;

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
    @Input() totalConflicts: number;

    mergeResult: IMergedStudentResultCaseUpload;
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

    ngOnInit(): void {
        if (this.providerCaseUpload && this.studentToMerge) {
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
            let fieldValue: string | number | Date = field.length > 1 ?
                (field[0] !== 'consent' ?
                    student[field[0]][field[1]] :
                    student.StudentParentalConsents[0]?.StudentParentalConsentType?.Name || '') :
                student[field[0]];

            if (~rosterField.indexOf('Date') < 0) {
                fieldValue = new DatePipe('en-US').transform(fieldValue, 'MMM d, y').toString();
            }

            this.createFormFields(rosterField, fieldValue.toString());
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

    getControl(evt: AbstractControl): void {
        this.checkboxFormControls.push(evt);
    }

    mergeStudent(): void {
        this.mergeResult.MergedCaseUpload = this.providerCaseUpload;
        this.merge();
    }

    merge(): void {
        this.studentProcessed.emit({ data: this.mergeResult, mergeStatus: StudentMergeStatuses.MERGED });
    }

    keep(): void {
        this.studentProcessed.emit({ data: this.mergeResult, mergeStatus: StudentMergeStatuses.KEPT });
    }
}
