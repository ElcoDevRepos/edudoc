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
import { IClaimType } from '../interfaces/claim-type';

export interface IClaimTypeDynamicControlsParameters {
    formGroup?: string;
}

export class ClaimTypeDynamicControls {

    formGroup: string;

    Form: IExpandableObject;
    View: IExpandableObject;

    constructor(private claimtype?: IClaimType, additionalParameters?: IClaimTypeDynamicControlsParameters) {
        this.formGroup = additionalParameters && additionalParameters.formGroup || 'ClaimType';

        this.Form = {
            Alias: new DynamicField({
                formGroup: this.formGroup,
                label: 'Alias',
                name: 'Alias',
                options: null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: null,
                    scale: null,
                }),
                validation: [ Validators.maxLength(50) ],
                validators: { 'maxlength': 50 },
                value: this.claimtype && this.claimtype.hasOwnProperty('Alias') && this.claimtype.Alias != null ? this.claimtype.Alias.toString() : '',
            }),
            IsVisible: new DynamicField({
                formGroup: this.formGroup,
                label: 'Is Visible',
                name: 'IsVisible',
                options: null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Checkbox,
                    inputType: null,
                    scale: null,
                }),
                validation: [  ],
                validators: {  },
                value: this.claimtype && this.claimtype.hasOwnProperty('IsVisible') && this.claimtype.IsVisible != null ? this.claimtype.IsVisible : true,
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
                value: this.claimtype && this.claimtype.hasOwnProperty('Name') && this.claimtype.Name != null ? this.claimtype.Name.toString() : '',
            }),
            ParentId: new DynamicField({
                formGroup: this.formGroup,
                label: 'Parent',
                name: 'ParentId',
                options: null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Numeric,
                    inputType: NumericInputTypes.Integer,
                    scale: null,
                }),
                validation: [  ],
                validators: {  },
                value: this.claimtype && this.claimtype.ParentId || null,
            }),
        };

        this.View = {
            Alias: new DynamicLabel({
                label: 'Alias',
                value: this.claimtype && this.claimtype.hasOwnProperty('Alias') && this.claimtype.Alias != null ? this.claimtype.Alias.toString() : '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: null,
                    scale: null,
                }),
            }),
            IsVisible: new DynamicLabel({
                label: 'Is Visible',
                value: this.claimtype && this.claimtype.hasOwnProperty('IsVisible') && this.claimtype.IsVisible != null ? this.claimtype.IsVisible : true,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Checkbox,
                    inputType: null,
                    scale: null,
                }),
            }),
            Name: new DynamicLabel({
                label: 'Name',
                value: this.claimtype && this.claimtype.hasOwnProperty('Name') && this.claimtype.Name != null ? this.claimtype.Name.toString() : '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: null,
                    scale: null,
                }),
            }),
            ParentId: new DynamicLabel({
                label: 'Parent',
                value: this.claimtype && this.claimtype.ParentId || null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Numeric,
                    inputType: NumericInputTypes.Integer,
                    scale: null,
                }),
            }),
        };

    }
}
