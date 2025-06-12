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
import { IContactStatus } from '../interfaces/contact-status';

export interface IContactStatusDynamicControlsParameters {
    formGroup?: string;
}

export class ContactStatusDynamicControls {

    formGroup: string;

    Form: IExpandableObject;
    View: IExpandableObject;

    constructor(private contactstatus?: IContactStatus, additionalParameters?: IContactStatusDynamicControlsParameters) {
        this.formGroup = additionalParameters && additionalParameters.formGroup || 'ContactStatus';

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
                value: this.contactstatus && this.contactstatus.hasOwnProperty('Name') && this.contactstatus.Name != null ? this.contactstatus.Name.toString() : '',
            }),
            Sort: new DynamicField({
                formGroup: this.formGroup,
                label: 'Sort',
                name: 'Sort',
                options: null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Numeric,
                    inputType: NumericInputTypes.Integer,
                    scale: null,
                }),
                validation: [  ],
                validators: {  },
                value: this.contactstatus && this.contactstatus.Sort || 0,
            }),
        };

        this.View = {
            Name: new DynamicLabel({
                label: 'Name',
                value: this.contactstatus && this.contactstatus.hasOwnProperty('Name') && this.contactstatus.Name != null ? this.contactstatus.Name.toString() : '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: null,
                    scale: null,
                }),
            }),
            Sort: new DynamicLabel({
                label: 'Sort',
                value: this.contactstatus && this.contactstatus.Sort || 0,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Numeric,
                    inputType: NumericInputTypes.Integer,
                    scale: null,
                }),
            }),
        };

    }
}
