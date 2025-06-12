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
import { ICaseLoadGoal } from '../interfaces/case-load-goal';
import { ICaseLoad } from '../interfaces/case-load';
import { IUser } from '../interfaces/user';
import { IGoal } from '../interfaces/goal';

export interface ICaseLoadGoalDynamicControlsParameters {
    formGroup?: string;
    caseLoads?: ICaseLoad[];
    goals?: IGoal[];
    createdBies?: IUser[];
    modifiedBies?: IUser[];
}

export class CaseLoadGoalDynamicControls {

    formGroup: string;
    caseLoads?: ICaseLoad[];
    goals?: IGoal[];
    createdBies?: IUser[];
    modifiedBies?: IUser[];

    Form: IExpandableObject;
    View: IExpandableObject;

    constructor(private caseloadgoal?: ICaseLoadGoal, additionalParameters?: ICaseLoadGoalDynamicControlsParameters) {
        this.formGroup = additionalParameters && additionalParameters.formGroup || 'CaseLoadGoal';
        this.caseLoads = additionalParameters && additionalParameters.caseLoads || undefined;
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
                value: this.caseloadgoal && this.caseloadgoal.hasOwnProperty('Archived') && this.caseloadgoal.Archived != null ? this.caseloadgoal.Archived : false,
            }),
            CaseLoadId: new DynamicField({
                formGroup: this.formGroup,
                label: 'Case Load',
                name: 'CaseLoadId',
                options: this.caseLoads,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
                validation: [ noZeroRequiredValidator ],
                validators: { 'required': true },
                value: this.caseloadgoal && this.caseloadgoal.CaseLoadId || null,
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
                value: this.caseloadgoal && this.caseloadgoal.CreatedById || 1,
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
                value: this.caseloadgoal && this.caseloadgoal.DateCreated || null,
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
                value: this.caseloadgoal && this.caseloadgoal.DateModified || null,
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
                value: this.caseloadgoal && this.caseloadgoal.GoalId || null,
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
                value: this.caseloadgoal && this.caseloadgoal.ModifiedById || null,
            }),
        };

        this.View = {
            Archived: new DynamicLabel({
                label: 'Archived',
                value: this.caseloadgoal && this.caseloadgoal.hasOwnProperty('Archived') && this.caseloadgoal.Archived != null ? this.caseloadgoal.Archived : false,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Checkbox,
                    inputType: null,
                    scale: null,
                }),
            }),
            CaseLoadId: new DynamicLabel({
                label: 'Case Load',
                value: getMetaItemValue(this.caseLoads as unknown as IMetaItem[], this.caseloadgoal && this.caseloadgoal.hasOwnProperty('CaseLoadId') ? this.caseloadgoal.CaseLoadId : null) ?? '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
            }),
            CreatedById: new DynamicLabel({
                label: 'Created By',
                value: getMetaItemValue(this.createdBies as unknown as IMetaItem[], this.caseloadgoal && this.caseloadgoal.hasOwnProperty('CreatedById') ? this.caseloadgoal.CreatedById : null) ?? '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
            }),
            DateCreated: new DynamicLabel({
                label: 'Date Created',
                value: this.caseloadgoal && this.caseloadgoal.DateCreated || null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: InputTypes.Datepicker,
                    scale: null,
                }),
            }),
            DateModified: new DynamicLabel({
                label: 'Date Modified',
                value: this.caseloadgoal && this.caseloadgoal.DateModified || null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: InputTypes.Datepicker,
                    scale: null,
                }),
            }),
            GoalId: new DynamicLabel({
                label: 'Goal',
                value: getMetaItemValue(this.goals as unknown as IMetaItem[], this.caseloadgoal && this.caseloadgoal.hasOwnProperty('GoalId') ? this.caseloadgoal.GoalId : null) ?? '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
            }),
            ModifiedById: new DynamicLabel({
                label: 'Modified By',
                value: getMetaItemValue(this.modifiedBies as unknown as IMetaItem[], this.caseloadgoal && this.caseloadgoal.hasOwnProperty('ModifiedById') ? this.caseloadgoal.ModifiedById : null) ?? '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
            }),
        };

    }
}
