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
import { IProviderInactivityDate } from '../interfaces/provider-inactivity-date';
import { IProviderDoNotBillReason } from '../interfaces/provider-do-not-bill-reason';
import { IProvider } from '../interfaces/provider';

export interface IProviderInactivityDateDynamicControlsParameters {
    formGroup?: string;
    providers?: IProvider[];
    providerDoNotBillReasons?: IProviderDoNotBillReason[];
}

export class ProviderInactivityDateDynamicControls {

    formGroup: string;
    providers?: IProvider[];
    providerDoNotBillReasons?: IProviderDoNotBillReason[];

    Form: IExpandableObject;
    View: IExpandableObject;

    constructor(private providerinactivitydate?: IProviderInactivityDate, additionalParameters?: IProviderInactivityDateDynamicControlsParameters) {
        this.formGroup = additionalParameters && additionalParameters.formGroup || 'ProviderInactivityDate';
        this.providers = additionalParameters && additionalParameters.providers || undefined;
        this.providerDoNotBillReasons = additionalParameters && additionalParameters.providerDoNotBillReasons || undefined;

        this.Form = {
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
                value: this.providerinactivitydate && this.providerinactivitydate.hasOwnProperty('Archived') && this.providerinactivitydate.Archived != null ? this.providerinactivitydate.Archived : false,
            }),
            ProviderDoNotBillReasonId: new DynamicField({
                formGroup: this.formGroup,
                label: 'Provider Do Not Bill Reason',
                name: 'ProviderDoNotBillReasonId',
                options: this.providerDoNotBillReasons,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
                validation: [  ],
                validators: {  },
                value: this.providerinactivitydate && this.providerinactivitydate.ProviderDoNotBillReasonId || 1,
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
                value: this.providerinactivitydate && this.providerinactivitydate.ProviderId || null,
            }),
            ProviderInactivityEndDate: new DynamicField({
                formGroup: this.formGroup,
                label: 'Provider Inactivity End Date',
                name: 'ProviderInactivityEndDate',
                options: null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: InputTypes.Datepicker,
                    scale: null,
                }),
                validation: [  ],
                validators: {  },
                value: this.providerinactivitydate && this.providerinactivitydate.ProviderInactivityEndDate || null,
            }),
            ProviderInactivityStartDate: new DynamicField({
                formGroup: this.formGroup,
                label: 'Provider Inactivity Start Date',
                name: 'ProviderInactivityStartDate',
                options: null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: InputTypes.Datepicker,
                    scale: null,
                }),
                validation: [ Validators.required ],
                validators: { 'required': true },
                value: this.providerinactivitydate && this.providerinactivitydate.ProviderInactivityStartDate || null,
            }),
        };

        this.View = {
            Archived: new DynamicLabel({
                label: 'Archived',
                value: this.providerinactivitydate && this.providerinactivitydate.hasOwnProperty('Archived') && this.providerinactivitydate.Archived != null ? this.providerinactivitydate.Archived : false,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Checkbox,
                    inputType: null,
                    scale: null,
                }),
            }),
            ProviderDoNotBillReasonId: new DynamicLabel({
                label: 'Provider Do Not Bill Reason',
                value: getMetaItemValue(this.providerDoNotBillReasons as unknown as IMetaItem[], this.providerinactivitydate && this.providerinactivitydate.hasOwnProperty('ProviderDoNotBillReasonId') ? this.providerinactivitydate.ProviderDoNotBillReasonId : null) ?? '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
            }),
            ProviderId: new DynamicLabel({
                label: 'Provider',
                value: getMetaItemValue(this.providers as unknown as IMetaItem[], this.providerinactivitydate && this.providerinactivitydate.hasOwnProperty('ProviderId') ? this.providerinactivitydate.ProviderId : null) ?? '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
            }),
            ProviderInactivityEndDate: new DynamicLabel({
                label: 'Provider Inactivity End Date',
                value: this.providerinactivitydate && this.providerinactivitydate.ProviderInactivityEndDate || null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: InputTypes.Datepicker,
                    scale: null,
                }),
            }),
            ProviderInactivityStartDate: new DynamicLabel({
                label: 'Provider Inactivity Start Date',
                value: this.providerinactivitydate && this.providerinactivitydate.ProviderInactivityStartDate || null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: InputTypes.Datepicker,
                    scale: null,
                }),
            }),
        };

    }
}
