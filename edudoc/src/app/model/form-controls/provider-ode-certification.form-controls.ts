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
import { IProviderOdeCertification } from '../interfaces/provider-ode-certification';
import { IProvider } from '../interfaces/provider';

export interface IProviderOdeCertificationDynamicControlsParameters {
    formGroup?: string;
    providers?: IProvider[];
}

export class ProviderOdeCertificationDynamicControls {

    formGroup: string;
    providers?: IProvider[];

    Form: IExpandableObject;
    View: IExpandableObject;

    constructor(private providerodecertification?: IProviderOdeCertification, additionalParameters?: IProviderOdeCertificationDynamicControlsParameters) {
        this.formGroup = additionalParameters && additionalParameters.formGroup || 'ProviderOdeCertification';
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
                value: this.providerodecertification && this.providerodecertification.AsOfDate || null,
            }),
            CertificationNumber: new DynamicField({
                formGroup: this.formGroup,
                label: 'Certification Number',
                name: 'CertificationNumber',
                options: null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: null,
                    scale: null,
                }),
                validation: [ Validators.maxLength(10) ],
                validators: { 'maxlength': 10 },
                value: this.providerodecertification && this.providerodecertification.hasOwnProperty('CertificationNumber') && this.providerodecertification.CertificationNumber != null ? this.providerodecertification.CertificationNumber.toString() : '',
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
                value: this.providerodecertification && this.providerodecertification.CreatedById || 1,
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
                value: this.providerodecertification && this.providerodecertification.DateCreated || null,
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
                value: this.providerodecertification && this.providerodecertification.ExpirationDate || null,
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
                value: this.providerodecertification && this.providerodecertification.ProviderId || null,
            }),
        };

        this.View = {
            AsOfDate: new DynamicLabel({
                label: 'As Of Date',
                value: this.providerodecertification && this.providerodecertification.AsOfDate || null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: InputTypes.Datepicker,
                    scale: null,
                }),
            }),
            CertificationNumber: new DynamicLabel({
                label: 'Certification Number',
                value: this.providerodecertification && this.providerodecertification.hasOwnProperty('CertificationNumber') && this.providerodecertification.CertificationNumber != null ? this.providerodecertification.CertificationNumber.toString() : '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: null,
                    scale: null,
                }),
            }),
            CreatedById: new DynamicLabel({
                label: 'Created By',
                value: this.providerodecertification && this.providerodecertification.CreatedById || 1,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Numeric,
                    inputType: NumericInputTypes.Integer,
                    scale: null,
                }),
            }),
            DateCreated: new DynamicLabel({
                label: 'Date Created',
                value: this.providerodecertification && this.providerodecertification.DateCreated || null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: InputTypes.Datepicker,
                    scale: null,
                }),
            }),
            ExpirationDate: new DynamicLabel({
                label: 'Expiration Date',
                value: this.providerodecertification && this.providerodecertification.ExpirationDate || null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: InputTypes.Datepicker,
                    scale: null,
                }),
            }),
            ProviderId: new DynamicLabel({
                label: 'Provider',
                value: getMetaItemValue(this.providers as unknown as IMetaItem[], this.providerodecertification && this.providerodecertification.hasOwnProperty('ProviderId') ? this.providerodecertification.ProviderId : null) ?? '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
            }),
        };

    }
}
