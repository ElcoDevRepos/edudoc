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
import { IProvider } from '../interfaces/provider';
import { IUser } from '../interfaces/user';
import { IProviderDoNotBillReason } from '../interfaces/provider-do-not-bill-reason';
import { IProviderEmploymentType } from '../interfaces/provider-employment-type';
import { IProviderTitle } from '../interfaces/provider-title';

export interface IProviderDynamicControlsParameters {
    formGroup?: string;
    providerUsers?: IUser[];
    titles?: IProviderTitle[];
    providerEmploymentTypes?: IProviderEmploymentType[];
    createdBies?: IUser[];
    modifiedBies?: IUser[];
    doNotBillReasons?: IProviderDoNotBillReason[];
}

export class ProviderDynamicControls {

    formGroup: string;
    providerUsers?: IUser[];
    titles?: IProviderTitle[];
    providerEmploymentTypes?: IProviderEmploymentType[];
    createdBies?: IUser[];
    modifiedBies?: IUser[];
    doNotBillReasons?: IProviderDoNotBillReason[];

    Form: IExpandableObject;
    View: IExpandableObject;

    constructor(private provider?: IProvider, additionalParameters?: IProviderDynamicControlsParameters) {
        this.formGroup = additionalParameters && additionalParameters.formGroup || 'Provider';
        this.providerUsers = additionalParameters && additionalParameters.providerUsers || undefined;
        this.titles = additionalParameters && additionalParameters.titles || undefined;
        this.providerEmploymentTypes = additionalParameters && additionalParameters.providerEmploymentTypes || undefined;
        this.createdBies = additionalParameters && additionalParameters.createdBies || undefined;
        this.modifiedBies = additionalParameters && additionalParameters.modifiedBies || undefined;
        this.doNotBillReasons = additionalParameters && additionalParameters.doNotBillReasons || undefined;

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
                value: this.provider && this.provider.hasOwnProperty('Archived') && this.provider.Archived != null ? this.provider.Archived : false,
            }),
            BlockedReason: new DynamicField({
                formGroup: this.formGroup,
                label: 'Blocked Reason',
                name: 'BlockedReason',
                options: null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: null,
                    scale: null,
                }),
                validation: [ Validators.maxLength(250) ],
                validators: { 'maxlength': 250 },
                value: this.provider && this.provider.hasOwnProperty('BlockedReason') && this.provider.BlockedReason != null ? this.provider.BlockedReason.toString() : '',
            }),
            CreatedById: new DynamicField({
                formGroup: this.formGroup,
                label: 'Created By',
                name: 'CreatedById',
                options: this.createdBies,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
                validation: [  ],
                validators: {  },
                value: this.provider && this.provider.CreatedById || 1,
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
                value: this.provider && this.provider.DateCreated || null,
            }),
            DateModified: new DynamicField({
                formGroup: this.formGroup,
                label: 'Date Modified',
                name: 'DateModified',
                options: null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: InputTypes.Datepicker,
                    scale: null,
                }),
                validation: [  ],
                validators: {  },
                value: this.provider && this.provider.DateModified || null,
            }),
            DocumentationDate: new DynamicField({
                formGroup: this.formGroup,
                label: 'Documentation Date',
                name: 'DocumentationDate',
                options: null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: InputTypes.Datepicker,
                    scale: null,
                }),
                validation: [  ],
                validators: {  },
                value: this.provider && this.provider.DocumentationDate || null,
            }),
            DoNotBillReasonId: new DynamicField({
                formGroup: this.formGroup,
                label: 'Do Not Bill Reason',
                name: 'DoNotBillReasonId',
                options: this.doNotBillReasons,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
                validation: [  ],
                validators: {  },
                value: this.provider && this.provider.DoNotBillReasonId || null,
            }),
            ModifiedById: new DynamicField({
                formGroup: this.formGroup,
                label: 'Modified By',
                name: 'ModifiedById',
                options: this.modifiedBies,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
                validation: [  ],
                validators: {  },
                value: this.provider && this.provider.ModifiedById || null,
            }),
            Notes: new DynamicField({
                formGroup: this.formGroup,
                label: 'Notes',
                name: 'Notes',
                options: null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: null,
                    scale: null,
                }),
                validation: [ Validators.maxLength(2000) ],
                validators: { 'maxlength': 2000 },
                value: this.provider && this.provider.hasOwnProperty('Notes') && this.provider.Notes != null ? this.provider.Notes.toString() : '',
            }),
            Npi: new DynamicField({
                formGroup: this.formGroup,
                label: 'Npi',
                name: 'Npi',
                options: null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: null,
                    scale: null,
                }),
                validation: [ Validators.maxLength(10) ],
                validators: { 'maxlength': 10 },
                value: this.provider && this.provider.hasOwnProperty('Npi') && this.provider.Npi != null ? this.provider.Npi.toString() : '',
            }),
            OrpApprovalDate: new DynamicField({
                formGroup: this.formGroup,
                label: 'Orp Approval Date',
                name: 'OrpApprovalDate',
                options: null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: InputTypes.Datepicker,
                    scale: null,
                }),
                validation: [  ],
                validators: {  },
                value: this.provider && this.provider.OrpApprovalDate || null,
            }),
            OrpApprovalRequestDate: new DynamicField({
                formGroup: this.formGroup,
                label: 'Orp Approval Request Date',
                name: 'OrpApprovalRequestDate',
                options: null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: InputTypes.Datepicker,
                    scale: null,
                }),
                validation: [  ],
                validators: {  },
                value: this.provider && this.provider.OrpApprovalRequestDate || null,
            }),
            OrpDenialDate: new DynamicField({
                formGroup: this.formGroup,
                label: 'Orp Denial Date',
                name: 'OrpDenialDate',
                options: null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: InputTypes.Datepicker,
                    scale: null,
                }),
                validation: [  ],
                validators: {  },
                value: this.provider && this.provider.OrpDenialDate || null,
            }),
            Phone: new DynamicField({
                formGroup: this.formGroup,
                label: 'Phone',
                name: 'Phone',
                options: null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: null,
                    scale: null,
                }),
                validation: [ Validators.maxLength(50) ],
                validators: { 'maxlength': 50 },
                value: this.provider && this.provider.hasOwnProperty('Phone') && this.provider.Phone != null ? this.provider.Phone.toString() : '',
            }),
            ProviderEmploymentTypeId: new DynamicField({
                formGroup: this.formGroup,
                label: 'Provider Employment Type',
                name: 'ProviderEmploymentTypeId',
                options: this.providerEmploymentTypes,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
                validation: [ noZeroRequiredValidator ],
                validators: { 'required': true },
                value: this.provider && this.provider.ProviderEmploymentTypeId || null,
            }),
            ProviderUserId: new DynamicField({
                formGroup: this.formGroup,
                label: 'Provider User',
                name: 'ProviderUserId',
                options: this.providerUsers,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
                validation: [ noZeroRequiredValidator ],
                validators: { 'required': true },
                value: this.provider && this.provider.ProviderUserId || null,
            }),
            TitleId: new DynamicField({
                formGroup: this.formGroup,
                label: 'Title',
                name: 'TitleId',
                options: this.titles,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
                validation: [ noZeroRequiredValidator ],
                validators: { 'required': true },
                value: this.provider && this.provider.TitleId || null,
            }),
            VerifiedOrp: new DynamicField({
                formGroup: this.formGroup,
                label: 'Verified Orp',
                name: 'VerifiedOrp',
                options: null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Checkbox,
                    inputType: null,
                    scale: null,
                }),
                validation: [  ],
                validators: {  },
                value: this.provider && this.provider.hasOwnProperty('VerifiedOrp') && this.provider.VerifiedOrp != null ? this.provider.VerifiedOrp : false,
            }),
        };

        this.View = {
            Archived: new DynamicLabel({
                label: 'Archived',
                value: this.provider && this.provider.hasOwnProperty('Archived') && this.provider.Archived != null ? this.provider.Archived : false,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Checkbox,
                    inputType: null,
                    scale: null,
                }),
            }),
            BlockedReason: new DynamicLabel({
                label: 'Blocked Reason',
                value: this.provider && this.provider.hasOwnProperty('BlockedReason') && this.provider.BlockedReason != null ? this.provider.BlockedReason.toString() : '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: null,
                    scale: null,
                }),
            }),
            CreatedById: new DynamicLabel({
                label: 'Created By',
                value: getMetaItemValue(this.createdBies as unknown as IMetaItem[], this.provider && this.provider.hasOwnProperty('CreatedById') ? this.provider.CreatedById : null) ?? '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
            }),
            DateCreated: new DynamicLabel({
                label: 'Date Created',
                value: this.provider && this.provider.DateCreated || null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: InputTypes.Datepicker,
                    scale: null,
                }),
            }),
            DateModified: new DynamicLabel({
                label: 'Date Modified',
                value: this.provider && this.provider.DateModified || null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: InputTypes.Datepicker,
                    scale: null,
                }),
            }),
            DocumentationDate: new DynamicLabel({
                label: 'Documentation Date',
                value: this.provider && this.provider.DocumentationDate || null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: InputTypes.Datepicker,
                    scale: null,
                }),
            }),
            DoNotBillReasonId: new DynamicLabel({
                label: 'Do Not Bill Reason',
                value: getMetaItemValue(this.doNotBillReasons as unknown as IMetaItem[], this.provider && this.provider.hasOwnProperty('DoNotBillReasonId') ? this.provider.DoNotBillReasonId : null) ?? '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
            }),
            ModifiedById: new DynamicLabel({
                label: 'Modified By',
                value: getMetaItemValue(this.modifiedBies as unknown as IMetaItem[], this.provider && this.provider.hasOwnProperty('ModifiedById') ? this.provider.ModifiedById : null) ?? '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
            }),
            Notes: new DynamicLabel({
                label: 'Notes',
                value: this.provider && this.provider.hasOwnProperty('Notes') && this.provider.Notes != null ? this.provider.Notes.toString() : '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: null,
                    scale: null,
                }),
            }),
            Npi: new DynamicLabel({
                label: 'Npi',
                value: this.provider && this.provider.hasOwnProperty('Npi') && this.provider.Npi != null ? this.provider.Npi.toString() : '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: null,
                    scale: null,
                }),
            }),
            OrpApprovalDate: new DynamicLabel({
                label: 'Orp Approval Date',
                value: this.provider && this.provider.OrpApprovalDate || null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: InputTypes.Datepicker,
                    scale: null,
                }),
            }),
            OrpApprovalRequestDate: new DynamicLabel({
                label: 'Orp Approval Request Date',
                value: this.provider && this.provider.OrpApprovalRequestDate || null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: InputTypes.Datepicker,
                    scale: null,
                }),
            }),
            OrpDenialDate: new DynamicLabel({
                label: 'Orp Denial Date',
                value: this.provider && this.provider.OrpDenialDate || null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: InputTypes.Datepicker,
                    scale: null,
                }),
            }),
            Phone: new DynamicLabel({
                label: 'Phone',
                value: this.provider && this.provider.hasOwnProperty('Phone') && this.provider.Phone != null ? this.provider.Phone.toString() : '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: null,
                    scale: null,
                }),
            }),
            ProviderEmploymentTypeId: new DynamicLabel({
                label: 'Provider Employment Type',
                value: getMetaItemValue(this.providerEmploymentTypes as unknown as IMetaItem[], this.provider && this.provider.hasOwnProperty('ProviderEmploymentTypeId') ? this.provider.ProviderEmploymentTypeId : null) ?? '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
            }),
            ProviderUserId: new DynamicLabel({
                label: 'Provider User',
                value: getMetaItemValue(this.providerUsers as unknown as IMetaItem[], this.provider && this.provider.hasOwnProperty('ProviderUserId') ? this.provider.ProviderUserId : null) ?? '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
            }),
            TitleId: new DynamicLabel({
                label: 'Title',
                value: getMetaItemValue(this.titles as unknown as IMetaItem[], this.provider && this.provider.hasOwnProperty('TitleId') ? this.provider.TitleId : null) ?? '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
            }),
            VerifiedOrp: new DynamicLabel({
                label: 'Verified Orp',
                value: this.provider && this.provider.hasOwnProperty('VerifiedOrp') && this.provider.VerifiedOrp != null ? this.provider.VerifiedOrp : false,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Checkbox,
                    inputType: null,
                    scale: null,
                }),
            }),
        };

    }
}
