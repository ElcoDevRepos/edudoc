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
import { IBillingScheduleDistrict } from '../interfaces/billing-schedule-district';
import { IBillingSchedule } from '../interfaces/billing-schedule';
import { ISchoolDistrict } from '../interfaces/school-district';

export interface IBillingScheduleDistrictDynamicControlsParameters {
    formGroup?: string;
    schoolDistricts?: ISchoolDistrict[];
    billingSchedules?: IBillingSchedule[];
}

export class BillingScheduleDistrictDynamicControls {

    formGroup: string;
    schoolDistricts?: ISchoolDistrict[];
    billingSchedules?: IBillingSchedule[];

    Form: IExpandableObject;
    View: IExpandableObject;

    constructor(private billingscheduledistrict?: IBillingScheduleDistrict, additionalParameters?: IBillingScheduleDistrictDynamicControlsParameters) {
        this.formGroup = additionalParameters && additionalParameters.formGroup || 'BillingScheduleDistrict';
        this.schoolDistricts = additionalParameters && additionalParameters.schoolDistricts || undefined;
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
                value: this.billingscheduledistrict && this.billingscheduledistrict.BillingScheduleId || null,
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
                value: this.billingscheduledistrict && this.billingscheduledistrict.CreatedById || 1,
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
                value: this.billingscheduledistrict && this.billingscheduledistrict.DateCreated || null,
            }),
            SchoolDistrictId: new DynamicField({
                formGroup: this.formGroup,
                label: 'School District',
                name: 'SchoolDistrictId',
                options: this.schoolDistricts,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
                validation: [ noZeroRequiredValidator ],
                validators: { 'required': true },
                value: this.billingscheduledistrict && this.billingscheduledistrict.SchoolDistrictId || null,
            }),
        };

        this.View = {
            BillingScheduleId: new DynamicLabel({
                label: 'Billing Schedule',
                value: getMetaItemValue(this.billingSchedules as unknown as IMetaItem[], this.billingscheduledistrict && this.billingscheduledistrict.hasOwnProperty('BillingScheduleId') ? this.billingscheduledistrict.BillingScheduleId : null) ?? '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
            }),
            CreatedById: new DynamicLabel({
                label: 'Created By',
                value: this.billingscheduledistrict && this.billingscheduledistrict.CreatedById || 1,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Numeric,
                    inputType: NumericInputTypes.Integer,
                    scale: null,
                }),
            }),
            DateCreated: new DynamicLabel({
                label: 'Date Created',
                value: this.billingscheduledistrict && this.billingscheduledistrict.DateCreated || null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: InputTypes.Datepicker,
                    scale: null,
                }),
            }),
            SchoolDistrictId: new DynamicLabel({
                label: 'School District',
                value: getMetaItemValue(this.schoolDistricts as unknown as IMetaItem[], this.billingscheduledistrict && this.billingscheduledistrict.hasOwnProperty('SchoolDistrictId') ? this.billingscheduledistrict.SchoolDistrictId : null) ?? '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
            }),
        };

    }
}
