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
import { IActivitySummaryServiceArea } from '../interfaces/activity-summary-service-area';
import { IActivitySummaryDistrict } from '../interfaces/activity-summary-district';

export interface IActivitySummaryServiceAreaDynamicControlsParameters {
    formGroup?: string;
    activitySummaryDistricts?: IActivitySummaryDistrict[];
}

export class ActivitySummaryServiceAreaDynamicControls {

    formGroup: string;
    activitySummaryDistricts?: IActivitySummaryDistrict[];

    Form: IExpandableObject;
    View: IExpandableObject;

    constructor(private activitysummaryservicearea?: IActivitySummaryServiceArea, additionalParameters?: IActivitySummaryServiceAreaDynamicControlsParameters) {
        this.formGroup = additionalParameters && additionalParameters.formGroup || 'ActivitySummaryServiceArea';
        this.activitySummaryDistricts = additionalParameters && additionalParameters.activitySummaryDistricts || undefined;

        this.Form = {
            ActivitySummaryDistrictId: new DynamicField({
                formGroup: this.formGroup,
                label: 'Activity Summary District',
                name: 'ActivitySummaryDistrictId',
                options: this.activitySummaryDistricts,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
                validation: [  ],
                validators: {  },
                value: this.activitysummaryservicearea && this.activitysummaryservicearea.ActivitySummaryDistrictId || null,
            }),
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
                value: this.activitysummaryservicearea && this.activitysummaryservicearea.CreatedById || 1,
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
                value: this.activitysummaryservicearea && this.activitysummaryservicearea.DateCreated || null,
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
                value: this.activitysummaryservicearea && this.activitysummaryservicearea.EncountersReturned || 0,
            }),
            OpenScheduledEncounters: new DynamicField({
                formGroup: this.formGroup,
                label: 'Open Scheduled Encounters',
                name: 'OpenScheduledEncounters',
                options: null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Numeric,
                    inputType: NumericInputTypes.Integer,
                    scale: null,
                }),
                validation: [  ],
                validators: {  },
                value: this.activitysummaryservicearea && this.activitysummaryservicearea.OpenScheduledEncounters || 0,
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
                value: this.activitysummaryservicearea && this.activitysummaryservicearea.PendingEvaluations || 0,
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
                value: this.activitysummaryservicearea && this.activitysummaryservicearea.PendingSupervisorCoSign || 0,
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
                value: this.activitysummaryservicearea && this.activitysummaryservicearea.ReferralsPending || 0,
            }),
            ServiceAreaId: new DynamicField({
                formGroup: this.formGroup,
                label: 'Service Area',
                name: 'ServiceAreaId',
                options: null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Numeric,
                    inputType: NumericInputTypes.Integer,
                    scale: null,
                }),
                validation: [ Validators.required ],
                validators: { 'required': true },
                value: this.activitysummaryservicearea && this.activitysummaryservicearea.ServiceAreaId || null,
            }),
        };

        this.View = {
            ActivitySummaryDistrictId: new DynamicLabel({
                label: 'Activity Summary District',
                value: getMetaItemValue(this.activitySummaryDistricts as unknown as IMetaItem[], this.activitysummaryservicearea && this.activitysummaryservicearea.hasOwnProperty('ActivitySummaryDistrictId') ? this.activitysummaryservicearea.ActivitySummaryDistrictId : null) ?? '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
            }),
            CreatedById: new DynamicLabel({
                label: 'Created By',
                value: this.activitysummaryservicearea && this.activitysummaryservicearea.CreatedById || 1,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Numeric,
                    inputType: NumericInputTypes.Integer,
                    scale: null,
                }),
            }),
            DateCreated: new DynamicLabel({
                label: 'Date Created',
                value: this.activitysummaryservicearea && this.activitysummaryservicearea.DateCreated || null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: InputTypes.Datepicker,
                    scale: null,
                }),
            }),
            EncountersReturned: new DynamicLabel({
                label: 'Encounters Returned',
                value: this.activitysummaryservicearea && this.activitysummaryservicearea.EncountersReturned || 0,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Numeric,
                    inputType: NumericInputTypes.Integer,
                    scale: null,
                }),
            }),
            OpenScheduledEncounters: new DynamicLabel({
                label: 'Open Scheduled Encounters',
                value: this.activitysummaryservicearea && this.activitysummaryservicearea.OpenScheduledEncounters || 0,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Numeric,
                    inputType: NumericInputTypes.Integer,
                    scale: null,
                }),
            }),
            PendingEvaluations: new DynamicLabel({
                label: 'Pending Evaluations',
                value: this.activitysummaryservicearea && this.activitysummaryservicearea.PendingEvaluations || 0,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Numeric,
                    inputType: NumericInputTypes.Integer,
                    scale: null,
                }),
            }),
            PendingSupervisorCoSign: new DynamicLabel({
                label: 'Pending Supervisor Co Sign',
                value: this.activitysummaryservicearea && this.activitysummaryservicearea.PendingSupervisorCoSign || 0,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Numeric,
                    inputType: NumericInputTypes.Integer,
                    scale: null,
                }),
            }),
            ReferralsPending: new DynamicLabel({
                label: 'Referrals Pending',
                value: this.activitysummaryservicearea && this.activitysummaryservicearea.ReferralsPending || 0,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Numeric,
                    inputType: NumericInputTypes.Integer,
                    scale: null,
                }),
            }),
            ServiceAreaId: new DynamicLabel({
                label: 'Service Area',
                value: this.activitysummaryservicearea && this.activitysummaryservicearea.ServiceAreaId || null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Numeric,
                    inputType: NumericInputTypes.Integer,
                    scale: null,
                }),
            }),
        };

    }
}
