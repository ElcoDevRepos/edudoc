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
import { IBillingFailure } from '../interfaces/billing-failure';
import { IBillingFailureReason } from '../interfaces/billing-failure-reason';
import { IBillingSchedule } from '../interfaces/billing-schedule';
import { IEncounterStudent } from '../interfaces/encounter-student';

export interface IBillingFailureDynamicControlsParameters {
    formGroup?: string;
    encounterStudents?: IEncounterStudent[];
    billingFailureReasons?: IBillingFailureReason[];
    billingSchedules?: IBillingSchedule[];
}

export class BillingFailureDynamicControls {

    formGroup: string;
    encounterStudents?: IEncounterStudent[];
    billingFailureReasons?: IBillingFailureReason[];
    billingSchedules?: IBillingSchedule[];

    Form: IExpandableObject;
    View: IExpandableObject;

    constructor(private billingfailure?: IBillingFailure, additionalParameters?: IBillingFailureDynamicControlsParameters) {
        this.formGroup = additionalParameters && additionalParameters.formGroup || 'BillingFailure';
        this.encounterStudents = additionalParameters && additionalParameters.encounterStudents || undefined;
        this.billingFailureReasons = additionalParameters && additionalParameters.billingFailureReasons || undefined;
        this.billingSchedules = additionalParameters && additionalParameters.billingSchedules || undefined;

        this.Form = {
            BillingFailureReasonId: new DynamicField({
                formGroup: this.formGroup,
                label: 'Billing Failure Reason',
                name: 'BillingFailureReasonId',
                options: this.billingFailureReasons,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
                validation: [ noZeroRequiredValidator ],
                validators: { 'required': true },
                value: this.billingfailure && this.billingfailure.BillingFailureReasonId || null,
            }),
            BillingScheduleId: new DynamicField({
                formGroup: this.formGroup,
                label: 'Billing Schedule',
                name: 'BillingScheduleId',
                options: this.billingSchedules,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
                validation: [  ],
                validators: {  },
                value: this.billingfailure && this.billingfailure.BillingScheduleId || null,
            }),
            DateOfFailure: new DynamicField({
                formGroup: this.formGroup,
                label: 'Date Of Failure',
                name: 'DateOfFailure',
                options: null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: InputTypes.Datepicker,
                    scale: null,
                }),
                validation: [  ],
                validators: {  },
                value: this.billingfailure && this.billingfailure.DateOfFailure || null,
            }),
            DateResolved: new DynamicField({
                formGroup: this.formGroup,
                label: 'Date Resolved',
                name: 'DateResolved',
                options: null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: InputTypes.Datepicker,
                    scale: null,
                }),
                validation: [  ],
                validators: {  },
                value: this.billingfailure && this.billingfailure.DateResolved || null,
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
                value: this.billingfailure && this.billingfailure.EncounterStudentId || null,
            }),
            IssueResolved: new DynamicField({
                formGroup: this.formGroup,
                label: 'Issue Resolved',
                name: 'IssueResolved',
                options: null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Checkbox,
                    inputType: null,
                    scale: null,
                }),
                validation: [  ],
                validators: {  },
                value: this.billingfailure && this.billingfailure.hasOwnProperty('IssueResolved') && this.billingfailure.IssueResolved != null ? this.billingfailure.IssueResolved : false,
            }),
            ResolvedById: new DynamicField({
                formGroup: this.formGroup,
                label: 'Resolved By',
                name: 'ResolvedById',
                options: null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Numeric,
                    inputType: NumericInputTypes.Integer,
                    scale: null,
                }),
                validation: [  ],
                validators: {  },
                value: this.billingfailure && this.billingfailure.ResolvedById || null,
            }),
        };

        this.View = {
            BillingFailureReasonId: new DynamicLabel({
                label: 'Billing Failure Reason',
                value: getMetaItemValue(this.billingFailureReasons as unknown as IMetaItem[], this.billingfailure && this.billingfailure.hasOwnProperty('BillingFailureReasonId') ? this.billingfailure.BillingFailureReasonId : null) ?? '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
            }),
            BillingScheduleId: new DynamicLabel({
                label: 'Billing Schedule',
                value: getMetaItemValue(this.billingSchedules as unknown as IMetaItem[], this.billingfailure && this.billingfailure.hasOwnProperty('BillingScheduleId') ? this.billingfailure.BillingScheduleId : null) ?? '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
            }),
            DateOfFailure: new DynamicLabel({
                label: 'Date Of Failure',
                value: this.billingfailure && this.billingfailure.DateOfFailure || null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: InputTypes.Datepicker,
                    scale: null,
                }),
            }),
            DateResolved: new DynamicLabel({
                label: 'Date Resolved',
                value: this.billingfailure && this.billingfailure.DateResolved || null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: InputTypes.Datepicker,
                    scale: null,
                }),
            }),
            EncounterStudentId: new DynamicLabel({
                label: 'Encounter Student',
                value: getMetaItemValue(this.encounterStudents as unknown as IMetaItem[], this.billingfailure && this.billingfailure.hasOwnProperty('EncounterStudentId') ? this.billingfailure.EncounterStudentId : null) ?? '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
            }),
            IssueResolved: new DynamicLabel({
                label: 'Issue Resolved',
                value: this.billingfailure && this.billingfailure.hasOwnProperty('IssueResolved') && this.billingfailure.IssueResolved != null ? this.billingfailure.IssueResolved : false,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Checkbox,
                    inputType: null,
                    scale: null,
                }),
            }),
            ResolvedById: new DynamicLabel({
                label: 'Resolved By',
                value: this.billingfailure && this.billingfailure.ResolvedById || null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Numeric,
                    inputType: NumericInputTypes.Integer,
                    scale: null,
                }),
            }),
        };

    }
}
