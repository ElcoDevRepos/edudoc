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
import { IActivitySummaryProvider } from '../interfaces/activity-summary-provider';
import { IActivitySummaryServiceArea } from '../interfaces/activity-summary-service-area';
import { IProvider } from '../interfaces/provider';

export interface IActivitySummaryProviderDynamicControlsParameters {
    formGroup?: string;
    providers?: IProvider[];
    activitySummaryServiceAreas?: IActivitySummaryServiceArea[];
}

export class ActivitySummaryProviderDynamicControls {

    formGroup: string;
    providers?: IProvider[];
    activitySummaryServiceAreas?: IActivitySummaryServiceArea[];

    Form: IExpandableObject;
    View: IExpandableObject;

    constructor(private activitysummaryprovider?: IActivitySummaryProvider, additionalParameters?: IActivitySummaryProviderDynamicControlsParameters) {
        this.formGroup = additionalParameters && additionalParameters.formGroup || 'ActivitySummaryProvider';
        this.providers = additionalParameters && additionalParameters.providers || undefined;
        this.activitySummaryServiceAreas = additionalParameters && additionalParameters.activitySummaryServiceAreas || undefined;

        this.Form = {
            ActivitySummaryServiceAreaId: new DynamicField({
                formGroup: this.formGroup,
                label: 'Activity Summary Service Area',
                name: 'ActivitySummaryServiceAreaId',
                options: this.activitySummaryServiceAreas,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
                validation: [  ],
                validators: {  },
                value: this.activitysummaryprovider && this.activitysummaryprovider.ActivitySummaryServiceAreaId || null,
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
                value: this.activitysummaryprovider && this.activitysummaryprovider.CreatedById || 1,
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
                value: this.activitysummaryprovider && this.activitysummaryprovider.DateCreated || null,
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
                value: this.activitysummaryprovider && this.activitysummaryprovider.EncountersReturned || 0,
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
                value: this.activitysummaryprovider && this.activitysummaryprovider.PendingEvaluations || 0,
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
                value: this.activitysummaryprovider && this.activitysummaryprovider.PendingSupervisorCoSign || 0,
            }),
            ProviderId: new DynamicField({
                formGroup: this.formGroup,
                label: 'Provider',
                name: 'ProviderId',
                options: this.providers,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
                validation: [ noZeroRequiredValidator ],
                validators: { 'required': true },
                value: this.activitysummaryprovider && this.activitysummaryprovider.ProviderId || null,
            }),
            ProviderName: new DynamicField({
                formGroup: this.formGroup,
                label: 'Provider Name',
                name: 'ProviderName',
                options: null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: null,
                    scale: null,
                }),
                validation: [ Validators.required, Validators.maxLength(250) ],
                validators: { 'required': true, 'maxlength': 250 },
                value: this.activitysummaryprovider && this.activitysummaryprovider.hasOwnProperty('ProviderName') && this.activitysummaryprovider.ProviderName != null ? this.activitysummaryprovider.ProviderName.toString() : '',
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
                value: this.activitysummaryprovider && this.activitysummaryprovider.ReferralsPending || 0,
            }),
        };

        this.View = {
            ActivitySummaryServiceAreaId: new DynamicLabel({
                label: 'Activity Summary Service Area',
                value: getMetaItemValue(this.activitySummaryServiceAreas as unknown as IMetaItem[], this.activitysummaryprovider && this.activitysummaryprovider.hasOwnProperty('ActivitySummaryServiceAreaId') ? this.activitysummaryprovider.ActivitySummaryServiceAreaId : null) ?? '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
            }),
            CreatedById: new DynamicLabel({
                label: 'Created By',
                value: this.activitysummaryprovider && this.activitysummaryprovider.CreatedById || 1,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Numeric,
                    inputType: NumericInputTypes.Integer,
                    scale: null,
                }),
            }),
            DateCreated: new DynamicLabel({
                label: 'Date Created',
                value: this.activitysummaryprovider && this.activitysummaryprovider.DateCreated || null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: InputTypes.Datepicker,
                    scale: null,
                }),
            }),
            EncountersReturned: new DynamicLabel({
                label: 'Encounters Returned',
                value: this.activitysummaryprovider && this.activitysummaryprovider.EncountersReturned || 0,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Numeric,
                    inputType: NumericInputTypes.Integer,
                    scale: null,
                }),
            }),
            PendingEvaluations: new DynamicLabel({
                label: 'Pending Evaluations',
                value: this.activitysummaryprovider && this.activitysummaryprovider.PendingEvaluations || 0,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Numeric,
                    inputType: NumericInputTypes.Integer,
                    scale: null,
                }),
            }),
            PendingSupervisorCoSign: new DynamicLabel({
                label: 'Pending Supervisor Co Sign',
                value: this.activitysummaryprovider && this.activitysummaryprovider.PendingSupervisorCoSign || 0,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Numeric,
                    inputType: NumericInputTypes.Integer,
                    scale: null,
                }),
            }),
            ProviderId: new DynamicLabel({
                label: 'Provider',
                value: getMetaItemValue(this.providers as unknown as IMetaItem[], this.activitysummaryprovider && this.activitysummaryprovider.hasOwnProperty('ProviderId') ? this.activitysummaryprovider.ProviderId : null) ?? '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
            }),
            ProviderName: new DynamicLabel({
                label: 'Provider Name',
                value: this.activitysummaryprovider && this.activitysummaryprovider.hasOwnProperty('ProviderName') && this.activitysummaryprovider.ProviderName != null ? this.activitysummaryprovider.ProviderName.toString() : '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: null,
                    scale: null,
                }),
            }),
            ReferralsPending: new DynamicLabel({
                label: 'Referrals Pending',
                value: this.activitysummaryprovider && this.activitysummaryprovider.ReferralsPending || 0,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Numeric,
                    inputType: NumericInputTypes.Integer,
                    scale: null,
                }),
            }),
        };

    }
}
