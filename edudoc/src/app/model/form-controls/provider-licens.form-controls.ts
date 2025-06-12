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
import { IProviderLicens } from '../interfaces/provider-licens';
import { IProvider } from '../interfaces/provider';

export interface IProviderLicensDynamicControlsParameters {
    formGroup?: string;
    providers?: IProvider[];
}

export class ProviderLicensDynamicControls {

    formGroup: string;
    providers?: IProvider[];

    Form: IExpandableObject;
    View: IExpandableObject;

    constructor(private providerlicens?: IProviderLicens, additionalParameters?: IProviderLicensDynamicControlsParameters) {
        this.formGroup = additionalParameters && additionalParameters.formGroup || 'ProviderLicens';
        this.providers = additionalParameters && additionalParameters.providers || undefined;

        this.Form = {
            AsOfDate: new DynamicField({
                formGroup: this.formGroup,
                label: 'As Of Date',
                name: 'AsOfDate',
                options: null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: InputTypes.Datepicker,
                    scale: null,
                }),
                validation: [ Validators.required ],
                validators: { 'required': true },
                value: this.providerlicens && this.providerlicens.AsOfDate || null,
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
                value: this.providerlicens && this.providerlicens.CreatedById || 1,
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
                value: this.providerlicens && this.providerlicens.DateCreated || null,
            }),
            ExpirationDate: new DynamicField({
                formGroup: this.formGroup,
                label: 'Expiration Date',
                name: 'ExpirationDate',
                options: null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: InputTypes.Datepicker,
                    scale: null,
                }),
                validation: [ Validators.required ],
                validators: { 'required': true },
                value: this.providerlicens && this.providerlicens.ExpirationDate || null,
            }),
            License: new DynamicField({
                formGroup: this.formGroup,
                label: 'License',
                name: 'License',
                options: null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: null,
                    scale: null,
                }),
                validation: [ Validators.required, Validators.maxLength(50) ],
                validators: { 'required': true, 'maxlength': 50 },
                value: this.providerlicens && this.providerlicens.hasOwnProperty('License') && this.providerlicens.License != null ? this.providerlicens.License.toString() : '',
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
                value: this.providerlicens && this.providerlicens.ProviderId || null,
            }),
        };

        this.View = {
            AsOfDate: new DynamicLabel({
                label: 'As Of Date',
                value: this.providerlicens && this.providerlicens.AsOfDate || null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: InputTypes.Datepicker,
                    scale: null,
                }),
            }),
            CreatedById: new DynamicLabel({
                label: 'Created By',
                value: this.providerlicens && this.providerlicens.CreatedById || 1,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Numeric,
                    inputType: NumericInputTypes.Integer,
                    scale: null,
                }),
            }),
            DateCreated: new DynamicLabel({
                label: 'Date Created',
                value: this.providerlicens && this.providerlicens.DateCreated || null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: InputTypes.Datepicker,
                    scale: null,
                }),
            }),
            ExpirationDate: new DynamicLabel({
                label: 'Expiration Date',
                value: this.providerlicens && this.providerlicens.ExpirationDate || null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: InputTypes.Datepicker,
                    scale: null,
                }),
            }),
            License: new DynamicLabel({
                label: 'License',
                value: this.providerlicens && this.providerlicens.hasOwnProperty('License') && this.providerlicens.License != null ? this.providerlicens.License.toString() : '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: null,
                    scale: null,
                }),
            }),
            ProviderId: new DynamicLabel({
                label: 'Provider',
                value: getMetaItemValue(this.providers as unknown as IMetaItem[], this.providerlicens && this.providerlicens.hasOwnProperty('ProviderId') ? this.providerlicens.ProviderId : null) ?? '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
            }),
        };

    }
}
