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
import { IClaimValue } from '../interfaces/claim-value';

export interface IClaimValueDynamicControlsParameters {
    formGroup?: string;
}

export class ClaimValueDynamicControls {

    formGroup: string;

    Form: IExpandableObject;
    View: IExpandableObject;

    constructor(private claimvalue?: IClaimValue, additionalParameters?: IClaimValueDynamicControlsParameters) {
        this.formGroup = additionalParameters && additionalParameters.formGroup || 'ClaimValue';

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
                value: this.claimvalue && this.claimvalue.hasOwnProperty('Name') && this.claimvalue.Name != null ? this.claimvalue.Name.toString() : '',
            }),
        };

        this.View = {
            Name: new DynamicLabel({
                label: 'Name',
                value: this.claimvalue && this.claimvalue.hasOwnProperty('Name') && this.claimvalue.Name != null ? this.claimvalue.Name.toString() : '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: null,
                    scale: null,
                }),
            }),
        };

    }
}
