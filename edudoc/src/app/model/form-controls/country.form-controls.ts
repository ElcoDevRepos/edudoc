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
import { ICountry } from '../interfaces/country';

export interface ICountryDynamicControlsParameters {
    formGroup?: string;
}

export class CountryDynamicControls {

    formGroup: string;

    Form: IExpandableObject;
    View: IExpandableObject;

    constructor(private country?: ICountry, additionalParameters?: ICountryDynamicControlsParameters) {
        this.formGroup = additionalParameters && additionalParameters.formGroup || 'Country';

        this.Form = {
            Alpha3Code: new DynamicField({
                formGroup: this.formGroup,
                label: 'Alpha3 Code',
                name: 'Alpha3Code',
                options: null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: null,
                    scale: null,
                }),
                validation: [ Validators.required, Validators.maxLength(3) ],
                validators: { 'required': true, 'maxlength': 3 },
                value: this.country && this.country.hasOwnProperty('Alpha3Code') && this.country.Alpha3Code != null ? this.country.Alpha3Code.toString() : '',
            }),
            CountryCode: new DynamicField({
                formGroup: this.formGroup,
                label: 'Country Code',
                name: 'CountryCode',
                options: null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: null,
                    scale: null,
                }),
                validation: [ Validators.required, Validators.maxLength(2) ],
                validators: { 'required': true, 'maxlength': 2 },
                value: this.country && this.country.hasOwnProperty('CountryCode') && this.country.CountryCode != null ? this.country.CountryCode.toString() : '',
            }),
            Name: new DynamicField({
                formGroup: this.formGroup,
                label: 'Name',
                name: 'Name',
                options: null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: null,
                    scale: null,
                }),
                validation: [ Validators.required, Validators.maxLength(50) ],
                validators: { 'required': true, 'maxlength': 50 },
                value: this.country && this.country.hasOwnProperty('Name') && this.country.Name != null ? this.country.Name.toString() : '',
            }),
        };

        this.View = {
            Alpha3Code: new DynamicLabel({
                label: 'Alpha3 Code',
                value: this.country && this.country.hasOwnProperty('Alpha3Code') && this.country.Alpha3Code != null ? this.country.Alpha3Code.toString() : '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: null,
                    scale: null,
                }),
            }),
            CountryCode: new DynamicLabel({
                label: 'Country Code',
                value: this.country && this.country.hasOwnProperty('CountryCode') && this.country.CountryCode != null ? this.country.CountryCode.toString() : '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: null,
                    scale: null,
                }),
            }),
            Name: new DynamicLabel({
                label: 'Name',
                value: this.country && this.country.hasOwnProperty('Name') && this.country.Name != null ? this.country.Name.toString() : '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: null,
                    scale: null,
                }),
            }),
        };

    }
}
