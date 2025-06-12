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
import { IEncounterStudentGoal } from '../interfaces/encounter-student-goal';
import { ICaseLoadScriptGoal } from '../interfaces/case-load-script-goal';
import { IUser } from '../interfaces/user';
import { IEncounterStudent } from '../interfaces/encounter-student';
import { IGoal } from '../interfaces/goal';
import { INursingGoalResult } from '../interfaces/nursing-goal-result';

export interface IEncounterStudentGoalDynamicControlsParameters {
    formGroup?: string;
    encounterStudents?: IEncounterStudent[];
    goals?: IGoal[];
    createdBies?: IUser[];
    modifiedBies?: IUser[];
    nursingGoalResults?: INursingGoalResult[];
    caseLoadScriptGoals?: ICaseLoadScriptGoal[];
}

export class EncounterStudentGoalDynamicControls {

    formGroup: string;
    encounterStudents?: IEncounterStudent[];
    goals?: IGoal[];
    createdBies?: IUser[];
    modifiedBies?: IUser[];
    nursingGoalResults?: INursingGoalResult[];
    caseLoadScriptGoals?: ICaseLoadScriptGoal[];

    Form: IExpandableObject;
    View: IExpandableObject;

    constructor(private encounterstudentgoal?: IEncounterStudentGoal, additionalParameters?: IEncounterStudentGoalDynamicControlsParameters) {
        this.formGroup = additionalParameters && additionalParameters.formGroup || 'EncounterStudentGoal';
        this.encounterStudents = additionalParameters && additionalParameters.encounterStudents || undefined;
        this.goals = additionalParameters && additionalParameters.goals || undefined;
        this.createdBies = additionalParameters && additionalParameters.createdBies || undefined;
        this.modifiedBies = additionalParameters && additionalParameters.modifiedBies || undefined;
        this.nursingGoalResults = additionalParameters && additionalParameters.nursingGoalResults || undefined;
        this.caseLoadScriptGoals = additionalParameters && additionalParameters.caseLoadScriptGoals || undefined;

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
                value: this.encounterstudentgoal && this.encounterstudentgoal.hasOwnProperty('Archived') && this.encounterstudentgoal.Archived != null ? this.encounterstudentgoal.Archived : false,
            }),
            CaseLoadScriptGoalId: new DynamicField({
                formGroup: this.formGroup,
                label: 'Case Load Script Goal',
                name: 'CaseLoadScriptGoalId',
                options: this.caseLoadScriptGoals,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
                validation: [  ],
                validators: {  },
                value: this.encounterstudentgoal && this.encounterstudentgoal.CaseLoadScriptGoalId || null,
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
                value: this.encounterstudentgoal && this.encounterstudentgoal.CreatedById || 1,
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
                value: this.encounterstudentgoal && this.encounterstudentgoal.DateCreated || null,
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
                value: this.encounterstudentgoal && this.encounterstudentgoal.DateModified || null,
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
                value: this.encounterstudentgoal && this.encounterstudentgoal.EncounterStudentId || null,
            }),
            GoalId: new DynamicField({
                formGroup: this.formGroup,
                label: 'Goal',
                name: 'GoalId',
                options: this.goals,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
                validation: [ noZeroRequiredValidator ],
                validators: { 'required': true },
                value: this.encounterstudentgoal && this.encounterstudentgoal.GoalId || null,
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
                value: this.encounterstudentgoal && this.encounterstudentgoal.ModifiedById || null,
            }),
            NursingGoalResultId: new DynamicField({
                formGroup: this.formGroup,
                label: 'Nursing Goal Result',
                name: 'NursingGoalResultId',
                options: this.nursingGoalResults,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
                validation: [  ],
                validators: {  },
                value: this.encounterstudentgoal && this.encounterstudentgoal.NursingGoalResultId || null,
            }),
            NursingResponseNote: new DynamicField({
                formGroup: this.formGroup,
                label: 'Nursing Response Note',
                name: 'NursingResponseNote',
                options: null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: null,
                    scale: null,
                }),
                validation: [ Validators.maxLength(50) ],
                validators: { 'maxlength': 50 },
                value: this.encounterstudentgoal && this.encounterstudentgoal.hasOwnProperty('NursingResponseNote') && this.encounterstudentgoal.NursingResponseNote != null ? this.encounterstudentgoal.NursingResponseNote.toString() : '',
            }),
            NursingResultNote: new DynamicField({
                formGroup: this.formGroup,
                label: 'Nursing Result Note',
                name: 'NursingResultNote',
                options: null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: null,
                    scale: null,
                }),
                validation: [ Validators.maxLength(50) ],
                validators: { 'maxlength': 50 },
                value: this.encounterstudentgoal && this.encounterstudentgoal.hasOwnProperty('NursingResultNote') && this.encounterstudentgoal.NursingResultNote != null ? this.encounterstudentgoal.NursingResultNote.toString() : '',
            }),
            ServiceOutcomes: new DynamicField({
                formGroup: this.formGroup,
                label: 'Service Outcomes',
                name: 'ServiceOutcomes',
                options: null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: null,
                    scale: null,
                }),
                validation: [ Validators.maxLength(250) ],
                validators: { 'maxlength': 250 },
                value: this.encounterstudentgoal && this.encounterstudentgoal.hasOwnProperty('ServiceOutcomes') && this.encounterstudentgoal.ServiceOutcomes != null ? this.encounterstudentgoal.ServiceOutcomes.toString() : '',
            }),
        };

        this.View = {
            Archived: new DynamicLabel({
                label: 'Archived',
                value: this.encounterstudentgoal && this.encounterstudentgoal.hasOwnProperty('Archived') && this.encounterstudentgoal.Archived != null ? this.encounterstudentgoal.Archived : false,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Checkbox,
                    inputType: null,
                    scale: null,
                }),
            }),
            CaseLoadScriptGoalId: new DynamicLabel({
                label: 'Case Load Script Goal',
                value: getMetaItemValue(this.caseLoadScriptGoals as unknown as IMetaItem[], this.encounterstudentgoal && this.encounterstudentgoal.hasOwnProperty('CaseLoadScriptGoalId') ? this.encounterstudentgoal.CaseLoadScriptGoalId : null) ?? '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
            }),
            CreatedById: new DynamicLabel({
                label: 'Created By',
                value: getMetaItemValue(this.createdBies as unknown as IMetaItem[], this.encounterstudentgoal && this.encounterstudentgoal.hasOwnProperty('CreatedById') ? this.encounterstudentgoal.CreatedById : null) ?? '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
            }),
            DateCreated: new DynamicLabel({
                label: 'Date Created',
                value: this.encounterstudentgoal && this.encounterstudentgoal.DateCreated || null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: InputTypes.Datepicker,
                    scale: null,
                }),
            }),
            DateModified: new DynamicLabel({
                label: 'Date Modified',
                value: this.encounterstudentgoal && this.encounterstudentgoal.DateModified || null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: InputTypes.Datepicker,
                    scale: null,
                }),
            }),
            EncounterStudentId: new DynamicLabel({
                label: 'Encounter Student',
                value: getMetaItemValue(this.encounterStudents as unknown as IMetaItem[], this.encounterstudentgoal && this.encounterstudentgoal.hasOwnProperty('EncounterStudentId') ? this.encounterstudentgoal.EncounterStudentId : null) ?? '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
            }),
            GoalId: new DynamicLabel({
                label: 'Goal',
                value: getMetaItemValue(this.goals as unknown as IMetaItem[], this.encounterstudentgoal && this.encounterstudentgoal.hasOwnProperty('GoalId') ? this.encounterstudentgoal.GoalId : null) ?? '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
            }),
            ModifiedById: new DynamicLabel({
                label: 'Modified By',
                value: getMetaItemValue(this.modifiedBies as unknown as IMetaItem[], this.encounterstudentgoal && this.encounterstudentgoal.hasOwnProperty('ModifiedById') ? this.encounterstudentgoal.ModifiedById : null) ?? '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
            }),
            NursingGoalResultId: new DynamicLabel({
                label: 'Nursing Goal Result',
                value: getMetaItemValue(this.nursingGoalResults as unknown as IMetaItem[], this.encounterstudentgoal && this.encounterstudentgoal.hasOwnProperty('NursingGoalResultId') ? this.encounterstudentgoal.NursingGoalResultId : null) ?? '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
            }),
            NursingResponseNote: new DynamicLabel({
                label: 'Nursing Response Note',
                value: this.encounterstudentgoal && this.encounterstudentgoal.hasOwnProperty('NursingResponseNote') && this.encounterstudentgoal.NursingResponseNote != null ? this.encounterstudentgoal.NursingResponseNote.toString() : '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: null,
                    scale: null,
                }),
            }),
            NursingResultNote: new DynamicLabel({
                label: 'Nursing Result Note',
                value: this.encounterstudentgoal && this.encounterstudentgoal.hasOwnProperty('NursingResultNote') && this.encounterstudentgoal.NursingResultNote != null ? this.encounterstudentgoal.NursingResultNote.toString() : '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: null,
                    scale: null,
                }),
            }),
            ServiceOutcomes: new DynamicLabel({
                label: 'Service Outcomes',
                value: this.encounterstudentgoal && this.encounterstudentgoal.hasOwnProperty('ServiceOutcomes') && this.encounterstudentgoal.ServiceOutcomes != null ? this.encounterstudentgoal.ServiceOutcomes.toString() : '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: null,
                    scale: null,
                }),
            }),
        };

    }
}
