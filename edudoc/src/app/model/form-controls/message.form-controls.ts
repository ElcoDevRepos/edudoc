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
import { IMessage } from '../interfaces/message';
import { IUser } from '../interfaces/user';
import { IEsc } from '../interfaces/esc';
import { IMessageFilterType } from '../interfaces/message-filter-type';
import { IProvider } from '../interfaces/provider';
import { IProviderTitle } from '../interfaces/provider-title';
import { ISchoolDistrict } from '../interfaces/school-district';
import { IServiceCode } from '../interfaces/service-code';

export interface IMessageDynamicControlsParameters {
    formGroup?: string;
    createdBies?: IUser[];
    modifiedBies?: IUser[];
    messageFilterTypes?: IMessageFilterType[];
    serviceCodes?: IServiceCode[];
    schoolDistricts?: ISchoolDistrict[];
    providerTitles?: IProviderTitle[];
    providers?: IProvider[];
    escs?: IEsc[];
}

export class MessageDynamicControls {

    formGroup: string;
    createdBies?: IUser[];
    modifiedBies?: IUser[];
    messageFilterTypes?: IMessageFilterType[];
    serviceCodes?: IServiceCode[];
    schoolDistricts?: ISchoolDistrict[];
    providerTitles?: IProviderTitle[];
    providers?: IProvider[];
    escs?: IEsc[];

    Form: IExpandableObject;
    View: IExpandableObject;

