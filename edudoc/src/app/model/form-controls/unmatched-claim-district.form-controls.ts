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
import { IUnmatchedClaimDistrict } from '../interfaces/unmatched-claim-district';
import { IBillingResponseFile } from '../interfaces/billing-response-file';

export interface IUnmatchedClaimDistrictDynamicControlsParameters {
    formGroup?: string;
    responseFiles?: IBillingResponseFile[];
}

export class UnmatchedClaimDistrictDynamicControls {

    formGroup: string;
    responseFiles?: IBillingResponseFile[];

    Form: IExpandableObject;
    View: IExpandableObject;

    constructor(private unmatchedclaimdistrict?: IUnmatchedClaimDistrict, additionalParameters?: IUnmatchedClaimDistrictDynamicControlsParameters) {
        this.formGroup = additionalParameters && additionalParameters.formGroup || 'UnmatchedClaimDistrict';
        this.responseFiles = additionalParameters && additionalParameters.responseFiles || undefined;

        this.Form = {
            Address: new DynamicField({
                formGroup: this.formGroup,
                label: 'Address',
                name: 'Address',
                options: null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: null,
                    scale: null,
                }),
                validation: [ Validators.required, Validators.maxLength(55) ],
                validators: { 'required': true, 'maxlength': 55 },
                value: this.unmatchedclaimdistrict && this.unmatchedclaimdistrict.hasOwnProperty('Address') && this.unmatchedclaimdistrict.Address != null ? this.unmatchedclaimdistrict.Address.toString() : '',
            }),
            City: new DynamicField({
                formGroup: this.formGroup,
                label: 'City',
                name: 'City',
                options: null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: null,
                    scale: null,
                }),
                validation: [ Validators.required, Validators.maxLength(30) ],
                validators: { 'required': true, 'maxlength': 30 },
                value: this.unmatchedclaimdistrict && this.unmatchedclaimdistrict.hasOwnProperty('City') && this.unmatchedclaimdistrict.City != null ? this.unmatchedclaimdistrict.City.toString() : '',
            }),
            DistrictOrganizationName: new DynamicField({
                formGroup: this.formGroup,
                label: 'District Organization Name',
                name: 'DistrictOrganizationName',
                options: null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: null,
                    scale: null,
                }),
                validation: [ Validators.required, Validators.maxLength(60) ],
                validators: { 'required': true, 'maxlength': 60 },
                value: this.unmatchedclaimdistrict && this.unmatchedclaimdistrict.hasOwnProperty('DistrictOrganizationName') && this.unmatchedclaimdistrict.DistrictOrganizationName != null ? this.unmatchedclaimdistrict.DistrictOrganizationName.toString() : '',
            }),
            EmployerId: new DynamicField({
                formGroup: this.formGroup,
                label: 'Employer',
                name: 'EmployerId',
                options: null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: null,
                    scale: null,
                }),
                validation: [ Validators.required, Validators.maxLength(50) ],
                validators: { 'required': true, 'maxlength': 50 },
                value: this.unmatchedclaimdistrict && this.unmatchedclaimdistrict.hasOwnProperty('EmployerId') && this.unmatchedclaimdistrict.EmployerId != null ? this.unmatchedclaimdistrict.EmployerId.toString() : '',
            }),
            IdentificationCode: new DynamicField({
                formGroup: this.formGroup,
                label: 'Identification Code',
                name: 'IdentificationCode',
                options: null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: null,
                    scale: null,
                }),
                validation: [ Validators.required, Validators.maxLength(80) ],
                validators: { 'required': true, 'maxlength': 80 },
                value: this.unmatchedclaimdistrict && this.unmatchedclaimdistrict.hasOwnProperty('IdentificationCode') && this.unmatchedclaimdistrict.IdentificationCode != null ? this.unmatchedclaimdistrict.IdentificationCode.toString() : '',
            }),
            PostalCode: new DynamicField({
                formGroup: this.formGroup,
                label: 'Postal Code',
                name: 'PostalCode',
                options: null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: null,
                    scale: null,
                }),
                validation: [ Validators.required, Validators.maxLength(15) ],
                validators: { 'required': true, 'maxlength': 15 },
                value: this.unmatchedclaimdistrict && this.unmatchedclaimdistrict.hasOwnProperty('PostalCode') && this.unmatchedclaimdistrict.PostalCode != null ? this.unmatchedclaimdistrict.PostalCode.toString() : '',
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
                value: this.unmatchedclaimdistrict && this.unmatchedclaimdistrict.ResponseFileId || null,
            }),
            State: new DynamicField({
                formGroup: this.formGroup,
                label: 'State',
                name: 'State',
                options: null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: null,
                    scale: null,
                }),
                validation: [ Validators.required, Validators.maxLength(2) ],
                validators: { 'required': true, 'maxlength': 2 },
                value: this.unmatchedclaimdistrict && this.unmatchedclaimdistrict.hasOwnProperty('State') && this.unmatchedclaimdistrict.State != null ? this.unmatchedclaimdistrict.State.toString() : '',
            }),
        };

        this.View = {
            Address: new DynamicLabel({
                label: 'Address',
                value: this.unmatchedclaimdistrict && this.unmatchedclaimdistrict.hasOwnProperty('Address') && this.unmatchedclaimdistrict.Address != null ? this.unmatchedclaimdistrict.Address.toString() : '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: null,
                    scale: null,
                }),
            }),
            City: new DynamicLabel({
                label: 'City',
                value: this.unmatchedclaimdistrict && this.unmatchedclaimdistrict.hasOwnProperty('City') && this.unmatchedclaimdistrict.City != null ? this.unmatchedclaimdistrict.City.toString() : '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: null,
                    scale: null,
                }),
            }),
            DistrictOrganizationName: new DynamicLabel({
                label: 'District Organization Name',
                value: this.unmatchedclaimdistrict && this.unmatchedclaimdistrict.hasOwnProperty('DistrictOrganizationName') && this.unmatchedclaimdistrict.DistrictOrganizationName != null ? this.unmatchedclaimdistrict.DistrictOrganizationName.toString() : '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: null,
                    scale: null,
                }),
            }),
            EmployerId: new DynamicLabel({
                label: 'Employer',
                value: this.unmatchedclaimdistrict && this.unmatchedclaimdistrict.hasOwnProperty('EmployerId') && this.unmatchedclaimdistrict.EmployerId != null ? this.unmatchedclaimdistrict.EmployerId.toString() : '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: null,
                    scale: null,
                }),
            }),
            IdentificationCode: new DynamicLabel({
                label: 'Identification Code',
                value: this.unmatchedclaimdistrict && this.unmatchedclaimdistrict.hasOwnProperty('IdentificationCode') && this.unmatchedclaimdistrict.IdentificationCode != null ? this.unmatchedclaimdistrict.IdentificationCode.toString() : '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: null,
                    scale: null,
                }),
            }),
            PostalCode: new DynamicLabel({
                label: 'Postal Code',
                value: this.unmatchedclaimdistrict && this.unmatchedclaimdistrict.hasOwnProperty('PostalCode') && this.unmatchedclaimdistrict.PostalCode != null ? this.unmatchedclaimdistrict.PostalCode.toString() : '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: null,
                    scale: null,
                }),
            }),
            ResponseFileId: new DynamicLabel({
                label: 'Response File',
                value: getMetaItemValue(this.responseFiles as unknown as IMetaItem[], this.unmatchedclaimdistrict && this.unmatchedclaimdistrict.hasOwnProperty('ResponseFileId') ? this.unmatchedclaimdistrict.ResponseFileId : null) ?? '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
            }),
            State: new DynamicLabel({
                label: 'State',
                value: this.unmatchedclaimdistrict && this.unmatchedclaimdistrict.hasOwnProperty('State') && this.unmatchedclaimdistrict.State != null ? this.unmatchedclaimdistrict.State.toString() : '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: null,
                    scale: null,
                }),
            }),
        };

    }
}
