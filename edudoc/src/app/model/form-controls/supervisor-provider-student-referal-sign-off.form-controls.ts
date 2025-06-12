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
import { ISupervisorProviderStudentReferalSignOff } from '../interfaces/supervisor-provider-student-referal-sign-off';
import { IUser } from '../interfaces/user';
import { IServiceCode } from '../interfaces/service-code';
import { IStudent } from '../interfaces/student';

export interface ISupervisorProviderStudentReferalSignOffDynamicControlsParameters {
    formGroup?: string;
    students?: IStudent[];
    signedOffBies?: IUser[];
    serviceCodes?: IServiceCode[];
    createdBies?: IUser[];
    modifiedBies?: IUser[];
}

export class SupervisorProviderStudentReferalSignOffDynamicControls {

    formGroup: string;
    students?: IStudent[];
    signedOffBies?: IUser[];
    serviceCodes?: IServiceCode[];
    createdBies?: IUser[];
    modifiedBies?: IUser[];

    Form: IExpandableObject;
    View: IExpandableObject;

    constructor(private supervisorproviderstudentreferalsignoff?: ISupervisorProviderStudentReferalSignOff, additionalParameters?: ISupervisorProviderStudentReferalSignOffDynamicControlsParameters) {
        this.formGroup = additionalParameters && additionalParameters.formGroup || 'SupervisorProviderStudentReferalSignOff';
        this.students = additionalParameters && additionalParameters.students || undefined;
        this.signedOffBies = additionalParameters && additionalParameters.signedOffBies || undefined;
        this.serviceCodes = additionalParameters && additionalParameters.serviceCodes || undefined;
        this.createdBies = additionalParameters && additionalParameters.createdBies || undefined;
        this.modifiedBies = additionalParameters && additionalParameters.modifiedBies || undefined;

        this.Form = {
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
                validation: [ noZeroRequiredValidator ],
                validators: { 'required': true },
                value: this.supervisorproviderstudentreferalsignoff && this.supervisorproviderstudentreferalsignoff.CreatedById || null,
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
                value: this.supervisorproviderstudentreferalsignoff && this.supervisorproviderstudentreferalsignoff.DateCreated || null,
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
                value: this.supervisorproviderstudentreferalsignoff && this.supervisorproviderstudentreferalsignoff.DateModified || null,
            }),
            EffectiveDateFrom: new DynamicField({
                formGroup: this.formGroup,
                label: 'Effective Date From',
                name: 'EffectiveDateFrom',
                options: null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: InputTypes.Datepicker,
                    scale: null,
                }),
                validation: [  ],
                validators: {  },
                value: this.supervisorproviderstudentreferalsignoff && this.supervisorproviderstudentreferalsignoff.EffectiveDateFrom || null,
            }),
            EffectiveDateTo: new DynamicField({
                formGroup: this.formGroup,
                label: 'Effective Date To',
                name: 'EffectiveDateTo',
                options: null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: InputTypes.Datepicker,
                    scale: null,
                }),
                validation: [  ],
                validators: {  },
                value: this.supervisorproviderstudentreferalsignoff && this.supervisorproviderstudentreferalsignoff.EffectiveDateTo || null,
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
                value: this.supervisorproviderstudentreferalsignoff && this.supervisorproviderstudentreferalsignoff.ModifiedById || null,
            }),
            ServiceCodeId: new DynamicField({
                formGroup: this.formGroup,
                label: 'Service Code',
                name: 'ServiceCodeId',
                options: this.serviceCodes,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
                validation: [  ],
                validators: {  },
                value: this.supervisorproviderstudentreferalsignoff && this.supervisorproviderstudentreferalsignoff.ServiceCodeId || null,
            }),
            SignedOffById: new DynamicField({
                formGroup: this.formGroup,
                label: 'Signed Off By',
                name: 'SignedOffById',
                options: this.signedOffBies,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
                validation: [  ],
                validators: {  },
                value: this.supervisorproviderstudentreferalsignoff && this.supervisorproviderstudentreferalsignoff.SignedOffById || null,
            }),
            SignOffDate: new DynamicField({
                formGroup: this.formGroup,
                label: 'Sign Off Date',
                name: 'SignOffDate',
                options: null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: InputTypes.Datepicker,
                    scale: null,
                }),
                validation: [  ],
                validators: {  },
                value: this.supervisorproviderstudentreferalsignoff && this.supervisorproviderstudentreferalsignoff.SignOffDate || null,
            }),
            SignOffText: new DynamicField({
                formGroup: this.formGroup,
                label: 'Sign Off Text',
                name: 'SignOffText',
                options: null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: null,
                    scale: null,
                }),
                validation: [ Validators.maxLength(1000) ],
                validators: { 'maxlength': 1000 },
                value: this.supervisorproviderstudentreferalsignoff && this.supervisorproviderstudentreferalsignoff.hasOwnProperty('SignOffText') && this.supervisorproviderstudentreferalsignoff.SignOffText != null ? this.supervisorproviderstudentreferalsignoff.SignOffText.toString() : '',
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
                value: this.supervisorproviderstudentreferalsignoff && this.supervisorproviderstudentreferalsignoff.StudentId || null,
            }),
            SupervisorId: new DynamicField({
                formGroup: this.formGroup,
                label: 'Supervisor',
                name: 'SupervisorId',
                options: null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Numeric,
                    inputType: NumericInputTypes.Integer,
                    scale: null,
                }),
                validation: [ Validators.required ],
                validators: { 'required': true },
                value: this.supervisorproviderstudentreferalsignoff && this.supervisorproviderstudentreferalsignoff.SupervisorId || null,
            }),
        };

        this.View = {
            CreatedById: new DynamicLabel({
                label: 'Created By',
                value: getMetaItemValue(this.createdBies as unknown as IMetaItem[], this.supervisorproviderstudentreferalsignoff && this.supervisorproviderstudentreferalsignoff.hasOwnProperty('CreatedById') ? this.supervisorproviderstudentreferalsignoff.CreatedById : null) ?? '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
            }),
            DateCreated: new DynamicLabel({
                label: 'Date Created',
                value: this.supervisorproviderstudentreferalsignoff && this.supervisorproviderstudentreferalsignoff.DateCreated || null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: InputTypes.Datepicker,
                    scale: null,
                }),
            }),
            DateModified: new DynamicLabel({
                label: 'Date Modified',
                value: this.supervisorproviderstudentreferalsignoff && this.supervisorproviderstudentreferalsignoff.DateModified || null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: InputTypes.Datepicker,
                    scale: null,
                }),
            }),
            EffectiveDateFrom: new DynamicLabel({
                label: 'Effective Date From',
                value: this.supervisorproviderstudentreferalsignoff && this.supervisorproviderstudentreferalsignoff.EffectiveDateFrom || null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: InputTypes.Datepicker,
                    scale: null,
                }),
            }),
            EffectiveDateTo: new DynamicLabel({
                label: 'Effective Date To',
                value: this.supervisorproviderstudentreferalsignoff && this.supervisorproviderstudentreferalsignoff.EffectiveDateTo || null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: InputTypes.Datepicker,
                    scale: null,
                }),
            }),
            ModifiedById: new DynamicLabel({
                label: 'Modified By',
                value: getMetaItemValue(this.modifiedBies as unknown as IMetaItem[], this.supervisorproviderstudentreferalsignoff && this.supervisorproviderstudentreferalsignoff.hasOwnProperty('ModifiedById') ? this.supervisorproviderstudentreferalsignoff.ModifiedById : null) ?? '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
            }),
            ServiceCodeId: new DynamicLabel({
                label: 'Service Code',
                value: getMetaItemValue(this.serviceCodes as unknown as IMetaItem[], this.supervisorproviderstudentreferalsignoff && this.supervisorproviderstudentreferalsignoff.hasOwnProperty('ServiceCodeId') ? this.supervisorproviderstudentreferalsignoff.ServiceCodeId : null) ?? '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
            }),
            SignedOffById: new DynamicLabel({
                label: 'Signed Off By',
                value: getMetaItemValue(this.signedOffBies as unknown as IMetaItem[], this.supervisorproviderstudentreferalsignoff && this.supervisorproviderstudentreferalsignoff.hasOwnProperty('SignedOffById') ? this.supervisorproviderstudentreferalsignoff.SignedOffById : null) ?? '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
            }),
            SignOffDate: new DynamicLabel({
                label: 'Sign Off Date',
                value: this.supervisorproviderstudentreferalsignoff && this.supervisorproviderstudentreferalsignoff.SignOffDate || null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: InputTypes.Datepicker,
                    scale: null,
                }),
            }),
            SignOffText: new DynamicLabel({
                label: 'Sign Off Text',
                value: this.supervisorproviderstudentreferalsignoff && this.supervisorproviderstudentreferalsignoff.hasOwnProperty('SignOffText') && this.supervisorproviderstudentreferalsignoff.SignOffText != null ? this.supervisorproviderstudentreferalsignoff.SignOffText.toString() : '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: null,
                    scale: null,
                }),
            }),
            StudentId: new DynamicLabel({
                label: 'Student',
                value: getMetaItemValue(this.students as unknown as IMetaItem[], this.supervisorproviderstudentreferalsignoff && this.supervisorproviderstudentreferalsignoff.hasOwnProperty('StudentId') ? this.supervisorproviderstudentreferalsignoff.StudentId : null) ?? '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
            }),
            SupervisorId: new DynamicLabel({
                label: 'Supervisor',
                value: this.supervisorproviderstudentreferalsignoff && this.supervisorproviderstudentreferalsignoff.SupervisorId || null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Numeric,
                    inputType: NumericInputTypes.Integer,
                    scale: null,
                }),
            }),
        };

    }
}
