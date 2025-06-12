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
import { ICaseLoad } from '../interfaces/case-load';
import { IUser } from '../interfaces/user';
import { IDiagnosisCode } from '../interfaces/diagnosis-code';
import { IDisabilityCode } from '../interfaces/disability-code';
import { IServiceCode } from '../interfaces/service-code';
import { IStudent } from '../interfaces/student';
import { IStudentType } from '../interfaces/student-type';

export interface ICaseLoadDynamicControlsParameters {
    formGroup?: string;
    studentTypes?: IStudentType[];
    serviceCodes?: IServiceCode[];
    students?: IStudent[];
    diagnosisCodes?: IDiagnosisCode[];
    disabilityCodes?: IDisabilityCode[];
    createdBies?: IUser[];
    modifiedBies?: IUser[];
}

export class CaseLoadDynamicControls {

    formGroup: string;
    studentTypes?: IStudentType[];
    serviceCodes?: IServiceCode[];
    students?: IStudent[];
    diagnosisCodes?: IDiagnosisCode[];
    disabilityCodes?: IDisabilityCode[];
    createdBies?: IUser[];
    modifiedBies?: IUser[];

    Form: IExpandableObject;
    View: IExpandableObject;

    constructor(private caseload?: ICaseLoad, additionalParameters?: ICaseLoadDynamicControlsParameters) {
        this.formGroup = additionalParameters && additionalParameters.formGroup || 'CaseLoad';
        this.studentTypes = additionalParameters && additionalParameters.studentTypes || undefined;
        this.serviceCodes = additionalParameters && additionalParameters.serviceCodes || undefined;
        this.students = additionalParameters && additionalParameters.students || undefined;
        this.diagnosisCodes = additionalParameters && additionalParameters.diagnosisCodes || undefined;
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
                value: this.caseload && this.caseload.hasOwnProperty('Archived') && this.caseload.Archived != null ? this.caseload.Archived : false,
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
                value: this.caseload && this.caseload.CreatedById || 1,
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
                value: this.caseload && this.caseload.DateCreated || null,
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
                value: this.caseload && this.caseload.DateModified || null,
            }),
            DiagnosisCodeId: new DynamicField({
                formGroup: this.formGroup,
                label: 'Diagnosis Code',
                name: 'DiagnosisCodeId',
                options: this.diagnosisCodes,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
                validation: [  ],
                validators: {  },
                value: this.caseload && this.caseload.DiagnosisCodeId || null,
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
                validation: [  ],
                validators: {  },
                value: this.caseload && this.caseload.DisabilityCodeId || null,
            }),
            IepEndDate: new DynamicField({
                formGroup: this.formGroup,
                label: 'Iep End Date',
                name: 'IepEndDate',
                options: null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: InputTypes.Datepicker,
                    scale: null,
                }),
                validation: [  ],
                validators: {  },
                value: this.caseload && this.caseload.IepEndDate || null,
            }),
            IepStartDate: new DynamicField({
                formGroup: this.formGroup,
                label: 'Iep Start Date',
                name: 'IepStartDate',
                options: null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: InputTypes.Datepicker,
                    scale: null,
                }),
                validation: [  ],
                validators: {  },
                value: this.caseload && this.caseload.IepStartDate || null,
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
                value: this.caseload && this.caseload.ModifiedById || null,
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
                value: this.caseload && this.caseload.ServiceCodeId || null,
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
                value: this.caseload && this.caseload.StudentId || null,
            }),
            StudentTypeId: new DynamicField({
                formGroup: this.formGroup,
                label: 'Student Type',
                name: 'StudentTypeId',
                options: this.studentTypes,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
                validation: [ noZeroRequiredValidator ],
                validators: { 'required': true },
                value: this.caseload && this.caseload.StudentTypeId || null,
            }),
        };

        this.View = {
            Archived: new DynamicLabel({
                label: 'Archived',
                value: this.caseload && this.caseload.hasOwnProperty('Archived') && this.caseload.Archived != null ? this.caseload.Archived : false,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Checkbox,
                    inputType: null,
                    scale: null,
                }),
            }),
            CreatedById: new DynamicLabel({
                label: 'Created By',
                value: getMetaItemValue(this.createdBies as unknown as IMetaItem[], this.caseload && this.caseload.hasOwnProperty('CreatedById') ? this.caseload.CreatedById : null) ?? '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
            }),
            DateCreated: new DynamicLabel({
                label: 'Date Created',
                value: this.caseload && this.caseload.DateCreated || null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: InputTypes.Datepicker,
                    scale: null,
                }),
            }),
            DateModified: new DynamicLabel({
                label: 'Date Modified',
                value: this.caseload && this.caseload.DateModified || null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: InputTypes.Datepicker,
                    scale: null,
                }),
            }),
            DiagnosisCodeId: new DynamicLabel({
                label: 'Diagnosis Code',
                value: getMetaItemValue(this.diagnosisCodes as unknown as IMetaItem[], this.caseload && this.caseload.hasOwnProperty('DiagnosisCodeId') ? this.caseload.DiagnosisCodeId : null) ?? '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
            }),
            DisabilityCodeId: new DynamicLabel({
                label: 'Disability Code',
                value: getMetaItemValue(this.disabilityCodes as unknown as IMetaItem[], this.caseload && this.caseload.hasOwnProperty('DisabilityCodeId') ? this.caseload.DisabilityCodeId : null) ?? '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
            }),
            IepEndDate: new DynamicLabel({
                label: 'Iep End Date',
                value: this.caseload && this.caseload.IepEndDate || null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: InputTypes.Datepicker,
                    scale: null,
                }),
            }),
            IepStartDate: new DynamicLabel({
                label: 'Iep Start Date',
                value: this.caseload && this.caseload.IepStartDate || null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: InputTypes.Datepicker,
                    scale: null,
                }),
            }),
            ModifiedById: new DynamicLabel({
                label: 'Modified By',
                value: getMetaItemValue(this.modifiedBies as unknown as IMetaItem[], this.caseload && this.caseload.hasOwnProperty('ModifiedById') ? this.caseload.ModifiedById : null) ?? '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
            }),
            ServiceCodeId: new DynamicLabel({
                label: 'Service Code',
                value: getMetaItemValue(this.serviceCodes as unknown as IMetaItem[], this.caseload && this.caseload.hasOwnProperty('ServiceCodeId') ? this.caseload.ServiceCodeId : null) ?? '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
            }),
            StudentId: new DynamicLabel({
                label: 'Student',
                value: getMetaItemValue(this.students as unknown as IMetaItem[], this.caseload && this.caseload.hasOwnProperty('StudentId') ? this.caseload.StudentId : null) ?? '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
            }),
            StudentTypeId: new DynamicLabel({
                label: 'Student Type',
                value: getMetaItemValue(this.studentTypes as unknown as IMetaItem[], this.caseload && this.caseload.hasOwnProperty('StudentTypeId') ? this.caseload.StudentTypeId : null) ?? '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
            }),
        };

    }
}
