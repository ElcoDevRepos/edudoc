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
import { IStudentDisabilityCode } from '../interfaces/student-disability-code';
import { IUser } from '../interfaces/user';
import { IDisabilityCode } from '../interfaces/disability-code';
import { IStudent } from '../interfaces/student';

export interface IStudentDisabilityCodeDynamicControlsParameters {
    formGroup?: string;
    students?: IStudent[];
    disabilityCodes?: IDisabilityCode[];
    createdBies?: IUser[];
    modifiedBies?: IUser[];
}

export class StudentDisabilityCodeDynamicControls {

    formGroup: string;
    students?: IStudent[];
    disabilityCodes?: IDisabilityCode[];
    createdBies?: IUser[];
    modifiedBies?: IUser[];

    Form: IExpandableObject;
    View: IExpandableObject;

    constructor(private studentdisabilitycode?: IStudentDisabilityCode, additionalParameters?: IStudentDisabilityCodeDynamicControlsParameters) {
        this.formGroup = additionalParameters && additionalParameters.formGroup || 'StudentDisabilityCode';
        this.students = additionalParameters && additionalParameters.students || undefined;
        this.disabilityCodes = additionalParameters && additionalParameters.disabilityCodes || undefined;
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
                value: this.studentdisabilitycode && this.studentdisabilitycode.hasOwnProperty('Archived') && this.studentdisabilitycode.Archived != null ? this.studentdisabilitycode.Archived : false,
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
                value: this.studentdisabilitycode && this.studentdisabilitycode.CreatedById || 1,
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
                value: this.studentdisabilitycode && this.studentdisabilitycode.DateCreated || null,
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
                value: this.studentdisabilitycode && this.studentdisabilitycode.DateModified || null,
            }),
            DisabilityCodeId: new DynamicField({
                formGroup: this.formGroup,
                label: 'Disability Code',
                name: 'DisabilityCodeId',
                options: this.disabilityCodes,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
                validation: [ noZeroRequiredValidator ],
                validators: { 'required': true },
                value: this.studentdisabilitycode && this.studentdisabilitycode.DisabilityCodeId || null,
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
                value: this.studentdisabilitycode && this.studentdisabilitycode.ModifiedById || null,
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
                value: this.studentdisabilitycode && this.studentdisabilitycode.StudentId || null,
            }),
        };

        this.View = {
            Archived: new DynamicLabel({
                label: 'Archived',
                value: this.studentdisabilitycode && this.studentdisabilitycode.hasOwnProperty('Archived') && this.studentdisabilitycode.Archived != null ? this.studentdisabilitycode.Archived : false,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Checkbox,
                    inputType: null,
                    scale: null,
                }),
            }),
            CreatedById: new DynamicLabel({
                label: 'Created By',
                value: getMetaItemValue(this.createdBies as unknown as IMetaItem[], this.studentdisabilitycode && this.studentdisabilitycode.hasOwnProperty('CreatedById') ? this.studentdisabilitycode.CreatedById : null) ?? '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
            }),
            DateCreated: new DynamicLabel({
                label: 'Date Created',
                value: this.studentdisabilitycode && this.studentdisabilitycode.DateCreated || null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: InputTypes.Datepicker,
                    scale: null,
                }),
            }),
            DateModified: new DynamicLabel({
                label: 'Date Modified',
                value: this.studentdisabilitycode && this.studentdisabilitycode.DateModified || null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: InputTypes.Datepicker,
                    scale: null,
                }),
            }),
            DisabilityCodeId: new DynamicLabel({
                label: 'Disability Code',
                value: getMetaItemValue(this.disabilityCodes as unknown as IMetaItem[], this.studentdisabilitycode && this.studentdisabilitycode.hasOwnProperty('DisabilityCodeId') ? this.studentdisabilitycode.DisabilityCodeId : null) ?? '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
            }),
            ModifiedById: new DynamicLabel({
                label: 'Modified By',
                value: getMetaItemValue(this.modifiedBies as unknown as IMetaItem[], this.studentdisabilitycode && this.studentdisabilitycode.hasOwnProperty('ModifiedById') ? this.studentdisabilitycode.ModifiedById : null) ?? '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
            }),
            StudentId: new DynamicLabel({
                label: 'Student',
                value: getMetaItemValue(this.students as unknown as IMetaItem[], this.studentdisabilitycode && this.studentdisabilitycode.hasOwnProperty('StudentId') ? this.studentdisabilitycode.StudentId : null) ?? '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
            }),
        };

    }
}
