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
import { IClaimsDistrict } from '../interfaces/claims-district';
import { IHealthCareClaim } from '../interfaces/health-care-claim';
import { ISchoolDistrict } from '../interfaces/school-district';

export interface IClaimsDistrictDynamicControlsParameters {
    formGroup?: string;
    healthCareClaims?: IHealthCareClaim[];
    schoolDistricts?: ISchoolDistrict[];
}

export class ClaimsDistrictDynamicControls {

    formGroup: string;
    healthCareClaims?: IHealthCareClaim[];
    schoolDistricts?: ISchoolDistrict[];

    Form: IExpandableObject;
    View: IExpandableObject;

    constructor(private claimsdistrict?: IClaimsDistrict, additionalParameters?: IClaimsDistrictDynamicControlsParameters) {
        this.formGroup = additionalParameters && additionalParameters.formGroup || 'ClaimsDistrict';
        this.healthCareClaims = additionalParameters && additionalParameters.healthCareClaims || undefined;
        this.schoolDistricts = additionalParameters && additionalParameters.schoolDistricts || undefined;

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
                value: this.claimsdistrict && this.claimsdistrict.hasOwnProperty('Address') && this.claimsdistrict.Address != null ? this.claimsdistrict.Address.toString() : '',
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
                value: this.claimsdistrict && this.claimsdistrict.hasOwnProperty('City') && this.claimsdistrict.City != null ? this.claimsdistrict.City.toString() : '',
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
                value: this.claimsdistrict && this.claimsdistrict.hasOwnProperty('DistrictOrganizationName') && this.claimsdistrict.DistrictOrganizationName != null ? this.claimsdistrict.DistrictOrganizationName.toString() : '',
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
                value: this.claimsdistrict && this.claimsdistrict.hasOwnProperty('EmployerId') && this.claimsdistrict.EmployerId != null ? this.claimsdistrict.EmployerId.toString() : '',
            }),
            HealthCareClaimsId: new DynamicField({
                formGroup: this.formGroup,
                label: 'Health Care Claims',
                name: 'HealthCareClaimsId',
                options: this.healthCareClaims,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
                validation: [ noZeroRequiredValidator ],
                validators: { 'required': true },
                value: this.claimsdistrict && this.claimsdistrict.HealthCareClaimsId || null,
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
                value: this.claimsdistrict && this.claimsdistrict.hasOwnProperty('IdentificationCode') && this.claimsdistrict.IdentificationCode != null ? this.claimsdistrict.IdentificationCode.toString() : '',
            }),
            Index: new DynamicField({
                formGroup: this.formGroup,
                label: 'Index',
                name: 'Index',
                options: null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Numeric,
                    inputType: NumericInputTypes.Integer,
                    scale: null,
                }),
                validation: [  ],
                validators: {  },
                value: this.claimsdistrict && this.claimsdistrict.Index || null,
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
                value: this.claimsdistrict && this.claimsdistrict.hasOwnProperty('PostalCode') && this.claimsdistrict.PostalCode != null ? this.claimsdistrict.PostalCode.toString() : '',
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
                validation: [ noZeroRequiredValidator ],
                validators: { 'required': true },
                value: this.claimsdistrict && this.claimsdistrict.SchoolDistrictId || null,
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
                value: this.claimsdistrict && this.claimsdistrict.hasOwnProperty('State') && this.claimsdistrict.State != null ? this.claimsdistrict.State.toString() : '',
            }),
        };

        this.View = {
            Address: new DynamicLabel({
                label: 'Address',
                value: this.claimsdistrict && this.claimsdistrict.hasOwnProperty('Address') && this.claimsdistrict.Address != null ? this.claimsdistrict.Address.toString() : '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: null,
                    scale: null,
                }),
            }),
            City: new DynamicLabel({
                label: 'City',
                value: this.claimsdistrict && this.claimsdistrict.hasOwnProperty('City') && this.claimsdistrict.City != null ? this.claimsdistrict.City.toString() : '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: null,
                    scale: null,
                }),
            }),
            DistrictOrganizationName: new DynamicLabel({
                label: 'District Organization Name',
                value: this.claimsdistrict && this.claimsdistrict.hasOwnProperty('DistrictOrganizationName') && this.claimsdistrict.DistrictOrganizationName != null ? this.claimsdistrict.DistrictOrganizationName.toString() : '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: null,
                    scale: null,
                }),
            }),
            EmployerId: new DynamicLabel({
                label: 'Employer',
                value: this.claimsdistrict && this.claimsdistrict.hasOwnProperty('EmployerId') && this.claimsdistrict.EmployerId != null ? this.claimsdistrict.EmployerId.toString() : '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: null,
                    scale: null,
                }),
            }),
            HealthCareClaimsId: new DynamicLabel({
                label: 'Health Care Claims',
                value: getMetaItemValue(this.healthCareClaims as unknown as IMetaItem[], this.claimsdistrict && this.claimsdistrict.hasOwnProperty('HealthCareClaimsId') ? this.claimsdistrict.HealthCareClaimsId : null) ?? '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
            }),
            IdentificationCode: new DynamicLabel({
                label: 'Identification Code',
                value: this.claimsdistrict && this.claimsdistrict.hasOwnProperty('IdentificationCode') && this.claimsdistrict.IdentificationCode != null ? this.claimsdistrict.IdentificationCode.toString() : '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: null,
                    scale: null,
                }),
            }),
            Index: new DynamicLabel({
                label: 'Index',
                value: this.claimsdistrict && this.claimsdistrict.Index || null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Numeric,
                    inputType: NumericInputTypes.Integer,
                    scale: null,
                }),
            }),
            PostalCode: new DynamicLabel({
                label: 'Postal Code',
                value: this.claimsdistrict && this.claimsdistrict.hasOwnProperty('PostalCode') && this.claimsdistrict.PostalCode != null ? this.claimsdistrict.PostalCode.toString() : '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: null,
                    scale: null,
                }),
            }),
            SchoolDistrictId: new DynamicLabel({
                label: 'School District',
                value: getMetaItemValue(this.schoolDistricts as unknown as IMetaItem[], this.claimsdistrict && this.claimsdistrict.hasOwnProperty('SchoolDistrictId') ? this.claimsdistrict.SchoolDistrictId : null) ?? '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
            }),
            State: new DynamicLabel({
                label: 'State',
                value: this.claimsdistrict && this.claimsdistrict.hasOwnProperty('State') && this.claimsdistrict.State != null ? this.claimsdistrict.State.toString() : '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: null,
                    scale: null,
                }),
            }),
        };

    }
}
