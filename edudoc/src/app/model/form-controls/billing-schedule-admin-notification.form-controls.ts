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
import { IBillingScheduleAdminNotification } from '../interfaces/billing-schedule-admin-notification';
import { IUser } from '../interfaces/user';
import { IBillingSchedule } from '../interfaces/billing-schedule';

export interface IBillingScheduleAdminNotificationDynamicControlsParameters {
    formGroup?: string;
    admins?: IUser[];
    billingSchedules?: IBillingSchedule[];
    createdBies?: IUser[];
}

export class BillingScheduleAdminNotificationDynamicControls {

    formGroup: string;
    admins?: IUser[];
    billingSchedules?: IBillingSchedule[];
    createdBies?: IUser[];

    Form: IExpandableObject;
    View: IExpandableObject;

    constructor(private billingscheduleadminnotification?: IBillingScheduleAdminNotification, additionalParameters?: IBillingScheduleAdminNotificationDynamicControlsParameters) {
        this.formGroup = additionalParameters && additionalParameters.formGroup || 'BillingScheduleAdminNotification';
        this.admins = additionalParameters && additionalParameters.admins || undefined;
        this.billingSchedules = additionalParameters && additionalParameters.billingSchedules || undefined;
        this.createdBies = additionalParameters && additionalParameters.createdBies || undefined;

        this.Form = {
            AdminId: new DynamicField({
                formGroup: this.formGroup,
                label: 'Admin',
                name: 'AdminId',
                options: this.admins,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
                validation: [ noZeroRequiredValidator ],
                validators: { 'required': true },
                value: this.billingscheduleadminnotification && this.billingscheduleadminnotification.AdminId || null,
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
                validation: [ noZeroRequiredValidator ],
                validators: { 'required': true },
                value: this.billingscheduleadminnotification && this.billingscheduleadminnotification.BillingScheduleId || null,
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
                value: this.billingscheduleadminnotification && this.billingscheduleadminnotification.CreatedById || 1,
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
                value: this.billingscheduleadminnotification && this.billingscheduleadminnotification.DateCreated || null,
            }),
        };

        this.View = {
            AdminId: new DynamicLabel({
                label: 'Admin',
                value: getMetaItemValue(this.admins as unknown as IMetaItem[], this.billingscheduleadminnotification && this.billingscheduleadminnotification.hasOwnProperty('AdminId') ? this.billingscheduleadminnotification.AdminId : null) ?? '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
            }),
            BillingScheduleId: new DynamicLabel({
                label: 'Billing Schedule',
                value: getMetaItemValue(this.billingSchedules as unknown as IMetaItem[], this.billingscheduleadminnotification && this.billingscheduleadminnotification.hasOwnProperty('BillingScheduleId') ? this.billingscheduleadminnotification.BillingScheduleId : null) ?? '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
            }),
            CreatedById: new DynamicLabel({
                label: 'Created By',
                value: getMetaItemValue(this.createdBies as unknown as IMetaItem[], this.billingscheduleadminnotification && this.billingscheduleadminnotification.hasOwnProperty('CreatedById') ? this.billingscheduleadminnotification.CreatedById : null) ?? '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
            }),
            DateCreated: new DynamicLabel({
                label: 'Date Created',
                value: this.billingscheduleadminnotification && this.billingscheduleadminnotification.DateCreated || null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: InputTypes.Datepicker,
                    scale: null,
                }),
            }),
        };

    }
}
