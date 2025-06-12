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
import { IStudent } from '../interfaces/student';
import { IAddress } from '../interfaces/address';
import { IUser } from '../interfaces/user';
import { ISchoolDistrict } from '../interfaces/school-district';
import { IEsc } from '../interfaces/esc';
import { ISchool } from '../interfaces/school';

export interface IStudentDynamicControlsParameters {
    formGroup?: string;
    addresses?: IAddress[];
    schools?: ISchool[];
    districts?: ISchoolDistrict[];
    escs?: IEsc[];
    createdBies?: IUser[];
    modifiedBies?: IUser[];
}

export class StudentDynamicControls {

    formGroup: string;
    addresses?: IAddress[];
    schools?: ISchool[];
    districts?: ISchoolDistrict[];
    escs?: IEsc[];
    createdBies?: IUser[];
    modifiedBies?: IUser[];

    Form: IExpandableObject;
    View: IExpandableObject;

    constructor(private student?: IStudent, additionalParameters?: IStudentDynamicControlsParameters) {
        this.formGroup = additionalParameters && additionalParameters.formGroup || 'Student';
        this.addresses = additionalParameters && additionalParameters.addresses || undefined;
        this.schools = additionalParameters && additionalParameters.schools || undefined;
        this.districts = additionalParameters && additionalParameters.districts || undefined;
        this.escs = additionalParameters && additionalParameters.escs || undefined;
        this.createdBies = additionalParameters && additionalParameters.createdBies || undefined;
        this.modifiedBies = additionalParameters && additionalParameters.modifiedBies || undefined;

        this.Form = {
            AddressId: new DynamicField({
                formGroup: this.formGroup,
                label: 'Address',
                name: 'AddressId',
                options: this.addresses,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
                validation: [  ],
                validators: {  },
                value: this.student && this.student.AddressId || null,
            }),
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
                value: this.student && this.student.hasOwnProperty('Archived') && this.student.Archived != null ? this.student.Archived : false,
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
                value: this.student && this.student.CreatedById || 1,
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
                value: this.student && this.student.DateCreated || null,
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
                value: this.student && this.student.DateModified || null,
            }),
            DateOfBirth: new DynamicField({
                formGroup: this.formGroup,
                label: 'Date Of Birth',
                name: 'DateOfBirth',
                options: null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: InputTypes.Datepicker,
                    scale: null,
                }),
                validation: [ Validators.required ],
                validators: { 'required': true },
                value: this.student && this.student.DateOfBirth || null,
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
                value: this.student && this.student.DistrictId || null,
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
                value: this.student && this.student.EnrollmentDate || null,
            }),
            EscId: new DynamicField({
                formGroup: this.formGroup,
                label: 'Esc',
                name: 'EscId',
                options: this.escs,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
                validation: [  ],
                validators: {  },
                value: this.student && this.student.EscId || null,
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
                validation: [ Validators.required, Validators.maxLength(50) ],
                validators: { 'required': true, 'maxlength': 50 },
                value: this.student && this.student.hasOwnProperty('FirstName') && this.student.FirstName != null ? this.student.FirstName.toString() : '',
            }),
            Grade: new DynamicField({
                formGroup: this.formGroup,
                label: 'Grade',
                name: 'Grade',
                options: null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: null,
                    scale: null,
                }),
                validation: [ Validators.required, Validators.maxLength(2) ],
                validators: { 'required': true, 'maxlength': 2 },
                value: this.student && this.student.hasOwnProperty('Grade') && this.student.Grade != null ? this.student.Grade.toString() : '',
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
                validation: [ Validators.required, Validators.maxLength(50) ],
                validators: { 'required': true, 'maxlength': 50 },
                value: this.student && this.student.hasOwnProperty('LastName') && this.student.LastName != null ? this.student.LastName.toString() : '',
            }),
            MedicaidNo: new DynamicField({
                formGroup: this.formGroup,
                label: 'Medicaid No',
                name: 'MedicaidNo',
                options: null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: null,
                    scale: null,
                }),
                validation: [ Validators.maxLength(12) ],
                validators: { 'maxlength': 12 },
                value: this.student && this.student.hasOwnProperty('MedicaidNo') && this.student.MedicaidNo != null ? this.student.MedicaidNo.toString() : '',
            }),
            MiddleName: new DynamicField({
                formGroup: this.formGroup,
                label: 'Middle Name',
                name: 'MiddleName',
                options: null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: null,
                    scale: null,
                }),
                validation: [ Validators.maxLength(50) ],
                validators: { 'maxlength': 50 },
                value: this.student && this.student.hasOwnProperty('MiddleName') && this.student.MiddleName != null ? this.student.MiddleName.toString() : '',
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
                value: this.student && this.student.ModifiedById || null,
            }),
            Notes: new DynamicField({
                formGroup: this.formGroup,
                label: 'Notes',
                name: 'Notes',
                options: null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: null,
                    scale: null,
                }),
                validation: [ Validators.maxLength(250) ],
                validators: { 'maxlength': 250 },
                value: this.student && this.student.hasOwnProperty('Notes') && this.student.Notes != null ? this.student.Notes.toString() : '',
            }),
            SchoolId: new DynamicField({
                formGroup: this.formGroup,
                label: 'School',
                name: 'SchoolId',
                options: this.schools,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
                validation: [ noZeroRequiredValidator ],
                validators: { 'required': true },
                value: this.student && this.student.SchoolId || null,
            }),
            StudentCode: new DynamicField({
                formGroup: this.formGroup,
                label: 'Student Code',
                name: 'StudentCode',
                options: null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: null,
                    scale: null,
                }),
                validation: [ Validators.maxLength(12) ],
                validators: { 'maxlength': 12 },
                value: this.student && this.student.hasOwnProperty('StudentCode') && this.student.StudentCode != null ? this.student.StudentCode.toString() : '',
            }),
        };

        this.View = {
            AddressId: new DynamicLabel({
                label: 'Address',
                value: getMetaItemValue(this.addresses as unknown as IMetaItem[], this.student && this.student.hasOwnProperty('AddressId') ? this.student.AddressId : null) ?? '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
            }),
            Archived: new DynamicLabel({
                label: 'Archived',
                value: this.student && this.student.hasOwnProperty('Archived') && this.student.Archived != null ? this.student.Archived : false,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Checkbox,
                    inputType: null,
                    scale: null,
                }),
            }),
            CreatedById: new DynamicLabel({
                label: 'Created By',
                value: getMetaItemValue(this.createdBies as unknown as IMetaItem[], this.student && this.student.hasOwnProperty('CreatedById') ? this.student.CreatedById : null) ?? '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
            }),
            DateCreated: new DynamicLabel({
                label: 'Date Created',
                value: this.student && this.student.DateCreated || null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: InputTypes.Datepicker,
                    scale: null,
                }),
            }),
            DateModified: new DynamicLabel({
                label: 'Date Modified',
                value: this.student && this.student.DateModified || null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: InputTypes.Datepicker,
                    scale: null,
                }),
            }),
            DateOfBirth: new DynamicLabel({
                label: 'Date Of Birth',
                value: this.student && this.student.DateOfBirth || null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: InputTypes.Datepicker,
                    scale: null,
                }),
            }),
            DistrictId: new DynamicLabel({
                label: 'District',
                value: getMetaItemValue(this.districts as unknown as IMetaItem[], this.student && this.student.hasOwnProperty('DistrictId') ? this.student.DistrictId : null) ?? '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
            }),
            EnrollmentDate: new DynamicLabel({
                label: 'Enrollment Date',
                value: this.student && this.student.EnrollmentDate || null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: InputTypes.Datepicker,
                    scale: null,
                }),
            }),
            EscId: new DynamicLabel({
                label: 'Esc',
                value: getMetaItemValue(this.escs as unknown as IMetaItem[], this.student && this.student.hasOwnProperty('EscId') ? this.student.EscId : null) ?? '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
            }),
            FirstName: new DynamicLabel({
                label: 'First Name',
                value: this.student && this.student.hasOwnProperty('FirstName') && this.student.FirstName != null ? this.student.FirstName.toString() : '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: null,
                    scale: null,
                }),
            }),
            Grade: new DynamicLabel({
                label: 'Grade',
                value: this.student && this.student.hasOwnProperty('Grade') && this.student.Grade != null ? this.student.Grade.toString() : '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: null,
                    scale: null,
                }),
            }),
            LastName: new DynamicLabel({
                label: 'Last Name',
                value: this.student && this.student.hasOwnProperty('LastName') && this.student.LastName != null ? this.student.LastName.toString() : '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: null,
                    scale: null,
                }),
            }),
            MedicaidNo: new DynamicLabel({
                label: 'Medicaid No',
                value: this.student && this.student.hasOwnProperty('MedicaidNo') && this.student.MedicaidNo != null ? this.student.MedicaidNo.toString() : '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: null,
                    scale: null,
                }),
            }),
            MiddleName: new DynamicLabel({
                label: 'Middle Name',
                value: this.student && this.student.hasOwnProperty('MiddleName') && this.student.MiddleName != null ? this.student.MiddleName.toString() : '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: null,
                    scale: null,
                }),
            }),
            ModifiedById: new DynamicLabel({
                label: 'Modified By',
                value: getMetaItemValue(this.modifiedBies as unknown as IMetaItem[], this.student && this.student.hasOwnProperty('ModifiedById') ? this.student.ModifiedById : null) ?? '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
            }),
            Notes: new DynamicLabel({
                label: 'Notes',
                value: this.student && this.student.hasOwnProperty('Notes') && this.student.Notes != null ? this.student.Notes.toString() : '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: null,
                    scale: null,
                }),
            }),
            SchoolId: new DynamicLabel({
                label: 'School',
                value: getMetaItemValue(this.schools as unknown as IMetaItem[], this.student && this.student.hasOwnProperty('SchoolId') ? this.student.SchoolId : null) ?? '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
            }),
            StudentCode: new DynamicLabel({
                label: 'Student Code',
                value: this.student && this.student.hasOwnProperty('StudentCode') && this.student.StudentCode != null ? this.student.StudentCode.toString() : '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: null,
                    scale: null,
                }),
            }),
        };

    }
}
