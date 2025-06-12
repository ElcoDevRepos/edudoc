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
import { ICounty } from '../interfaces/county';

export interface ICountyDynamicControlsParameters {
    formGroup?: string;
}

export class CountyDynamicControls {

    formGroup: string;

    Form: IExpandableObject;
    View: IExpandableObject;

    constructor(private county?: ICounty, additionalParameters?: ICountyDynamicControlsParameters) {
        this.formGroup = additionalParameters && additionalParameters.formGroup || 'County';

        this.Form = {
            City: new DynamicField({
                formGroup: this.formGroup,
                label: 'City',
                name: 'City',
                options: null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: null,
                    scale: null,
                }),
                validation: [ Validators.required, Validators.maxLength(50) ],
                validators: { 'required': true, 'maxlength': 50 },
                value: this.county && this.county.hasOwnProperty('City') && this.county.City != null ? this.county.City.toString() : '',
            }),
            CountyName: new DynamicField({
                formGroup: this.formGroup,
                label: 'County Name',
                name: 'CountyName',
                options: null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: null,
                    scale: null,
                }),
                validation: [ Validators.required, Validators.maxLength(50) ],
                validators: { 'required': true, 'maxlength': 50 },
                value: this.county && this.county.hasOwnProperty('CountyName') && this.county.CountyName != null ? this.county.CountyName.toString() : '',
            }),
            Id: new DynamicField({
                formGroup: this.formGroup,
                label: '',
                name: 'Id',
                options: null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Numeric,
                    inputType: NumericInputTypes.Integer,
                    scale: null,
                }),
                validation: [ Validators.required ],
                validators: { 'required': true },
                value: this.county && this.county.Id || null,
            }),
            Latitude: new DynamicField({
                formGroup: this.formGroup,
                label: 'Latitude',
                name: 'Latitude',
                options: null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Numeric,
                    inputType: null,
                    scale: null,
                }),
                validation: [  ],
                validators: {  },
                value: this.county && this.county.Latitude || null,
            }),
            Longitude: new DynamicField({
                formGroup: this.formGroup,
                label: 'Longitude',
                name: 'Longitude',
                options: null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Numeric,
                    inputType: null,
                    scale: null,
                }),
                validation: [  ],
                validators: {  },
                value: this.county && this.county.Longitude || null,
            }),
            StateCode: new DynamicField({
                formGroup: this.formGroup,
                label: 'State Code',
                name: 'StateCode',
                options: null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: null,
                    scale: null,
                }),
                validation: [ Validators.required, Validators.maxLength(2) ],
                validators: { 'required': true, 'maxlength': 2 },
                value: this.county && this.county.hasOwnProperty('StateCode') && this.county.StateCode != null ? this.county.StateCode.toString() : '',
            }),
            Zip: new DynamicField({
                formGroup: this.formGroup,
                label: 'Zip',
                name: 'Zip',
                options: null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: null,
                    scale: null,
                }),
                validation: [ Validators.required, Validators.maxLength(20) ],
                validators: { 'required': true, 'maxlength': 20 },
                value: this.county && this.county.hasOwnProperty('Zip') && this.county.Zip != null ? this.county.Zip.toString() : '',
            }),
        };

        this.View = {
            City: new DynamicLabel({
                label: 'City',
                value: this.county && this.county.hasOwnProperty('City') && this.county.City != null ? this.county.City.toString() : '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: null,
                    scale: null,
                }),
            }),
            CountyName: new DynamicLabel({
                label: 'County Name',
                value: this.county && this.county.hasOwnProperty('CountyName') && this.county.CountyName != null ? this.county.CountyName.toString() : '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: null,
                    scale: null,
                }),
            }),
            Id: new DynamicLabel({
                label: '',
                value: this.county && this.county.Id || null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Numeric,
                    inputType: NumericInputTypes.Integer,
                    scale: null,
                }),
            }),
            Latitude: new DynamicLabel({
                label: 'Latitude',
                value: this.county && this.county.Latitude || null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Numeric,
                    inputType: null,
                    scale: null,
                }),
            }),
            Longitude: new DynamicLabel({
                label: 'Longitude',
                value: this.county && this.county.Longitude || null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Numeric,
                    inputType: null,
                    scale: null,
                }),
            }),
            StateCode: new DynamicLabel({
                label: 'State Code',
                value: this.county && this.county.hasOwnProperty('StateCode') && this.county.StateCode != null ? this.county.StateCode.toString() : '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: null,
                    scale: null,
                }),
            }),
            Zip: new DynamicLabel({
                label: 'Zip',
                value: this.county && this.county.hasOwnProperty('Zip') && this.county.Zip != null ? this.county.Zip.toString() : '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: null,
                    scale: null,
                }),
            }),
        };

    }
}
