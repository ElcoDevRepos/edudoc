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
import { IMessageLink } from '../interfaces/message-link';
import { IUser } from '../interfaces/user';
import { IEsc } from '../interfaces/esc';
import { IMessageFilterType } from '../interfaces/message-filter-type';
import { IProvider } from '../interfaces/provider';
import { IProviderTitle } from '../interfaces/provider-title';
import { ISchoolDistrict } from '../interfaces/school-district';
import { IServiceCode } from '../interfaces/service-code';
import { ITrainingType } from '../interfaces/training-type';

export interface IMessageLinkDynamicControlsParameters {
    formGroup?: string;
    trainingTypes?: ITrainingType[];
    createdBies?: IUser[];
    modifiedBies?: IUser[];
    messageFilterTypes?: IMessageFilterType[];
    serviceCodes?: IServiceCode[];
    schoolDistricts?: ISchoolDistrict[];
    providerTitles?: IProviderTitle[];
    providers?: IProvider[];
    escs?: IEsc[];
}

export class MessageLinkDynamicControls {

    formGroup: string;
    trainingTypes?: ITrainingType[];
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

    constructor(private messagelink?: IMessageLink, additionalParameters?: IMessageLinkDynamicControlsParameters) {
        this.formGroup = additionalParameters && additionalParameters.formGroup || 'MessageLink';
        this.trainingTypes = additionalParameters && additionalParameters.trainingTypes || undefined;
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
                value: this.messagelink && this.messagelink.hasOwnProperty('Archived') && this.messagelink.Archived != null ? this.messagelink.Archived : false,
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
                value: this.messagelink && this.messagelink.CreatedById || 1,
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
                value: this.messagelink && this.messagelink.DateCreated || null,
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
                value: this.messagelink && this.messagelink.DateModified || null,
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
                validation: [ Validators.required, Validators.maxLength(200) ],
                validators: { 'required': true, 'maxlength': 200 },
                value: this.messagelink && this.messagelink.hasOwnProperty('Description') && this.messagelink.Description != null ? this.messagelink.Description.toString() : '',
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
                value: this.messagelink && this.messagelink.DueDate || null,
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
                value: this.messagelink && this.messagelink.EscId || null,
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
                value: this.messagelink && this.messagelink.hasOwnProperty('ForDistrictAdmins') && this.messagelink.ForDistrictAdmins != null ? this.messagelink.ForDistrictAdmins : false,
            }),
            Mandatory: new DynamicField({
                formGroup: this.formGroup,
                label: 'Mandatory',
                name: 'Mandatory',
                options: null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Checkbox,
                    inputType: null,
                    scale: null,
                }),
                validation: [  ],
                validators: {  },
                value: this.messagelink && this.messagelink.hasOwnProperty('Mandatory') && this.messagelink.Mandatory != null ? this.messagelink.Mandatory : false,
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
                value: this.messagelink && this.messagelink.MessageFilterTypeId || null,
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
                value: this.messagelink && this.messagelink.ModifiedById || null,
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
                value: this.messagelink && this.messagelink.ProviderId || null,
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
                value: this.messagelink && this.messagelink.ProviderTitleId || null,
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
                value: this.messagelink && this.messagelink.SchoolDistrictId || null,
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
                value: this.messagelink && this.messagelink.ServiceCodeId || null,
            }),
            TrainingTypeId: new DynamicField({
                formGroup: this.formGroup,
                label: 'Training Type',
                name: 'TrainingTypeId',
                options: this.trainingTypes,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
                validation: [  ],
                validators: {  },
                value: this.messagelink && this.messagelink.TrainingTypeId || null,
            }),
            Url: new DynamicField({
                formGroup: this.formGroup,
                label: 'Url',
                name: 'Url',
                options: null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: null,
                    scale: null,
                }),
                validation: [ Validators.required, Validators.maxLength(1000) ],
                validators: { 'required': true, 'maxlength': 1000 },
                value: this.messagelink && this.messagelink.hasOwnProperty('Url') && this.messagelink.Url != null ? this.messagelink.Url.toString() : '',
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
                value: this.messagelink && this.messagelink.ValidTill || null,
            }),
        };

        this.View = {
            Archived: new DynamicLabel({
                label: 'Archived',
                value: this.messagelink && this.messagelink.hasOwnProperty('Archived') && this.messagelink.Archived != null ? this.messagelink.Archived : false,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Checkbox,
                    inputType: null,
                    scale: null,
                }),
            }),
            CreatedById: new DynamicLabel({
                label: 'Created By',
                value: getMetaItemValue(this.createdBies as unknown as IMetaItem[], this.messagelink && this.messagelink.hasOwnProperty('CreatedById') ? this.messagelink.CreatedById : null) ?? '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
            }),
            DateCreated: new DynamicLabel({
                label: 'Date Created',
                value: this.messagelink && this.messagelink.DateCreated || null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: InputTypes.Datepicker,
                    scale: null,
                }),
            }),
            DateModified: new DynamicLabel({
                label: 'Date Modified',
                value: this.messagelink && this.messagelink.DateModified || null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: InputTypes.Datepicker,
                    scale: null,
                }),
            }),
            Description: new DynamicLabel({
                label: 'Description',
                value: this.messagelink && this.messagelink.hasOwnProperty('Description') && this.messagelink.Description != null ? this.messagelink.Description.toString() : '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: null,
                    scale: null,
                }),
            }),
            DueDate: new DynamicLabel({
                label: 'Due Date',
                value: this.messagelink && this.messagelink.DueDate || null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: InputTypes.Datepicker,
                    scale: null,
                }),
            }),
            EscId: new DynamicLabel({
                label: 'Esc',
                value: getMetaItemValue(this.escs as unknown as IMetaItem[], this.messagelink && this.messagelink.hasOwnProperty('EscId') ? this.messagelink.EscId : null) ?? '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
            }),
            ForDistrictAdmins: new DynamicLabel({
                label: 'For District Admins',
                value: this.messagelink && this.messagelink.hasOwnProperty('ForDistrictAdmins') && this.messagelink.ForDistrictAdmins != null ? this.messagelink.ForDistrictAdmins : false,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Checkbox,
                    inputType: null,
                    scale: null,
                }),
            }),
            Mandatory: new DynamicLabel({
                label: 'Mandatory',
                value: this.messagelink && this.messagelink.hasOwnProperty('Mandatory') && this.messagelink.Mandatory != null ? this.messagelink.Mandatory : false,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Checkbox,
                    inputType: null,
                    scale: null,
                }),
            }),
            MessageFilterTypeId: new DynamicLabel({
                label: 'Message Filter Type',
                value: getMetaItemValue(this.messageFilterTypes as unknown as IMetaItem[], this.messagelink && this.messagelink.hasOwnProperty('MessageFilterTypeId') ? this.messagelink.MessageFilterTypeId : null) ?? '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
            }),
            ModifiedById: new DynamicLabel({
                label: 'Modified By',
                value: getMetaItemValue(this.modifiedBies as unknown as IMetaItem[], this.messagelink && this.messagelink.hasOwnProperty('ModifiedById') ? this.messagelink.ModifiedById : null) ?? '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
            }),
            ProviderId: new DynamicLabel({
                label: 'Provider',
                value: getMetaItemValue(this.providers as unknown as IMetaItem[], this.messagelink && this.messagelink.hasOwnProperty('ProviderId') ? this.messagelink.ProviderId : null) ?? '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
            }),
            ProviderTitleId: new DynamicLabel({
                label: 'Provider Title',
                value: getMetaItemValue(this.providerTitles as unknown as IMetaItem[], this.messagelink && this.messagelink.hasOwnProperty('ProviderTitleId') ? this.messagelink.ProviderTitleId : null) ?? '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
            }),
            SchoolDistrictId: new DynamicLabel({
                label: 'School District',
                value: getMetaItemValue(this.schoolDistricts as unknown as IMetaItem[], this.messagelink && this.messagelink.hasOwnProperty('SchoolDistrictId') ? this.messagelink.SchoolDistrictId : null) ?? '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
            }),
            ServiceCodeId: new DynamicLabel({
                label: 'Service Code',
                value: getMetaItemValue(this.serviceCodes as unknown as IMetaItem[], this.messagelink && this.messagelink.hasOwnProperty('ServiceCodeId') ? this.messagelink.ServiceCodeId : null) ?? '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
            }),
            TrainingTypeId: new DynamicLabel({
                label: 'Training Type',
                value: getMetaItemValue(this.trainingTypes as unknown as IMetaItem[], this.messagelink && this.messagelink.hasOwnProperty('TrainingTypeId') ? this.messagelink.TrainingTypeId : null) ?? '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
            }),
            Url: new DynamicLabel({
                label: 'Url',
                value: this.messagelink && this.messagelink.hasOwnProperty('Url') && this.messagelink.Url != null ? this.messagelink.Url.toString() : '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: null,
                    scale: null,
                }),
            }),
            ValidTill: new DynamicLabel({
                label: 'Valid Till',
                value: this.messagelink && this.messagelink.ValidTill || null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: InputTypes.Datepicker,
                    scale: null,
                }),
            }),
        };

    }
}
