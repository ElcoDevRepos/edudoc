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

import { IExpandableObject } from '../expandable-object';
import { IActivitySummary } from '../interfaces/activity-summary';

export interface IActivitySummaryDynamicControlsParameters {
    formGroup?: string;
}

export class ActivitySummaryDynamicControls {

    formGroup: string;

    Form: IExpandableObject;
    View: IExpandableObject;

    constructor(private activitysummary?: IActivitySummary, additionalParameters?: IActivitySummaryDynamicControlsParameters) {
        this.formGroup = additionalParameters && additionalParameters.formGroup || 'ActivitySummary';

        this.Form = {
            CreatedById: new DynamicField({
                formGroup: this.formGroup,
                label: 'Created By',
                name: 'CreatedById',
                options: null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Numeric,
                    inputType: NumericInputTypes.Integer,
                    scale: null,
                }),
                validation: [  ],
                validators: {  },
                value: this.activitysummary && this.activitysummary.CreatedById || 1,
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
                value: this.activitysummary && this.activitysummary.DateCreated || null,
            }),
            EncountersReturned: new DynamicField({
                formGroup: this.formGroup,
                label: 'Encounters Returned',
                name: 'EncountersReturned',
                options: null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Numeric,
                    inputType: NumericInputTypes.Integer,
                    scale: null,
                }),
                validation: [  ],
                validators: {  },
                value: this.activitysummary && this.activitysummary.EncountersReturned || 0,
            }),
            PendingEvaluations: new DynamicField({
                formGroup: this.formGroup,
                label: 'Pending Evaluations',
                name: 'PendingEvaluations',
                options: null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Numeric,
                    inputType: NumericInputTypes.Integer,
                    scale: null,
                }),
                validation: [  ],
                validators: {  },
                value: this.activitysummary && this.activitysummary.PendingEvaluations || 0,
            }),
            PendingSupervisorCoSign: new DynamicField({
                formGroup: this.formGroup,
                label: 'Pending Supervisor Co Sign',
                name: 'PendingSupervisorCoSign',
                options: null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Numeric,
                    inputType: NumericInputTypes.Integer,
                    scale: null,
                }),
                validation: [  ],
                validators: {  },
                value: this.activitysummary && this.activitysummary.PendingSupervisorCoSign || 0,
            }),
            ReferralsPending: new DynamicField({
                formGroup: this.formGroup,
                label: 'Referrals Pending',
                name: 'ReferralsPending',
                options: null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Numeric,
                    inputType: NumericInputTypes.Integer,
                    scale: null,
                }),
                validation: [  ],
                validators: {  },
                value: this.activitysummary && this.activitysummary.ReferralsPending || 0,
            }),
        };

        this.View = {
            CreatedById: new DynamicLabel({
                label: 'Created By',
                value: this.activitysummary && this.activitysummary.CreatedById || 1,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Numeric,
                    inputType: NumericInputTypes.Integer,
                    scale: null,
                }),
            }),
            DateCreated: new DynamicLabel({
                label: 'Date Created',
                value: this.activitysummary && this.activitysummary.DateCreated || null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: InputTypes.Datepicker,
                    scale: null,
                }),
            }),
            EncountersReturned: new DynamicLabel({
                label: 'Encounters Returned',
                value: this.activitysummary && this.activitysummary.EncountersReturned || 0,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Numeric,
                    inputType: NumericInputTypes.Integer,
                    scale: null,
                }),
            }),
            PendingEvaluations: new DynamicLabel({
                label: 'Pending Evaluations',
                value: this.activitysummary && this.activitysummary.PendingEvaluations || 0,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Numeric,
                    inputType: NumericInputTypes.Integer,
                    scale: null,
                }),
            }),
            PendingSupervisorCoSign: new DynamicLabel({
                label: 'Pending Supervisor Co Sign',
                value: this.activitysummary && this.activitysummary.PendingSupervisorCoSign || 0,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Numeric,
                    inputType: NumericInputTypes.Integer,
                    scale: null,
                }),
            }),
            ReferralsPending: new DynamicLabel({
                label: 'Referrals Pending',
                value: this.activitysummary && this.activitysummary.ReferralsPending || 0,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Numeric,
                    inputType: NumericInputTypes.Integer,
                    scale: null,
                }),
            }),
        };

    }
}
