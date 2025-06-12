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
import { IProviderTraining } from '../interfaces/provider-training';
import { IMessageDocument } from '../interfaces/message-document';
import { IMessageLink } from '../interfaces/message-link';
import { IProvider } from '../interfaces/provider';

export interface IProviderTrainingDynamicControlsParameters {
    formGroup?: string;
    documents?: IMessageDocument[];
    links?: IMessageLink[];
    providers?: IProvider[];
}

export class ProviderTrainingDynamicControls {

    formGroup: string;
    documents?: IMessageDocument[];
    links?: IMessageLink[];
    providers?: IProvider[];

    Form: IExpandableObject;
    View: IExpandableObject;

    constructor(private providertraining?: IProviderTraining, additionalParameters?: IProviderTrainingDynamicControlsParameters) {
        this.formGroup = additionalParameters && additionalParameters.formGroup || 'ProviderTraining';
        this.documents = additionalParameters && additionalParameters.documents || undefined;
        this.links = additionalParameters && additionalParameters.links || undefined;
        this.providers = additionalParameters && additionalParameters.providers || undefined;

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
                value: this.providertraining && this.providertraining.hasOwnProperty('Archived') && this.providertraining.Archived != null ? this.providertraining.Archived : false,
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
                value: this.providertraining && this.providertraining.CreatedById || 1,
            }),
            DateCompleted: new DynamicField({
                formGroup: this.formGroup,
                label: 'Date Completed',
                name: 'DateCompleted',
                options: null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: InputTypes.Datepicker,
                    scale: null,
                }),
                validation: [  ],
                validators: {  },
                value: this.providertraining && this.providertraining.DateCompleted || null,
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
                value: this.providertraining && this.providertraining.DateCreated || null,
            }),
            DocumentId: new DynamicField({
                formGroup: this.formGroup,
                label: 'Document',
                name: 'DocumentId',
                options: this.documents,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
                validation: [  ],
                validators: {  },
                value: this.providertraining && this.providertraining.DocumentId || null,
            }),
            DueDate: new DynamicField({
                formGroup: this.formGroup,
                label: 'Due Date',
                name: 'DueDate',
                options: null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: InputTypes.Datepicker,
                    scale: null,
                }),
                validation: [  ],
                validators: {  },
                value: this.providertraining && this.providertraining.DueDate || null,
            }),
            LastReminder: new DynamicField({
                formGroup: this.formGroup,
                label: 'Last Reminder',
                name: 'LastReminder',
                options: null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: InputTypes.Datepicker,
                    scale: null,
                }),
                validation: [  ],
                validators: {  },
                value: this.providertraining && this.providertraining.LastReminder || null,
            }),
            LinkId: new DynamicField({
                formGroup: this.formGroup,
                label: 'Link',
                name: 'LinkId',
                options: this.links,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
                validation: [  ],
                validators: {  },
                value: this.providertraining && this.providertraining.LinkId || null,
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
                value: this.providertraining && this.providertraining.ProviderId || null,
            }),
        };

        this.View = {
            Archived: new DynamicLabel({
                label: 'Archived',
                value: this.providertraining && this.providertraining.hasOwnProperty('Archived') && this.providertraining.Archived != null ? this.providertraining.Archived : false,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Checkbox,
                    inputType: null,
                    scale: null,
                }),
            }),
            CreatedById: new DynamicLabel({
                label: 'Created By',
                value: this.providertraining && this.providertraining.CreatedById || 1,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Numeric,
                    inputType: NumericInputTypes.Integer,
                    scale: null,
                }),
            }),
            DateCompleted: new DynamicLabel({
                label: 'Date Completed',
                value: this.providertraining && this.providertraining.DateCompleted || null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: InputTypes.Datepicker,
                    scale: null,
                }),
            }),
            DateCreated: new DynamicLabel({
                label: 'Date Created',
                value: this.providertraining && this.providertraining.DateCreated || null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: InputTypes.Datepicker,
                    scale: null,
                }),
            }),
            DocumentId: new DynamicLabel({
                label: 'Document',
                value: getMetaItemValue(this.documents as unknown as IMetaItem[], this.providertraining && this.providertraining.hasOwnProperty('DocumentId') ? this.providertraining.DocumentId : null) ?? '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
            }),
            DueDate: new DynamicLabel({
                label: 'Due Date',
                value: this.providertraining && this.providertraining.DueDate || null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: InputTypes.Datepicker,
                    scale: null,
                }),
            }),
            LastReminder: new DynamicLabel({
                label: 'Last Reminder',
                value: this.providertraining && this.providertraining.LastReminder || null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: InputTypes.Datepicker,
                    scale: null,
                }),
            }),
            LinkId: new DynamicLabel({
                label: 'Link',
                value: getMetaItemValue(this.links as unknown as IMetaItem[], this.providertraining && this.providertraining.hasOwnProperty('LinkId') ? this.providertraining.LinkId : null) ?? '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
            }),
            ProviderId: new DynamicLabel({
                label: 'Provider',
                value: getMetaItemValue(this.providers as unknown as IMetaItem[], this.providertraining && this.providertraining.hasOwnProperty('ProviderId') ? this.providertraining.ProviderId : null) ?? '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
            }),
        };

    }
}
