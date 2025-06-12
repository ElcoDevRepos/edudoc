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
import { IProviderInactivityReason } from '../interfaces/provider-inactivity-reason';

export interface IProviderInactivityReasonDynamicControlsParameters {
    formGroup?: string;
}

export class ProviderInactivityReasonDynamicControls {

    formGroup: string;

    Form: IExpandableObject;
    View: IExpandableObject;

    constructor(private providerinactivityreason?: IProviderInactivityReason, additionalParameters?: IProviderInactivityReasonDynamicControlsParameters) {
        this.formGroup = additionalParameters && additionalParameters.formGroup || 'ProviderInactivityReason';

        this.Form = {
            Code: new DynamicField({
                formGroup: this.formGroup,
                label: 'Code',
                name: 'Code',
                options: null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: null,
                    scale: null,
                }),
                validation: [ Validators.maxLength(3) ],
                validators: { 'maxlength': 3 },
                value: this.providerinactivityreason && this.providerinactivityreason.hasOwnProperty('Code') && this.providerinactivityreason.Code != null ? this.providerinactivityreason.Code.toString() : '',
            }),
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
                value: this.providerinactivityreason && this.providerinactivityreason.hasOwnProperty('Name') && this.providerinactivityreason.Name != null ? this.providerinactivityreason.Name.toString() : '',
            }),
        };

        this.View = {
            Code: new DynamicLabel({
                label: 'Code',
                value: this.providerinactivityreason && this.providerinactivityreason.hasOwnProperty('Code') && this.providerinactivityreason.Code != null ? this.providerinactivityreason.Code.toString() : '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: null,
                    scale: null,
                }),
            }),
            Name: new DynamicLabel({
                label: 'Name',
                value: this.providerinactivityreason && this.providerinactivityreason.hasOwnProperty('Name') && this.providerinactivityreason.Name != null ? this.providerinactivityreason.Name.toString() : '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: null,
                    scale: null,
                }),
            }),
        };

    }
}
