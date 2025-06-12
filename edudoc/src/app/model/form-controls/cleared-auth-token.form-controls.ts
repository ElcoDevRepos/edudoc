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
import { IClearedAuthToken } from '../interfaces/cleared-auth-token';

export interface IClearedAuthTokenDynamicControlsParameters {
    formGroup?: string;
}

export class ClearedAuthTokenDynamicControls {

    formGroup: string;

    Form: IExpandableObject;
    View: IExpandableObject;

    constructor(private clearedauthtoken?: IClearedAuthToken, additionalParameters?: IClearedAuthTokenDynamicControlsParameters) {
        this.formGroup = additionalParameters && additionalParameters.formGroup || 'ClearedAuthToken';

        this.Form = {
            AuthClientId: new DynamicField({
                formGroup: this.formGroup,
                label: 'Auth Client',
                name: 'AuthClientId',
                options: null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Numeric,
                    inputType: NumericInputTypes.Integer,
                    scale: null,
                }),
                validation: [ Validators.required ],
                validators: { 'required': true },
                value: this.clearedauthtoken && this.clearedauthtoken.AuthClientId || null,
            }),
            AuthUserId: new DynamicField({
                formGroup: this.formGroup,
                label: 'Auth User',
                name: 'AuthUserId',
                options: null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Numeric,
                    inputType: NumericInputTypes.Integer,
                    scale: null,
                }),
                validation: [ Validators.required ],
                validators: { 'required': true },
                value: this.clearedauthtoken && this.clearedauthtoken.AuthUserId || null,
            }),
            ClearedDate: new DynamicField({
                formGroup: this.formGroup,
                label: 'Cleared Date',
                name: 'ClearedDate',
                options: null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: InputTypes.Datepicker,
                    scale: null,
                }),
                validation: [  ],
                validators: {  },
                value: this.clearedauthtoken && this.clearedauthtoken.ClearedDate || null,
            }),
            ExpiresUtc: new DynamicField({
                formGroup: this.formGroup,
                label: 'Expires Utc',
                name: 'ExpiresUtc',
                options: null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: InputTypes.Datepicker,
                    scale: null,
                }),
                validation: [ Validators.required ],
                validators: { 'required': true },
                value: this.clearedauthtoken && this.clearedauthtoken.ExpiresUtc || null,
            }),
            IdentifierKey: new DynamicField({
                formGroup: this.formGroup,
                label: 'Identifier Key',
                name: 'IdentifierKey',
                options: null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: null,
                    scale: null,
                }),
                validation: [ Validators.required, Validators.maxLength(64) ],
                validators: { 'required': true, 'maxlength': 64 },
                value: this.clearedauthtoken && this.clearedauthtoken.hasOwnProperty('IdentifierKey') && this.clearedauthtoken.IdentifierKey != null ? this.clearedauthtoken.IdentifierKey.toString() : '',
            }),
            IssuedUtc: new DynamicField({
                formGroup: this.formGroup,
                label: 'Issued Utc',
                name: 'IssuedUtc',
                options: null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: InputTypes.Datepicker,
                    scale: null,
                }),
                validation: [ Validators.required ],
                validators: { 'required': true },
                value: this.clearedauthtoken && this.clearedauthtoken.IssuedUtc || null,
            }),
            Salt: new DynamicField({
                formGroup: this.formGroup,
                label: 'Salt',
                name: 'Salt',
                options: null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: null,
                    scale: null,
                }),
                validation: [ Validators.required, Validators.maxLength(64) ],
                validators: { 'required': true, 'maxlength': 64 },
                value: this.clearedauthtoken && this.clearedauthtoken.hasOwnProperty('Salt') && this.clearedauthtoken.Salt != null ? this.clearedauthtoken.Salt.toString() : '',
            }),
            Token: new DynamicField({
                formGroup: this.formGroup,
                label: 'Token',
                name: 'Token',
                options: null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: InputTypes.Textarea,
                    scale: null,
                }),
                validation: [ Validators.required ],
                validators: { 'required': true },
                value: this.clearedauthtoken && this.clearedauthtoken.hasOwnProperty('Token') && this.clearedauthtoken.Token != null ? this.clearedauthtoken.Token.toString() : '',
            }),
        };

        this.View = {
            AuthClientId: new DynamicLabel({
                label: 'Auth Client',
                value: this.clearedauthtoken && this.clearedauthtoken.AuthClientId || null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Numeric,
                    inputType: NumericInputTypes.Integer,
                    scale: null,
                }),
            }),
            AuthUserId: new DynamicLabel({
                label: 'Auth User',
                value: this.clearedauthtoken && this.clearedauthtoken.AuthUserId || null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Numeric,
                    inputType: NumericInputTypes.Integer,
                    scale: null,
                }),
            }),
            ClearedDate: new DynamicLabel({
                label: 'Cleared Date',
                value: this.clearedauthtoken && this.clearedauthtoken.ClearedDate || null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: InputTypes.Datepicker,
                    scale: null,
                }),
            }),
            ExpiresUtc: new DynamicLabel({
                label: 'Expires Utc',
                value: this.clearedauthtoken && this.clearedauthtoken.ExpiresUtc || null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: InputTypes.Datepicker,
                    scale: null,
                }),
            }),
            IdentifierKey: new DynamicLabel({
                label: 'Identifier Key',
                value: this.clearedauthtoken && this.clearedauthtoken.hasOwnProperty('IdentifierKey') && this.clearedauthtoken.IdentifierKey != null ? this.clearedauthtoken.IdentifierKey.toString() : '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: null,
                    scale: null,
                }),
            }),
            IssuedUtc: new DynamicLabel({
                label: 'Issued Utc',
                value: this.clearedauthtoken && this.clearedauthtoken.IssuedUtc || null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: InputTypes.Datepicker,
                    scale: null,
                }),
            }),
            Salt: new DynamicLabel({
                label: 'Salt',
                value: this.clearedauthtoken && this.clearedauthtoken.hasOwnProperty('Salt') && this.clearedauthtoken.Salt != null ? this.clearedauthtoken.Salt.toString() : '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: null,
                    scale: null,
                }),
            }),
            Token: new DynamicLabel({
                label: 'Token',
                value: this.clearedauthtoken && this.clearedauthtoken.hasOwnProperty('Token') && this.clearedauthtoken.Token != null ? this.clearedauthtoken.Token.toString() : '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: InputTypes.Textarea,
                    scale: null,
                }),
            }),
        };

    }
}
