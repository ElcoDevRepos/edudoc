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
import { getMetaItemValue } from '@mt-ng2/common-functions';
import { IMetaItem } from '../interfaces/base';

import { IExpandableObject } from '../expandable-object';
import { IVoucherBillingResponseFile } from '../interfaces/voucher-billing-response-file';
import { IBillingResponseFile } from '../interfaces/billing-response-file';
import { IVoucher } from '../interfaces/voucher';

export interface IVoucherBillingResponseFileDynamicControlsParameters {
    formGroup?: string;
    vouchers?: IVoucher[];
    billingResponseFiles?: IBillingResponseFile[];
}

export class VoucherBillingResponseFileDynamicControls {

    formGroup: string;
    vouchers?: IVoucher[];
    billingResponseFiles?: IBillingResponseFile[];

    Form: IExpandableObject;
    View: IExpandableObject;

    constructor(private voucherbillingresponsefile?: IVoucherBillingResponseFile, additionalParameters?: IVoucherBillingResponseFileDynamicControlsParameters) {
        this.formGroup = additionalParameters && additionalParameters.formGroup || 'VoucherBillingResponseFile';
        this.vouchers = additionalParameters && additionalParameters.vouchers || undefined;
        this.billingResponseFiles = additionalParameters && additionalParameters.billingResponseFiles || undefined;

        this.Form = {
            BillingResponseFileId: new DynamicField({
                formGroup: this.formGroup,
                label: 'Billing Response File',
                name: 'BillingResponseFileId',
                options: this.billingResponseFiles,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
                validation: [ noZeroRequiredValidator ],
                validators: { 'required': true },
                value: this.voucherbillingresponsefile && this.voucherbillingresponsefile.BillingResponseFileId || null,
            }),
            CreatedById: new DynamicField({
                formGroup: this.formGroup,
                label: 'Created By',
                name: 'CreatedById',
                options: null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Numeric,
                    inputType: NumericInputTypes.Integer,
                    scale: null,
                }),
                validation: [  ],
                validators: {  },
                value: this.voucherbillingresponsefile && this.voucherbillingresponsefile.CreatedById || 1,
            }),
            DateCreated: new DynamicField({
                formGroup: this.formGroup,
                label: 'Date Created',
                name: 'DateCreated',
                options: null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: InputTypes.Datepicker,
                    scale: null,
                }),
                validation: [  ],
                validators: {  },
                value: this.voucherbillingresponsefile && this.voucherbillingresponsefile.DateCreated || null,
            }),
            VoucherId: new DynamicField({
                formGroup: this.formGroup,
                label: 'Voucher',
                name: 'VoucherId',
                options: this.vouchers,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
                validation: [ noZeroRequiredValidator ],
                validators: { 'required': true },
                value: this.voucherbillingresponsefile && this.voucherbillingresponsefile.VoucherId || null,
            }),
        };

        this.View = {
            BillingResponseFileId: new DynamicLabel({
                label: 'Billing Response File',
                value: getMetaItemValue(this.billingResponseFiles as unknown as IMetaItem[], this.voucherbillingresponsefile && this.voucherbillingresponsefile.hasOwnProperty('BillingResponseFileId') ? this.voucherbillingresponsefile.BillingResponseFileId : null) ?? '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
            }),
            CreatedById: new DynamicLabel({
                label: 'Created By',
                value: this.voucherbillingresponsefile && this.voucherbillingresponsefile.CreatedById || 1,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Numeric,
                    inputType: NumericInputTypes.Integer,
                    scale: null,
                }),
            }),
            DateCreated: new DynamicLabel({
                label: 'Date Created',
                value: this.voucherbillingresponsefile && this.voucherbillingresponsefile.DateCreated || null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: InputTypes.Datepicker,
                    scale: null,
                }),
            }),
            VoucherId: new DynamicLabel({
                label: 'Voucher',
                value: getMetaItemValue(this.vouchers as unknown as IMetaItem[], this.voucherbillingresponsefile && this.voucherbillingresponsefile.hasOwnProperty('VoucherId') ? this.voucherbillingresponsefile.VoucherId : null) ?? '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
            }),
        };

    }
}
