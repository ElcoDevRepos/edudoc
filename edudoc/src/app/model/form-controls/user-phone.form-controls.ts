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
import { IUserPhone } from '../interfaces/user-phone';
import { IPhoneType } from '../interfaces/phone-type';
import { IUser } from '../interfaces/user';

export interface IUserPhoneDynamicControlsParameters {
    formGroup?: string;
    users?: IUser[];
    phoneTypes?: IPhoneType[];
}

export class UserPhoneDynamicControls {

    formGroup: string;
    users?: IUser[];
    phoneTypes?: IPhoneType[];

    Form: IExpandableObject;
    View: IExpandableObject;

    constructor(private userphone?: IUserPhone, additionalParameters?: IUserPhoneDynamicControlsParameters) {
        this.formGroup = additionalParameters && additionalParameters.formGroup || 'UserPhone';
        this.users = additionalParameters && additionalParameters.users || undefined;
        this.phoneTypes = additionalParameters && additionalParameters.phoneTypes || undefined;

        this.Form = {
            Extension: new DynamicField({
                formGroup: this.formGroup,
                label: 'Extension',
                name: 'Extension',
                options: null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: null,
                    scale: null,
                }),
                validation: [ Validators.maxLength(5) ],
                validators: { 'maxlength': 5 },
                value: this.userphone && this.userphone.hasOwnProperty('Extension') && this.userphone.Extension != null ? this.userphone.Extension.toString() : '',
            }),
            IsPrimary: new DynamicField({
                formGroup: this.formGroup,
                label: 'Is Primary',
                name: 'IsPrimary',
                options: null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Checkbox,
                    inputType: null,
                    scale: null,
                }),
                validation: [  ],
                validators: {  },
                value: this.userphone && this.userphone.hasOwnProperty('IsPrimary') && this.userphone.IsPrimary != null ? this.userphone.IsPrimary : false,
            }),
            Phone: new DynamicField({
                formGroup: this.formGroup,
                label: 'Phone',
                name: 'Phone',
                options: null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: null,
                    scale: null,
                }),
                validation: [ Validators.required, Validators.maxLength(20) ],
                validators: { 'required': true, 'maxlength': 20 },
                value: this.userphone && this.userphone.hasOwnProperty('Phone') && this.userphone.Phone != null ? this.userphone.Phone.toString() : '',
            }),
            PhoneTypeId: new DynamicField({
                formGroup: this.formGroup,
                label: 'Phone Type',
                name: 'PhoneTypeId',
                options: this.phoneTypes,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
                validation: [ noZeroRequiredValidator ],
                validators: { 'required': true },
                value: this.userphone && this.userphone.PhoneTypeId || null,
            }),
            UserId: new DynamicField({
                formGroup: this.formGroup,
                label: 'User',
                name: 'UserId',
                options: this.users,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
                validation: [ noZeroRequiredValidator ],
                validators: { 'required': true },
                value: this.userphone && this.userphone.UserId || null,
            }),
        };

        this.View = {
            Extension: new DynamicLabel({
                label: 'Extension',
                value: this.userphone && this.userphone.hasOwnProperty('Extension') && this.userphone.Extension != null ? this.userphone.Extension.toString() : '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: null,
                    scale: null,
                }),
            }),
            IsPrimary: new DynamicLabel({
                label: 'Is Primary',
                value: this.userphone && this.userphone.hasOwnProperty('IsPrimary') && this.userphone.IsPrimary != null ? this.userphone.IsPrimary : false,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Checkbox,
                    inputType: null,
                    scale: null,
                }),
            }),
            Phone: new DynamicLabel({
                label: 'Phone',
                value: this.userphone && this.userphone.hasOwnProperty('Phone') && this.userphone.Phone != null ? this.userphone.Phone.toString() : '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: null,
                    scale: null,
                }),
            }),
            PhoneTypeId: new DynamicLabel({
                label: 'Phone Type',
                value: getMetaItemValue(this.phoneTypes as unknown as IMetaItem[], this.userphone && this.userphone.hasOwnProperty('PhoneTypeId') ? this.userphone.PhoneTypeId : null) ?? '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
            }),
            UserId: new DynamicLabel({
                label: 'User',
                value: getMetaItemValue(this.users as unknown as IMetaItem[], this.userphone && this.userphone.hasOwnProperty('UserId') ? this.userphone.UserId : null) ?? '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
            }),
        };

    }
}
