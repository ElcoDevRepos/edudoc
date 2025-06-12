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
import { IAnnualEntryStatus } from '../interfaces/annual-entry-status';

export interface IAnnualEntryStatusDynamicControlsParameters {
    formGroup?: string;
}

export class AnnualEntryStatusDynamicControls {

    formGroup: string;

    Form: IExpandableObject;
    View: IExpandableObject;

    constructor(private annualentrystatus?: IAnnualEntryStatus, additionalParameters?: IAnnualEntryStatusDynamicControlsParameters) {
        this.formGroup = additionalParameters && additionalParameters.formGroup || 'AnnualEntryStatus';

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
                value: this.annualentrystatus && this.annualentrystatus.hasOwnProperty('Name') && this.annualentrystatus.Name != null ? this.annualentrystatus.Name.toString() : '',
            }),
        };

        this.View = {
            Name: new DynamicLabel({
                label: 'Name',
                value: this.annualentrystatus && this.annualentrystatus.hasOwnProperty('Name') && this.annualentrystatus.Name != null ? this.annualentrystatus.Name.toString() : '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: null,
                    scale: null,
                }),
            }),
        };

    }
}
