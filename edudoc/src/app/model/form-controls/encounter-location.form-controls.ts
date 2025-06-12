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
import { IEncounterLocation } from '../interfaces/encounter-location';

export interface IEncounterLocationDynamicControlsParameters {
    formGroup?: string;
}

export class EncounterLocationDynamicControls {

    formGroup: string;

    Form: IExpandableObject;
    View: IExpandableObject;

    constructor(private encounterlocation?: IEncounterLocation, additionalParameters?: IEncounterLocationDynamicControlsParameters) {
        this.formGroup = additionalParameters && additionalParameters.formGroup || 'EncounterLocation';

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
                value: this.encounterlocation && this.encounterlocation.hasOwnProperty('Name') && this.encounterlocation.Name != null ? this.encounterlocation.Name.toString() : '',
            }),
        };

        this.View = {
            Name: new DynamicLabel({
                label: 'Name',
                value: this.encounterlocation && this.encounterlocation.hasOwnProperty('Name') && this.encounterlocation.Name != null ? this.encounterlocation.Name.toString() : '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: null,
                    scale: null,
                }),
            }),
        };

    }
}
