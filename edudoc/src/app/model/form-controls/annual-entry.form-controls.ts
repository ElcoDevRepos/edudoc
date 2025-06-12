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
import { IAnnualEntry } from '../interfaces/annual-entry';
import { ISchoolDistrict } from '../interfaces/school-district';
import { IAnnualEntryStatus } from '../interfaces/annual-entry-status';

export interface IAnnualEntryDynamicControlsParameters {
    formGroup?: string;
    statuses?: IAnnualEntryStatus[];
    schoolDistricts?: ISchoolDistrict[];
}

export class AnnualEntryDynamicControls {

    formGroup: string;
    statuses?: IAnnualEntryStatus[];
    schoolDistricts?: ISchoolDistrict[];

    Form: IExpandableObject;
    View: IExpandableObject;

    constructor(private annualentry?: IAnnualEntry, additionalParameters?: IAnnualEntryDynamicControlsParameters) {
        this.formGroup = additionalParameters && additionalParameters.formGroup || 'AnnualEntry';
        this.statuses = additionalParameters && additionalParameters.statuses || undefined;
        this.schoolDistricts = additionalParameters && additionalParameters.schoolDistricts || undefined;

        this.Form = {
            AllowableCosts: new DynamicField({
                formGroup: this.formGroup,
                label: 'Allowable Costs',
                name: 'AllowableCosts',
                options: null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: null,
                    scale: null,
                }),
                validation: [ Validators.required, Validators.maxLength(18) ],
                validators: { 'required': true, 'maxlength': 18 },
                value: this.annualentry && this.annualentry.hasOwnProperty('AllowableCosts') && this.annualentry.AllowableCosts != null ? this.annualentry.AllowableCosts.toString() : '',
            }),
            Archived: new DynamicField({
                formGroup: this.formGroup,
                label: 'Archived',
                name: 'Archived',
                options: null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Checkbox,
                    inputType: null,
                    scale: null,
                }),
                validation: [  ],
                validators: {  },
                value: this.annualentry && this.annualentry.hasOwnProperty('Archived') && this.annualentry.Archived != null ? this.annualentry.Archived : false,
            }),
            InterimPayments: new DynamicField({
                formGroup: this.formGroup,
                label: 'Interim Payments',
                name: 'InterimPayments',
                options: null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: null,
                    scale: null,
                }),
                validation: [ Validators.required, Validators.maxLength(18) ],
                validators: { 'required': true, 'maxlength': 18 },
                value: this.annualentry && this.annualentry.hasOwnProperty('InterimPayments') && this.annualentry.InterimPayments != null ? this.annualentry.InterimPayments.toString() : '',
            }),
            Mer: new DynamicField({
                formGroup: this.formGroup,
                label: 'Mer',
                name: 'Mer',
                options: null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: null,
                    scale: null,
                }),
                validation: [ Validators.maxLength(18) ],
                validators: { 'maxlength': 18 },
                value: this.annualentry && this.annualentry.hasOwnProperty('Mer') && this.annualentry.Mer != null ? this.annualentry.Mer.toString() : '',
            }),
            Rmts: new DynamicField({
                formGroup: this.formGroup,
                label: 'Rmts',
                name: 'Rmts',
                options: null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: null,
                    scale: null,
                }),
                validation: [ Validators.maxLength(18) ],
                validators: { 'maxlength': 18 },
                value: this.annualentry && this.annualentry.hasOwnProperty('Rmts') && this.annualentry.Rmts != null ? this.annualentry.Rmts.toString() : '',
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
                value: this.annualentry && this.annualentry.SchoolDistrictId || null,
            }),
            SettlementAmount: new DynamicField({
                formGroup: this.formGroup,
                label: 'Settlement Amount',
                name: 'SettlementAmount',
                options: null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: null,
                    scale: null,
                }),
                validation: [ Validators.required, Validators.maxLength(18) ],
                validators: { 'required': true, 'maxlength': 18 },
                value: this.annualentry && this.annualentry.hasOwnProperty('SettlementAmount') && this.annualentry.SettlementAmount != null ? this.annualentry.SettlementAmount.toString() : '',
            }),
            StatusId: new DynamicField({
                formGroup: this.formGroup,
                label: 'Status',
                name: 'StatusId',
                options: this.statuses,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
                validation: [ noZeroRequiredValidator ],
                validators: { 'required': true },
                value: this.annualentry && this.annualentry.StatusId || null,
            }),
            Year: new DynamicField({
                formGroup: this.formGroup,
                label: 'Year',
                name: 'Year',
                options: null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: null,
                    scale: null,
                }),
                validation: [ Validators.required, Validators.maxLength(4) ],
                validators: { 'required': true, 'maxlength': 4 },
                value: this.annualentry && this.annualentry.hasOwnProperty('Year') && this.annualentry.Year != null ? this.annualentry.Year.toString() : '',
            }),
        };

        this.View = {
            AllowableCosts: new DynamicLabel({
                label: 'Allowable Costs',
                value: this.annualentry && this.annualentry.hasOwnProperty('AllowableCosts') && this.annualentry.AllowableCosts != null ? this.annualentry.AllowableCosts.toString() : '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: null,
                    scale: null,
                }),
            }),
            Archived: new DynamicLabel({
                label: 'Archived',
                value: this.annualentry && this.annualentry.hasOwnProperty('Archived') && this.annualentry.Archived != null ? this.annualentry.Archived : false,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Checkbox,
                    inputType: null,
                    scale: null,
                }),
            }),
            InterimPayments: new DynamicLabel({
                label: 'Interim Payments',
                value: this.annualentry && this.annualentry.hasOwnProperty('InterimPayments') && this.annualentry.InterimPayments != null ? this.annualentry.InterimPayments.toString() : '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: null,
                    scale: null,
                }),
            }),
            Mer: new DynamicLabel({
                label: 'Mer',
                value: this.annualentry && this.annualentry.hasOwnProperty('Mer') && this.annualentry.Mer != null ? this.annualentry.Mer.toString() : '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: null,
                    scale: null,
                }),
            }),
            Rmts: new DynamicLabel({
                label: 'Rmts',
                value: this.annualentry && this.annualentry.hasOwnProperty('Rmts') && this.annualentry.Rmts != null ? this.annualentry.Rmts.toString() : '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: null,
                    scale: null,
                }),
            }),
            SchoolDistrictId: new DynamicLabel({
                label: 'School District',
                value: getMetaItemValue(this.schoolDistricts as unknown as IMetaItem[], this.annualentry && this.annualentry.hasOwnProperty('SchoolDistrictId') ? this.annualentry.SchoolDistrictId : null) ?? '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
            }),
            SettlementAmount: new DynamicLabel({
                label: 'Settlement Amount',
                value: this.annualentry && this.annualentry.hasOwnProperty('SettlementAmount') && this.annualentry.SettlementAmount != null ? this.annualentry.SettlementAmount.toString() : '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: null,
                    scale: null,
                }),
            }),
            StatusId: new DynamicLabel({
                label: 'Status',
                value: getMetaItemValue(this.statuses as unknown as IMetaItem[], this.annualentry && this.annualentry.hasOwnProperty('StatusId') ? this.annualentry.StatusId : null) ?? '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
            }),
            Year: new DynamicLabel({
                label: 'Year',
                value: this.annualentry && this.annualentry.hasOwnProperty('Year') && this.annualentry.Year != null ? this.annualentry.Year.toString() : '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: null,
                    scale: null,
                }),
            }),
        };

    }
}
