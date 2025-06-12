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
import { IRevokeAccess } from '../interfaces/revoke-access';
import { IProvider } from '../interfaces/provider';

export interface IRevokeAccessDynamicControlsParameters {
    formGroup?: string;
    providers?: IProvider[];
}

export class RevokeAccessDynamicControls {

    formGroup: string;
    providers?: IProvider[];

    Form: IExpandableObject;
    View: IExpandableObject;

    constructor(private revokeaccess?: IRevokeAccess, additionalParameters?: IRevokeAccessDynamicControlsParameters) {
        this.formGroup = additionalParameters && additionalParameters.formGroup || 'RevokeAccess';
        this.providers = additionalParameters && additionalParameters.providers || undefined;

        this.Form = {
            AccessGranted: new DynamicField({
                formGroup: this.formGroup,
                label: 'Access Granted',
                name: 'AccessGranted',
                options: null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Checkbox,
                    inputType: null,
                    scale: null,
                }),
                validation: [  ],
                validators: {  },
                value: this.revokeaccess && this.revokeaccess.hasOwnProperty('AccessGranted') && this.revokeaccess.AccessGranted != null ? this.revokeaccess.AccessGranted : false,
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
                value: this.revokeaccess && this.revokeaccess.Date || null,
            }),
            OtherReason: new DynamicField({
                formGroup: this.formGroup,
                label: 'Other Reason',
                name: 'OtherReason',
                options: null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: null,
                    scale: null,
                }),
                validation: [ Validators.maxLength(250) ],
                validators: { 'maxlength': 250 },
                value: this.revokeaccess && this.revokeaccess.hasOwnProperty('OtherReason') && this.revokeaccess.OtherReason != null ? this.revokeaccess.OtherReason.toString() : '',
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
                value: this.revokeaccess && this.revokeaccess.ProviderId || null,
            }),
            RevocationReasonId: new DynamicField({
                formGroup: this.formGroup,
                label: 'Revocation Reason',
                name: 'RevocationReasonId',
                options: null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Numeric,
                    inputType: NumericInputTypes.Integer,
                    scale: null,
                }),
                validation: [  ],
                validators: {  },
                value: this.revokeaccess && this.revokeaccess.RevocationReasonId || null,
            }),
        };

        this.View = {
            AccessGranted: new DynamicLabel({
                label: 'Access Granted',
                value: this.revokeaccess && this.revokeaccess.hasOwnProperty('AccessGranted') && this.revokeaccess.AccessGranted != null ? this.revokeaccess.AccessGranted : false,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Checkbox,
                    inputType: null,
                    scale: null,
                }),
            }),
            Date: new DynamicLabel({
                label: 'Date',
                value: this.revokeaccess && this.revokeaccess.Date || null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: InputTypes.Datepicker,
                    scale: null,
                }),
            }),
            OtherReason: new DynamicLabel({
                label: 'Other Reason',
                value: this.revokeaccess && this.revokeaccess.hasOwnProperty('OtherReason') && this.revokeaccess.OtherReason != null ? this.revokeaccess.OtherReason.toString() : '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: null,
                    scale: null,
                }),
            }),
            ProviderId: new DynamicLabel({
                label: 'Provider',
                value: getMetaItemValue(this.providers as unknown as IMetaItem[], this.revokeaccess && this.revokeaccess.hasOwnProperty('ProviderId') ? this.revokeaccess.ProviderId : null) ?? '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
            }),
            RevocationReasonId: new DynamicLabel({
                label: 'Revocation Reason',
                value: this.revokeaccess && this.revokeaccess.RevocationReasonId || null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Numeric,
                    inputType: NumericInputTypes.Integer,
                    scale: null,
                }),
            }),
        };

    }
}
