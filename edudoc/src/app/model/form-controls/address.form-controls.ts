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
import { IAddress } from '../interfaces/address';

export interface IAddressDynamicControlsParameters {
    formGroup?: string;
}

export class AddressDynamicControls {

    formGroup: string;

    Form: IExpandableObject;
    View: IExpandableObject;

    constructor(private address?: IAddress, additionalParameters?: IAddressDynamicControlsParameters) {
        this.formGroup = additionalParameters && additionalParameters.formGroup || 'Address';

        this.Form = {
            Address1: new DynamicField({
                formGroup: this.formGroup,
                label: 'Address1',
                name: 'Address1',
                options: null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: null,
                    scale: null,
                }),
                validation: [ Validators.maxLength(250) ],
                validators: { 'maxlength': 250 },
                value: this.address && this.address.hasOwnProperty('Address1') && this.address.Address1 != null ? this.address.Address1.toString() : '',
            }),
            Address2: new DynamicField({
                formGroup: this.formGroup,
                label: 'Address2',
                name: 'Address2',
                options: null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: null,
                    scale: null,
                }),
                validation: [ Validators.maxLength(250) ],
                validators: { 'maxlength': 250 },
                value: this.address && this.address.hasOwnProperty('Address2') && this.address.Address2 != null ? this.address.Address2.toString() : '',
            }),
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
                validation: [ Validators.maxLength(50) ],
                validators: { 'maxlength': 50 },
                value: this.address && this.address.hasOwnProperty('City') && this.address.City != null ? this.address.City.toString() : '',
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
                validation: [ Validators.maxLength(2) ],
                validators: { 'maxlength': 2 },
                value: this.address && this.address.hasOwnProperty('CountryCode') && this.address.CountryCode != null ? this.address.CountryCode.toString() : '',
            }),
            County: new DynamicField({
                formGroup: this.formGroup,
                label: 'County',
                name: 'County',
                options: null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: null,
                    scale: null,
                }),
                validation: [ Validators.maxLength(50) ],
                validators: { 'maxlength': 50 },
                value: this.address && this.address.hasOwnProperty('County') && this.address.County != null ? this.address.County.toString() : '',
            }),
            Province: new DynamicField({
                formGroup: this.formGroup,
                label: 'Province',
                name: 'Province',
                options: null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: null,
                    scale: null,
                }),
                validation: [ Validators.maxLength(50) ],
                validators: { 'maxlength': 50 },
                value: this.address && this.address.hasOwnProperty('Province') && this.address.Province != null ? this.address.Province.toString() : '',
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
                validation: [ Validators.maxLength(2) ],
                validators: { 'maxlength': 2 },
                value: this.address && this.address.hasOwnProperty('StateCode') && this.address.StateCode != null ? this.address.StateCode.toString() : '',
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
                validation: [ Validators.maxLength(20) ],
                validators: { 'maxlength': 20 },
                value: this.address && this.address.hasOwnProperty('Zip') && this.address.Zip != null ? this.address.Zip.toString() : '',
            }),
        };

        this.View = {
            Address1: new DynamicLabel({
                label: 'Address1',
                value: this.address && this.address.hasOwnProperty('Address1') && this.address.Address1 != null ? this.address.Address1.toString() : '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: null,
                    scale: null,
                }),
            }),
            Address2: new DynamicLabel({
                label: 'Address2',
                value: this.address && this.address.hasOwnProperty('Address2') && this.address.Address2 != null ? this.address.Address2.toString() : '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: null,
                    scale: null,
                }),
            }),
            City: new DynamicLabel({
                label: 'City',
                value: this.address && this.address.hasOwnProperty('City') && this.address.City != null ? this.address.City.toString() : '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: null,
                    scale: null,
                }),
            }),
            CountryCode: new DynamicLabel({
                label: 'Country Code',
                value: this.address && this.address.hasOwnProperty('CountryCode') && this.address.CountryCode != null ? this.address.CountryCode.toString() : '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: null,
                    scale: null,
                }),
            }),
            County: new DynamicLabel({
                label: 'County',
                value: this.address && this.address.hasOwnProperty('County') && this.address.County != null ? this.address.County.toString() : '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: null,
                    scale: null,
                }),
            }),
            Province: new DynamicLabel({
                label: 'Province',
                value: this.address && this.address.hasOwnProperty('Province') && this.address.Province != null ? this.address.Province.toString() : '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: null,
                    scale: null,
                }),
            }),
            StateCode: new DynamicLabel({
                label: 'State Code',
                value: this.address && this.address.hasOwnProperty('StateCode') && this.address.StateCode != null ? this.address.StateCode.toString() : '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: null,
                    scale: null,
                }),
            }),
            Zip: new DynamicLabel({
                label: 'Zip',
                value: this.address && this.address.hasOwnProperty('Zip') && this.address.Zip != null ? this.address.Zip.toString() : '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: null,
                    scale: null,
                }),
            }),
        };

    }
}
