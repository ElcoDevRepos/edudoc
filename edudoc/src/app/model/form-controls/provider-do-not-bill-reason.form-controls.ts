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
import { IProviderDoNotBillReason } from '../interfaces/provider-do-not-bill-reason';

export interface IProviderDoNotBillReasonDynamicControlsParameters {
    formGroup?: string;
}

export class ProviderDoNotBillReasonDynamicControls {

    formGroup: string;

    Form: IExpandableObject;
    View: IExpandableObject;

    constructor(private providerdonotbillreason?: IProviderDoNotBillReason, additionalParameters?: IProviderDoNotBillReasonDynamicControlsParameters) {
        this.formGroup = additionalParameters && additionalParameters.formGroup || 'ProviderDoNotBillReason';

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
                value: this.providerdonotbillreason && this.providerdonotbillreason.hasOwnProperty('Name') && this.providerdonotbillreason.Name != null ? this.providerdonotbillreason.Name.toString() : '',
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
                value: this.providerdonotbillreason && this.providerdonotbillreason.Sort || 0,
            }),
        };

        this.View = {
            Name: new DynamicLabel({
                label: 'Name',
                value: this.providerdonotbillreason && this.providerdonotbillreason.hasOwnProperty('Name') && this.providerdonotbillreason.Name != null ? this.providerdonotbillreason.Name.toString() : '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: null,
                    scale: null,
                }),
            }),
            Sort: new DynamicLabel({
                label: 'Sort',
                value: this.providerdonotbillreason && this.providerdonotbillreason.Sort || 0,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Numeric,
                    inputType: NumericInputTypes.Integer,
                    scale: null,
                }),
            }),
        };

    }
}
