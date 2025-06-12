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
import { IDisabilityCode } from '../interfaces/disability-code';

export interface IDisabilityCodeDynamicControlsParameters {
    formGroup?: string;
}

export class DisabilityCodeDynamicControls {

    formGroup: string;

    Form: IExpandableObject;
    View: IExpandableObject;

    constructor(private disabilitycode?: IDisabilityCode, additionalParameters?: IDisabilityCodeDynamicControlsParameters) {
        this.formGroup = additionalParameters && additionalParameters.formGroup || 'DisabilityCode';

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
                value: this.disabilitycode && this.disabilitycode.hasOwnProperty('Name') && this.disabilitycode.Name != null ? this.disabilitycode.Name.toString() : '',
            }),
        };

        this.View = {
            Name: new DynamicLabel({
                label: 'Name',
                value: this.disabilitycode && this.disabilitycode.hasOwnProperty('Name') && this.disabilitycode.Name != null ? this.disabilitycode.Name.toString() : '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: null,
                    scale: null,
                }),
            }),
        };

    }
}
