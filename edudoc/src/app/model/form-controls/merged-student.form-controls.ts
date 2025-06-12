import { Validators } from '@angular/forms';

import {
    DynamicField,
    DynamicFieldType,
    DynamicFieldTypes,
    DynamicLabel,
    noZeroRequiredValidator,
    InputTypes,
    NumericInputTypes,
    SelectInputTypes,
} from '@mt-ng2/dynamic-form';
import { getMetaItemValue } from '@mt-ng2/common-functions';
import { IMetaItem } from '../interfaces/base';

import { IExpandableObject } from '../expandable-object';
import { IMergedStudent } from '../interfaces/merged-student';
import { IAddress } from '../interfaces/address';
import { IStudent } from '../interfaces/student';
import { ISchool } from '../interfaces/school';

export interface IMergedStudentDynamicControlsParameters {
    formGroup?: string;
    addresses?: IAddress[];
    schools?: ISchool[];
    mergedToStudents?: IStudent[];
}

export class MergedStudentDynamicControls {

    formGroup: string;
    addresses?: IAddress[];
    schools?: ISchool[];
    mergedToStudents?: IStudent[];

    Form: IExpandableObject;
    View: IExpandableObject;

    constructor(private mergedstudent?: IMergedStudent, additionalParameters?: IMergedStudentDynamicControlsParameters) {
        this.formGroup = additionalParameters && additionalParameters.formGroup || 'MergedStudent';
        this.addresses = additionalParameters && additionalParameters.addresses || undefined;
        this.schools = additionalParameters && additionalParameters.schools || undefined;
        this.mergedToStudents = additionalParameters && additionalParameters.mergedToStudents || undefined;

        this.Form = {
            AddressId: new DynamicField({
                formGroup: this.formGroup,
                label: 'Address',
                name: 'AddressId',
                options: this.addresses,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
                validation: [  ],
                validators: {  },
                value: this.mergedstudent && this.mergedstudent.AddressId || null,
            }),
            CreatedById: new DynamicField({
                formGroup: this.formGroup,
                label: 'Created By',
                name: 'CreatedById',
                options: null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Numeric,
                    inputType: NumericInputTypes.Integer,
                    scale: null,
                }),
                validation: [  ],
                validators: {  },
                value: this.mergedstudent && this.mergedstudent.CreatedById || 1,
            }),
            DateCreated: new DynamicField({
                formGroup: this.formGroup,
                label: 'Date Created',
                name: 'DateCreated',
                options: null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: InputTypes.Datepicker,
                    scale: null,
                }),
                validation: [  ],
                validators: {  },
                value: this.mergedstudent && this.mergedstudent.DateCreated || null,
            }),
            DateOfBirth: new DynamicField({
                formGroup: this.formGroup,
                label: 'Date Of Birth',
                name: 'DateOfBirth',
                options: null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: InputTypes.Datepicker,
                    scale: null,
                }),
                validation: [ Validators.required ],
                validators: { 'required': true },
                value: this.mergedstudent && this.mergedstudent.DateOfBirth || null,
            }),
            FirstName: new DynamicField({
                formGroup: this.formGroup,
                label: 'First Name',
                name: 'FirstName',
                options: null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: null,
                    scale: null,
                }),
                validation: [ Validators.required, Validators.maxLength(50) ],
                validators: { 'required': true, 'maxlength': 50 },
                value: this.mergedstudent && this.mergedstudent.hasOwnProperty('FirstName') && this.mergedstudent.FirstName != null ? this.mergedstudent.FirstName.toString() : '',
            }),
            Grade: new DynamicField({
                formGroup: this.formGroup,
                label: 'Grade',
                name: 'Grade',
                options: null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: null,
                    scale: null,
                }),
                validation: [ Validators.required, Validators.maxLength(2) ],
                validators: { 'required': true, 'maxlength': 2 },
                value: this.mergedstudent && this.mergedstudent.hasOwnProperty('Grade') && this.mergedstudent.Grade != null ? this.mergedstudent.Grade.toString() : '',
            }),
            LastName: new DynamicField({
                formGroup: this.formGroup,
                label: 'Last Name',
                name: 'LastName',
                options: null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: null,
                    scale: null,
                }),
                validation: [ Validators.required, Validators.maxLength(50) ],
                validators: { 'required': true, 'maxlength': 50 },
                value: this.mergedstudent && this.mergedstudent.hasOwnProperty('LastName') && this.mergedstudent.LastName != null ? this.mergedstudent.LastName.toString() : '',
            }),
            MergedToStudentId: new DynamicField({
                formGroup: this.formGroup,
                label: 'Merged To Student',
                name: 'MergedToStudentId',
                options: this.mergedToStudents,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
                validation: [ noZeroRequiredValidator ],
                validators: { 'required': true },
                value: this.mergedstudent && this.mergedstudent.MergedToStudentId || null,
            }),
            MiddleName: new DynamicField({
                formGroup: this.formGroup,
                label: 'Middle Name',
                name: 'MiddleName',
                options: null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: null,
                    scale: null,
                }),
                validation: [ Validators.maxLength(50) ],
                validators: { 'maxlength': 50 },
                value: this.mergedstudent && this.mergedstudent.hasOwnProperty('MiddleName') && this.mergedstudent.MiddleName != null ? this.mergedstudent.MiddleName.toString() : '',
            }),
            SchoolId: new DynamicField({
                formGroup: this.formGroup,
                label: 'School',
                name: 'SchoolId',
                options: this.schools,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
                validation: [ noZeroRequiredValidator ],
                validators: { 'required': true },
                value: this.mergedstudent && this.mergedstudent.SchoolId || null,
            }),
            StudentCode: new DynamicField({
                formGroup: this.formGroup,
                label: 'Student Code',
                name: 'StudentCode',
                options: null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: null,
                    scale: null,
                }),
                validation: [ Validators.required, Validators.maxLength(12) ],
                validators: { 'required': true, 'maxlength': 12 },
                value: this.mergedstudent && this.mergedstudent.hasOwnProperty('StudentCode') && this.mergedstudent.StudentCode != null ? this.mergedstudent.StudentCode.toString() : '',
            }),
        };

        this.View = {
            AddressId: new DynamicLabel({
                label: 'Address',
                value: getMetaItemValue(this.addresses as unknown as IMetaItem[], this.mergedstudent && this.mergedstudent.hasOwnProperty('AddressId') ? this.mergedstudent.AddressId : null) ?? '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
            }),
            CreatedById: new DynamicLabel({
                label: 'Created By',
                value: this.mergedstudent && this.mergedstudent.CreatedById || 1,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Numeric,
                    inputType: NumericInputTypes.Integer,
                    scale: null,
                }),
            }),
            DateCreated: new DynamicLabel({
                label: 'Date Created',
                value: this.mergedstudent && this.mergedstudent.DateCreated || null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: InputTypes.Datepicker,
                    scale: null,
                }),
            }),
            DateOfBirth: new DynamicLabel({
                label: 'Date Of Birth',
                value: this.mergedstudent && this.mergedstudent.DateOfBirth || null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: InputTypes.Datepicker,
                    scale: null,
                }),
            }),
            FirstName: new DynamicLabel({
                label: 'First Name',
                value: this.mergedstudent && this.mergedstudent.hasOwnProperty('FirstName') && this.mergedstudent.FirstName != null ? this.mergedstudent.FirstName.toString() : '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: null,
                    scale: null,
                }),
            }),
            Grade: new DynamicLabel({
                label: 'Grade',
                value: this.mergedstudent && this.mergedstudent.hasOwnProperty('Grade') && this.mergedstudent.Grade != null ? this.mergedstudent.Grade.toString() : '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: null,
                    scale: null,
                }),
            }),
            LastName: new DynamicLabel({
                label: 'Last Name',
                value: this.mergedstudent && this.mergedstudent.hasOwnProperty('LastName') && this.mergedstudent.LastName != null ? this.mergedstudent.LastName.toString() : '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: null,
                    scale: null,
                }),
            }),
            MergedToStudentId: new DynamicLabel({
                label: 'Merged To Student',
                value: getMetaItemValue(this.mergedToStudents as unknown as IMetaItem[], this.mergedstudent && this.mergedstudent.hasOwnProperty('MergedToStudentId') ? this.mergedstudent.MergedToStudentId : null) ?? '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
            }),
            MiddleName: new DynamicLabel({
                label: 'Middle Name',
                value: this.mergedstudent && this.mergedstudent.hasOwnProperty('MiddleName') && this.mergedstudent.MiddleName != null ? this.mergedstudent.MiddleName.toString() : '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: null,
                    scale: null,
                }),
            }),
            SchoolId: new DynamicLabel({
                label: 'School',
                value: getMetaItemValue(this.schools as unknown as IMetaItem[], this.mergedstudent && this.mergedstudent.hasOwnProperty('SchoolId') ? this.mergedstudent.SchoolId : null) ?? '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
            }),
            StudentCode: new DynamicLabel({
                label: 'Student Code',
                value: this.mergedstudent && this.mergedstudent.hasOwnProperty('StudentCode') && this.mergedstudent.StudentCode != null ? this.mergedstudent.StudentCode.toString() : '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: null,
                    scale: null,
                }),
            }),
        };

    }
}
