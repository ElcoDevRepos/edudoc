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

import { IExpandableObject } from '../expandable-object';
import { IImpersonationLog } from '../interfaces/impersonation-log';

export interface IImpersonationLogDynamicControlsParameters {
    formGroup?: string;
}

export class ImpersonationLogDynamicControls {

    formGroup: string;

    Form: IExpandableObject;
    View: IExpandableObject;

    constructor(private impersonationlog?: IImpersonationLog, additionalParameters?: IImpersonationLogDynamicControlsParameters) {
        this.formGroup = additionalParameters && additionalParameters.formGroup || 'ImpersonationLog';

        this.Form = {
            AuthTokenId: new DynamicField({
                formGroup: this.formGroup,
                label: 'Auth Token',
                name: 'AuthTokenId',
                options: null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Numeric,
                    inputType: NumericInputTypes.Integer,
                    scale: null,
                }),
                validation: [ Validators.required ],
                validators: { 'required': true },
                value: this.impersonationlog && this.impersonationlog.AuthTokenId || null,
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
                value: this.impersonationlog && this.impersonationlog.DateCreated || null,
            }),
            ImpersonaterId: new DynamicField({
                formGroup: this.formGroup,
                label: 'Impersonater',
                name: 'ImpersonaterId',
                options: null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Numeric,
                    inputType: NumericInputTypes.Integer,
                    scale: null,
                }),
                validation: [ Validators.required ],
                validators: { 'required': true },
                value: this.impersonationlog && this.impersonationlog.ImpersonaterId || null,
            }),
        };

        this.View = {
            AuthTokenId: new DynamicLabel({
                label: 'Auth Token',
                value: this.impersonationlog && this.impersonationlog.AuthTokenId || null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Numeric,
                    inputType: NumericInputTypes.Integer,
                    scale: null,
                }),
            }),
            DateCreated: new DynamicLabel({
                label: 'Date Created',
                value: this.impersonationlog && this.impersonationlog.DateCreated || null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: InputTypes.Datepicker,
                    scale: null,
                }),
            }),
            ImpersonaterId: new DynamicLabel({
                label: 'Impersonater',
                value: this.impersonationlog && this.impersonationlog.ImpersonaterId || null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Numeric,
                    inputType: NumericInputTypes.Integer,
                    scale: null,
                }),
            }),
        };

    }
}
