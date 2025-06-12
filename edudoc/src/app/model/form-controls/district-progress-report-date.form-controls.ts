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
import { IDistrictProgressReportDate } from '../interfaces/district-progress-report-date';
import { ISchoolDistrict } from '../interfaces/school-district';

export interface IDistrictProgressReportDateDynamicControlsParameters {
    formGroup?: string;
    districts?: ISchoolDistrict[];
}

export class DistrictProgressReportDateDynamicControls {

    formGroup: string;
    districts?: ISchoolDistrict[];

    Form: IExpandableObject;
    View: IExpandableObject;

    constructor(private districtprogressreportdate?: IDistrictProgressReportDate, additionalParameters?: IDistrictProgressReportDateDynamicControlsParameters) {
        this.formGroup = additionalParameters && additionalParameters.formGroup || 'DistrictProgressReportDate';
        this.districts = additionalParameters && additionalParameters.districts || undefined;

        this.Form = {
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
                value: this.districtprogressreportdate && this.districtprogressreportdate.DistrictId || null,
            }),
            FirstQuarterEndDate: new DynamicField({
                formGroup: this.formGroup,
                label: 'First Quarter End Date',
                name: 'FirstQuarterEndDate',
                options: null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: InputTypes.Datepicker,
                    scale: null,
                }),
                validation: [ Validators.required ],
                validators: { 'required': true },
                value: this.districtprogressreportdate && this.districtprogressreportdate.FirstQuarterEndDate || null,
            }),
            FirstQuarterStartDate: new DynamicField({
                formGroup: this.formGroup,
                label: 'First Quarter Start Date',
                name: 'FirstQuarterStartDate',
                options: null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: InputTypes.Datepicker,
                    scale: null,
                }),
                validation: [ Validators.required ],
                validators: { 'required': true },
                value: this.districtprogressreportdate && this.districtprogressreportdate.FirstQuarterStartDate || null,
            }),
            FourthQuarterEndDate: new DynamicField({
                formGroup: this.formGroup,
                label: 'Fourth Quarter End Date',
                name: 'FourthQuarterEndDate',
                options: null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: InputTypes.Datepicker,
                    scale: null,
                }),
                validation: [ Validators.required ],
                validators: { 'required': true },
                value: this.districtprogressreportdate && this.districtprogressreportdate.FourthQuarterEndDate || null,
            }),
            FourthQuarterStartDate: new DynamicField({
                formGroup: this.formGroup,
                label: 'Fourth Quarter Start Date',
                name: 'FourthQuarterStartDate',
                options: null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: InputTypes.Datepicker,
                    scale: null,
                }),
                validation: [ Validators.required ],
                validators: { 'required': true },
                value: this.districtprogressreportdate && this.districtprogressreportdate.FourthQuarterStartDate || null,
            }),
            SecondQuarterEndDate: new DynamicField({
                formGroup: this.formGroup,
                label: 'Second Quarter End Date',
                name: 'SecondQuarterEndDate',
                options: null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: InputTypes.Datepicker,
                    scale: null,
                }),
                validation: [ Validators.required ],
                validators: { 'required': true },
                value: this.districtprogressreportdate && this.districtprogressreportdate.SecondQuarterEndDate || null,
            }),
            SecondQuarterStartDate: new DynamicField({
                formGroup: this.formGroup,
                label: 'Second Quarter Start Date',
                name: 'SecondQuarterStartDate',
                options: null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: InputTypes.Datepicker,
                    scale: null,
                }),
                validation: [ Validators.required ],
                validators: { 'required': true },
                value: this.districtprogressreportdate && this.districtprogressreportdate.SecondQuarterStartDate || null,
            }),
            ThirdQuarterEndDate: new DynamicField({
                formGroup: this.formGroup,
                label: 'Third Quarter End Date',
                name: 'ThirdQuarterEndDate',
                options: null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: InputTypes.Datepicker,
                    scale: null,
                }),
                validation: [ Validators.required ],
                validators: { 'required': true },
                value: this.districtprogressreportdate && this.districtprogressreportdate.ThirdQuarterEndDate || null,
            }),
            ThirdQuarterStartDate: new DynamicField({
                formGroup: this.formGroup,
                label: 'Third Quarter Start Date',
                name: 'ThirdQuarterStartDate',
                options: null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: InputTypes.Datepicker,
                    scale: null,
                }),
                validation: [ Validators.required ],
                validators: { 'required': true },
                value: this.districtprogressreportdate && this.districtprogressreportdate.ThirdQuarterStartDate || null,
            }),
        };

        this.View = {
            DistrictId: new DynamicLabel({
                label: 'District',
                value: getMetaItemValue(this.districts as unknown as IMetaItem[], this.districtprogressreportdate && this.districtprogressreportdate.hasOwnProperty('DistrictId') ? this.districtprogressreportdate.DistrictId : null) ?? '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
            }),
            FirstQuarterEndDate: new DynamicLabel({
                label: 'First Quarter End Date',
                value: this.districtprogressreportdate && this.districtprogressreportdate.FirstQuarterEndDate || null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: InputTypes.Datepicker,
                    scale: null,
                }),
            }),
            FirstQuarterStartDate: new DynamicLabel({
                label: 'First Quarter Start Date',
                value: this.districtprogressreportdate && this.districtprogressreportdate.FirstQuarterStartDate || null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: InputTypes.Datepicker,
                    scale: null,
                }),
            }),
            FourthQuarterEndDate: new DynamicLabel({
                label: 'Fourth Quarter End Date',
                value: this.districtprogressreportdate && this.districtprogressreportdate.FourthQuarterEndDate || null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: InputTypes.Datepicker,
                    scale: null,
                }),
            }),
            FourthQuarterStartDate: new DynamicLabel({
                label: 'Fourth Quarter Start Date',
                value: this.districtprogressreportdate && this.districtprogressreportdate.FourthQuarterStartDate || null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: InputTypes.Datepicker,
                    scale: null,
                }),
            }),
            SecondQuarterEndDate: new DynamicLabel({
                label: 'Second Quarter End Date',
                value: this.districtprogressreportdate && this.districtprogressreportdate.SecondQuarterEndDate || null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: InputTypes.Datepicker,
                    scale: null,
                }),
            }),
            SecondQuarterStartDate: new DynamicLabel({
                label: 'Second Quarter Start Date',
                value: this.districtprogressreportdate && this.districtprogressreportdate.SecondQuarterStartDate || null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: InputTypes.Datepicker,
                    scale: null,
                }),
            }),
            ThirdQuarterEndDate: new DynamicLabel({
                label: 'Third Quarter End Date',
                value: this.districtprogressreportdate && this.districtprogressreportdate.ThirdQuarterEndDate || null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: InputTypes.Datepicker,
                    scale: null,
                }),
            }),
            ThirdQuarterStartDate: new DynamicLabel({
                label: 'Third Quarter Start Date',
                value: this.districtprogressreportdate && this.districtprogressreportdate.ThirdQuarterStartDate || null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: InputTypes.Datepicker,
                    scale: null,
                }),
            }),
        };

    }
}
