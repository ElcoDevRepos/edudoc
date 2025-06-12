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
import { IBillingScheduleExcludedServiceCode } from '../interfaces/billing-schedule-excluded-service-code';
import { IBillingSchedule } from '../interfaces/billing-schedule';
import { IServiceCode } from '../interfaces/service-code';

export interface IBillingScheduleExcludedServiceCodeDynamicControlsParameters {
    formGroup?: string;
    serviceCodes?: IServiceCode[];
    billingSchedules?: IBillingSchedule[];
}

export class BillingScheduleExcludedServiceCodeDynamicControls {

    formGroup: string;
    serviceCodes?: IServiceCode[];
    billingSchedules?: IBillingSchedule[];

    Form: IExpandableObject;
    View: IExpandableObject;

    constructor(private billingscheduleexcludedservicecode?: IBillingScheduleExcludedServiceCode, additionalParameters?: IBillingScheduleExcludedServiceCodeDynamicControlsParameters) {
        this.formGroup = additionalParameters && additionalParameters.formGroup || 'BillingScheduleExcludedServiceCode';
        this.serviceCodes = additionalParameters && additionalParameters.serviceCodes || undefined;
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
                value: this.billingscheduleexcludedservicecode && this.billingscheduleexcludedservicecode.BillingScheduleId || null,
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
                value: this.billingscheduleexcludedservicecode && this.billingscheduleexcludedservicecode.CreatedById || 1,
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
                value: this.billingscheduleexcludedservicecode && this.billingscheduleexcludedservicecode.DateCreated || null,
            }),
            ServiceCodeId: new DynamicField({
                formGroup: this.formGroup,
                label: 'Service Code',
                name: 'ServiceCodeId',
                options: this.serviceCodes,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
                validation: [ noZeroRequiredValidator ],
                validators: { 'required': true },
                value: this.billingscheduleexcludedservicecode && this.billingscheduleexcludedservicecode.ServiceCodeId || null,
            }),
        };

        this.View = {
            BillingScheduleId: new DynamicLabel({
                label: 'Billing Schedule',
                value: getMetaItemValue(this.billingSchedules as unknown as IMetaItem[], this.billingscheduleexcludedservicecode && this.billingscheduleexcludedservicecode.hasOwnProperty('BillingScheduleId') ? this.billingscheduleexcludedservicecode.BillingScheduleId : null) ?? '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
            }),
            CreatedById: new DynamicLabel({
                label: 'Created By',
                value: this.billingscheduleexcludedservicecode && this.billingscheduleexcludedservicecode.CreatedById || 1,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Numeric,
                    inputType: NumericInputTypes.Integer,
                    scale: null,
                }),
            }),
            DateCreated: new DynamicLabel({
                label: 'Date Created',
                value: this.billingscheduleexcludedservicecode && this.billingscheduleexcludedservicecode.DateCreated || null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: InputTypes.Datepicker,
                    scale: null,
                }),
            }),
            ServiceCodeId: new DynamicLabel({
                label: 'Service Code',
                value: getMetaItemValue(this.serviceCodes as unknown as IMetaItem[], this.billingscheduleexcludedservicecode && this.billingscheduleexcludedservicecode.hasOwnProperty('ServiceCodeId') ? this.billingscheduleexcludedservicecode.ServiceCodeId : null) ?? '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
            }),
        };

    }
}
