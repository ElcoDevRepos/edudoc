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
import { IHealthCareClaim } from '../interfaces/health-care-claim';
import { IBillingSchedule } from '../interfaces/billing-schedule';

export interface IHealthCareClaimDynamicControlsParameters {
    formGroup?: string;
    billingSchedules?: IBillingSchedule[];
}

export class HealthCareClaimDynamicControls {

    formGroup: string;
    billingSchedules?: IBillingSchedule[];

    Form: IExpandableObject;
    View: IExpandableObject;

    constructor(private healthcareclaim?: IHealthCareClaim, additionalParameters?: IHealthCareClaimDynamicControlsParameters) {
        this.formGroup = additionalParameters && additionalParameters.formGroup || 'HealthCareClaim';
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
                validation: [  ],
                validators: {  },
                value: this.healthcareclaim && this.healthcareclaim.BillingScheduleId || null,
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
                value: this.healthcareclaim && this.healthcareclaim.DateCreated || null,
            }),
            PageCount: new DynamicField({
                formGroup: this.formGroup,
                label: 'Page Count',
                name: 'PageCount',
                options: null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Numeric,
                    inputType: NumericInputTypes.Integer,
                    scale: null,
                }),
                validation: [  ],
                validators: {  },
                value: this.healthcareclaim && this.healthcareclaim.PageCount || 1,
            }),
        };

        this.View = {
            BillingScheduleId: new DynamicLabel({
                label: 'Billing Schedule',
                value: getMetaItemValue(this.billingSchedules as unknown as IMetaItem[], this.healthcareclaim && this.healthcareclaim.hasOwnProperty('BillingScheduleId') ? this.healthcareclaim.BillingScheduleId : null) ?? '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
            }),
            DateCreated: new DynamicLabel({
                label: 'Date Created',
                value: this.healthcareclaim && this.healthcareclaim.DateCreated || null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: InputTypes.Datepicker,
                    scale: null,
                }),
            }),
            PageCount: new DynamicLabel({
                label: 'Page Count',
                value: this.healthcareclaim && this.healthcareclaim.PageCount || 1,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Numeric,
                    inputType: NumericInputTypes.Integer,
                    scale: null,
                }),
            }),
        };

    }
}
