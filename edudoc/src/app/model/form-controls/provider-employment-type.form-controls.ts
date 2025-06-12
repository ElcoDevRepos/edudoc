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
import { IProviderEmploymentType } from '../interfaces/provider-employment-type';

export interface IProviderEmploymentTypeDynamicControlsParameters {
    formGroup?: string;
}

export class ProviderEmploymentTypeDynamicControls {

    formGroup: string;

    Form: IExpandableObject;
    View: IExpandableObject;

    constructor(private provideremploymenttype?: IProviderEmploymentType, additionalParameters?: IProviderEmploymentTypeDynamicControlsParameters) {
        this.formGroup = additionalParameters && additionalParameters.formGroup || 'ProviderEmploymentType';

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
                validation: [ Validators.required, Validators.maxLength(20) ],
                validators: { 'required': true, 'maxlength': 20 },
                value: this.provideremploymenttype && this.provideremploymenttype.hasOwnProperty('Name') && this.provideremploymenttype.Name != null ? this.provideremploymenttype.Name.toString() : '',
            }),
        };

        this.View = {
            Name: new DynamicLabel({
                label: 'Name',
                value: this.provideremploymenttype && this.provideremploymenttype.hasOwnProperty('Name') && this.provideremploymenttype.Name != null ? this.provideremploymenttype.Name.toString() : '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: null,
                    scale: null,
                }),
            }),
        };

    }
}
