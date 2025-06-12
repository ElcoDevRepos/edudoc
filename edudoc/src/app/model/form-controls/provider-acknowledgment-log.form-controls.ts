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
import { IProviderAcknowledgmentLog } from '../interfaces/provider-acknowledgment-log';
import { IProvider } from '../interfaces/provider';

export interface IProviderAcknowledgmentLogDynamicControlsParameters {
    formGroup?: string;
    providers?: IProvider[];
}

export class ProviderAcknowledgmentLogDynamicControls {

    formGroup: string;
    providers?: IProvider[];

    Form: IExpandableObject;
    View: IExpandableObject;

    constructor(private provideracknowledgmentlog?: IProviderAcknowledgmentLog, additionalParameters?: IProviderAcknowledgmentLogDynamicControlsParameters) {
        this.formGroup = additionalParameters && additionalParameters.formGroup || 'ProviderAcknowledgmentLog';
        this.providers = additionalParameters && additionalParameters.providers || undefined;

        this.Form = {
            DateAcknowledged: new DynamicField({
                formGroup: this.formGroup,
                label: 'Date Acknowledged',
                name: 'DateAcknowledged',
                options: null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: InputTypes.Datepicker,
                    scale: null,
                }),
                validation: [ Validators.required ],
                validators: { 'required': true },
                value: this.provideracknowledgmentlog && this.provideracknowledgmentlog.DateAcknowledged || null,
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
                value: this.provideracknowledgmentlog && this.provideracknowledgmentlog.ProviderId || null,
            }),
        };

        this.View = {
            DateAcknowledged: new DynamicLabel({
                label: 'Date Acknowledged',
                value: this.provideracknowledgmentlog && this.provideracknowledgmentlog.DateAcknowledged || null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: InputTypes.Datepicker,
                    scale: null,
                }),
            }),
            ProviderId: new DynamicLabel({
                label: 'Provider',
                value: getMetaItemValue(this.providers as unknown as IMetaItem[], this.provideracknowledgmentlog && this.provideracknowledgmentlog.hasOwnProperty('ProviderId') ? this.provideracknowledgmentlog.ProviderId : null) ?? '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
            }),
        };

    }
}
