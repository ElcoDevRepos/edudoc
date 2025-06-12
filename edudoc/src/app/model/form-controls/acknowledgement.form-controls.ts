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
import { IAcknowledgement } from '../interfaces/acknowledgement';

export interface IAcknowledgementDynamicControlsParameters {
    formGroup?: string;
}

export class AcknowledgementDynamicControls {

    formGroup: string;

    Form: IExpandableObject;
    View: IExpandableObject;

    constructor(private acknowledgement?: IAcknowledgement, additionalParameters?: IAcknowledgementDynamicControlsParameters) {
        this.formGroup = additionalParameters && additionalParameters.formGroup || 'Acknowledgement';

        this.Form = {
            Name: new DynamicField({
                formGroup: this.formGroup,
                label: 'Name',
                name: 'Name',
                options: null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: InputTypes.Textarea,
                    scale: null,
                }),
                validation: [ Validators.required ],
                validators: { 'required': true },
                value: this.acknowledgement && this.acknowledgement.hasOwnProperty('Name') && this.acknowledgement.Name != null ? this.acknowledgement.Name.toString() : '',
            }),
        };

        this.View = {
            Name: new DynamicLabel({
                label: 'Name',
                value: this.acknowledgement && this.acknowledgement.hasOwnProperty('Name') && this.acknowledgement.Name != null ? this.acknowledgement.Name.toString() : '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: InputTypes.Textarea,
                    scale: null,
                }),
            }),
        };

    }
}
