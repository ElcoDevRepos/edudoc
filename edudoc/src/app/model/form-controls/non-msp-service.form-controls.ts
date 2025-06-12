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
import { INonMspService } from '../interfaces/non-msp-service';

export interface INonMspServiceDynamicControlsParameters {
    formGroup?: string;
}

export class NonMspServiceDynamicControls {

    formGroup: string;

    Form: IExpandableObject;
    View: IExpandableObject;

    constructor(private nonmspservice?: INonMspService, additionalParameters?: INonMspServiceDynamicControlsParameters) {
        this.formGroup = additionalParameters && additionalParameters.formGroup || 'NonMspService';

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
                value: this.nonmspservice && this.nonmspservice.hasOwnProperty('Name') && this.nonmspservice.Name != null ? this.nonmspservice.Name.toString() : '',
            }),
        };

        this.View = {
            Name: new DynamicLabel({
                label: 'Name',
                value: this.nonmspservice && this.nonmspservice.hasOwnProperty('Name') && this.nonmspservice.Name != null ? this.nonmspservice.Name.toString() : '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: null,
                    scale: null,
                }),
            }),
        };

    }
}
