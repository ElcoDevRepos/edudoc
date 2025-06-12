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
import { IBillingFailureReason } from '../interfaces/billing-failure-reason';

export interface IBillingFailureReasonDynamicControlsParameters {
    formGroup?: string;
}

export class BillingFailureReasonDynamicControls {

    formGroup: string;

    Form: IExpandableObject;
    View: IExpandableObject;

    constructor(private billingfailurereason?: IBillingFailureReason, additionalParameters?: IBillingFailureReasonDynamicControlsParameters) {
        this.formGroup = additionalParameters && additionalParameters.formGroup || 'BillingFailureReason';

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
                value: this.billingfailurereason && this.billingfailurereason.hasOwnProperty('Name') && this.billingfailurereason.Name != null ? this.billingfailurereason.Name.toString() : '',
            }),
        };

        this.View = {
            Name: new DynamicLabel({
                label: 'Name',
                value: this.billingfailurereason && this.billingfailurereason.hasOwnProperty('Name') && this.billingfailurereason.Name != null ? this.billingfailurereason.Name.toString() : '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: null,
                    scale: null,
                }),
            }),
        };

    }
}
