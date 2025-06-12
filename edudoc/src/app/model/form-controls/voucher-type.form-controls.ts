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
import { IVoucherType } from '../interfaces/voucher-type';

export interface IVoucherTypeDynamicControlsParameters {
    formGroup?: string;
}

export class VoucherTypeDynamicControls {

    formGroup: string;

    Form: IExpandableObject;
    View: IExpandableObject;

    constructor(private vouchertype?: IVoucherType, additionalParameters?: IVoucherTypeDynamicControlsParameters) {
        this.formGroup = additionalParameters && additionalParameters.formGroup || 'VoucherType';

        this.Form = {
            Editable: new DynamicField({
                formGroup: this.formGroup,
                label: 'Editable',
                name: 'Editable',
                options: null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Checkbox,
                    inputType: null,
                    scale: null,
                }),
                validation: [  ],
                validators: {  },
                value: this.vouchertype && this.vouchertype.hasOwnProperty('Editable') && this.vouchertype.Editable != null ? this.vouchertype.Editable : true,
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
                validation: [ Validators.required, Validators.maxLength(100) ],
                validators: { 'required': true, 'maxlength': 100 },
                value: this.vouchertype && this.vouchertype.hasOwnProperty('Name') && this.vouchertype.Name != null ? this.vouchertype.Name.toString() : '',
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
                value: this.vouchertype && this.vouchertype.Sort || 2,
            }),
        };

        this.View = {
            Editable: new DynamicLabel({
                label: 'Editable',
                value: this.vouchertype && this.vouchertype.hasOwnProperty('Editable') && this.vouchertype.Editable != null ? this.vouchertype.Editable : true,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Checkbox,
                    inputType: null,
                    scale: null,
                }),
            }),
            Name: new DynamicLabel({
                label: 'Name',
                value: this.vouchertype && this.vouchertype.hasOwnProperty('Name') && this.vouchertype.Name != null ? this.vouchertype.Name.toString() : '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: null,
                    scale: null,
                }),
            }),
            Sort: new DynamicLabel({
                label: 'Sort',
                value: this.vouchertype && this.vouchertype.Sort || 2,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Numeric,
                    inputType: NumericInputTypes.Integer,
                    scale: null,
                }),
            }),
        };

    }
}
