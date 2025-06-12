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
import { IActivitySummaryDistrict } from '../interfaces/activity-summary-district';
import { IActivitySummary } from '../interfaces/activity-summary';
import { ISchoolDistrict } from '../interfaces/school-district';

export interface IActivitySummaryDistrictDynamicControlsParameters {
    formGroup?: string;
    districts?: ISchoolDistrict[];
    activitySummaries?: IActivitySummary[];
}

export class ActivitySummaryDistrictDynamicControls {

    formGroup: string;
    districts?: ISchoolDistrict[];
    activitySummaries?: IActivitySummary[];

    Form: IExpandableObject;
    View: IExpandableObject;

    constructor(private activitysummarydistrict?: IActivitySummaryDistrict, additionalParameters?: IActivitySummaryDistrictDynamicControlsParameters) {
        this.formGroup = additionalParameters && additionalParameters.formGroup || 'ActivitySummaryDistrict';
        this.districts = additionalParameters && additionalParameters.districts || undefined;
        this.activitySummaries = additionalParameters && additionalParameters.activitySummaries || undefined;

        this.Form = {
            ActivitySummaryId: new DynamicField({
                formGroup: this.formGroup,
                label: 'Activity Summary',
                name: 'ActivitySummaryId',
                options: this.activitySummaries,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
                validation: [  ],
                validators: {  },
                value: this.activitysummarydistrict && this.activitysummarydistrict.ActivitySummaryId || null,
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
                value: this.activitysummarydistrict && this.activitysummarydistrict.CreatedById || 1,
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
                value: this.activitysummarydistrict && this.activitysummarydistrict.DateCreated || null,
            }),
            DistrictId: new DynamicField({
                formGroup: this.formGroup,
                label: 'District',
                name: 'DistrictId',
                options: this.districts,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
                validation: [ noZeroRequiredValidator ],
                validators: { 'required': true },
                value: this.activitysummarydistrict && this.activitysummarydistrict.DistrictId || null,
            }),
            EncountersReadyForScheduling: new DynamicField({
                formGroup: this.formGroup,
                label: 'Encounters Ready For Scheduling',
                name: 'EncountersReadyForScheduling',
                options: null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Numeric,
                    inputType: NumericInputTypes.Integer,
                    scale: null,
                }),
                validation: [  ],
                validators: {  },
                value: this.activitysummarydistrict && this.activitysummarydistrict.EncountersReadyForScheduling || 0,
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
                value: this.activitysummarydistrict && this.activitysummarydistrict.EncountersReturned || 0,
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
                value: this.activitysummarydistrict && this.activitysummarydistrict.PendingEvaluations || 0,
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
                value: this.activitysummarydistrict && this.activitysummarydistrict.PendingSupervisorCoSign || 0,
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
                value: this.activitysummarydistrict && this.activitysummarydistrict.ReferralsPending || 0,
            }),
        };

        this.View = {
            ActivitySummaryId: new DynamicLabel({
                label: 'Activity Summary',
                value: getMetaItemValue(this.activitySummaries as unknown as IMetaItem[], this.activitysummarydistrict && this.activitysummarydistrict.hasOwnProperty('ActivitySummaryId') ? this.activitysummarydistrict.ActivitySummaryId : null) ?? '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
            }),
            CreatedById: new DynamicLabel({
                label: 'Created By',
                value: this.activitysummarydistrict && this.activitysummarydistrict.CreatedById || 1,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Numeric,
                    inputType: NumericInputTypes.Integer,
                    scale: null,
                }),
            }),
            DateCreated: new DynamicLabel({
                label: 'Date Created',
                value: this.activitysummarydistrict && this.activitysummarydistrict.DateCreated || null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: InputTypes.Datepicker,
                    scale: null,
                }),
            }),
            DistrictId: new DynamicLabel({
                label: 'District',
                value: getMetaItemValue(this.districts as unknown as IMetaItem[], this.activitysummarydistrict && this.activitysummarydistrict.hasOwnProperty('DistrictId') ? this.activitysummarydistrict.DistrictId : null) ?? '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
            }),
            EncountersReadyForScheduling: new DynamicLabel({
                label: 'Encounters Ready For Scheduling',
                value: this.activitysummarydistrict && this.activitysummarydistrict.EncountersReadyForScheduling || 0,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Numeric,
                    inputType: NumericInputTypes.Integer,
                    scale: null,
                }),
            }),
            EncountersReturned: new DynamicLabel({
                label: 'Encounters Returned',
                value: this.activitysummarydistrict && this.activitysummarydistrict.EncountersReturned || 0,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Numeric,
                    inputType: NumericInputTypes.Integer,
                    scale: null,
                }),
            }),
            PendingEvaluations: new DynamicLabel({
                label: 'Pending Evaluations',
                value: this.activitysummarydistrict && this.activitysummarydistrict.PendingEvaluations || 0,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Numeric,
                    inputType: NumericInputTypes.Integer,
                    scale: null,
                }),
            }),
            PendingSupervisorCoSign: new DynamicLabel({
                label: 'Pending Supervisor Co Sign',
                value: this.activitysummarydistrict && this.activitysummarydistrict.PendingSupervisorCoSign || 0,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Numeric,
                    inputType: NumericInputTypes.Integer,
                    scale: null,
                }),
            }),
            ReferralsPending: new DynamicLabel({
                label: 'Referrals Pending',
                value: this.activitysummarydistrict && this.activitysummarydistrict.ReferralsPending || 0,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Numeric,
                    inputType: NumericInputTypes.Integer,
                    scale: null,
                }),
            }),
        };

    }
}
