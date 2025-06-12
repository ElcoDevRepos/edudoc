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
import { IEncounterStudentCptCode } from '../interfaces/encounter-student-cpt-code';
import { ICptCode } from '../interfaces/cpt-code';
import { IUser } from '../interfaces/user';
import { IEncounterStudent } from '../interfaces/encounter-student';

export interface IEncounterStudentCptCodeDynamicControlsParameters {
    formGroup?: string;
    encounterStudents?: IEncounterStudent[];
    cptCodes?: ICptCode[];
    createdBies?: IUser[];
    modifiedBies?: IUser[];
}

export class EncounterStudentCptCodeDynamicControls {

    formGroup: string;
    encounterStudents?: IEncounterStudent[];
    cptCodes?: ICptCode[];
    createdBies?: IUser[];
    modifiedBies?: IUser[];

    Form: IExpandableObject;
    View: IExpandableObject;

    constructor(private encounterstudentcptcode?: IEncounterStudentCptCode, additionalParameters?: IEncounterStudentCptCodeDynamicControlsParameters) {
        this.formGroup = additionalParameters && additionalParameters.formGroup || 'EncounterStudentCptCode';
        this.encounterStudents = additionalParameters && additionalParameters.encounterStudents || undefined;
        this.cptCodes = additionalParameters && additionalParameters.cptCodes || undefined;
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
                value: this.encounterstudentcptcode && this.encounterstudentcptcode.hasOwnProperty('Archived') && this.encounterstudentcptcode.Archived != null ? this.encounterstudentcptcode.Archived : false,
            }),
            CptCodeId: new DynamicField({
                formGroup: this.formGroup,
                label: 'Cpt Code',
                name: 'CptCodeId',
                options: this.cptCodes,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
                validation: [ noZeroRequiredValidator ],
                validators: { 'required': true },
                value: this.encounterstudentcptcode && this.encounterstudentcptcode.CptCodeId || null,
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
                value: this.encounterstudentcptcode && this.encounterstudentcptcode.CreatedById || 1,
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
                value: this.encounterstudentcptcode && this.encounterstudentcptcode.DateCreated || null,
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
                value: this.encounterstudentcptcode && this.encounterstudentcptcode.DateModified || null,
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
                value: this.encounterstudentcptcode && this.encounterstudentcptcode.EncounterStudentId || null,
            }),
            Minutes: new DynamicField({
                formGroup: this.formGroup,
                label: 'Minutes',
                name: 'Minutes',
                options: null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Numeric,
                    inputType: NumericInputTypes.Integer,
                    scale: null,
                }),
                validation: [  ],
                validators: {  },
                value: this.encounterstudentcptcode && this.encounterstudentcptcode.Minutes || null,
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
                value: this.encounterstudentcptcode && this.encounterstudentcptcode.ModifiedById || null,
            }),
        };

        this.View = {
            Archived: new DynamicLabel({
                label: 'Archived',
                value: this.encounterstudentcptcode && this.encounterstudentcptcode.hasOwnProperty('Archived') && this.encounterstudentcptcode.Archived != null ? this.encounterstudentcptcode.Archived : false,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Checkbox,
                    inputType: null,
                    scale: null,
                }),
            }),
            CptCodeId: new DynamicLabel({
                label: 'Cpt Code',
                value: getMetaItemValue(this.cptCodes as unknown as IMetaItem[], this.encounterstudentcptcode && this.encounterstudentcptcode.hasOwnProperty('CptCodeId') ? this.encounterstudentcptcode.CptCodeId : null) ?? '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
            }),
            CreatedById: new DynamicLabel({
                label: 'Created By',
                value: getMetaItemValue(this.createdBies as unknown as IMetaItem[], this.encounterstudentcptcode && this.encounterstudentcptcode.hasOwnProperty('CreatedById') ? this.encounterstudentcptcode.CreatedById : null) ?? '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
            }),
            DateCreated: new DynamicLabel({
                label: 'Date Created',
                value: this.encounterstudentcptcode && this.encounterstudentcptcode.DateCreated || null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: InputTypes.Datepicker,
                    scale: null,
                }),
            }),
            DateModified: new DynamicLabel({
                label: 'Date Modified',
                value: this.encounterstudentcptcode && this.encounterstudentcptcode.DateModified || null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: InputTypes.Datepicker,
                    scale: null,
                }),
            }),
            EncounterStudentId: new DynamicLabel({
                label: 'Encounter Student',
                value: getMetaItemValue(this.encounterStudents as unknown as IMetaItem[], this.encounterstudentcptcode && this.encounterstudentcptcode.hasOwnProperty('EncounterStudentId') ? this.encounterstudentcptcode.EncounterStudentId : null) ?? '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
            }),
            Minutes: new DynamicLabel({
                label: 'Minutes',
                value: this.encounterstudentcptcode && this.encounterstudentcptcode.Minutes || null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Numeric,
                    inputType: NumericInputTypes.Integer,
                    scale: null,
                }),
            }),
            ModifiedById: new DynamicLabel({
                label: 'Modified By',
                value: getMetaItemValue(this.modifiedBies as unknown as IMetaItem[], this.encounterstudentcptcode && this.encounterstudentcptcode.hasOwnProperty('ModifiedById') ? this.encounterstudentcptcode.ModifiedById : null) ?? '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
            }),
        };

    }
}
