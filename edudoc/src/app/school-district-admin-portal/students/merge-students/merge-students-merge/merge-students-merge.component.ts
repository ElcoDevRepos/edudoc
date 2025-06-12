// tslint:disable:member-ordering
import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ParentalConsentTypesEnum } from '@model/enums/parental-consent-types.enum';
import { ISchoolDistrictRoster } from '@model/interfaces/school-district-roster';
import { IStudent } from '@model/interfaces/student';
import { IStudentParentalConsent } from '@model/interfaces/student-parental-consent';

export interface IMergedStudentResult {
    ParentalConsentEffectiveDate?: Date;
    ParentalConsentTypeId?: ParentalConsentTypesEnum;
    MergedRoster?: ISchoolDistrictRoster;
    StudentId?: number;
}

@Component({
    selector: 'app-merge-students-merge',
    styles: ['.studentField{text-align: left;}'],
    templateUrl: './merge-students-merge.component.html',
})
export class MergeStudentsMergeComponent implements OnInit {
    @Input() schoolDistrictRoster: ISchoolDistrictRoster;

    private _studentToMerge: IStudent;
    get studentToMerge(): IStudent {
        return this._studentToMerge;
    }
    @Input('studentToMerge')
    set studentToMerge(studentToMerge: IStudent) {
        this._studentToMerge = studentToMerge;
        this.mergeResult = {
            StudentId: this.studentToMerge.Id,
        };
    }
    @Input()
    latestConsentToMerge?: IStudentParentalConsent;
    @Output() mergeStudent = new EventEmitter();

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

    formCheckboxes = [];

    constructor(private router: Router, private fb: UntypedFormBuilder) {}

    ngOnInit(): void {
        this.buildForm(this.studentToMerge);
    }

    private buildForm(student: IStudent): void {
        this.studentForm = this.fb.group({
            Form: this.fb.group({}),
        });

        this.loadFormOptions(student);
    }

    private loadFormOptions(student: IStudent): void {
        for (const field of this.mergingFields) {
            const studentField = field.slice(-1).toString();

            let fieldValue: string = student[field[0]] && field.length > 1 ?
                student[field[0]][field[1]] :
                student[field[0]];

            if (~studentField.indexOf('Date') < 0) {
                fieldValue = new DatePipe('en-US').transform(fieldValue, 'MMM d, y').toString();
            }

            this.createFormFields(studentField, fieldValue);
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

    private createFormFields(studentField: string, fieldValue: string): void {
        this.formCheckboxes.push({
            label: `${this.addSpaceToFormField(studentField)}:`,
            merging: false,
            value: fieldValue,
        });
    }

    merge(): void {
        this.mergeStudent.emit();
    }

}
