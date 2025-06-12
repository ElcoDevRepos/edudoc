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
import { IPhoneType } from '../interfaces/phone-type';

export interface IPhoneTypeDynamicControlsParameters {
    formGroup?: string;
}

export class PhoneTypeDynamicControls {

    formGroup: string;

    Form: IExpandableObject;
    View: IExpandableObject;

    constructor(private phonetype?: IPhoneType, additionalParameters?: IPhoneTypeDynamicControlsParameters) {
        this.formGroup = additionalParameters && additionalParameters.formGroup || 'PhoneType';

        this.Form = {
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
                validation: [ Validators.required, Validators.maxLength(50) ],
                validators: { 'required': true, 'maxlength': 50 },
                value: this.phonetype && this.phonetype.hasOwnProperty('Name') && this.phonetype.Name != null ? this.phonetype.Name.toString() : '',
            }),
        };

        this.View = {
            Name: new DynamicLabel({
                label: 'Name',
                value: this.phonetype && this.phonetype.hasOwnProperty('Name') && this.phonetype.Name != null ? this.phonetype.Name.toString() : '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: null,
                    scale: null,
                }),
            }),
        };

    }
}
