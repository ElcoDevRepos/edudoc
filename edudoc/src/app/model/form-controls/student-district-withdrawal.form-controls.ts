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
import { IStudentDistrictWithdrawal } from '../interfaces/student-district-withdrawal';
import { IUser } from '../interfaces/user';
import { ISchoolDistrict } from '../interfaces/school-district';
import { IStudent } from '../interfaces/student';

export interface IStudentDistrictWithdrawalDynamicControlsParameters {
    formGroup?: string;
    students?: IStudent[];
    districts?: ISchoolDistrict[];
    createdBies?: IUser[];
    modifiedBies?: IUser[];
}

export class StudentDistrictWithdrawalDynamicControls {

    formGroup: string;
    students?: IStudent[];
    districts?: ISchoolDistrict[];
    createdBies?: IUser[];
    modifiedBies?: IUser[];

    Form: IExpandableObject;
    View: IExpandableObject;

    constructor(private studentdistrictwithdrawal?: IStudentDistrictWithdrawal, additionalParameters?: IStudentDistrictWithdrawalDynamicControlsParameters) {
        this.formGroup = additionalParameters && additionalParameters.formGroup || 'StudentDistrictWithdrawal';
        this.students = additionalParameters && additionalParameters.students || undefined;
        this.districts = additionalParameters && additionalParameters.districts || undefined;
        this.createdBies = additionalParameters && additionalParameters.createdBies || undefined;
        this.modifiedBies = additionalParameters && additionalParameters.modifiedBies || undefined;

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
                value: this.studentdistrictwithdrawal && this.studentdistrictwithdrawal.hasOwnProperty('Archived') && this.studentdistrictwithdrawal.Archived != null ? this.studentdistrictwithdrawal.Archived : false,
            }),
            CreatedById: new DynamicField({
                formGroup: this.formGroup,
                label: 'Created By',
                name: 'CreatedById',
                options: this.createdBies,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
                validation: [  ],
                validators: {  },
                value: this.studentdistrictwithdrawal && this.studentdistrictwithdrawal.CreatedById || 1,
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
                value: this.studentdistrictwithdrawal && this.studentdistrictwithdrawal.DateCreated || null,
            }),
            DateModified: new DynamicField({
                formGroup: this.formGroup,
                label: 'Date Modified',
                name: 'DateModified',
                options: null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: InputTypes.Datepicker,
                    scale: null,
                }),
                validation: [  ],
                validators: {  },
                value: this.studentdistrictwithdrawal && this.studentdistrictwithdrawal.DateModified || null,
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
                validation: [ noZeroRequiredValidator ],
                validators: { 'required': true },
                value: this.studentdistrictwithdrawal && this.studentdistrictwithdrawal.DistrictId || null,
            }),
            EnrollmentDate: new DynamicField({
                formGroup: this.formGroup,
                label: 'Enrollment Date',
                name: 'EnrollmentDate',
                options: null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: InputTypes.Datepicker,
                    scale: null,
                }),
                validation: [  ],
                validators: {  },
                value: this.studentdistrictwithdrawal && this.studentdistrictwithdrawal.EnrollmentDate || null,
            }),
            ModifiedById: new DynamicField({
                formGroup: this.formGroup,
                label: 'Modified By',
                name: 'ModifiedById',
                options: this.modifiedBies,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
                validation: [  ],
                validators: {  },
                value: this.studentdistrictwithdrawal && this.studentdistrictwithdrawal.ModifiedById || null,
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
                value: this.studentdistrictwithdrawal && this.studentdistrictwithdrawal.StudentId || null,
            }),
            WithdrawalDate: new DynamicField({
                formGroup: this.formGroup,
                label: 'Withdrawal Date',
                name: 'WithdrawalDate',
                options: null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: InputTypes.Datepicker,
                    scale: null,
                }),
                validation: [  ],
                validators: {  },
                value: this.studentdistrictwithdrawal && this.studentdistrictwithdrawal.WithdrawalDate || null,
            }),
        };

        this.View = {
            Archived: new DynamicLabel({
                label: 'Archived',
                value: this.studentdistrictwithdrawal && this.studentdistrictwithdrawal.hasOwnProperty('Archived') && this.studentdistrictwithdrawal.Archived != null ? this.studentdistrictwithdrawal.Archived : false,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Checkbox,
                    inputType: null,
                    scale: null,
                }),
            }),
            CreatedById: new DynamicLabel({
                label: 'Created By',
                value: getMetaItemValue(this.createdBies as unknown as IMetaItem[], this.studentdistrictwithdrawal && this.studentdistrictwithdrawal.hasOwnProperty('CreatedById') ? this.studentdistrictwithdrawal.CreatedById : null) ?? '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
            }),
            DateCreated: new DynamicLabel({
                label: 'Date Created',
                value: this.studentdistrictwithdrawal && this.studentdistrictwithdrawal.DateCreated || null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: InputTypes.Datepicker,
                    scale: null,
                }),
            }),
            DateModified: new DynamicLabel({
                label: 'Date Modified',
                value: this.studentdistrictwithdrawal && this.studentdistrictwithdrawal.DateModified || null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: InputTypes.Datepicker,
                    scale: null,
                }),
            }),
            DistrictId: new DynamicLabel({
                label: 'District',
                value: getMetaItemValue(this.districts as unknown as IMetaItem[], this.studentdistrictwithdrawal && this.studentdistrictwithdrawal.hasOwnProperty('DistrictId') ? this.studentdistrictwithdrawal.DistrictId : null) ?? '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
            }),
            EnrollmentDate: new DynamicLabel({
                label: 'Enrollment Date',
                value: this.studentdistrictwithdrawal && this.studentdistrictwithdrawal.EnrollmentDate || null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: InputTypes.Datepicker,
                    scale: null,
                }),
            }),
            ModifiedById: new DynamicLabel({
                label: 'Modified By',
                value: getMetaItemValue(this.modifiedBies as unknown as IMetaItem[], this.studentdistrictwithdrawal && this.studentdistrictwithdrawal.hasOwnProperty('ModifiedById') ? this.studentdistrictwithdrawal.ModifiedById : null) ?? '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
            }),
            StudentId: new DynamicLabel({
                label: 'Student',
                value: getMetaItemValue(this.students as unknown as IMetaItem[], this.studentdistrictwithdrawal && this.studentdistrictwithdrawal.hasOwnProperty('StudentId') ? this.studentdistrictwithdrawal.StudentId : null) ?? '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
            }),
            WithdrawalDate: new DynamicLabel({
                label: 'Withdrawal Date',
                value: this.studentdistrictwithdrawal && this.studentdistrictwithdrawal.WithdrawalDate || null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: InputTypes.Datepicker,
                    scale: null,
                }),
            }),
        };

    }
}
