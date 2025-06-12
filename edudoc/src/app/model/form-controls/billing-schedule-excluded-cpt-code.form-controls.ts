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
import { IBillingScheduleExcludedCptCode } from '../interfaces/billing-schedule-excluded-cpt-code';
import { IBillingSchedule } from '../interfaces/billing-schedule';
import { ICptCode } from '../interfaces/cpt-code';

export interface IBillingScheduleExcludedCptCodeDynamicControlsParameters {
    formGroup?: string;
    cptCodes?: ICptCode[];
    billingSchedules?: IBillingSchedule[];
}

export class BillingScheduleExcludedCptCodeDynamicControls {

    formGroup: string;
    cptCodes?: ICptCode[];
    billingSchedules?: IBillingSchedule[];

    Form: IExpandableObject;
    View: IExpandableObject;

    constructor(private billingscheduleexcludedcptcode?: IBillingScheduleExcludedCptCode, additionalParameters?: IBillingScheduleExcludedCptCodeDynamicControlsParameters) {
        this.formGroup = additionalParameters && additionalParameters.formGroup || 'BillingScheduleExcludedCptCode';
        this.cptCodes = additionalParameters && additionalParameters.cptCodes || undefined;
        this.billingSchedules = additionalParameters && additionalParameters.billingSchedules || undefined;

        this.Form = {
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
                validation: [ noZeroRequiredValidator ],
                validators: { 'required': true },
                value: this.billingscheduleexcludedcptcode && this.billingscheduleexcludedcptcode.BillingScheduleId || null,
            }),
            CptCodeId: new DynamicField({
                formGroup: this.formGroup,
                label: 'Cpt Code',
                name: 'CptCodeId',
                options: this.cptCodes,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
                validation: [ noZeroRequiredValidator ],
                validators: { 'required': true },
                value: this.billingscheduleexcludedcptcode && this.billingscheduleexcludedcptcode.CptCodeId || null,
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
                value: this.billingscheduleexcludedcptcode && this.billingscheduleexcludedcptcode.CreatedById || 1,
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
                value: this.billingscheduleexcludedcptcode && this.billingscheduleexcludedcptcode.DateCreated || null,
            }),
        };

        this.View = {
            BillingScheduleId: new DynamicLabel({
                label: 'Billing Schedule',
                value: getMetaItemValue(this.billingSchedules as unknown as IMetaItem[], this.billingscheduleexcludedcptcode && this.billingscheduleexcludedcptcode.hasOwnProperty('BillingScheduleId') ? this.billingscheduleexcludedcptcode.BillingScheduleId : null) ?? '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
            }),
            CptCodeId: new DynamicLabel({
                label: 'Cpt Code',
                value: getMetaItemValue(this.cptCodes as unknown as IMetaItem[], this.billingscheduleexcludedcptcode && this.billingscheduleexcludedcptcode.hasOwnProperty('CptCodeId') ? this.billingscheduleexcludedcptcode.CptCodeId : null) ?? '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
            }),
            CreatedById: new DynamicLabel({
                label: 'Created By',
                value: this.billingscheduleexcludedcptcode && this.billingscheduleexcludedcptcode.CreatedById || 1,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Numeric,
                    inputType: NumericInputTypes.Integer,
                    scale: null,
                }),
            }),
            DateCreated: new DynamicLabel({
                label: 'Date Created',
                value: this.billingscheduleexcludedcptcode && this.billingscheduleexcludedcptcode.DateCreated || null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: InputTypes.Datepicker,
                    scale: null,
                }),
            }),
        };

    }
}
