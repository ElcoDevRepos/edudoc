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
import { IEdiErrorCodeAdminNotification } from '../interfaces/edi-error-code-admin-notification';

export interface IEdiErrorCodeAdminNotificationDynamicControlsParameters {
    formGroup?: string;
}

export class EdiErrorCodeAdminNotificationDynamicControls {

    formGroup: string;

    Form: IExpandableObject;
    View: IExpandableObject;

    constructor(private edierrorcodeadminnotification?: IEdiErrorCodeAdminNotification, additionalParameters?: IEdiErrorCodeAdminNotificationDynamicControlsParameters) {
        this.formGroup = additionalParameters && additionalParameters.formGroup || 'EdiErrorCodeAdminNotification';

        this.Form = {
            AdminId: new DynamicField({
                formGroup: this.formGroup,
                label: 'Admin',
                name: 'AdminId',
                options: null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Numeric,
                    inputType: NumericInputTypes.Integer,
                    scale: null,
                }),
                validation: [ Validators.required ],
                validators: { 'required': true },
                value: this.edierrorcodeadminnotification && this.edierrorcodeadminnotification.AdminId || null,
            }),
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
                value: this.edierrorcodeadminnotification && this.edierrorcodeadminnotification.hasOwnProperty('Archived') && this.edierrorcodeadminnotification.Archived != null ? this.edierrorcodeadminnotification.Archived : false,
            }),
        };

        this.View = {
            AdminId: new DynamicLabel({
                label: 'Admin',
                value: this.edierrorcodeadminnotification && this.edierrorcodeadminnotification.AdminId || null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Numeric,
                    inputType: NumericInputTypes.Integer,
                    scale: null,
                }),
            }),
            Archived: new DynamicLabel({
                label: 'Archived',
                value: this.edierrorcodeadminnotification && this.edierrorcodeadminnotification.hasOwnProperty('Archived') && this.edierrorcodeadminnotification.Archived != null ? this.edierrorcodeadminnotification.Archived : false,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Checkbox,
                    inputType: null,
                    scale: null,
                }),
            }),
        };

    }
}
