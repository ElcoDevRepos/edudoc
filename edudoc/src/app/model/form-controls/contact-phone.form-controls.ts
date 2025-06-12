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
import { IContactPhone } from '../interfaces/contact-phone';
import { IContact } from '../interfaces/contact';
import { IPhoneType } from '../interfaces/phone-type';

export interface IContactPhoneDynamicControlsParameters {
    formGroup?: string;
    contacts?: IContact[];
    phoneTypes?: IPhoneType[];
}

export class ContactPhoneDynamicControls {

    formGroup: string;
    contacts?: IContact[];
    phoneTypes?: IPhoneType[];

    Form: IExpandableObject;
    View: IExpandableObject;

    constructor(private contactphone?: IContactPhone, additionalParameters?: IContactPhoneDynamicControlsParameters) {
        this.formGroup = additionalParameters && additionalParameters.formGroup || 'ContactPhone';
        this.contacts = additionalParameters && additionalParameters.contacts || undefined;
        this.phoneTypes = additionalParameters && additionalParameters.phoneTypes || undefined;

        this.Form = {
            ContactId: new DynamicField({
                formGroup: this.formGroup,
                label: 'Contact',
                name: 'ContactId',
                options: this.contacts,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
                validation: [ noZeroRequiredValidator ],
                validators: { 'required': true },
                value: this.contactphone && this.contactphone.ContactId || null,
            }),
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
                value: this.contactphone && this.contactphone.hasOwnProperty('Extension') && this.contactphone.Extension != null ? this.contactphone.Extension.toString() : '',
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
                value: this.contactphone && this.contactphone.hasOwnProperty('IsPrimary') && this.contactphone.IsPrimary != null ? this.contactphone.IsPrimary : false,
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
                value: this.contactphone && this.contactphone.hasOwnProperty('Phone') && this.contactphone.Phone != null ? this.contactphone.Phone.toString() : '',
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
                value: this.contactphone && this.contactphone.PhoneTypeId || null,
            }),
        };

        this.View = {
            ContactId: new DynamicLabel({
                label: 'Contact',
                value: getMetaItemValue(this.contacts as unknown as IMetaItem[], this.contactphone && this.contactphone.hasOwnProperty('ContactId') ? this.contactphone.ContactId : null) ?? '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
            }),
            Extension: new DynamicLabel({
                label: 'Extension',
                value: this.contactphone && this.contactphone.hasOwnProperty('Extension') && this.contactphone.Extension != null ? this.contactphone.Extension.toString() : '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: null,
                    scale: null,
                }),
            }),
            IsPrimary: new DynamicLabel({
                label: 'Is Primary',
                value: this.contactphone && this.contactphone.hasOwnProperty('IsPrimary') && this.contactphone.IsPrimary != null ? this.contactphone.IsPrimary : false,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Checkbox,
                    inputType: null,
                    scale: null,
                }),
            }),
            Phone: new DynamicLabel({
                label: 'Phone',
                value: this.contactphone && this.contactphone.hasOwnProperty('Phone') && this.contactphone.Phone != null ? this.contactphone.Phone.toString() : '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: null,
                    scale: null,
                }),
            }),
            PhoneTypeId: new DynamicLabel({
                label: 'Phone Type',
                value: getMetaItemValue(this.phoneTypes as unknown as IMetaItem[], this.contactphone && this.contactphone.hasOwnProperty('PhoneTypeId') ? this.contactphone.PhoneTypeId : null) ?? '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
            }),
        };

    }
}
