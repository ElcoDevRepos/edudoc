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
import { IAuthClient } from '../interfaces/auth-client';
import { IAuthApplicationType } from '../interfaces/auth-application-type';

export interface IAuthClientDynamicControlsParameters {
    formGroup?: string;
    authApplicationTypes?: IAuthApplicationType[];
}

export class AuthClientDynamicControls {

    formGroup: string;
    authApplicationTypes?: IAuthApplicationType[];

    Form: IExpandableObject;
    View: IExpandableObject;

    constructor(private authclient?: IAuthClient, additionalParameters?: IAuthClientDynamicControlsParameters) {
        this.formGroup = additionalParameters && additionalParameters.formGroup || 'AuthClient';
        this.authApplicationTypes = additionalParameters && additionalParameters.authApplicationTypes || undefined;

        this.Form = {
            AllowedOrigin: new DynamicField({
                formGroup: this.formGroup,
                label: 'Allowed Origin',
                name: 'AllowedOrigin',
                options: null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: null,
                    scale: null,
                }),
                validation: [ Validators.required, Validators.maxLength(500) ],
                validators: { 'required': true, 'maxlength': 500 },
                value: this.authclient && this.authclient.hasOwnProperty('AllowedOrigin') && this.authclient.AllowedOrigin != null ? this.authclient.AllowedOrigin.toString() : '',
            }),
            AuthApplicationTypeId: new DynamicField({
                formGroup: this.formGroup,
                label: 'Auth Application Type',
                name: 'AuthApplicationTypeId',
                options: this.authApplicationTypes,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
                validation: [ noZeroRequiredValidator ],
                validators: { 'required': true },
                value: this.authclient && this.authclient.AuthApplicationTypeId || null,
            }),
            Description: new DynamicField({
                formGroup: this.formGroup,
                label: 'Description',
                name: 'Description',
                options: null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: null,
                    scale: null,
                }),
                validation: [ Validators.maxLength(200) ],
                validators: { 'maxlength': 200 },
                value: this.authclient && this.authclient.hasOwnProperty('Description') && this.authclient.Description != null ? this.authclient.Description.toString() : '',
            }),
            Name: new DynamicField({
                formGroup: this.formGroup,
                label: 'Name',
                name: 'Name',
                options: null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: null,
                    scale: null,
                }),
                validation: [ Validators.required, Validators.maxLength(200) ],
                validators: { 'required': true, 'maxlength': 200 },
                value: this.authclient && this.authclient.hasOwnProperty('Name') && this.authclient.Name != null ? this.authclient.Name.toString() : '',
            }),
            RefreshTokenMinutes: new DynamicField({
                formGroup: this.formGroup,
                label: 'Refresh Token Minutes',
                name: 'RefreshTokenMinutes',
                options: null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Numeric,
                    inputType: NumericInputTypes.Integer,
                    scale: null,
                }),
                validation: [ Validators.required ],
                validators: { 'required': true },
                value: this.authclient && this.authclient.RefreshTokenMinutes || null,
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
                validation: [ Validators.required ],
                validators: { 'required': true },
                value: this.authclient && this.authclient.hasOwnProperty('Salt') && this.authclient.Salt != null ? this.authclient.Salt.toString() : '',
            }),
            Secret: new DynamicField({
                formGroup: this.formGroup,
                label: 'Secret',
                name: 'Secret',
                options: null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: null,
                    scale: null,
                }),
                validation: [ Validators.required ],
                validators: { 'required': true },
                value: this.authclient && this.authclient.hasOwnProperty('Secret') && this.authclient.Secret != null ? this.authclient.Secret.toString() : '',
            }),
        };

        this.View = {
            AllowedOrigin: new DynamicLabel({
                label: 'Allowed Origin',
                value: this.authclient && this.authclient.hasOwnProperty('AllowedOrigin') && this.authclient.AllowedOrigin != null ? this.authclient.AllowedOrigin.toString() : '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: null,
                    scale: null,
                }),
            }),
            AuthApplicationTypeId: new DynamicLabel({
                label: 'Auth Application Type',
                value: getMetaItemValue(this.authApplicationTypes as unknown as IMetaItem[], this.authclient && this.authclient.hasOwnProperty('AuthApplicationTypeId') ? this.authclient.AuthApplicationTypeId : null) ?? '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
            }),
            Description: new DynamicLabel({
                label: 'Description',
                value: this.authclient && this.authclient.hasOwnProperty('Description') && this.authclient.Description != null ? this.authclient.Description.toString() : '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: null,
                    scale: null,
                }),
            }),
            Name: new DynamicLabel({
                label: 'Name',
                value: this.authclient && this.authclient.hasOwnProperty('Name') && this.authclient.Name != null ? this.authclient.Name.toString() : '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: null,
                    scale: null,
                }),
            }),
            RefreshTokenMinutes: new DynamicLabel({
                label: 'Refresh Token Minutes',
                value: this.authclient && this.authclient.RefreshTokenMinutes || null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Numeric,
                    inputType: NumericInputTypes.Integer,
                    scale: null,
                }),
            }),
            Salt: new DynamicLabel({
                label: 'Salt',
                value: this.authclient && this.authclient.hasOwnProperty('Salt') && this.authclient.Salt != null ? this.authclient.Salt.toString() : '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: null,
                    scale: null,
                }),
            }),
            Secret: new DynamicLabel({
                label: 'Secret',
                value: this.authclient && this.authclient.hasOwnProperty('Secret') && this.authclient.Secret != null ? this.authclient.Secret.toString() : '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: null,
                    scale: null,
                }),
            }),
        };

    }
}
