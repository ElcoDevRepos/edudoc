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
import { IServiceOutcome } from '../interfaces/service-outcome';
import { IUser } from '../interfaces/user';
import { IGoal } from '../interfaces/goal';

export interface IServiceOutcomeDynamicControlsParameters {
    formGroup?: string;
    goals?: IGoal[];
    createdBies?: IUser[];
    modifiedBies?: IUser[];
}

export class ServiceOutcomeDynamicControls {

    formGroup: string;
    goals?: IGoal[];
    createdBies?: IUser[];
    modifiedBies?: IUser[];

    Form: IExpandableObject;
    View: IExpandableObject;

    constructor(private serviceoutcome?: IServiceOutcome, additionalParameters?: IServiceOutcomeDynamicControlsParameters) {
        this.formGroup = additionalParameters && additionalParameters.formGroup || 'ServiceOutcome';
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
                value: this.serviceoutcome && this.serviceoutcome.hasOwnProperty('Archived') && this.serviceoutcome.Archived != null ? this.serviceoutcome.Archived : false,
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
                value: this.serviceoutcome && this.serviceoutcome.CreatedById || null,
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
                value: this.serviceoutcome && this.serviceoutcome.DateCreated || null,
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
                value: this.serviceoutcome && this.serviceoutcome.DateModified || null,
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
                value: this.serviceoutcome && this.serviceoutcome.GoalId || null,
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
                value: this.serviceoutcome && this.serviceoutcome.ModifiedById || null,
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
                validation: [ Validators.required, Validators.maxLength(250) ],
                validators: { 'required': true, 'maxlength': 250 },
                value: this.serviceoutcome && this.serviceoutcome.hasOwnProperty('Notes') && this.serviceoutcome.Notes != null ? this.serviceoutcome.Notes.toString() : '',
            }),
        };

        this.View = {
            Archived: new DynamicLabel({
                label: 'Archived',
                value: this.serviceoutcome && this.serviceoutcome.hasOwnProperty('Archived') && this.serviceoutcome.Archived != null ? this.serviceoutcome.Archived : false,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Checkbox,
                    inputType: null,
                    scale: null,
                }),
            }),
            CreatedById: new DynamicLabel({
                label: 'Created By',
                value: getMetaItemValue(this.createdBies as unknown as IMetaItem[], this.serviceoutcome && this.serviceoutcome.hasOwnProperty('CreatedById') ? this.serviceoutcome.CreatedById : null) ?? '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
            }),
            DateCreated: new DynamicLabel({
                label: 'Date Created',
                value: this.serviceoutcome && this.serviceoutcome.DateCreated || null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: InputTypes.Datepicker,
                    scale: null,
                }),
            }),
            DateModified: new DynamicLabel({
                label: 'Date Modified',
                value: this.serviceoutcome && this.serviceoutcome.DateModified || null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: InputTypes.Datepicker,
                    scale: null,
                }),
            }),
            GoalId: new DynamicLabel({
                label: 'Goal',
                value: getMetaItemValue(this.goals as unknown as IMetaItem[], this.serviceoutcome && this.serviceoutcome.hasOwnProperty('GoalId') ? this.serviceoutcome.GoalId : null) ?? '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
            }),
            ModifiedById: new DynamicLabel({
                label: 'Modified By',
                value: getMetaItemValue(this.modifiedBies as unknown as IMetaItem[], this.serviceoutcome && this.serviceoutcome.hasOwnProperty('ModifiedById') ? this.serviceoutcome.ModifiedById : null) ?? '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
            }),
            Notes: new DynamicLabel({
                label: 'Notes',
                value: this.serviceoutcome && this.serviceoutcome.hasOwnProperty('Notes') && this.serviceoutcome.Notes != null ? this.serviceoutcome.Notes.toString() : '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: null,
                    scale: null,
                }),
            }),
        };

    }
}
