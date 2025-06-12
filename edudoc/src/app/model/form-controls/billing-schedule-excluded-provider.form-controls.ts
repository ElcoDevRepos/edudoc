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
import { IBillingScheduleExcludedProvider } from '../interfaces/billing-schedule-excluded-provider';
import { IBillingSchedule } from '../interfaces/billing-schedule';
import { IProvider } from '../interfaces/provider';

export interface IBillingScheduleExcludedProviderDynamicControlsParameters {
    formGroup?: string;
    providers?: IProvider[];
    billingSchedules?: IBillingSchedule[];
}

export class BillingScheduleExcludedProviderDynamicControls {

    formGroup: string;
    providers?: IProvider[];
    billingSchedules?: IBillingSchedule[];

    Form: IExpandableObject;
    View: IExpandableObject;

    constructor(private billingscheduleexcludedprovider?: IBillingScheduleExcludedProvider, additionalParameters?: IBillingScheduleExcludedProviderDynamicControlsParameters) {
        this.formGroup = additionalParameters && additionalParameters.formGroup || 'BillingScheduleExcludedProvider';
        this.providers = additionalParameters && additionalParameters.providers || undefined;
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
                value: this.billingscheduleexcludedprovider && this.billingscheduleexcludedprovider.BillingScheduleId || null,
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
                value: this.billingscheduleexcludedprovider && this.billingscheduleexcludedprovider.CreatedById || 1,
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
                value: this.billingscheduleexcludedprovider && this.billingscheduleexcludedprovider.DateCreated || null,
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
                value: this.billingscheduleexcludedprovider && this.billingscheduleexcludedprovider.ProviderId || null,
            }),
        };

        this.View = {
            BillingScheduleId: new DynamicLabel({
                label: 'Billing Schedule',
                value: getMetaItemValue(this.billingSchedules as unknown as IMetaItem[], this.billingscheduleexcludedprovider && this.billingscheduleexcludedprovider.hasOwnProperty('BillingScheduleId') ? this.billingscheduleexcludedprovider.BillingScheduleId : null) ?? '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
            }),
            CreatedById: new DynamicLabel({
                label: 'Created By',
                value: this.billingscheduleexcludedprovider && this.billingscheduleexcludedprovider.CreatedById || 1,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Numeric,
                    inputType: NumericInputTypes.Integer,
                    scale: null,
                }),
            }),
            DateCreated: new DynamicLabel({
                label: 'Date Created',
                value: this.billingscheduleexcludedprovider && this.billingscheduleexcludedprovider.DateCreated || null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: InputTypes.Datepicker,
                    scale: null,
                }),
            }),
            ProviderId: new DynamicLabel({
                label: 'Provider',
                value: getMetaItemValue(this.providers as unknown as IMetaItem[], this.billingscheduleexcludedprovider && this.billingscheduleexcludedprovider.hasOwnProperty('ProviderId') ? this.billingscheduleexcludedprovider.ProviderId : null) ?? '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
            }),
        };

    }
}
