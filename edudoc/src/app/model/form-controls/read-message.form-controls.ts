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
import { IReadMessage } from '../interfaces/read-message';
import { IMessage } from '../interfaces/message';

export interface IReadMessageDynamicControlsParameters {
    formGroup?: string;
    messages?: IMessage[];
}

export class ReadMessageDynamicControls {

    formGroup: string;
    messages?: IMessage[];

    Form: IExpandableObject;
    View: IExpandableObject;

    constructor(private readmessage?: IReadMessage, additionalParameters?: IReadMessageDynamicControlsParameters) {
        this.formGroup = additionalParameters && additionalParameters.formGroup || 'ReadMessage';
        this.messages = additionalParameters && additionalParameters.messages || undefined;

        this.Form = {
            DateRead: new DynamicField({
                formGroup: this.formGroup,
                label: 'Date Read',
                name: 'DateRead',
                options: null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: InputTypes.Datepicker,
                    scale: null,
                }),
                validation: [  ],
                validators: {  },
                value: this.readmessage && this.readmessage.DateRead || null,
            }),
            MessageId: new DynamicField({
                formGroup: this.formGroup,
                label: 'Message',
                name: 'MessageId',
                options: this.messages,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
                validation: [ noZeroRequiredValidator ],
                validators: { 'required': true },
                value: this.readmessage && this.readmessage.MessageId || null,
            }),
            ReadById: new DynamicField({
                formGroup: this.formGroup,
                label: 'Read By',
                name: 'ReadById',
                options: null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Numeric,
                    inputType: NumericInputTypes.Integer,
                    scale: null,
                }),
                validation: [ Validators.required ],
                validators: { 'required': true },
                value: this.readmessage && this.readmessage.ReadById || null,
            }),
        };

        this.View = {
            DateRead: new DynamicLabel({
                label: 'Date Read',
                value: this.readmessage && this.readmessage.DateRead || null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: InputTypes.Datepicker,
                    scale: null,
                }),
            }),
            MessageId: new DynamicLabel({
                label: 'Message',
                value: getMetaItemValue(this.messages as unknown as IMetaItem[], this.readmessage && this.readmessage.hasOwnProperty('MessageId') ? this.readmessage.MessageId : null) ?? '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
            }),
            ReadById: new DynamicLabel({
                label: 'Read By',
                value: this.readmessage && this.readmessage.ReadById || null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Numeric,
                    inputType: NumericInputTypes.Integer,
                    scale: null,
                }),
            }),
        };

    }
}
