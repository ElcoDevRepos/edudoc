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
import { IRosterValidationDistrict } from '../interfaces/roster-validation-district';
import { IRosterValidation } from '../interfaces/roster-validation';
import { ISchoolDistrict } from '../interfaces/school-district';

export interface IRosterValidationDistrictDynamicControlsParameters {
    formGroup?: string;
    rosterValidations?: IRosterValidation[];
    schoolDistricts?: ISchoolDistrict[];
}

export class RosterValidationDistrictDynamicControls {

    formGroup: string;
    rosterValidations?: IRosterValidation[];
    schoolDistricts?: ISchoolDistrict[];

    Form: IExpandableObject;
    View: IExpandableObject;

    constructor(private rostervalidationdistrict?: IRosterValidationDistrict, additionalParameters?: IRosterValidationDistrictDynamicControlsParameters) {
        this.formGroup = additionalParameters && additionalParameters.formGroup || 'RosterValidationDistrict';
        this.rosterValidations = additionalParameters && additionalParameters.rosterValidations || undefined;
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
                value: this.rostervalidationdistrict && this.rostervalidationdistrict.hasOwnProperty('Address') && this.rostervalidationdistrict.Address != null ? this.rostervalidationdistrict.Address.toString() : '',
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
                value: this.rostervalidationdistrict && this.rostervalidationdistrict.hasOwnProperty('City') && this.rostervalidationdistrict.City != null ? this.rostervalidationdistrict.City.toString() : '',
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
                value: this.rostervalidationdistrict && this.rostervalidationdistrict.hasOwnProperty('DistrictOrganizationName') && this.rostervalidationdistrict.DistrictOrganizationName != null ? this.rostervalidationdistrict.DistrictOrganizationName.toString() : '',
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
                value: this.rostervalidationdistrict && this.rostervalidationdistrict.hasOwnProperty('EmployerId') && this.rostervalidationdistrict.EmployerId != null ? this.rostervalidationdistrict.EmployerId.toString() : '',
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
                value: this.rostervalidationdistrict && this.rostervalidationdistrict.hasOwnProperty('IdentificationCode') && this.rostervalidationdistrict.IdentificationCode != null ? this.rostervalidationdistrict.IdentificationCode.toString() : '',
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
                value: this.rostervalidationdistrict && this.rostervalidationdistrict.Index || null,
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
                value: this.rostervalidationdistrict && this.rostervalidationdistrict.hasOwnProperty('PostalCode') && this.rostervalidationdistrict.PostalCode != null ? this.rostervalidationdistrict.PostalCode.toString() : '',
            }),
            RosterValidationId: new DynamicField({
                formGroup: this.formGroup,
                label: 'Roster Validation',
                name: 'RosterValidationId',
                options: this.rosterValidations,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
                validation: [ noZeroRequiredValidator ],
                validators: { 'required': true },
                value: this.rostervalidationdistrict && this.rostervalidationdistrict.RosterValidationId || null,
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
                value: this.rostervalidationdistrict && this.rostervalidationdistrict.SchoolDistrictId || null,
            }),
            SegmentsCount: new DynamicField({
                formGroup: this.formGroup,
                label: 'Segments Count',
                name: 'SegmentsCount',
                options: null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Numeric,
                    inputType: NumericInputTypes.Integer,
                    scale: null,
                }),
                validation: [  ],
                validators: {  },
                value: this.rostervalidationdistrict && this.rostervalidationdistrict.SegmentsCount || null,
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
                value: this.rostervalidationdistrict && this.rostervalidationdistrict.hasOwnProperty('State') && this.rostervalidationdistrict.State != null ? this.rostervalidationdistrict.State.toString() : '',
            }),
        };

        this.View = {
            Address: new DynamicLabel({
                label: 'Address',
                value: this.rostervalidationdistrict && this.rostervalidationdistrict.hasOwnProperty('Address') && this.rostervalidationdistrict.Address != null ? this.rostervalidationdistrict.Address.toString() : '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: null,
                    scale: null,
                }),
            }),
            City: new DynamicLabel({
                label: 'City',
                value: this.rostervalidationdistrict && this.rostervalidationdistrict.hasOwnProperty('City') && this.rostervalidationdistrict.City != null ? this.rostervalidationdistrict.City.toString() : '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: null,
                    scale: null,
                }),
            }),
            DistrictOrganizationName: new DynamicLabel({
                label: 'District Organization Name',
                value: this.rostervalidationdistrict && this.rostervalidationdistrict.hasOwnProperty('DistrictOrganizationName') && this.rostervalidationdistrict.DistrictOrganizationName != null ? this.rostervalidationdistrict.DistrictOrganizationName.toString() : '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: null,
                    scale: null,
                }),
            }),
            EmployerId: new DynamicLabel({
                label: 'Employer',
                value: this.rostervalidationdistrict && this.rostervalidationdistrict.hasOwnProperty('EmployerId') && this.rostervalidationdistrict.EmployerId != null ? this.rostervalidationdistrict.EmployerId.toString() : '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: null,
                    scale: null,
                }),
            }),
            IdentificationCode: new DynamicLabel({
                label: 'Identification Code',
                value: this.rostervalidationdistrict && this.rostervalidationdistrict.hasOwnProperty('IdentificationCode') && this.rostervalidationdistrict.IdentificationCode != null ? this.rostervalidationdistrict.IdentificationCode.toString() : '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: null,
                    scale: null,
                }),
            }),
            Index: new DynamicLabel({
                label: 'Index',
                value: this.rostervalidationdistrict && this.rostervalidationdistrict.Index || null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Numeric,
                    inputType: NumericInputTypes.Integer,
                    scale: null,
                }),
            }),
            PostalCode: new DynamicLabel({
                label: 'Postal Code',
                value: this.rostervalidationdistrict && this.rostervalidationdistrict.hasOwnProperty('PostalCode') && this.rostervalidationdistrict.PostalCode != null ? this.rostervalidationdistrict.PostalCode.toString() : '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: null,
                    scale: null,
                }),
            }),
            RosterValidationId: new DynamicLabel({
                label: 'Roster Validation',
                value: getMetaItemValue(this.rosterValidations as unknown as IMetaItem[], this.rostervalidationdistrict && this.rostervalidationdistrict.hasOwnProperty('RosterValidationId') ? this.rostervalidationdistrict.RosterValidationId : null) ?? '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
            }),
            SchoolDistrictId: new DynamicLabel({
                label: 'School District',
                value: getMetaItemValue(this.schoolDistricts as unknown as IMetaItem[], this.rostervalidationdistrict && this.rostervalidationdistrict.hasOwnProperty('SchoolDistrictId') ? this.rostervalidationdistrict.SchoolDistrictId : null) ?? '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
            }),
            SegmentsCount: new DynamicLabel({
                label: 'Segments Count',
                value: this.rostervalidationdistrict && this.rostervalidationdistrict.SegmentsCount || null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Numeric,
                    inputType: NumericInputTypes.Integer,
                    scale: null,
                }),
            }),
            State: new DynamicLabel({
                label: 'State',
                value: this.rostervalidationdistrict && this.rostervalidationdistrict.hasOwnProperty('State') && this.rostervalidationdistrict.State != null ? this.rostervalidationdistrict.State.toString() : '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: null,
                    scale: null,
                }),
            }),
        };

    }
}
