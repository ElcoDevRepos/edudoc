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
import { IProviderStudentSupervisor } from '../interfaces/provider-student-supervisor';
import { IProvider } from '../interfaces/provider';
import { IUser } from '../interfaces/user';
import { IStudent } from '../interfaces/student';

export interface IProviderStudentSupervisorDynamicControlsParameters {
    formGroup?: string;
    assistants?: IProvider[];
    supervisors?: IProvider[];
    students?: IStudent[];
    createdBies?: IUser[];
    modifiedBies?: IUser[];
}

export class ProviderStudentSupervisorDynamicControls {

    formGroup: string;
    assistants?: IProvider[];
    supervisors?: IProvider[];
    students?: IStudent[];
    createdBies?: IUser[];
    modifiedBies?: IUser[];

    Form: IExpandableObject;
    View: IExpandableObject;

    constructor(private providerstudentsupervisor?: IProviderStudentSupervisor, additionalParameters?: IProviderStudentSupervisorDynamicControlsParameters) {
        this.formGroup = additionalParameters && additionalParameters.formGroup || 'ProviderStudentSupervisor';
        this.assistants = additionalParameters && additionalParameters.assistants || undefined;
        this.supervisors = additionalParameters && additionalParameters.supervisors || undefined;
        this.students = additionalParameters && additionalParameters.students || undefined;
        this.createdBies = additionalParameters && additionalParameters.createdBies || undefined;
        this.modifiedBies = additionalParameters && additionalParameters.modifiedBies || undefined;

        this.Form = {
            AssistantId: new DynamicField({
                formGroup: this.formGroup,
                label: 'Assistant',
                name: 'AssistantId',
                options: this.assistants,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
                validation: [ noZeroRequiredValidator ],
                validators: { 'required': true },
                value: this.providerstudentsupervisor && this.providerstudentsupervisor.AssistantId || null,
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
                value: this.providerstudentsupervisor && this.providerstudentsupervisor.CreatedById || 1,
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
                value: this.providerstudentsupervisor && this.providerstudentsupervisor.DateCreated || null,
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
                value: this.providerstudentsupervisor && this.providerstudentsupervisor.DateModified || null,
            }),
            EffectiveEndDate: new DynamicField({
                formGroup: this.formGroup,
                label: 'Effective End Date',
                name: 'EffectiveEndDate',
                options: null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: InputTypes.Datepicker,
                    scale: null,
                }),
                validation: [  ],
                validators: {  },
                value: this.providerstudentsupervisor && this.providerstudentsupervisor.EffectiveEndDate || null,
            }),
            EffectiveStartDate: new DynamicField({
                formGroup: this.formGroup,
                label: 'Effective Start Date',
                name: 'EffectiveStartDate',
                options: null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: InputTypes.Datepicker,
                    scale: null,
                }),
                validation: [ Validators.required ],
                validators: { 'required': true },
                value: this.providerstudentsupervisor && this.providerstudentsupervisor.EffectiveStartDate || null,
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
                value: this.providerstudentsupervisor && this.providerstudentsupervisor.ModifiedById || null,
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
                value: this.providerstudentsupervisor && this.providerstudentsupervisor.StudentId || null,
            }),
            SupervisorId: new DynamicField({
                formGroup: this.formGroup,
                label: 'Supervisor',
                name: 'SupervisorId',
                options: this.supervisors,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
                validation: [ noZeroRequiredValidator ],
                validators: { 'required': true },
                value: this.providerstudentsupervisor && this.providerstudentsupervisor.SupervisorId || null,
            }),
        };

        this.View = {
            AssistantId: new DynamicLabel({
                label: 'Assistant',
                value: getMetaItemValue(this.assistants as unknown as IMetaItem[], this.providerstudentsupervisor && this.providerstudentsupervisor.hasOwnProperty('AssistantId') ? this.providerstudentsupervisor.AssistantId : null) ?? '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
            }),
            CreatedById: new DynamicLabel({
                label: 'Created By',
                value: getMetaItemValue(this.createdBies as unknown as IMetaItem[], this.providerstudentsupervisor && this.providerstudentsupervisor.hasOwnProperty('CreatedById') ? this.providerstudentsupervisor.CreatedById : null) ?? '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
            }),
            DateCreated: new DynamicLabel({
                label: 'Date Created',
                value: this.providerstudentsupervisor && this.providerstudentsupervisor.DateCreated || null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: InputTypes.Datepicker,
                    scale: null,
                }),
            }),
            DateModified: new DynamicLabel({
                label: 'Date Modified',
                value: this.providerstudentsupervisor && this.providerstudentsupervisor.DateModified || null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: InputTypes.Datepicker,
                    scale: null,
                }),
            }),
            EffectiveEndDate: new DynamicLabel({
                label: 'Effective End Date',
                value: this.providerstudentsupervisor && this.providerstudentsupervisor.EffectiveEndDate || null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: InputTypes.Datepicker,
                    scale: null,
                }),
            }),
            EffectiveStartDate: new DynamicLabel({
                label: 'Effective Start Date',
                value: this.providerstudentsupervisor && this.providerstudentsupervisor.EffectiveStartDate || null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: InputTypes.Datepicker,
                    scale: null,
                }),
            }),
            ModifiedById: new DynamicLabel({
                label: 'Modified By',
                value: getMetaItemValue(this.modifiedBies as unknown as IMetaItem[], this.providerstudentsupervisor && this.providerstudentsupervisor.hasOwnProperty('ModifiedById') ? this.providerstudentsupervisor.ModifiedById : null) ?? '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
            }),
            StudentId: new DynamicLabel({
                label: 'Student',
                value: getMetaItemValue(this.students as unknown as IMetaItem[], this.providerstudentsupervisor && this.providerstudentsupervisor.hasOwnProperty('StudentId') ? this.providerstudentsupervisor.StudentId : null) ?? '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
            }),
            SupervisorId: new DynamicLabel({
                label: 'Supervisor',
                value: getMetaItemValue(this.supervisors as unknown as IMetaItem[], this.providerstudentsupervisor && this.providerstudentsupervisor.hasOwnProperty('SupervisorId') ? this.providerstudentsupervisor.SupervisorId : null) ?? '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
            }),
        };

    }
}
