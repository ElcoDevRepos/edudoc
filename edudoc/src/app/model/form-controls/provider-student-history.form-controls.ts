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
import { IProviderStudentHistory } from '../interfaces/provider-student-history';
import { IProvider } from '../interfaces/provider';
import { IStudent } from '../interfaces/student';

export interface IProviderStudentHistoryDynamicControlsParameters {
    formGroup?: string;
    providers?: IProvider[];
    students?: IStudent[];
}

export class ProviderStudentHistoryDynamicControls {

    formGroup: string;
    providers?: IProvider[];
    students?: IStudent[];

    Form: IExpandableObject;
    View: IExpandableObject;

    constructor(private providerstudenthistory?: IProviderStudentHistory, additionalParameters?: IProviderStudentHistoryDynamicControlsParameters) {
        this.formGroup = additionalParameters && additionalParameters.formGroup || 'ProviderStudentHistory';
        this.providers = additionalParameters && additionalParameters.providers || undefined;
        this.students = additionalParameters && additionalParameters.students || undefined;

        this.Form = {
            DateArchived: new DynamicField({
                formGroup: this.formGroup,
                label: 'Date Archived',
                name: 'DateArchived',
                options: null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: InputTypes.Datepicker,
                    scale: null,
                }),
                validation: [ Validators.required ],
                validators: { 'required': true },
                value: this.providerstudenthistory && this.providerstudenthistory.DateArchived || null,
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
                value: this.providerstudenthistory && this.providerstudenthistory.ProviderId || null,
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
                value: this.providerstudenthistory && this.providerstudenthistory.StudentId || null,
            }),
        };

        this.View = {
            DateArchived: new DynamicLabel({
                label: 'Date Archived',
                value: this.providerstudenthistory && this.providerstudenthistory.DateArchived || null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: InputTypes.Datepicker,
                    scale: null,
                }),
            }),
            ProviderId: new DynamicLabel({
                label: 'Provider',
                value: getMetaItemValue(this.providers as unknown as IMetaItem[], this.providerstudenthistory && this.providerstudenthistory.hasOwnProperty('ProviderId') ? this.providerstudenthistory.ProviderId : null) ?? '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
            }),
            StudentId: new DynamicLabel({
                label: 'Student',
                value: getMetaItemValue(this.students as unknown as IMetaItem[], this.providerstudenthistory && this.providerstudenthistory.hasOwnProperty('StudentId') ? this.providerstudenthistory.StudentId : null) ?? '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
            }),
        };

    }
}
