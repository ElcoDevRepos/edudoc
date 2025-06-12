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
import { IConsoleJobLog } from '../interfaces/console-job-log';
import { IConsoleJobType } from '../interfaces/console-job-type';

export interface IConsoleJobLogDynamicControlsParameters {
    formGroup?: string;
    consoleJobTypes?: IConsoleJobType[];
}

export class ConsoleJobLogDynamicControls {

    formGroup: string;
    consoleJobTypes?: IConsoleJobType[];

    Form: IExpandableObject;
    View: IExpandableObject;

    constructor(private consolejoblog?: IConsoleJobLog, additionalParameters?: IConsoleJobLogDynamicControlsParameters) {
        this.formGroup = additionalParameters && additionalParameters.formGroup || 'ConsoleJobLog';
        this.consoleJobTypes = additionalParameters && additionalParameters.consoleJobTypes || undefined;

        this.Form = {
            ConsoleJobTypeId: new DynamicField({
                formGroup: this.formGroup,
                label: 'Console Job Type',
                name: 'ConsoleJobTypeId',
                options: this.consoleJobTypes,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
                validation: [ noZeroRequiredValidator ],
                validators: { 'required': true },
                value: this.consolejoblog && this.consolejoblog.ConsoleJobTypeId || null,
            }),
            Date: new DynamicField({
                formGroup: this.formGroup,
                label: 'Date',
                name: 'Date',
                options: null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: InputTypes.Datepicker,
                    scale: null,
                }),
                validation: [  ],
                validators: {  },
                value: this.consolejoblog && this.consolejoblog.Date || null,
            }),
            ErrorMessage: new DynamicField({
                formGroup: this.formGroup,
                label: 'Error Message',
                name: 'ErrorMessage',
                options: null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: InputTypes.Textarea,
                    scale: null,
                }),
                validation: [  ],
                validators: {  },
                value: this.consolejoblog && this.consolejoblog.hasOwnProperty('ErrorMessage') && this.consolejoblog.ErrorMessage != null ? this.consolejoblog.ErrorMessage.toString() : '',
            }),
            IsError: new DynamicField({
                formGroup: this.formGroup,
                label: 'Is Error',
                name: 'IsError',
                options: null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Checkbox,
                    inputType: null,
                    scale: null,
                }),
                validation: [  ],
                validators: {  },
                value: this.consolejoblog && this.consolejoblog.hasOwnProperty('IsError') && this.consolejoblog.IsError != null ? this.consolejoblog.IsError : false,
            }),
            RelatedEntityId: new DynamicField({
                formGroup: this.formGroup,
                label: 'Related Entity',
                name: 'RelatedEntityId',
                options: null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Numeric,
                    inputType: NumericInputTypes.Integer,
                    scale: null,
                }),
                validation: [  ],
                validators: {  },
                value: this.consolejoblog && this.consolejoblog.RelatedEntityId || null,
            }),
            StackTrace: new DynamicField({
                formGroup: this.formGroup,
                label: 'Stack Trace',
                name: 'StackTrace',
                options: null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: InputTypes.Textarea,
                    scale: null,
                }),
                validation: [  ],
                validators: {  },
                value: this.consolejoblog && this.consolejoblog.hasOwnProperty('StackTrace') && this.consolejoblog.StackTrace != null ? this.consolejoblog.StackTrace.toString() : '',
            }),
        };

        this.View = {
            ConsoleJobTypeId: new DynamicLabel({
                label: 'Console Job Type',
                value: getMetaItemValue(this.consoleJobTypes as unknown as IMetaItem[], this.consolejoblog && this.consolejoblog.hasOwnProperty('ConsoleJobTypeId') ? this.consolejoblog.ConsoleJobTypeId : null) ?? '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
            }),
            Date: new DynamicLabel({
                label: 'Date',
                value: this.consolejoblog && this.consolejoblog.Date || null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: InputTypes.Datepicker,
                    scale: null,
                }),
            }),
            ErrorMessage: new DynamicLabel({
                label: 'Error Message',
                value: this.consolejoblog && this.consolejoblog.hasOwnProperty('ErrorMessage') && this.consolejoblog.ErrorMessage != null ? this.consolejoblog.ErrorMessage.toString() : '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: InputTypes.Textarea,
                    scale: null,
                }),
            }),
            IsError: new DynamicLabel({
                label: 'Is Error',
                value: this.consolejoblog && this.consolejoblog.hasOwnProperty('IsError') && this.consolejoblog.IsError != null ? this.consolejoblog.IsError : false,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Checkbox,
                    inputType: null,
                    scale: null,
                }),
            }),
            RelatedEntityId: new DynamicLabel({
                label: 'Related Entity',
                value: this.consolejoblog && this.consolejoblog.RelatedEntityId || null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Numeric,
                    inputType: NumericInputTypes.Integer,
                    scale: null,
                }),
            }),
            StackTrace: new DynamicLabel({
                label: 'Stack Trace',
                value: this.consolejoblog && this.consolejoblog.hasOwnProperty('StackTrace') && this.consolejoblog.StackTrace != null ? this.consolejoblog.StackTrace.toString() : '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: InputTypes.Textarea,
                    scale: null,
                }),
            }),
        };

    }
}
