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
import { IVoucher } from '../interfaces/voucher';
import { ISchoolDistrict } from '../interfaces/school-district';
import { IUnmatchedClaimDistrict } from '../interfaces/unmatched-claim-district';
import { IVoucherType } from '../interfaces/voucher-type';

export interface IVoucherDynamicControlsParameters {
    formGroup?: string;
    schoolDistricts?: ISchoolDistrict[];
    unmatchedClaimDistricts?: IUnmatchedClaimDistrict[];
    voucherTypes?: IVoucherType[];
}

export class VoucherDynamicControls {

    formGroup: string;
    schoolDistricts?: ISchoolDistrict[];
    unmatchedClaimDistricts?: IUnmatchedClaimDistrict[];
    voucherTypes?: IVoucherType[];

    Form: IExpandableObject;
    View: IExpandableObject;

    constructor(private voucher?: IVoucher, additionalParameters?: IVoucherDynamicControlsParameters) {
        this.formGroup = additionalParameters && additionalParameters.formGroup || 'Voucher';
        this.schoolDistricts = additionalParameters && additionalParameters.schoolDistricts || undefined;
        this.unmatchedClaimDistricts = additionalParameters && additionalParameters.unmatchedClaimDistricts || undefined;
        this.voucherTypes = additionalParameters && additionalParameters.voucherTypes || undefined;

        this.Form = {
            Archived: new DynamicField({
                formGroup: this.formGroup,
                label: 'Archived',
                name: 'Archived',
                options: null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Checkbox,
                    inputType: null,
                    scale: null,
                }),
                validation: [  ],
                validators: {  },
                value: this.voucher && this.voucher.hasOwnProperty('Archived') && this.voucher.Archived != null ? this.voucher.Archived : false,
            }),
            PaidAmount: new DynamicField({
                formGroup: this.formGroup,
                label: 'Paid Amount',
                name: 'PaidAmount',
                options: null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: null,
                    scale: null,
                }),
                validation: [ Validators.required, Validators.maxLength(18) ],
                validators: { 'required': true, 'maxlength': 18 },
                value: this.voucher && this.voucher.hasOwnProperty('PaidAmount') && this.voucher.PaidAmount != null ? this.voucher.PaidAmount.toString() : '',
            }),
            SchoolDistrictId: new DynamicField({
                formGroup: this.formGroup,
                label: 'School District',
                name: 'SchoolDistrictId',
                options: this.schoolDistricts,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
                validation: [  ],
                validators: {  },
                value: this.voucher && this.voucher.SchoolDistrictId || null,
            }),
            SchoolYear: new DynamicField({
                formGroup: this.formGroup,
                label: 'School Year',
                name: 'SchoolYear',
                options: null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: null,
                    scale: null,
                }),
                validation: [ Validators.required, Validators.maxLength(9) ],
                validators: { 'required': true, 'maxlength': 9 },
                value: this.voucher && this.voucher.hasOwnProperty('SchoolYear') && this.voucher.SchoolYear != null ? this.voucher.SchoolYear.toString() : '',
            }),
            ServiceCode: new DynamicField({
                formGroup: this.formGroup,
                label: 'Service Code',
                name: 'ServiceCode',
                options: null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: null,
                    scale: null,
                }),
                validation: [ Validators.maxLength(100) ],
                validators: { 'maxlength': 100 },
                value: this.voucher && this.voucher.hasOwnProperty('ServiceCode') && this.voucher.ServiceCode != null ? this.voucher.ServiceCode.toString() : '',
            }),
            UnmatchedClaimDistrictId: new DynamicField({
                formGroup: this.formGroup,
                label: 'Unmatched Claim District',
                name: 'UnmatchedClaimDistrictId',
                options: this.unmatchedClaimDistricts,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
                validation: [  ],
                validators: {  },
                value: this.voucher && this.voucher.UnmatchedClaimDistrictId || null,
            }),
            VoucherAmount: new DynamicField({
                formGroup: this.formGroup,
                label: 'Voucher Amount',
                name: 'VoucherAmount',
                options: null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: null,
                    scale: null,
                }),
                validation: [ Validators.required, Validators.maxLength(18) ],
                validators: { 'required': true, 'maxlength': 18 },
                value: this.voucher && this.voucher.hasOwnProperty('VoucherAmount') && this.voucher.VoucherAmount != null ? this.voucher.VoucherAmount.toString() : '',
            }),
            VoucherDate: new DynamicField({
                formGroup: this.formGroup,
                label: 'Voucher Date',
                name: 'VoucherDate',
                options: null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: InputTypes.Datepicker,
                    scale: null,
                }),
                validation: [ Validators.required ],
                validators: { 'required': true },
                value: this.voucher && this.voucher.VoucherDate || null,
            }),
            VoucherTypeId: new DynamicField({
                formGroup: this.formGroup,
                label: 'Voucher Type',
                name: 'VoucherTypeId',
                options: this.voucherTypes,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
                validation: [  ],
                validators: {  },
                value: this.voucher && this.voucher.VoucherTypeId || 1,
            }),
        };

        this.View = {
            Archived: new DynamicLabel({
                label: 'Archived',
                value: this.voucher && this.voucher.hasOwnProperty('Archived') && this.voucher.Archived != null ? this.voucher.Archived : false,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Checkbox,
                    inputType: null,
                    scale: null,
                }),
            }),
            PaidAmount: new DynamicLabel({
                label: 'Paid Amount',
                value: this.voucher && this.voucher.hasOwnProperty('PaidAmount') && this.voucher.PaidAmount != null ? this.voucher.PaidAmount.toString() : '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: null,
                    scale: null,
                }),
            }),
            SchoolDistrictId: new DynamicLabel({
                label: 'School District',
                value: getMetaItemValue(this.schoolDistricts as unknown as IMetaItem[], this.voucher && this.voucher.hasOwnProperty('SchoolDistrictId') ? this.voucher.SchoolDistrictId : null) ?? '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
            }),
            SchoolYear: new DynamicLabel({
                label: 'School Year',
                value: this.voucher && this.voucher.hasOwnProperty('SchoolYear') && this.voucher.SchoolYear != null ? this.voucher.SchoolYear.toString() : '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: null,
                    scale: null,
                }),
            }),
            ServiceCode: new DynamicLabel({
                label: 'Service Code',
                value: this.voucher && this.voucher.hasOwnProperty('ServiceCode') && this.voucher.ServiceCode != null ? this.voucher.ServiceCode.toString() : '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: null,
                    scale: null,
                }),
            }),
            UnmatchedClaimDistrictId: new DynamicLabel({
                label: 'Unmatched Claim District',
                value: getMetaItemValue(this.unmatchedClaimDistricts as unknown as IMetaItem[], this.voucher && this.voucher.hasOwnProperty('UnmatchedClaimDistrictId') ? this.voucher.UnmatchedClaimDistrictId : null) ?? '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
            }),
            VoucherAmount: new DynamicLabel({
                label: 'Voucher Amount',
                value: this.voucher && this.voucher.hasOwnProperty('VoucherAmount') && this.voucher.VoucherAmount != null ? this.voucher.VoucherAmount.toString() : '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: null,
                    scale: null,
                }),
            }),
            VoucherDate: new DynamicLabel({
                label: 'Voucher Date',
                value: this.voucher && this.voucher.VoucherDate || null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: InputTypes.Datepicker,
                    scale: null,
                }),
            }),
            VoucherTypeId: new DynamicLabel({
                label: 'Voucher Type',
                value: getMetaItemValue(this.voucherTypes as unknown as IMetaItem[], this.voucher && this.voucher.hasOwnProperty('VoucherTypeId') ? this.voucher.VoucherTypeId : null) ?? '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
            }),
        };

    }
}