    constructor(private message?: IMessage, additionalParameters?: IMessageDynamicControlsParameters) {
        this.formGroup = additionalParameters && additionalParameters.formGroup || 'Message';
        this.createdBies = additionalParameters && additionalParameters.createdBies || undefined;
        this.modifiedBies = additionalParameters && additionalParameters.modifiedBies || undefined;
        this.messageFilterTypes = additionalParameters && additionalParameters.messageFilterTypes || undefined;
        this.serviceCodes = additionalParameters && additionalParameters.serviceCodes || undefined;
        this.schoolDistricts = additionalParameters && additionalParameters.schoolDistricts || undefined;
        this.providerTitles = additionalParameters && additionalParameters.providerTitles || undefined;
        this.providers = additionalParameters && additionalParameters.providers || undefined;
        this.escs = additionalParameters && additionalParameters.escs || undefined;

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
                value: this.message && this.message.hasOwnProperty('Archived') && this.message.Archived != null ? this.message.Archived : false,
            }),
            Body: new DynamicField({
                formGroup: this.formGroup,
                label: 'Body',
                name: 'Body',
                options: null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: null,
                    scale: null,
                }),
                validation: [ Validators.required, Validators.maxLength(2147483647) ],
                validators: { 'required': true, 'maxlength': 2147483647 },
                value: this.message && this.message.hasOwnProperty('Body') && this.message.Body != null ? this.message.Body.toString() : '',
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
                value: this.message && this.message.CreatedById || 1,
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
                value: this.message && this.message.DateCreated || null,
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
                value: this.message && this.message.DateModified || null,
            }),
            Description: new DynamicField({
                formGroup: this.formGroup,
                label: 'Description',
                name: 'Description',
                options: null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: null,
                    scale: null,
                }),
                validation: [ Validators.required, Validators.maxLength(500) ],
                validators: { 'required': true, 'maxlength': 500 },
                value: this.message && this.message.hasOwnProperty('Description') && this.message.Description != null ? this.message.Description.toString() : '',
            }),
            EscId: new DynamicField({
                formGroup: this.formGroup,
                label: 'Esc',
                name: 'EscId',
                options: this.escs,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
                validation: [  ],
                validators: {  },
                value: this.message && this.message.EscId || null,
            }),
            ForDistrictAdmins: new DynamicField({
                formGroup: this.formGroup,
                label: 'For District Admins',
                name: 'ForDistrictAdmins',
                options: null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Checkbox,
                    inputType: null,
                    scale: null,
                }),
                validation: [  ],
                validators: {  },
                value: this.message && this.message.hasOwnProperty('ForDistrictAdmins') && this.message.ForDistrictAdmins != null ? this.message.ForDistrictAdmins : false,
            }),
            MessageFilterTypeId: new DynamicField({
                formGroup: this.formGroup,
                label: 'Message Filter Type',
                name: 'MessageFilterTypeId',
                options: this.messageFilterTypes,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
                validation: [ noZeroRequiredValidator ],
                validators: { 'required': true },
                value: this.message && this.message.MessageFilterTypeId || null,
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
                value: this.message && this.message.ModifiedById || null,
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
                validation: [  ],
                validators: {  },
                value: this.message && this.message.ProviderId || null,
            }),
            ProviderTitleId: new DynamicField({
                formGroup: this.formGroup,
                label: 'Provider Title',
                name: 'ProviderTitleId',
                options: this.providerTitles,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
                validation: [  ],
                validators: {  },
                value: this.message && this.message.ProviderTitleId || null,
            }),
            SchoolDistrictId: new DynamicField({
                formGroup: this.formGroup,
                label: 'School District',
                name: 'SchoolDistrictId',
                options: this.schoolDistricts,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
                validation: [  ],
                validators: {  },
                value: this.message && this.message.SchoolDistrictId || null,
            }),
            ServiceCodeId: new DynamicField({
                formGroup: this.formGroup,
                label: 'Service Code',
                name: 'ServiceCodeId',
                options: this.serviceCodes,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
                validation: [  ],
                validators: {  },
                value: this.message && this.message.ServiceCodeId || null,
            }),
            SortOrder: new DynamicField({
                formGroup: this.formGroup,
                label: 'Sort Order',
                name: 'SortOrder',
                options: null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Numeric,
                    inputType: NumericInputTypes.Integer,
                    scale: null,
                }),
                validation: [  ],
                validators: {  },
                value: this.message && this.message.SortOrder || null,
            }),
            ValidTill: new DynamicField({
                formGroup: this.formGroup,
                label: 'Valid Till',
                name: 'ValidTill',
                options: null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: InputTypes.Datepicker,
                    scale: null,
                }),
                validation: [  ],
                validators: {  },
                value: this.message && this.message.ValidTill || null,
            }),
        };

        this.View = {
            Archived: new DynamicLabel({
                label: 'Archived',
                value: this.message && this.message.hasOwnProperty('Archived') && this.message.Archived != null ? this.message.Archived : false,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Checkbox,
                    inputType: null,
                    scale: null,
                }),
            }),
            Body: new DynamicLabel({
                label: 'Body',
                value: this.message && this.message.hasOwnProperty('Body') && this.message.Body != null ? this.message.Body.toString() : '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: null,
                    scale: null,
                }),
            }),
            CreatedById: new DynamicLabel({
                label: 'Created By',
                value: getMetaItemValue(this.createdBies as unknown as IMetaItem[], this.message && this.message.hasOwnProperty('CreatedById') ? this.message.CreatedById : null) ?? '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
            }),
            DateCreated: new DynamicLabel({
                label: 'Date Created',
                value: this.message && this.message.DateCreated || null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: InputTypes.Datepicker,
                    scale: null,
                }),
            }),
            DateModified: new DynamicLabel({
                label: 'Date Modified',
                value: this.message && this.message.DateModified || null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: InputTypes.Datepicker,
                    scale: null,
                }),
            }),
            Description: new DynamicLabel({
                label: 'Description',
                value: this.message && this.message.hasOwnProperty('Description') && this.message.Description != null ? this.message.Description.toString() : '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: null,
                    scale: null,
                }),
            }),
            EscId: new DynamicLabel({
                label: 'Esc',
                value: getMetaItemValue(this.escs as unknown as IMetaItem[], this.message && this.message.hasOwnProperty('EscId') ? this.message.EscId : null) ?? '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
            }),
            ForDistrictAdmins: new DynamicLabel({
                label: 'For District Admins',
                value: this.message && this.message.hasOwnProperty('ForDistrictAdmins') && this.message.ForDistrictAdmins != null ? this.message.ForDistrictAdmins : false,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Checkbox,
                    inputType: null,
                    scale: null,
                }),
            }),
            MessageFilterTypeId: new DynamicLabel({
                label: 'Message Filter Type',
                value: getMetaItemValue(this.messageFilterTypes as unknown as IMetaItem[], this.message && this.message.hasOwnProperty('MessageFilterTypeId') ? this.message.MessageFilterTypeId : null) ?? '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
            }),
            ModifiedById: new DynamicLabel({
                label: 'Modified By',
                value: getMetaItemValue(this.modifiedBies as unknown as IMetaItem[], this.message && this.message.hasOwnProperty('ModifiedById') ? this.message.ModifiedById : null) ?? '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
            }),
            ProviderId: new DynamicLabel({
                label: 'Provider',
                value: getMetaItemValue(this.providers as unknown as IMetaItem[], this.message && this.message.hasOwnProperty('ProviderId') ? this.message.ProviderId : null) ?? '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
            }),
            ProviderTitleId: new DynamicLabel({
                label: 'Provider Title',
                value: getMetaItemValue(this.providerTitles as unknown as IMetaItem[], this.message && this.message.hasOwnProperty('ProviderTitleId') ? this.message.ProviderTitleId : null) ?? '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
            }),
            SchoolDistrictId: new DynamicLabel({
                label: 'School District',
                value: getMetaItemValue(this.schoolDistricts as unknown as IMetaItem[], this.message && this.message.hasOwnProperty('SchoolDistrictId') ? this.message.SchoolDistrictId : null) ?? '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
            }),
            ServiceCodeId: new DynamicLabel({
                label: 'Service Code',
                value: getMetaItemValue(this.serviceCodes as unknown as IMetaItem[], this.message && this.message.hasOwnProperty('ServiceCodeId') ? this.message.ServiceCodeId : null) ?? '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
            }),
            SortOrder: new DynamicLabel({
                label: 'Sort Order',
                value: this.message && this.message.SortOrder || null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Numeric,
                    inputType: NumericInputTypes.Integer,
                    scale: null,
                }),
            }),
            ValidTill: new DynamicLabel({
                label: 'Valid Till',
                value: this.message && this.message.ValidTill || null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: InputTypes.Datepicker,
                    scale: null,
                }),
            }),
        };

    }
}
