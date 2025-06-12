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
import { IAuthUser } from '../interfaces/auth-user';
import { IUserRole } from '../interfaces/user-role';

export interface IAuthUserDynamicControlsParameters {
    formGroup?: string;
    roles?: IUserRole[];
}

export class AuthUserDynamicControls {

    formGroup: string;
    roles?: IUserRole[];

    Form: IExpandableObject;
    View: IExpandableObject;

    constructor(private authuser?: IAuthUser, additionalParameters?: IAuthUserDynamicControlsParameters) {
        this.formGroup = additionalParameters && additionalParameters.formGroup || 'AuthUser';
        this.roles = additionalParameters && additionalParameters.roles || undefined;

        this.Form = {
            HasAccess: new DynamicField({
                formGroup: this.formGroup,
                label: 'Has Access',
                name: 'HasAccess',
                options: null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Checkbox,
                    inputType: null,
                    scale: null,
                }),
                validation: [  ],
                validators: {  },
                value: this.authuser && this.authuser.hasOwnProperty('HasAccess') && this.authuser.HasAccess != null ? this.authuser.HasAccess : true,
            }),
            HasLoggedIn: new DynamicField({
                formGroup: this.formGroup,
                label: 'Has Logged In',
                name: 'HasLoggedIn',
                options: null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Checkbox,
                    inputType: null,
                    scale: null,
                }),
                validation: [  ],
                validators: {  },
                value: this.authuser && this.authuser.hasOwnProperty('HasLoggedIn') && this.authuser.HasLoggedIn != null ? this.authuser.HasLoggedIn : false,
            }),
            IsEditable: new DynamicField({
                formGroup: this.formGroup,
                label: 'Is Editable',
                name: 'IsEditable',
                options: null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Checkbox,
                    inputType: null,
                    scale: null,
                }),
                validation: [  ],
                validators: {  },
                value: this.authuser && this.authuser.hasOwnProperty('IsEditable') && this.authuser.IsEditable != null ? this.authuser.IsEditable : true,
            }),
            Password: new DynamicField({
                formGroup: this.formGroup,
                label: 'Password',
                name: 'Password',
                options: null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Password,
                    inputType: null,
                    scale: null,
                }),
                validation: [ Validators.required ],
                validators: { 'required': true },
                value: this.authuser && this.authuser.hasOwnProperty('Password') && this.authuser.Password != null ? this.authuser.Password.toString() : '',
            }),
            ResetKey: new DynamicField({
                formGroup: this.formGroup,
                label: 'Reset Key',
                name: 'ResetKey',
                options: null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: null,
                    scale: null,
                }),
                validation: [ Validators.required, Validators.maxLength(64) ],
                validators: { 'required': true, 'maxlength': 64 },
                value: this.authuser && this.authuser.hasOwnProperty('ResetKey') && this.authuser.ResetKey != null ? this.authuser.ResetKey.toString() : '',
            }),
            ResetKeyExpirationUtc: new DynamicField({
                formGroup: this.formGroup,
                label: 'Reset Key Expiration Utc',
                name: 'ResetKeyExpirationUtc',
                options: null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: InputTypes.Datepicker,
                    scale: null,
                }),
                validation: [  ],
                validators: {  },
                value: this.authuser && this.authuser.ResetKeyExpirationUtc || null,
            }),
            RoleId: new DynamicField({
                formGroup: this.formGroup,
                label: 'Role',
                name: 'RoleId',
                options: this.roles,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
                validation: [ noZeroRequiredValidator ],
                validators: { 'required': true },
                value: this.authuser && this.authuser.RoleId || null,
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
                value: this.authuser && this.authuser.hasOwnProperty('Salt') && this.authuser.Salt != null ? this.authuser.Salt.toString() : '',
            }),
            Username: new DynamicField({
                formGroup: this.formGroup,
                label: 'Username',
                name: 'Username',
                options: null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: null,
                    scale: null,
                }),
                validation: [ Validators.required, Validators.maxLength(50) ],
                validators: { 'required': true, 'maxlength': 50 },
                value: this.authuser && this.authuser.hasOwnProperty('Username') && this.authuser.Username != null ? this.authuser.Username.toString() : '',
            }),
        };

        this.View = {
            HasAccess: new DynamicLabel({
                label: 'Has Access',
                value: this.authuser && this.authuser.hasOwnProperty('HasAccess') && this.authuser.HasAccess != null ? this.authuser.HasAccess : true,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Checkbox,
                    inputType: null,
                    scale: null,
                }),
            }),
            HasLoggedIn: new DynamicLabel({
                label: 'Has Logged In',
                value: this.authuser && this.authuser.hasOwnProperty('HasLoggedIn') && this.authuser.HasLoggedIn != null ? this.authuser.HasLoggedIn : false,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Checkbox,
                    inputType: null,
                    scale: null,
                }),
            }),
            IsEditable: new DynamicLabel({
                label: 'Is Editable',
                value: this.authuser && this.authuser.hasOwnProperty('IsEditable') && this.authuser.IsEditable != null ? this.authuser.IsEditable : true,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Checkbox,
                    inputType: null,
                    scale: null,
                }),
            }),
            Password: new DynamicLabel({
                label: 'Password',
                value: this.authuser && this.authuser.hasOwnProperty('Password') && this.authuser.Password != null ? this.authuser.Password.toString() : '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Password,
                    inputType: null,
                    scale: null,
                }),
            }),
            ResetKey: new DynamicLabel({
                label: 'Reset Key',
                value: this.authuser && this.authuser.hasOwnProperty('ResetKey') && this.authuser.ResetKey != null ? this.authuser.ResetKey.toString() : '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: null,
                    scale: null,
                }),
            }),
            ResetKeyExpirationUtc: new DynamicLabel({
                label: 'Reset Key Expiration Utc',
                value: this.authuser && this.authuser.ResetKeyExpirationUtc || null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: InputTypes.Datepicker,
                    scale: null,
                }),
            }),
            RoleId: new DynamicLabel({
                label: 'Role',
                value: getMetaItemValue(this.roles as unknown as IMetaItem[], this.authuser && this.authuser.hasOwnProperty('RoleId') ? this.authuser.RoleId : null) ?? '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
            }),
            Salt: new DynamicLabel({
                label: 'Salt',
                value: this.authuser && this.authuser.hasOwnProperty('Salt') && this.authuser.Salt != null ? this.authuser.Salt.toString() : '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: null,
                    scale: null,
                }),
            }),
            Username: new DynamicLabel({
                label: 'Username',
                value: this.authuser && this.authuser.hasOwnProperty('Username') && this.authuser.Username != null ? this.authuser.Username.toString() : '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: null,
                    scale: null,
                }),
            }),
        };

    }
}
