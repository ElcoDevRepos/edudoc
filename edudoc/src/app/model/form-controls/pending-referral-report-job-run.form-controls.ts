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
import { IPendingReferralReportJobRun } from '../interfaces/pending-referral-report-job-run';

export interface IPendingReferralReportJobRunDynamicControlsParameters {
    formGroup?: string;
}

export class PendingReferralReportJobRunDynamicControls {

    formGroup: string;

    Form: IExpandableObject;
    View: IExpandableObject;

    constructor(private pendingreferralreportjobrun?: IPendingReferralReportJobRun, additionalParameters?: IPendingReferralReportJobRunDynamicControlsParameters) {
        this.formGroup = additionalParameters && additionalParameters.formGroup || 'PendingReferralReportJobRun';

        this.Form = {
            JobRunById: new DynamicField({
                formGroup: this.formGroup,
                label: 'Job Run By',
                name: 'JobRunById',
                options: null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Numeric,
                    inputType: NumericInputTypes.Integer,
                    scale: null,
                }),
                validation: [  ],
                validators: {  },
                value: this.pendingreferralreportjobrun && this.pendingreferralreportjobrun.JobRunById || 1,
            }),
            JobRunDate: new DynamicField({
                formGroup: this.formGroup,
                label: 'Job Run Date',
                name: 'JobRunDate',
                options: null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: InputTypes.Datepicker,
                    scale: null,
                }),
                validation: [  ],
                validators: {  },
                value: this.pendingreferralreportjobrun && this.pendingreferralreportjobrun.JobRunDate || null,
            }),
        };

        this.View = {
            JobRunById: new DynamicLabel({
                label: 'Job Run By',
                value: this.pendingreferralreportjobrun && this.pendingreferralreportjobrun.JobRunById || 1,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Numeric,
                    inputType: NumericInputTypes.Integer,
                    scale: null,
                }),
            }),
            JobRunDate: new DynamicLabel({
                label: 'Job Run Date',
                value: this.pendingreferralreportjobrun && this.pendingreferralreportjobrun.JobRunDate || null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: InputTypes.Datepicker,
                    scale: null,
                }),
            }),
        };

    }
}
