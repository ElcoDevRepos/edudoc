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
import { IRosterValidationStudent } from '../interfaces/roster-validation-student';
import { IRosterValidationDistrict } from '../interfaces/roster-validation-district';
import { IStudent } from '../interfaces/student';

export interface IRosterValidationStudentDynamicControlsParameters {
    formGroup?: string;
    rosterValidationDistricts?: IRosterValidationDistrict[];
    students?: IStudent[];
}

export class RosterValidationStudentDynamicControls {

    formGroup: string;
    rosterValidationDistricts?: IRosterValidationDistrict[];
    students?: IStudent[];

    Form: IExpandableObject;
    View: IExpandableObject;

    constructor(private rostervalidationstudent?: IRosterValidationStudent, additionalParameters?: IRosterValidationStudentDynamicControlsParameters) {
        this.formGroup = additionalParameters && additionalParameters.formGroup || 'RosterValidationStudent';
        this.rosterValidationDistricts = additionalParameters && additionalParameters.rosterValidationDistricts || undefined;
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
                value: this.rostervalidationstudent && this.rostervalidationstudent.hasOwnProperty('Address') && this.rostervalidationstudent.Address != null ? this.rostervalidationstudent.Address.toString() : '',
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
                value: this.rostervalidationstudent && this.rostervalidationstudent.hasOwnProperty('City') && this.rostervalidationstudent.City != null ? this.rostervalidationstudent.City.toString() : '',
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
                value: this.rostervalidationstudent && this.rostervalidationstudent.hasOwnProperty('FirstName') && this.rostervalidationstudent.FirstName != null ? this.rostervalidationstudent.FirstName.toString() : '',
            }),
            FollowUpActionCode: new DynamicField({
                formGroup: this.formGroup,
                label: 'Follow Up Action Code',
                name: 'FollowUpActionCode',
                options: null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: null,
                    scale: null,
                }),
                validation: [ Validators.maxLength(3) ],
                validators: { 'maxlength': 3 },
                value: this.rostervalidationstudent && this.rostervalidationstudent.hasOwnProperty('FollowUpActionCode') && this.rostervalidationstudent.FollowUpActionCode != null ? this.rostervalidationstudent.FollowUpActionCode.toString() : '',
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
                validation: [ Validators.maxLength(12) ],
                validators: { 'maxlength': 12 },
                value: this.rostervalidationstudent && this.rostervalidationstudent.hasOwnProperty('IdentificationCode') && this.rostervalidationstudent.IdentificationCode != null ? this.rostervalidationstudent.IdentificationCode.toString() : '',
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
                value: this.rostervalidationstudent && this.rostervalidationstudent.hasOwnProperty('InsuredDateTimePeriod') && this.rostervalidationstudent.InsuredDateTimePeriod != null ? this.rostervalidationstudent.InsuredDateTimePeriod.toString() : '',
            }),
            IsSuccessfullyProcessed: new DynamicField({
                formGroup: this.formGroup,
                label: 'Is Successfully Processed',
                name: 'IsSuccessfullyProcessed',
                options: null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Checkbox,
                    inputType: null,
                    scale: null,
                }),
                validation: [  ],
                validators: {  },
                value: this.rostervalidationstudent && this.rostervalidationstudent.hasOwnProperty('IsSuccessfullyProcessed') && this.rostervalidationstudent.IsSuccessfullyProcessed != null ? this.rostervalidationstudent.IsSuccessfullyProcessed : false,
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
                value: this.rostervalidationstudent && this.rostervalidationstudent.hasOwnProperty('LastName') && this.rostervalidationstudent.LastName != null ? this.rostervalidationstudent.LastName.toString() : '',
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
                value: this.rostervalidationstudent && this.rostervalidationstudent.hasOwnProperty('PostalCode') && this.rostervalidationstudent.PostalCode != null ? this.rostervalidationstudent.PostalCode.toString() : '',
            }),
            ReferenceId: new DynamicField({
                formGroup: this.formGroup,
                label: 'Reference',
                name: 'ReferenceId',
                options: null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: null,
                    scale: null,
                }),
                validation: [ Validators.required, Validators.maxLength(15) ],
                validators: { 'required': true, 'maxlength': 15 },
                value: this.rostervalidationstudent && this.rostervalidationstudent.hasOwnProperty('ReferenceId') && this.rostervalidationstudent.ReferenceId != null ? this.rostervalidationstudent.ReferenceId.toString() : '',
            }),
            RejectReasonCode: new DynamicField({
                formGroup: this.formGroup,
                label: 'Reject Reason Code',
                name: 'RejectReasonCode',
                options: null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: null,
                    scale: null,
                }),
                validation: [ Validators.maxLength(3) ],
                validators: { 'maxlength': 3 },
                value: this.rostervalidationstudent && this.rostervalidationstudent.hasOwnProperty('RejectReasonCode') && this.rostervalidationstudent.RejectReasonCode != null ? this.rostervalidationstudent.RejectReasonCode.toString() : '',
            }),
            RosterValidationDistrictId: new DynamicField({
                formGroup: this.formGroup,
                label: 'Roster Validation District',
                name: 'RosterValidationDistrictId',
                options: this.rosterValidationDistricts,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
                validation: [ noZeroRequiredValidator ],
                validators: { 'required': true },
                value: this.rostervalidationstudent && this.rostervalidationstudent.RosterValidationDistrictId || null,
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
                value: this.rostervalidationstudent && this.rostervalidationstudent.hasOwnProperty('State') && this.rostervalidationstudent.State != null ? this.rostervalidationstudent.State.toString() : '',
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
                value: this.rostervalidationstudent && this.rostervalidationstudent.StudentId || null,
            }),
        };

        this.View = {
            Address: new DynamicLabel({
                label: 'Address',
                value: this.rostervalidationstudent && this.rostervalidationstudent.hasOwnProperty('Address') && this.rostervalidationstudent.Address != null ? this.rostervalidationstudent.Address.toString() : '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: null,
                    scale: null,
                }),
            }),
            City: new DynamicLabel({
                label: 'City',
                value: this.rostervalidationstudent && this.rostervalidationstudent.hasOwnProperty('City') && this.rostervalidationstudent.City != null ? this.rostervalidationstudent.City.toString() : '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: null,
                    scale: null,
                }),
            }),
            FirstName: new DynamicLabel({
                label: 'First Name',
                value: this.rostervalidationstudent && this.rostervalidationstudent.hasOwnProperty('FirstName') && this.rostervalidationstudent.FirstName != null ? this.rostervalidationstudent.FirstName.toString() : '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: null,
                    scale: null,
                }),
            }),
            FollowUpActionCode: new DynamicLabel({
                label: 'Follow Up Action Code',
                value: this.rostervalidationstudent && this.rostervalidationstudent.hasOwnProperty('FollowUpActionCode') && this.rostervalidationstudent.FollowUpActionCode != null ? this.rostervalidationstudent.FollowUpActionCode.toString() : '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: null,
                    scale: null,
                }),
            }),
            IdentificationCode: new DynamicLabel({
                label: 'Identification Code',
                value: this.rostervalidationstudent && this.rostervalidationstudent.hasOwnProperty('IdentificationCode') && this.rostervalidationstudent.IdentificationCode != null ? this.rostervalidationstudent.IdentificationCode.toString() : '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: null,
                    scale: null,
                }),
            }),
            InsuredDateTimePeriod: new DynamicLabel({
                label: 'Insured Date Time Period',
                value: this.rostervalidationstudent && this.rostervalidationstudent.hasOwnProperty('InsuredDateTimePeriod') && this.rostervalidationstudent.InsuredDateTimePeriod != null ? this.rostervalidationstudent.InsuredDateTimePeriod.toString() : '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: null,
                    scale: null,
                }),
            }),
            IsSuccessfullyProcessed: new DynamicLabel({
                label: 'Is Successfully Processed',
                value: this.rostervalidationstudent && this.rostervalidationstudent.hasOwnProperty('IsSuccessfullyProcessed') && this.rostervalidationstudent.IsSuccessfullyProcessed != null ? this.rostervalidationstudent.IsSuccessfullyProcessed : false,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Checkbox,
                    inputType: null,
                    scale: null,
                }),
            }),
            LastName: new DynamicLabel({
                label: 'Last Name',
                value: this.rostervalidationstudent && this.rostervalidationstudent.hasOwnProperty('LastName') && this.rostervalidationstudent.LastName != null ? this.rostervalidationstudent.LastName.toString() : '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: null,
                    scale: null,
                }),
            }),
            PostalCode: new DynamicLabel({
                label: 'Postal Code',
                value: this.rostervalidationstudent && this.rostervalidationstudent.hasOwnProperty('PostalCode') && this.rostervalidationstudent.PostalCode != null ? this.rostervalidationstudent.PostalCode.toString() : '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: null,
                    scale: null,
                }),
            }),
            ReferenceId: new DynamicLabel({
                label: 'Reference',
                value: this.rostervalidationstudent && this.rostervalidationstudent.hasOwnProperty('ReferenceId') && this.rostervalidationstudent.ReferenceId != null ? this.rostervalidationstudent.ReferenceId.toString() : '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: null,
                    scale: null,
                }),
            }),
            RejectReasonCode: new DynamicLabel({
                label: 'Reject Reason Code',
                value: this.rostervalidationstudent && this.rostervalidationstudent.hasOwnProperty('RejectReasonCode') && this.rostervalidationstudent.RejectReasonCode != null ? this.rostervalidationstudent.RejectReasonCode.toString() : '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: null,
                    scale: null,
                }),
            }),
            RosterValidationDistrictId: new DynamicLabel({
                label: 'Roster Validation District',
                value: getMetaItemValue(this.rosterValidationDistricts as unknown as IMetaItem[], this.rostervalidationstudent && this.rostervalidationstudent.hasOwnProperty('RosterValidationDistrictId') ? this.rostervalidationstudent.RosterValidationDistrictId : null) ?? '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
            }),
            State: new DynamicLabel({
                label: 'State',
                value: this.rostervalidationstudent && this.rostervalidationstudent.hasOwnProperty('State') && this.rostervalidationstudent.State != null ? this.rostervalidationstudent.State.toString() : '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: null,
                    scale: null,
                }),
            }),
            StudentId: new DynamicLabel({
                label: 'Student',
                value: getMetaItemValue(this.students as unknown as IMetaItem[], this.rostervalidationstudent && this.rostervalidationstudent.hasOwnProperty('StudentId') ? this.rostervalidationstudent.StudentId : null) ?? '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
            }),
        };

    }
}
