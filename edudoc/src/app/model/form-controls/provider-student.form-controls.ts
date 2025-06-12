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
import { IProviderStudent } from '../interfaces/provider-student';
import { IProvider } from '../interfaces/provider';
import { IStudent } from '../interfaces/student';

export interface IProviderStudentDynamicControlsParameters {
    formGroup?: string;
    providers?: IProvider[];
    students?: IStudent[];
}

export class ProviderStudentDynamicControls {

    formGroup: string;
    providers?: IProvider[];
    students?: IStudent[];

    Form: IExpandableObject;
    View: IExpandableObject;

    constructor(private providerstudent?: IProviderStudent, additionalParameters?: IProviderStudentDynamicControlsParameters) {
        this.formGroup = additionalParameters && additionalParameters.formGroup || 'ProviderStudent';
        this.providers = additionalParameters && additionalParameters.providers || undefined;
        this.students = additionalParameters && additionalParameters.students || undefined;

        this.Form = {
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
                value: this.providerstudent && this.providerstudent.CreatedById || 1,
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
                value: this.providerstudent && this.providerstudent.DateCreated || null,
            }),
            ProviderId: new DynamicField({
                formGroup: this.formGroup,
                label: 'Provider',
                name: 'ProviderId',
                options: this.providers,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
                validation: [ noZeroRequiredValidator ],
                validators: { 'required': true },
                value: this.providerstudent && this.providerstudent.ProviderId || null,
            }),
            StudentId: new DynamicField({
                formGroup: this.formGroup,
                label: 'Student',
                name: 'StudentId',
                options: this.students,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
                validation: [ noZeroRequiredValidator ],
                validators: { 'required': true },
                value: this.providerstudent && this.providerstudent.StudentId || null,
            }),
        };

        this.View = {
            CreatedById: new DynamicLabel({
                label: 'Created By',
                value: this.providerstudent && this.providerstudent.CreatedById || 1,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Numeric,
                    inputType: NumericInputTypes.Integer,
                    scale: null,
                }),
            }),
            DateCreated: new DynamicLabel({
                label: 'Date Created',
                value: this.providerstudent && this.providerstudent.DateCreated || null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: InputTypes.Datepicker,
                    scale: null,
                }),
            }),
            ProviderId: new DynamicLabel({
                label: 'Provider',
                value: getMetaItemValue(this.providers as unknown as IMetaItem[], this.providerstudent && this.providerstudent.hasOwnProperty('ProviderId') ? this.providerstudent.ProviderId : null) ?? '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
            }),
            StudentId: new DynamicLabel({
                label: 'Student',
                value: getMetaItemValue(this.students as unknown as IMetaItem[], this.providerstudent && this.providerstudent.hasOwnProperty('StudentId') ? this.providerstudent.StudentId : null) ?? '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
            }),
        };

    }
}
