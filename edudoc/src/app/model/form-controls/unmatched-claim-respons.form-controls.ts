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
import { IUnmatchedClaimRespons } from '../interfaces/unmatched-claim-respons';
import { ISchoolDistrict } from '../interfaces/school-district';
import { IEdiErrorCode } from '../interfaces/edi-error-code';
import { IBillingResponseFile } from '../interfaces/billing-response-file';

export interface IUnmatchedClaimResponsDynamicControlsParameters {
    formGroup?: string;
    ediErrorCodes?: IEdiErrorCode[];
    districts?: ISchoolDistrict[];
    responseFiles?: IBillingResponseFile[];
}

export class UnmatchedClaimResponsDynamicControls {

    formGroup: string;
    ediErrorCodes?: IEdiErrorCode[];
    districts?: ISchoolDistrict[];
    responseFiles?: IBillingResponseFile[];

    Form: IExpandableObject;
    View: IExpandableObject;

    constructor(private unmatchedclaimrespons?: IUnmatchedClaimRespons, additionalParameters?: IUnmatchedClaimResponsDynamicControlsParameters) {
        this.formGroup = additionalParameters && additionalParameters.formGroup || 'UnmatchedClaimRespons';
        this.ediErrorCodes = additionalParameters && additionalParameters.ediErrorCodes || undefined;
        this.districts = additionalParameters && additionalParameters.districts || undefined;
        this.responseFiles = additionalParameters && additionalParameters.responseFiles || undefined;

        this.Form = {
            AdjustmentAmount: new DynamicField({
                formGroup: this.formGroup,
                label: 'Adjustment Amount',
                name: 'AdjustmentAmount',
                options: null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: null,
                    scale: null,
                }),
                validation: [ Validators.maxLength(20) ],
                validators: { 'maxlength': 20 },
                value: this.unmatchedclaimrespons && this.unmatchedclaimrespons.hasOwnProperty('AdjustmentAmount') && this.unmatchedclaimrespons.AdjustmentAmount != null ? this.unmatchedclaimrespons.AdjustmentAmount.toString() : '',
            }),
            AdjustmentReasonCode: new DynamicField({
                formGroup: this.formGroup,
                label: 'Adjustment Reason Code',
                name: 'AdjustmentReasonCode',
                options: null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: null,
                    scale: null,
                }),
                validation: [ Validators.maxLength(5) ],
                validators: { 'maxlength': 5 },
                value: this.unmatchedclaimrespons && this.unmatchedclaimrespons.hasOwnProperty('AdjustmentReasonCode') && this.unmatchedclaimrespons.AdjustmentReasonCode != null ? this.unmatchedclaimrespons.AdjustmentReasonCode.toString() : '',
            }),
            ClaimAmount: new DynamicField({
                formGroup: this.formGroup,
                label: 'Claim Amount',
                name: 'ClaimAmount',
                options: null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: null,
                    scale: null,
                }),
                validation: [ Validators.required, Validators.maxLength(18) ],
                validators: { 'required': true, 'maxlength': 18 },
                value: this.unmatchedclaimrespons && this.unmatchedclaimrespons.hasOwnProperty('ClaimAmount') && this.unmatchedclaimrespons.ClaimAmount != null ? this.unmatchedclaimrespons.ClaimAmount.toString() : '',
            }),
            ClaimId: new DynamicField({
                formGroup: this.formGroup,
                label: 'Claim',
                name: 'ClaimId',
                options: null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: null,
                    scale: null,
                }),
                validation: [ Validators.maxLength(25) ],
                validators: { 'maxlength': 25 },
                value: this.unmatchedclaimrespons && this.unmatchedclaimrespons.hasOwnProperty('ClaimId') && this.unmatchedclaimrespons.ClaimId != null ? this.unmatchedclaimrespons.ClaimId.toString() : '',
            }),
            DistrictId: new DynamicField({
                formGroup: this.formGroup,
                label: 'District',
                name: 'DistrictId',
                options: this.districts,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
                validation: [  ],
                validators: {  },
                value: this.unmatchedclaimrespons && this.unmatchedclaimrespons.DistrictId || null,
            }),
            EdiErrorCodeId: new DynamicField({
                formGroup: this.formGroup,
                label: 'Edi Error Code',
                name: 'EdiErrorCodeId',
                options: this.ediErrorCodes,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
                validation: [  ],
                validators: {  },
                value: this.unmatchedclaimrespons && this.unmatchedclaimrespons.EdiErrorCodeId || null,
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
                validation: [ Validators.maxLength(18) ],
                validators: { 'maxlength': 18 },
                value: this.unmatchedclaimrespons && this.unmatchedclaimrespons.hasOwnProperty('PaidAmount') && this.unmatchedclaimrespons.PaidAmount != null ? this.unmatchedclaimrespons.PaidAmount.toString() : '',
            }),
            PatientFirstName: new DynamicField({
                formGroup: this.formGroup,
                label: 'Patient First Name',
                name: 'PatientFirstName',
                options: null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: null,
                    scale: null,
                }),
                validation: [ Validators.maxLength(35) ],
                validators: { 'maxlength': 35 },
                value: this.unmatchedclaimrespons && this.unmatchedclaimrespons.hasOwnProperty('PatientFirstName') && this.unmatchedclaimrespons.PatientFirstName != null ? this.unmatchedclaimrespons.PatientFirstName.toString() : '',
            }),
            PatientId: new DynamicField({
                formGroup: this.formGroup,
                label: 'Patient',
                name: 'PatientId',
                options: null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: null,
                    scale: null,
                }),
                validation: [ Validators.required, Validators.maxLength(80) ],
                validators: { 'required': true, 'maxlength': 80 },
                value: this.unmatchedclaimrespons && this.unmatchedclaimrespons.hasOwnProperty('PatientId') && this.unmatchedclaimrespons.PatientId != null ? this.unmatchedclaimrespons.PatientId.toString() : '',
            }),
            PatientLastName: new DynamicField({
                formGroup: this.formGroup,
                label: 'Patient Last Name',
                name: 'PatientLastName',
                options: null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: null,
                    scale: null,
                }),
                validation: [ Validators.maxLength(60) ],
                validators: { 'maxlength': 60 },
                value: this.unmatchedclaimrespons && this.unmatchedclaimrespons.hasOwnProperty('PatientLastName') && this.unmatchedclaimrespons.PatientLastName != null ? this.unmatchedclaimrespons.PatientLastName.toString() : '',
            }),
            ProcedureIdentifier: new DynamicField({
                formGroup: this.formGroup,
                label: 'Procedure Identifier',
                name: 'ProcedureIdentifier',
                options: null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: null,
                    scale: null,
                }),
                validation: [ Validators.required, Validators.maxLength(50) ],
                validators: { 'required': true, 'maxlength': 50 },
                value: this.unmatchedclaimrespons && this.unmatchedclaimrespons.hasOwnProperty('ProcedureIdentifier') && this.unmatchedclaimrespons.ProcedureIdentifier != null ? this.unmatchedclaimrespons.ProcedureIdentifier.toString() : '',
            }),
            ReferenceNumber: new DynamicField({
                formGroup: this.formGroup,
                label: 'Reference Number',
                name: 'ReferenceNumber',
                options: null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: null,
                    scale: null,
                }),
                validation: [ Validators.maxLength(50) ],
                validators: { 'maxlength': 50 },
                value: this.unmatchedclaimrespons && this.unmatchedclaimrespons.hasOwnProperty('ReferenceNumber') && this.unmatchedclaimrespons.ReferenceNumber != null ? this.unmatchedclaimrespons.ReferenceNumber.toString() : '',
            }),
            ResponseFileId: new DynamicField({
                formGroup: this.formGroup,
                label: 'Response File',
                name: 'ResponseFileId',
                options: this.responseFiles,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
                validation: [ noZeroRequiredValidator ],
                validators: { 'required': true },
                value: this.unmatchedclaimrespons && this.unmatchedclaimrespons.ResponseFileId || null,
            }),
            ServiceDate: new DynamicField({
                formGroup: this.formGroup,
                label: 'Service Date',
                name: 'ServiceDate',
                options: null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: InputTypes.Datepicker,
                    scale: null,
                }),
                validation: [ Validators.required ],
                validators: { 'required': true },
                value: this.unmatchedclaimrespons && this.unmatchedclaimrespons.ServiceDate || null,
            }),
            UnmatchedDistrictId: new DynamicField({
                formGroup: this.formGroup,
                label: 'Unmatched District',
                name: 'UnmatchedDistrictId',
                options: null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Numeric,
                    inputType: NumericInputTypes.Integer,
                    scale: null,
                }),
                validation: [  ],
                validators: {  },
                value: this.unmatchedclaimrespons && this.unmatchedclaimrespons.UnmatchedDistrictId || null,
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
                validation: [  ],
                validators: {  },
                value: this.unmatchedclaimrespons && this.unmatchedclaimrespons.VoucherDate || null,
            }),
        };

        this.View = {
            AdjustmentAmount: new DynamicLabel({
                label: 'Adjustment Amount',
                value: this.unmatchedclaimrespons && this.unmatchedclaimrespons.hasOwnProperty('AdjustmentAmount') && this.unmatchedclaimrespons.AdjustmentAmount != null ? this.unmatchedclaimrespons.AdjustmentAmount.toString() : '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: null,
                    scale: null,
                }),
            }),
            AdjustmentReasonCode: new DynamicLabel({
                label: 'Adjustment Reason Code',
                value: this.unmatchedclaimrespons && this.unmatchedclaimrespons.hasOwnProperty('AdjustmentReasonCode') && this.unmatchedclaimrespons.AdjustmentReasonCode != null ? this.unmatchedclaimrespons.AdjustmentReasonCode.toString() : '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: null,
                    scale: null,
                }),
            }),
            ClaimAmount: new DynamicLabel({
                label: 'Claim Amount',
                value: this.unmatchedclaimrespons && this.unmatchedclaimrespons.hasOwnProperty('ClaimAmount') && this.unmatchedclaimrespons.ClaimAmount != null ? this.unmatchedclaimrespons.ClaimAmount.toString() : '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: null,
                    scale: null,
                }),
            }),
            ClaimId: new DynamicLabel({
                label: 'Claim',
                value: this.unmatchedclaimrespons && this.unmatchedclaimrespons.hasOwnProperty('ClaimId') && this.unmatchedclaimrespons.ClaimId != null ? this.unmatchedclaimrespons.ClaimId.toString() : '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: null,
                    scale: null,
                }),
            }),
            DistrictId: new DynamicLabel({
                label: 'District',
                value: getMetaItemValue(this.districts as unknown as IMetaItem[], this.unmatchedclaimrespons && this.unmatchedclaimrespons.hasOwnProperty('DistrictId') ? this.unmatchedclaimrespons.DistrictId : null) ?? '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
            }),
            EdiErrorCodeId: new DynamicLabel({
                label: 'Edi Error Code',
                value: getMetaItemValue(this.ediErrorCodes as unknown as IMetaItem[], this.unmatchedclaimrespons && this.unmatchedclaimrespons.hasOwnProperty('EdiErrorCodeId') ? this.unmatchedclaimrespons.EdiErrorCodeId : null) ?? '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
            }),
            PaidAmount: new DynamicLabel({
                label: 'Paid Amount',
                value: this.unmatchedclaimrespons && this.unmatchedclaimrespons.hasOwnProperty('PaidAmount') && this.unmatchedclaimrespons.PaidAmount != null ? this.unmatchedclaimrespons.PaidAmount.toString() : '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: null,
                    scale: null,
                }),
            }),
            PatientFirstName: new DynamicLabel({
                label: 'Patient First Name',
                value: this.unmatchedclaimrespons && this.unmatchedclaimrespons.hasOwnProperty('PatientFirstName') && this.unmatchedclaimrespons.PatientFirstName != null ? this.unmatchedclaimrespons.PatientFirstName.toString() : '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: null,
                    scale: null,
                }),
            }),
            PatientId: new DynamicLabel({
                label: 'Patient',
                value: this.unmatchedclaimrespons && this.unmatchedclaimrespons.hasOwnProperty('PatientId') && this.unmatchedclaimrespons.PatientId != null ? this.unmatchedclaimrespons.PatientId.toString() : '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: null,
                    scale: null,
                }),
            }),
            PatientLastName: new DynamicLabel({
                label: 'Patient Last Name',
                value: this.unmatchedclaimrespons && this.unmatchedclaimrespons.hasOwnProperty('PatientLastName') && this.unmatchedclaimrespons.PatientLastName != null ? this.unmatchedclaimrespons.PatientLastName.toString() : '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: null,
                    scale: null,
                }),
            }),
            ProcedureIdentifier: new DynamicLabel({
                label: 'Procedure Identifier',
                value: this.unmatchedclaimrespons && this.unmatchedclaimrespons.hasOwnProperty('ProcedureIdentifier') && this.unmatchedclaimrespons.ProcedureIdentifier != null ? this.unmatchedclaimrespons.ProcedureIdentifier.toString() : '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: null,
                    scale: null,
                }),
            }),
            ReferenceNumber: new DynamicLabel({
                label: 'Reference Number',
                value: this.unmatchedclaimrespons && this.unmatchedclaimrespons.hasOwnProperty('ReferenceNumber') && this.unmatchedclaimrespons.ReferenceNumber != null ? this.unmatchedclaimrespons.ReferenceNumber.toString() : '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: null,
                    scale: null,
                }),
            }),
            ResponseFileId: new DynamicLabel({
                label: 'Response File',
                value: getMetaItemValue(this.responseFiles as unknown as IMetaItem[], this.unmatchedclaimrespons && this.unmatchedclaimrespons.hasOwnProperty('ResponseFileId') ? this.unmatchedclaimrespons.ResponseFileId : null) ?? '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
            }),
            ServiceDate: new DynamicLabel({
                label: 'Service Date',
                value: this.unmatchedclaimrespons && this.unmatchedclaimrespons.ServiceDate || null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: InputTypes.Datepicker,
                    scale: null,
                }),
            }),
            UnmatchedDistrictId: new DynamicLabel({
                label: 'Unmatched District',
                value: this.unmatchedclaimrespons && this.unmatchedclaimrespons.UnmatchedDistrictId || null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Numeric,
                    inputType: NumericInputTypes.Integer,
                    scale: null,
                }),
            }),
            VoucherDate: new DynamicLabel({
                label: 'Voucher Date',
                value: this.unmatchedclaimrespons && this.unmatchedclaimrespons.VoucherDate || null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: InputTypes.Datepicker,
                    scale: null,
                }),
            }),
        };

    }
}
