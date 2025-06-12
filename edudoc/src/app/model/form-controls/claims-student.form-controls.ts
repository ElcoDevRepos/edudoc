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
import { IClaimsStudent } from '../interfaces/claims-student';
import { IClaimsDistrict } from '../interfaces/claims-district';
import { IStudent } from '../interfaces/student';

export interface IClaimsStudentDynamicControlsParameters {
    formGroup?: string;
    claimsDistricts?: IClaimsDistrict[];
    students?: IStudent[];
}

export class ClaimsStudentDynamicControls {

    formGroup: string;
    claimsDistricts?: IClaimsDistrict[];
    students?: IStudent[];

    Form: IExpandableObject;
    View: IExpandableObject;

    constructor(private claimsstudent?: IClaimsStudent, additionalParameters?: IClaimsStudentDynamicControlsParameters) {
        this.formGroup = additionalParameters && additionalParameters.formGroup || 'ClaimsStudent';
        this.claimsDistricts = additionalParameters && additionalParameters.claimsDistricts || undefined;
        this.students = additionalParameters && additionalParameters.students || undefined;

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
                value: this.claimsstudent && this.claimsstudent.hasOwnProperty('Address') && this.claimsstudent.Address != null ? this.claimsstudent.Address.toString() : '',
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
                value: this.claimsstudent && this.claimsstudent.hasOwnProperty('City') && this.claimsstudent.City != null ? this.claimsstudent.City.toString() : '',
            }),
            ClaimsDistrictId: new DynamicField({
                formGroup: this.formGroup,
                label: 'Claims District',
                name: 'ClaimsDistrictId',
                options: this.claimsDistricts,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
                validation: [ noZeroRequiredValidator ],
                validators: { 'required': true },
                value: this.claimsstudent && this.claimsstudent.ClaimsDistrictId || null,
            }),
            FirstName: new DynamicField({
                formGroup: this.formGroup,
                label: 'First Name',
                name: 'FirstName',
                options: null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: null,
                    scale: null,
                }),
                validation: [ Validators.required, Validators.maxLength(35) ],
                validators: { 'required': true, 'maxlength': 35 },
                value: this.claimsstudent && this.claimsstudent.hasOwnProperty('FirstName') && this.claimsstudent.FirstName != null ? this.claimsstudent.FirstName.toString() : '',
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
                validation: [ Validators.required, Validators.maxLength(12) ],
                validators: { 'required': true, 'maxlength': 12 },
                value: this.claimsstudent && this.claimsstudent.hasOwnProperty('IdentificationCode') && this.claimsstudent.IdentificationCode != null ? this.claimsstudent.IdentificationCode.toString() : '',
            }),
            InsuredDateTimePeriod: new DynamicField({
                formGroup: this.formGroup,
                label: 'Insured Date Time Period',
                name: 'InsuredDateTimePeriod',
                options: null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: null,
                    scale: null,
                }),
                validation: [ Validators.required, Validators.maxLength(35) ],
                validators: { 'required': true, 'maxlength': 35 },
                value: this.claimsstudent && this.claimsstudent.hasOwnProperty('InsuredDateTimePeriod') && this.claimsstudent.InsuredDateTimePeriod != null ? this.claimsstudent.InsuredDateTimePeriod.toString() : '',
            }),
            LastName: new DynamicField({
                formGroup: this.formGroup,
                label: 'Last Name',
                name: 'LastName',
                options: null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: null,
                    scale: null,
                }),
                validation: [ Validators.required, Validators.maxLength(60) ],
                validators: { 'required': true, 'maxlength': 60 },
                value: this.claimsstudent && this.claimsstudent.hasOwnProperty('LastName') && this.claimsstudent.LastName != null ? this.claimsstudent.LastName.toString() : '',
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
                value: this.claimsstudent && this.claimsstudent.hasOwnProperty('PostalCode') && this.claimsstudent.PostalCode != null ? this.claimsstudent.PostalCode.toString() : '',
            }),
            ResponseFollowUpAction: new DynamicField({
                formGroup: this.formGroup,
                label: 'Response Follow Up Action',
                name: 'ResponseFollowUpAction',
                options: null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: null,
                    scale: null,
                }),
                validation: [ Validators.maxLength(2) ],
                validators: { 'maxlength': 2 },
                value: this.claimsstudent && this.claimsstudent.hasOwnProperty('ResponseFollowUpAction') && this.claimsstudent.ResponseFollowUpAction != null ? this.claimsstudent.ResponseFollowUpAction.toString() : '',
            }),
            ResponseRejectReason: new DynamicField({
                formGroup: this.formGroup,
                label: 'Response Reject Reason',
                name: 'ResponseRejectReason',
                options: null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Numeric,
                    inputType: NumericInputTypes.Integer,
                    scale: null,
                }),
                validation: [  ],
                validators: {  },
                value: this.claimsstudent && this.claimsstudent.ResponseRejectReason || null,
            }),
            ResponseValid: new DynamicField({
                formGroup: this.formGroup,
                label: 'Response Val',
                name: 'ResponseValid',
                options: null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Checkbox,
                    inputType: null,
                    scale: null,
                }),
                validation: [  ],
                validators: {  },
                value: this.claimsstudent && this.claimsstudent.hasOwnProperty('ResponseValid') && this.claimsstudent.ResponseValid != null ? this.claimsstudent.ResponseValid : false,
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
                value: this.claimsstudent && this.claimsstudent.hasOwnProperty('State') && this.claimsstudent.State != null ? this.claimsstudent.State.toString() : '',
            }),
            StudentId: new DynamicField({
                formGroup: this.formGroup,
                label: 'Student',
                name: 'StudentId',
                options: this.students,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
                validation: [ noZeroRequiredValidator ],
                validators: { 'required': true },
                value: this.claimsstudent && this.claimsstudent.StudentId || null,
            }),
        };

        this.View = {
            Address: new DynamicLabel({
                label: 'Address',
                value: this.claimsstudent && this.claimsstudent.hasOwnProperty('Address') && this.claimsstudent.Address != null ? this.claimsstudent.Address.toString() : '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: null,
                    scale: null,
                }),
            }),
            City: new DynamicLabel({
                label: 'City',
                value: this.claimsstudent && this.claimsstudent.hasOwnProperty('City') && this.claimsstudent.City != null ? this.claimsstudent.City.toString() : '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: null,
                    scale: null,
                }),
            }),
            ClaimsDistrictId: new DynamicLabel({
                label: 'Claims District',
                value: getMetaItemValue(this.claimsDistricts as unknown as IMetaItem[], this.claimsstudent && this.claimsstudent.hasOwnProperty('ClaimsDistrictId') ? this.claimsstudent.ClaimsDistrictId : null) ?? '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
            }),
            FirstName: new DynamicLabel({
                label: 'First Name',
                value: this.claimsstudent && this.claimsstudent.hasOwnProperty('FirstName') && this.claimsstudent.FirstName != null ? this.claimsstudent.FirstName.toString() : '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: null,
                    scale: null,
                }),
            }),
            IdentificationCode: new DynamicLabel({
                label: 'Identification Code',
                value: this.claimsstudent && this.claimsstudent.hasOwnProperty('IdentificationCode') && this.claimsstudent.IdentificationCode != null ? this.claimsstudent.IdentificationCode.toString() : '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: null,
                    scale: null,
                }),
            }),
            InsuredDateTimePeriod: new DynamicLabel({
                label: 'Insured Date Time Period',
                value: this.claimsstudent && this.claimsstudent.hasOwnProperty('InsuredDateTimePeriod') && this.claimsstudent.InsuredDateTimePeriod != null ? this.claimsstudent.InsuredDateTimePeriod.toString() : '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: null,
                    scale: null,
                }),
            }),
            LastName: new DynamicLabel({
                label: 'Last Name',
                value: this.claimsstudent && this.claimsstudent.hasOwnProperty('LastName') && this.claimsstudent.LastName != null ? this.claimsstudent.LastName.toString() : '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: null,
                    scale: null,
                }),
            }),
            PostalCode: new DynamicLabel({
                label: 'Postal Code',
                value: this.claimsstudent && this.claimsstudent.hasOwnProperty('PostalCode') && this.claimsstudent.PostalCode != null ? this.claimsstudent.PostalCode.toString() : '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: null,
                    scale: null,
                }),
            }),
            ResponseFollowUpAction: new DynamicLabel({
                label: 'Response Follow Up Action',
                value: this.claimsstudent && this.claimsstudent.hasOwnProperty('ResponseFollowUpAction') && this.claimsstudent.ResponseFollowUpAction != null ? this.claimsstudent.ResponseFollowUpAction.toString() : '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: null,
                    scale: null,
                }),
            }),
            ResponseRejectReason: new DynamicLabel({
                label: 'Response Reject Reason',
                value: this.claimsstudent && this.claimsstudent.ResponseRejectReason || null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Numeric,
                    inputType: NumericInputTypes.Integer,
                    scale: null,
                }),
            }),
            ResponseValid: new DynamicLabel({
                label: 'Response Val',
                value: this.claimsstudent && this.claimsstudent.hasOwnProperty('ResponseValid') && this.claimsstudent.ResponseValid != null ? this.claimsstudent.ResponseValid : false,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Checkbox,
                    inputType: null,
                    scale: null,
                }),
            }),
            State: new DynamicLabel({
                label: 'State',
                value: this.claimsstudent && this.claimsstudent.hasOwnProperty('State') && this.claimsstudent.State != null ? this.claimsstudent.State.toString() : '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: null,
                    scale: null,
                }),
            }),
            StudentId: new DynamicLabel({
                label: 'Student',
                value: getMetaItemValue(this.students as unknown as IMetaItem[], this.claimsstudent && this.claimsstudent.hasOwnProperty('StudentId') ? this.claimsstudent.StudentId : null) ?? '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
            }),
        };

    }
}
