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
import { IClaimsEncounter } from '../interfaces/claims-encounter';
import { IEncounterStudentCptCode } from '../interfaces/encounter-student-cpt-code';
import { IClaimsStudent } from '../interfaces/claims-student';
import { IEdiErrorCode } from '../interfaces/edi-error-code';
import { IEncounterStudent } from '../interfaces/encounter-student';

export interface IClaimsEncounterDynamicControlsParameters {
    formGroup?: string;
    ediErrorCodes?: IEdiErrorCode[];
    claimsStudents?: IClaimsStudent[];
    encounterStudents?: IEncounterStudent[];
    aggregates?: IEncounterStudentCptCode[];
    encounterStudentCptCodes?: IEncounterStudentCptCode[];
}

export class ClaimsEncounterDynamicControls {

    formGroup: string;
    ediErrorCodes?: IEdiErrorCode[];
    claimsStudents?: IClaimsStudent[];
    encounterStudents?: IEncounterStudent[];
    aggregates?: IEncounterStudentCptCode[];
    encounterStudentCptCodes?: IEncounterStudentCptCode[];

    Form: IExpandableObject;
    View: IExpandableObject;

    constructor(private claimsencounter?: IClaimsEncounter, additionalParameters?: IClaimsEncounterDynamicControlsParameters) {
        this.formGroup = additionalParameters && additionalParameters.formGroup || 'ClaimsEncounter';
        this.ediErrorCodes = additionalParameters && additionalParameters.ediErrorCodes || undefined;
        this.claimsStudents = additionalParameters && additionalParameters.claimsStudents || undefined;
        this.encounterStudents = additionalParameters && additionalParameters.encounterStudents || undefined;
        this.aggregates = additionalParameters && additionalParameters.aggregates || undefined;
        this.encounterStudentCptCodes = additionalParameters && additionalParameters.encounterStudentCptCodes || undefined;

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
                value: this.claimsencounter && this.claimsencounter.hasOwnProperty('AdjustmentAmount') && this.claimsencounter.AdjustmentAmount != null ? this.claimsencounter.AdjustmentAmount.toString() : '',
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
                value: this.claimsencounter && this.claimsencounter.hasOwnProperty('AdjustmentReasonCode') && this.claimsencounter.AdjustmentReasonCode != null ? this.claimsencounter.AdjustmentReasonCode.toString() : '',
            }),
            AggregateId: new DynamicField({
                formGroup: this.formGroup,
                label: 'Aggregate',
                name: 'AggregateId',
                options: this.aggregates,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
                validation: [  ],
                validators: {  },
                value: this.claimsencounter && this.claimsencounter.AggregateId || null,
            }),
            BillingUnits: new DynamicField({
                formGroup: this.formGroup,
                label: 'Billing Units',
                name: 'BillingUnits',
                options: null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: null,
                    scale: null,
                }),
                validation: [ Validators.required, Validators.maxLength(15) ],
                validators: { 'required': true, 'maxlength': 15 },
                value: this.claimsencounter && this.claimsencounter.hasOwnProperty('BillingUnits') && this.claimsencounter.BillingUnits != null ? this.claimsencounter.BillingUnits.toString() : '',
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
                value: this.claimsencounter && this.claimsencounter.hasOwnProperty('ClaimAmount') && this.claimsencounter.ClaimAmount != null ? this.claimsencounter.ClaimAmount.toString() : '',
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
                validation: [ Validators.maxLength(15) ],
                validators: { 'maxlength': 15 },
                value: this.claimsencounter && this.claimsencounter.hasOwnProperty('ClaimId') && this.claimsencounter.ClaimId != null ? this.claimsencounter.ClaimId.toString() : '',
            }),
            ClaimsStudentId: new DynamicField({
                formGroup: this.formGroup,
                label: 'Claims Student',
                name: 'ClaimsStudentId',
                options: this.claimsStudents,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
                validation: [  ],
                validators: {  },
                value: this.claimsencounter && this.claimsencounter.ClaimsStudentId || null,
            }),
            ControlNumberPrefix: new DynamicField({
                formGroup: this.formGroup,
                label: 'Control Number Prefix',
                name: 'ControlNumberPrefix',
                options: null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: null,
                    scale: null,
                }),
                validation: [ Validators.maxLength(3) ],
                validators: { 'maxlength': 3 },
                value: this.claimsencounter && this.claimsencounter.hasOwnProperty('ControlNumberPrefix') && this.claimsencounter.ControlNumberPrefix != null ? this.claimsencounter.ControlNumberPrefix.toString() : '',
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
                value: this.claimsencounter && this.claimsencounter.EdiErrorCodeId || null,
            }),
            EncounterStudentCptCodeId: new DynamicField({
                formGroup: this.formGroup,
                label: 'Encounter Student Cpt Code',
                name: 'EncounterStudentCptCodeId',
                options: this.encounterStudentCptCodes,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
                validation: [ noZeroRequiredValidator ],
                validators: { 'required': true },
                value: this.claimsencounter && this.claimsencounter.EncounterStudentCptCodeId || null,
            }),
            EncounterStudentId: new DynamicField({
                formGroup: this.formGroup,
                label: 'Encounter Student',
                name: 'EncounterStudentId',
                options: this.encounterStudents,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
                validation: [ noZeroRequiredValidator ],
                validators: { 'required': true },
                value: this.claimsencounter && this.claimsencounter.EncounterStudentId || null,
            }),
            IsTelehealth: new DynamicField({
                formGroup: this.formGroup,
                label: 'Is Telehealth',
                name: 'IsTelehealth',
                options: null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Checkbox,
                    inputType: null,
                    scale: null,
                }),
                validation: [  ],
                validators: {  },
                value: this.claimsencounter && this.claimsencounter.hasOwnProperty('IsTelehealth') && this.claimsencounter.IsTelehealth != null ? this.claimsencounter.IsTelehealth : false,
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
                value: this.claimsencounter && this.claimsencounter.hasOwnProperty('PaidAmount') && this.claimsencounter.PaidAmount != null ? this.claimsencounter.PaidAmount.toString() : '',
            }),
            PhysicianFirstName: new DynamicField({
                formGroup: this.formGroup,
                label: 'Physician First Name',
                name: 'PhysicianFirstName',
                options: null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: null,
                    scale: null,
                }),
                validation: [ Validators.maxLength(35) ],
                validators: { 'maxlength': 35 },
                value: this.claimsencounter && this.claimsencounter.hasOwnProperty('PhysicianFirstName') && this.claimsencounter.PhysicianFirstName != null ? this.claimsencounter.PhysicianFirstName.toString() : '',
            }),
            PhysicianId: new DynamicField({
                formGroup: this.formGroup,
                label: 'Physician',
                name: 'PhysicianId',
                options: null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: null,
                    scale: null,
                }),
                validation: [ Validators.maxLength(80) ],
                validators: { 'maxlength': 80 },
                value: this.claimsencounter && this.claimsencounter.hasOwnProperty('PhysicianId') && this.claimsencounter.PhysicianId != null ? this.claimsencounter.PhysicianId.toString() : '',
            }),
            PhysicianLastName: new DynamicField({
                formGroup: this.formGroup,
                label: 'Physician Last Name',
                name: 'PhysicianLastName',
                options: null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: null,
                    scale: null,
                }),
                validation: [ Validators.maxLength(60) ],
                validators: { 'maxlength': 60 },
                value: this.claimsencounter && this.claimsencounter.hasOwnProperty('PhysicianLastName') && this.claimsencounter.PhysicianLastName != null ? this.claimsencounter.PhysicianLastName.toString() : '',
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
                value: this.claimsencounter && this.claimsencounter.hasOwnProperty('ProcedureIdentifier') && this.claimsencounter.ProcedureIdentifier != null ? this.claimsencounter.ProcedureIdentifier.toString() : '',
            }),
            ReasonForServiceCode: new DynamicField({
                formGroup: this.formGroup,
                label: 'Reason For Service Code',
                name: 'ReasonForServiceCode',
                options: null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: null,
                    scale: null,
                }),
                validation: [ Validators.required, Validators.maxLength(50) ],
                validators: { 'required': true, 'maxlength': 50 },
                value: this.claimsencounter && this.claimsencounter.hasOwnProperty('ReasonForServiceCode') && this.claimsencounter.ReasonForServiceCode != null ? this.claimsencounter.ReasonForServiceCode.toString() : '',
            }),
            Rebilled: new DynamicField({
                formGroup: this.formGroup,
                label: 'Rebilled',
                name: 'Rebilled',
                options: null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Checkbox,
                    inputType: null,
                    scale: null,
                }),
                validation: [  ],
                validators: {  },
                value: this.claimsencounter && this.claimsencounter.hasOwnProperty('Rebilled') && this.claimsencounter.Rebilled != null ? this.claimsencounter.Rebilled : false,
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
                value: this.claimsencounter && this.claimsencounter.hasOwnProperty('ReferenceNumber') && this.claimsencounter.ReferenceNumber != null ? this.claimsencounter.ReferenceNumber.toString() : '',
            }),
            ReferringProviderFirstName: new DynamicField({
                formGroup: this.formGroup,
                label: 'Referring Provider First Name',
                name: 'ReferringProviderFirstName',
                options: null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: null,
                    scale: null,
                }),
                validation: [ Validators.maxLength(35) ],
                validators: { 'maxlength': 35 },
                value: this.claimsencounter && this.claimsencounter.hasOwnProperty('ReferringProviderFirstName') && this.claimsencounter.ReferringProviderFirstName != null ? this.claimsencounter.ReferringProviderFirstName.toString() : '',
            }),
            ReferringProviderId: new DynamicField({
                formGroup: this.formGroup,
                label: 'Referring Provider',
                name: 'ReferringProviderId',
                options: null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: null,
                    scale: null,
                }),
                validation: [ Validators.required, Validators.maxLength(80) ],
                validators: { 'required': true, 'maxlength': 80 },
                value: this.claimsencounter && this.claimsencounter.hasOwnProperty('ReferringProviderId') && this.claimsencounter.ReferringProviderId != null ? this.claimsencounter.ReferringProviderId.toString() : '',
            }),
            ReferringProviderLastName: new DynamicField({
                formGroup: this.formGroup,
                label: 'Referring Provider Last Name',
                name: 'ReferringProviderLastName',
                options: null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: null,
                    scale: null,
                }),
                validation: [ Validators.maxLength(60) ],
                validators: { 'maxlength': 60 },
                value: this.claimsencounter && this.claimsencounter.hasOwnProperty('ReferringProviderLastName') && this.claimsencounter.ReferringProviderLastName != null ? this.claimsencounter.ReferringProviderLastName.toString() : '',
            }),
            Response: new DynamicField({
                formGroup: this.formGroup,
                label: 'Response',
                name: 'Response',
                options: null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Checkbox,
                    inputType: null,
                    scale: null,
                }),
                validation: [  ],
                validators: {  },
                value: this.claimsencounter && this.claimsencounter.hasOwnProperty('Response') && this.claimsencounter.Response != null ? this.claimsencounter.Response : false,
            }),
            ReversedClaimId: new DynamicField({
                formGroup: this.formGroup,
                label: 'Reversed Claim',
                name: 'ReversedClaimId',
                options: null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Numeric,
                    inputType: NumericInputTypes.Integer,
                    scale: null,
                }),
                validation: [  ],
                validators: {  },
                value: this.claimsencounter && this.claimsencounter.ReversedClaimId || null,
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
                value: this.claimsencounter && this.claimsencounter.ServiceDate || null,
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
                value: this.claimsencounter && this.claimsencounter.VoucherDate || null,
            }),
        };

        this.View = {
            AdjustmentAmount: new DynamicLabel({
                label: 'Adjustment Amount',
                value: this.claimsencounter && this.claimsencounter.hasOwnProperty('AdjustmentAmount') && this.claimsencounter.AdjustmentAmount != null ? this.claimsencounter.AdjustmentAmount.toString() : '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: null,
                    scale: null,
                }),
            }),
            AdjustmentReasonCode: new DynamicLabel({
                label: 'Adjustment Reason Code',
                value: this.claimsencounter && this.claimsencounter.hasOwnProperty('AdjustmentReasonCode') && this.claimsencounter.AdjustmentReasonCode != null ? this.claimsencounter.AdjustmentReasonCode.toString() : '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: null,
                    scale: null,
                }),
            }),
            AggregateId: new DynamicLabel({
                label: 'Aggregate',
                value: getMetaItemValue(this.aggregates as unknown as IMetaItem[], this.claimsencounter && this.claimsencounter.hasOwnProperty('AggregateId') ? this.claimsencounter.AggregateId : null) ?? '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
            }),
            BillingUnits: new DynamicLabel({
                label: 'Billing Units',
                value: this.claimsencounter && this.claimsencounter.hasOwnProperty('BillingUnits') && this.claimsencounter.BillingUnits != null ? this.claimsencounter.BillingUnits.toString() : '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: null,
                    scale: null,
                }),
            }),
            ClaimAmount: new DynamicLabel({
                label: 'Claim Amount',
                value: this.claimsencounter && this.claimsencounter.hasOwnProperty('ClaimAmount') && this.claimsencounter.ClaimAmount != null ? this.claimsencounter.ClaimAmount.toString() : '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: null,
                    scale: null,
                }),
            }),
            ClaimId: new DynamicLabel({
                label: 'Claim',
                value: this.claimsencounter && this.claimsencounter.hasOwnProperty('ClaimId') && this.claimsencounter.ClaimId != null ? this.claimsencounter.ClaimId.toString() : '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: null,
                    scale: null,
                }),
            }),
            ClaimsStudentId: new DynamicLabel({
                label: 'Claims Student',
                value: getMetaItemValue(this.claimsStudents as unknown as IMetaItem[], this.claimsencounter && this.claimsencounter.hasOwnProperty('ClaimsStudentId') ? this.claimsencounter.ClaimsStudentId : null) ?? '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
            }),
            ControlNumberPrefix: new DynamicLabel({
                label: 'Control Number Prefix',
                value: this.claimsencounter && this.claimsencounter.hasOwnProperty('ControlNumberPrefix') && this.claimsencounter.ControlNumberPrefix != null ? this.claimsencounter.ControlNumberPrefix.toString() : '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: null,
                    scale: null,
                }),
            }),
            EdiErrorCodeId: new DynamicLabel({
                label: 'Edi Error Code',
                value: getMetaItemValue(this.ediErrorCodes as unknown as IMetaItem[], this.claimsencounter && this.claimsencounter.hasOwnProperty('EdiErrorCodeId') ? this.claimsencounter.EdiErrorCodeId : null) ?? '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
            }),
            EncounterStudentCptCodeId: new DynamicLabel({
                label: 'Encounter Student Cpt Code',
                value: getMetaItemValue(this.encounterStudentCptCodes as unknown as IMetaItem[], this.claimsencounter && this.claimsencounter.hasOwnProperty('EncounterStudentCptCodeId') ? this.claimsencounter.EncounterStudentCptCodeId : null) ?? '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
            }),
            EncounterStudentId: new DynamicLabel({
                label: 'Encounter Student',
                value: getMetaItemValue(this.encounterStudents as unknown as IMetaItem[], this.claimsencounter && this.claimsencounter.hasOwnProperty('EncounterStudentId') ? this.claimsencounter.EncounterStudentId : null) ?? '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
            }),
            IsTelehealth: new DynamicLabel({
                label: 'Is Telehealth',
                value: this.claimsencounter && this.claimsencounter.hasOwnProperty('IsTelehealth') && this.claimsencounter.IsTelehealth != null ? this.claimsencounter.IsTelehealth : false,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Checkbox,
                    inputType: null,
                    scale: null,
                }),
            }),
            PaidAmount: new DynamicLabel({
                label: 'Paid Amount',
                value: this.claimsencounter && this.claimsencounter.hasOwnProperty('PaidAmount') && this.claimsencounter.PaidAmount != null ? this.claimsencounter.PaidAmount.toString() : '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: null,
                    scale: null,
                }),
            }),
            PhysicianFirstName: new DynamicLabel({
                label: 'Physician First Name',
                value: this.claimsencounter && this.claimsencounter.hasOwnProperty('PhysicianFirstName') && this.claimsencounter.PhysicianFirstName != null ? this.claimsencounter.PhysicianFirstName.toString() : '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: null,
                    scale: null,
                }),
            }),
            PhysicianId: new DynamicLabel({
                label: 'Physician',
                value: this.claimsencounter && this.claimsencounter.hasOwnProperty('PhysicianId') && this.claimsencounter.PhysicianId != null ? this.claimsencounter.PhysicianId.toString() : '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: null,
                    scale: null,
                }),
            }),
            PhysicianLastName: new DynamicLabel({
                label: 'Physician Last Name',
                value: this.claimsencounter && this.claimsencounter.hasOwnProperty('PhysicianLastName') && this.claimsencounter.PhysicianLastName != null ? this.claimsencounter.PhysicianLastName.toString() : '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: null,
                    scale: null,
                }),
            }),
            ProcedureIdentifier: new DynamicLabel({
                label: 'Procedure Identifier',
                value: this.claimsencounter && this.claimsencounter.hasOwnProperty('ProcedureIdentifier') && this.claimsencounter.ProcedureIdentifier != null ? this.claimsencounter.ProcedureIdentifier.toString() : '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: null,
                    scale: null,
                }),
            }),
            ReasonForServiceCode: new DynamicLabel({
                label: 'Reason For Service Code',
                value: this.claimsencounter && this.claimsencounter.hasOwnProperty('ReasonForServiceCode') && this.claimsencounter.ReasonForServiceCode != null ? this.claimsencounter.ReasonForServiceCode.toString() : '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: null,
                    scale: null,
                }),
            }),
            Rebilled: new DynamicLabel({
                label: 'Rebilled',
                value: this.claimsencounter && this.claimsencounter.hasOwnProperty('Rebilled') && this.claimsencounter.Rebilled != null ? this.claimsencounter.Rebilled : false,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Checkbox,
                    inputType: null,
                    scale: null,
                }),
            }),
            ReferenceNumber: new DynamicLabel({
                label: 'Reference Number',
                value: this.claimsencounter && this.claimsencounter.hasOwnProperty('ReferenceNumber') && this.claimsencounter.ReferenceNumber != null ? this.claimsencounter.ReferenceNumber.toString() : '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: null,
                    scale: null,
                }),
            }),
            ReferringProviderFirstName: new DynamicLabel({
                label: 'Referring Provider First Name',
                value: this.claimsencounter && this.claimsencounter.hasOwnProperty('ReferringProviderFirstName') && this.claimsencounter.ReferringProviderFirstName != null ? this.claimsencounter.ReferringProviderFirstName.toString() : '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: null,
                    scale: null,
                }),
            }),
            ReferringProviderId: new DynamicLabel({
                label: 'Referring Provider',
                value: this.claimsencounter && this.claimsencounter.hasOwnProperty('ReferringProviderId') && this.claimsencounter.ReferringProviderId != null ? this.claimsencounter.ReferringProviderId.toString() : '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: null,
                    scale: null,
                }),
            }),
            ReferringProviderLastName: new DynamicLabel({
                label: 'Referring Provider Last Name',
                value: this.claimsencounter && this.claimsencounter.hasOwnProperty('ReferringProviderLastName') && this.claimsencounter.ReferringProviderLastName != null ? this.claimsencounter.ReferringProviderLastName.toString() : '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: null,
                    scale: null,
                }),
            }),
            Response: new DynamicLabel({
                label: 'Response',
                value: this.claimsencounter && this.claimsencounter.hasOwnProperty('Response') && this.claimsencounter.Response != null ? this.claimsencounter.Response : false,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Checkbox,
                    inputType: null,
                    scale: null,
                }),
            }),
            ReversedClaimId: new DynamicLabel({
                label: 'Reversed Claim',
                value: this.claimsencounter && this.claimsencounter.ReversedClaimId || null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Numeric,
                    inputType: NumericInputTypes.Integer,
                    scale: null,
                }),
            }),
            ServiceDate: new DynamicLabel({
                label: 'Service Date',
                value: this.claimsencounter && this.claimsencounter.ServiceDate || null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: InputTypes.Datepicker,
                    scale: null,
                }),
            }),
            VoucherDate: new DynamicLabel({
                label: 'Voucher Date',
                value: this.claimsencounter && this.claimsencounter.VoucherDate || null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: InputTypes.Datepicker,
                    scale: null,
                }),
            }),
        };

    }
}
