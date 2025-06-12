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
import { ICaseLoadScriptGoal } from '../interfaces/case-load-script-goal';
import { ICaseLoadScript } from '../interfaces/case-load-script';
import { IUser } from '../interfaces/user';
import { IGoal } from '../interfaces/goal';

export interface ICaseLoadScriptGoalDynamicControlsParameters {
    formGroup?: string;
    caseLoadScripts?: ICaseLoadScript[];
    goals?: IGoal[];
    createdBies?: IUser[];
    modifiedBies?: IUser[];
}

export class CaseLoadScriptGoalDynamicControls {

    formGroup: string;
    caseLoadScripts?: ICaseLoadScript[];
    goals?: IGoal[];
    createdBies?: IUser[];
    modifiedBies?: IUser[];

    Form: IExpandableObject;
    View: IExpandableObject;

    constructor(private caseloadscriptgoal?: ICaseLoadScriptGoal, additionalParameters?: ICaseLoadScriptGoalDynamicControlsParameters) {
        this.formGroup = additionalParameters && additionalParameters.formGroup || 'CaseLoadScriptGoal';
        this.caseLoadScripts = additionalParameters && additionalParameters.caseLoadScripts || undefined;
        this.goals = additionalParameters && additionalParameters.goals || undefined;
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
                value: this.caseloadscriptgoal && this.caseloadscriptgoal.hasOwnProperty('Archived') && this.caseloadscriptgoal.Archived != null ? this.caseloadscriptgoal.Archived : false,
            }),
            CaseLoadScriptId: new DynamicField({
                formGroup: this.formGroup,
                label: 'Case Load Script',
                name: 'CaseLoadScriptId',
                options: this.caseLoadScripts,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
                validation: [ noZeroRequiredValidator ],
                validators: { 'required': true },
                value: this.caseloadscriptgoal && this.caseloadscriptgoal.CaseLoadScriptId || null,
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
                value: this.caseloadscriptgoal && this.caseloadscriptgoal.CreatedById || 1,
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
                value: this.caseloadscriptgoal && this.caseloadscriptgoal.DateCreated || null,
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
                value: this.caseloadscriptgoal && this.caseloadscriptgoal.DateModified || null,
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
                value: this.caseloadscriptgoal && this.caseloadscriptgoal.GoalId || null,
            }),
            MedicationName: new DynamicField({
                formGroup: this.formGroup,
                label: 'Medication Name',
                name: 'MedicationName',
                options: null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: null,
                    scale: null,
                }),
                validation: [ Validators.maxLength(50) ],
                validators: { 'maxlength': 50 },
                value: this.caseloadscriptgoal && this.caseloadscriptgoal.hasOwnProperty('MedicationName') && this.caseloadscriptgoal.MedicationName != null ? this.caseloadscriptgoal.MedicationName.toString() : '',
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
                value: this.caseloadscriptgoal && this.caseloadscriptgoal.ModifiedById || null,
            }),
        };

        this.View = {
            Archived: new DynamicLabel({
                label: 'Archived',
                value: this.caseloadscriptgoal && this.caseloadscriptgoal.hasOwnProperty('Archived') && this.caseloadscriptgoal.Archived != null ? this.caseloadscriptgoal.Archived : false,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Checkbox,
                    inputType: null,
                    scale: null,
                }),
            }),
            CaseLoadScriptId: new DynamicLabel({
                label: 'Case Load Script',
                value: getMetaItemValue(this.caseLoadScripts as unknown as IMetaItem[], this.caseloadscriptgoal && this.caseloadscriptgoal.hasOwnProperty('CaseLoadScriptId') ? this.caseloadscriptgoal.CaseLoadScriptId : null) ?? '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
            }),
            CreatedById: new DynamicLabel({
                label: 'Created By',
                value: getMetaItemValue(this.createdBies as unknown as IMetaItem[], this.caseloadscriptgoal && this.caseloadscriptgoal.hasOwnProperty('CreatedById') ? this.caseloadscriptgoal.CreatedById : null) ?? '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
            }),
            DateCreated: new DynamicLabel({
                label: 'Date Created',
                value: this.caseloadscriptgoal && this.caseloadscriptgoal.DateCreated || null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: InputTypes.Datepicker,
                    scale: null,
                }),
            }),
            DateModified: new DynamicLabel({
                label: 'Date Modified',
                value: this.caseloadscriptgoal && this.caseloadscriptgoal.DateModified || null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: InputTypes.Datepicker,
                    scale: null,
                }),
            }),
            GoalId: new DynamicLabel({
                label: 'Goal',
                value: getMetaItemValue(this.goals as unknown as IMetaItem[], this.caseloadscriptgoal && this.caseloadscriptgoal.hasOwnProperty('GoalId') ? this.caseloadscriptgoal.GoalId : null) ?? '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
            }),
            MedicationName: new DynamicLabel({
                label: 'Medication Name',
                value: this.caseloadscriptgoal && this.caseloadscriptgoal.hasOwnProperty('MedicationName') && this.caseloadscriptgoal.MedicationName != null ? this.caseloadscriptgoal.MedicationName.toString() : '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: null,
                    scale: null,
                }),
            }),
            ModifiedById: new DynamicLabel({
                label: 'Modified By',
                value: getMetaItemValue(this.modifiedBies as unknown as IMetaItem[], this.caseloadscriptgoal && this.caseloadscriptgoal.hasOwnProperty('ModifiedById') ? this.caseloadscriptgoal.ModifiedById : null) ?? '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
            }),
        };

    }
}
