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
import { IAuthToken } from '../interfaces/auth-token';
import { IAuthClient } from '../interfaces/auth-client';
import { IAuthUser } from '../interfaces/auth-user';

export interface IAuthTokenDynamicControlsParameters {
    formGroup?: string;
    authUsers?: IAuthUser[];
    authClients?: IAuthClient[];
}

export class AuthTokenDynamicControls {

    formGroup: string;
    authUsers?: IAuthUser[];
    authClients?: IAuthClient[];

    Form: IExpandableObject;
    View: IExpandableObject;

    constructor(private authtoken?: IAuthToken, additionalParameters?: IAuthTokenDynamicControlsParameters) {
        this.formGroup = additionalParameters && additionalParameters.formGroup || 'AuthToken';
        this.authUsers = additionalParameters && additionalParameters.authUsers || undefined;
        this.authClients = additionalParameters && additionalParameters.authClients || undefined;

        this.Form = {
            AuthClientId: new DynamicField({
                formGroup: this.formGroup,
                label: 'Auth Client',
                name: 'AuthClientId',
                options: this.authClients,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
                validation: [ noZeroRequiredValidator ],
                validators: { 'required': true },
                value: this.authtoken && this.authtoken.AuthClientId || null,
            }),
            AuthUserId: new DynamicField({
                formGroup: this.formGroup,
                label: 'Auth User',
                name: 'AuthUserId',
                options: this.authUsers,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
                validation: [ noZeroRequiredValidator ],
                validators: { 'required': true },
                value: this.authtoken && this.authtoken.AuthUserId || null,
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
                value: this.authtoken && this.authtoken.ExpiresUtc || null,
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
                value: this.authtoken && this.authtoken.hasOwnProperty('IdentifierKey') && this.authtoken.IdentifierKey != null ? this.authtoken.IdentifierKey.toString() : '',
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
                value: this.authtoken && this.authtoken.IssuedUtc || null,
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
                value: this.authtoken && this.authtoken.hasOwnProperty('Salt') && this.authtoken.Salt != null ? this.authtoken.Salt.toString() : '',
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
                value: this.authtoken && this.authtoken.hasOwnProperty('Token') && this.authtoken.Token != null ? this.authtoken.Token.toString() : '',
            }),
        };

        this.View = {
            AuthClientId: new DynamicLabel({
                label: 'Auth Client',
                value: getMetaItemValue(this.authClients as unknown as IMetaItem[], this.authtoken && this.authtoken.hasOwnProperty('AuthClientId') ? this.authtoken.AuthClientId : null) ?? '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
            }),
            AuthUserId: new DynamicLabel({
                label: 'Auth User',
                value: getMetaItemValue(this.authUsers as unknown as IMetaItem[], this.authtoken && this.authtoken.hasOwnProperty('AuthUserId') ? this.authtoken.AuthUserId : null) ?? '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
            }),
            ExpiresUtc: new DynamicLabel({
                label: 'Expires Utc',
                value: this.authtoken && this.authtoken.ExpiresUtc || null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: InputTypes.Datepicker,
                    scale: null,
                }),
            }),
            IdentifierKey: new DynamicLabel({
                label: 'Identifier Key',
                value: this.authtoken && this.authtoken.hasOwnProperty('IdentifierKey') && this.authtoken.IdentifierKey != null ? this.authtoken.IdentifierKey.toString() : '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: null,
                    scale: null,
                }),
            }),
            IssuedUtc: new DynamicLabel({
                label: 'Issued Utc',
                value: this.authtoken && this.authtoken.IssuedUtc || null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: InputTypes.Datepicker,
                    scale: null,
                }),
            }),
            Salt: new DynamicLabel({
                label: 'Salt',
                value: this.authtoken && this.authtoken.hasOwnProperty('Salt') && this.authtoken.Salt != null ? this.authtoken.Salt.toString() : '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: null,
                    scale: null,
                }),
            }),
            Token: new DynamicLabel({
                label: 'Token',
                value: this.authtoken && this.authtoken.hasOwnProperty('Token') && this.authtoken.Token != null ? this.authtoken.Token.toString() : '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: InputTypes.Textarea,
                    scale: null,
                }),
            }),
        };

    }
}
