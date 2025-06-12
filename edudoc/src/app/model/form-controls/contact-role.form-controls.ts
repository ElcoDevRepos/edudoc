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
import { IContactRole } from '../interfaces/contact-role';

export interface IContactRoleDynamicControlsParameters {
    formGroup?: string;
}

export class ContactRoleDynamicControls {

    formGroup: string;

    Form: IExpandableObject;
    View: IExpandableObject;

    constructor(private contactrole?: IContactRole, additionalParameters?: IContactRoleDynamicControlsParameters) {
        this.formGroup = additionalParameters && additionalParameters.formGroup || 'ContactRole';

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
                validation: [ Validators.required, Validators.maxLength(100) ],
                validators: { 'required': true, 'maxlength': 100 },
                value: this.contactrole && this.contactrole.hasOwnProperty('Name') && this.contactrole.Name != null ? this.contactrole.Name.toString() : '',
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
                value: this.contactrole && this.contactrole.Sort || 0,
            }),
        };

        this.View = {
            Name: new DynamicLabel({
                label: 'Name',
                value: this.contactrole && this.contactrole.hasOwnProperty('Name') && this.contactrole.Name != null ? this.contactrole.Name.toString() : '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: null,
                    scale: null,
                }),
            }),
            Sort: new DynamicLabel({
                label: 'Sort',
                value: this.contactrole && this.contactrole.Sort || 0,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Numeric,
                    inputType: NumericInputTypes.Integer,
                    scale: null,
                }),
            }),
        };

    }
}
