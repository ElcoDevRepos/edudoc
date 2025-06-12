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
import { IEncounterStudentMethod } from '../interfaces/encounter-student-method';
import { IUser } from '../interfaces/user';
import { IEncounterStudent } from '../interfaces/encounter-student';
import { IMethod } from '../interfaces/method';

export interface IEncounterStudentMethodDynamicControlsParameters {
    formGroup?: string;
    encounterStudents?: IEncounterStudent[];
    methods?: IMethod[];
    createdBies?: IUser[];
    modifiedBies?: IUser[];
}

export class EncounterStudentMethodDynamicControls {

    formGroup: string;
    encounterStudents?: IEncounterStudent[];
    methods?: IMethod[];
    createdBies?: IUser[];
    modifiedBies?: IUser[];

    Form: IExpandableObject;
    View: IExpandableObject;

    constructor(private encounterstudentmethod?: IEncounterStudentMethod, additionalParameters?: IEncounterStudentMethodDynamicControlsParameters) {
        this.formGroup = additionalParameters && additionalParameters.formGroup || 'EncounterStudentMethod';
        this.encounterStudents = additionalParameters && additionalParameters.encounterStudents || undefined;
        this.methods = additionalParameters && additionalParameters.methods || undefined;
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
                value: this.encounterstudentmethod && this.encounterstudentmethod.hasOwnProperty('Archived') && this.encounterstudentmethod.Archived != null ? this.encounterstudentmethod.Archived : false,
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
                value: this.encounterstudentmethod && this.encounterstudentmethod.CreatedById || 1,
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
                value: this.encounterstudentmethod && this.encounterstudentmethod.DateCreated || null,
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
                value: this.encounterstudentmethod && this.encounterstudentmethod.DateModified || null,
            }),
            EncounterStudentId: new DynamicField({
                formGroup: this.formGroup,
                label: 'Encounter Student',
                name: 'EncounterStudentId',
                options: this.encounterStudents,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
                validation: [ noZeroRequiredValidator ],
                validators: { 'required': true },
                value: this.encounterstudentmethod && this.encounterstudentmethod.EncounterStudentId || null,
            }),
            MethodId: new DynamicField({
                formGroup: this.formGroup,
                label: 'Method',
                name: 'MethodId',
                options: this.methods,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
                validation: [ noZeroRequiredValidator ],
                validators: { 'required': true },
                value: this.encounterstudentmethod && this.encounterstudentmethod.MethodId || null,
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
                value: this.encounterstudentmethod && this.encounterstudentmethod.ModifiedById || null,
            }),
        };

        this.View = {
            Archived: new DynamicLabel({
                label: 'Archived',
                value: this.encounterstudentmethod && this.encounterstudentmethod.hasOwnProperty('Archived') && this.encounterstudentmethod.Archived != null ? this.encounterstudentmethod.Archived : false,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Checkbox,
                    inputType: null,
                    scale: null,
                }),
            }),
            CreatedById: new DynamicLabel({
                label: 'Created By',
                value: getMetaItemValue(this.createdBies as unknown as IMetaItem[], this.encounterstudentmethod && this.encounterstudentmethod.hasOwnProperty('CreatedById') ? this.encounterstudentmethod.CreatedById : null) ?? '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
            }),
            DateCreated: new DynamicLabel({
                label: 'Date Created',
                value: this.encounterstudentmethod && this.encounterstudentmethod.DateCreated || null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: InputTypes.Datepicker,
                    scale: null,
                }),
            }),
            DateModified: new DynamicLabel({
                label: 'Date Modified',
                value: this.encounterstudentmethod && this.encounterstudentmethod.DateModified || null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: InputTypes.Datepicker,
                    scale: null,
                }),
            }),
            EncounterStudentId: new DynamicLabel({
                label: 'Encounter Student',
                value: getMetaItemValue(this.encounterStudents as unknown as IMetaItem[], this.encounterstudentmethod && this.encounterstudentmethod.hasOwnProperty('EncounterStudentId') ? this.encounterstudentmethod.EncounterStudentId : null) ?? '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
            }),
            MethodId: new DynamicLabel({
                label: 'Method',
                value: getMetaItemValue(this.methods as unknown as IMetaItem[], this.encounterstudentmethod && this.encounterstudentmethod.hasOwnProperty('MethodId') ? this.encounterstudentmethod.MethodId : null) ?? '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
            }),
            ModifiedById: new DynamicLabel({
                label: 'Modified By',
                value: getMetaItemValue(this.modifiedBies as unknown as IMetaItem[], this.encounterstudentmethod && this.encounterstudentmethod.hasOwnProperty('ModifiedById') ? this.encounterstudentmethod.ModifiedById : null) ?? '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
            }),
        };

    }
}
