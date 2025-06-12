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
import { IMessageDocument } from '../interfaces/message-document';
import { IUser } from '../interfaces/user';
import { IEsc } from '../interfaces/esc';
import { IMessageFilterType } from '../interfaces/message-filter-type';
import { IProvider } from '../interfaces/provider';
import { IProviderTitle } from '../interfaces/provider-title';
import { ISchoolDistrict } from '../interfaces/school-district';
import { IServiceCode } from '../interfaces/service-code';
import { ITrainingType } from '../interfaces/training-type';

export interface IMessageDocumentDynamicControlsParameters {
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

export class MessageDocumentDynamicControls {

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

    constructor(private messagedocument?: IMessageDocument, additionalParameters?: IMessageDocumentDynamicControlsParameters) {
        this.formGroup = additionalParameters && additionalParameters.formGroup || 'MessageDocument';
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
                value: this.messagedocument && this.messagedocument.hasOwnProperty('Archived') && this.messagedocument.Archived != null ? this.messagedocument.Archived : false,
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
                value: this.messagedocument && this.messagedocument.CreatedById || 1,
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
                value: this.messagedocument && this.messagedocument.DateCreated || null,
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
                value: this.messagedocument && this.messagedocument.DateModified || null,
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
                value: this.messagedocument && this.messagedocument.hasOwnProperty('Description') && this.messagedocument.Description != null ? this.messagedocument.Description.toString() : '',
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
                value: this.messagedocument && this.messagedocument.DueDate || null,
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
                value: this.messagedocument && this.messagedocument.EscId || null,
            }),
            FileName: new DynamicField({
                formGroup: this.formGroup,
                label: 'File Name',
                name: 'FileName',
                options: null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: null,
                    scale: null,
                }),
                validation: [ Validators.required, Validators.maxLength(200) ],
                validators: { 'required': true, 'maxlength': 200 },
                value: this.messagedocument && this.messagedocument.hasOwnProperty('FileName') && this.messagedocument.FileName != null ? this.messagedocument.FileName.toString() : '',
            }),
            FilePath: new DynamicField({
                formGroup: this.formGroup,
                label: 'File Path',
                name: 'FilePath',
                options: null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: null,
                    scale: null,
                }),
                validation: [ Validators.required, Validators.maxLength(500) ],
                validators: { 'required': true, 'maxlength': 500 },
                value: this.messagedocument && this.messagedocument.hasOwnProperty('FilePath') && this.messagedocument.FilePath != null ? this.messagedocument.FilePath.toString() : '',
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
                value: this.messagedocument && this.messagedocument.hasOwnProperty('ForDistrictAdmins') && this.messagedocument.ForDistrictAdmins != null ? this.messagedocument.ForDistrictAdmins : false,
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
                value: this.messagedocument && this.messagedocument.hasOwnProperty('Mandatory') && this.messagedocument.Mandatory != null ? this.messagedocument.Mandatory : false,
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
                value: this.messagedocument && this.messagedocument.MessageFilterTypeId || null,
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
                value: this.messagedocument && this.messagedocument.ModifiedById || null,
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
                value: this.messagedocument && this.messagedocument.ProviderId || null,
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
                value: this.messagedocument && this.messagedocument.ProviderTitleId || null,
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
                value: this.messagedocument && this.messagedocument.SchoolDistrictId || null,
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
                value: this.messagedocument && this.messagedocument.ServiceCodeId || null,
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
                value: this.messagedocument && this.messagedocument.TrainingTypeId || null,
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
                value: this.messagedocument && this.messagedocument.ValidTill || null,
            }),
        };

        this.View = {
            Archived: new DynamicLabel({
                label: 'Archived',
                value: this.messagedocument && this.messagedocument.hasOwnProperty('Archived') && this.messagedocument.Archived != null ? this.messagedocument.Archived : false,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Checkbox,
                    inputType: null,
                    scale: null,
                }),
            }),
            CreatedById: new DynamicLabel({
                label: 'Created By',
                value: getMetaItemValue(this.createdBies as unknown as IMetaItem[], this.messagedocument && this.messagedocument.hasOwnProperty('CreatedById') ? this.messagedocument.CreatedById : null) ?? '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
            }),
            DateCreated: new DynamicLabel({
                label: 'Date Created',
                value: this.messagedocument && this.messagedocument.DateCreated || null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: InputTypes.Datepicker,
                    scale: null,
                }),
            }),
            DateModified: new DynamicLabel({
                label: 'Date Modified',
                value: this.messagedocument && this.messagedocument.DateModified || null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: InputTypes.Datepicker,
                    scale: null,
                }),
            }),
            Description: new DynamicLabel({
                label: 'Description',
                value: this.messagedocument && this.messagedocument.hasOwnProperty('Description') && this.messagedocument.Description != null ? this.messagedocument.Description.toString() : '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: null,
                    scale: null,
                }),
            }),
            DueDate: new DynamicLabel({
                label: 'Due Date',
                value: this.messagedocument && this.messagedocument.DueDate || null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: InputTypes.Datepicker,
                    scale: null,
                }),
            }),
            EscId: new DynamicLabel({
                label: 'Esc',
                value: getMetaItemValue(this.escs as unknown as IMetaItem[], this.messagedocument && this.messagedocument.hasOwnProperty('EscId') ? this.messagedocument.EscId : null) ?? '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
            }),
            FileName: new DynamicLabel({
                label: 'File Name',
                value: this.messagedocument && this.messagedocument.hasOwnProperty('FileName') && this.messagedocument.FileName != null ? this.messagedocument.FileName.toString() : '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: null,
                    scale: null,
                }),
            }),
            FilePath: new DynamicLabel({
                label: 'File Path',
                value: this.messagedocument && this.messagedocument.hasOwnProperty('FilePath') && this.messagedocument.FilePath != null ? this.messagedocument.FilePath.toString() : '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: null,
                    scale: null,
                }),
            }),
            ForDistrictAdmins: new DynamicLabel({
                label: 'For District Admins',
                value: this.messagedocument && this.messagedocument.hasOwnProperty('ForDistrictAdmins') && this.messagedocument.ForDistrictAdmins != null ? this.messagedocument.ForDistrictAdmins : false,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Checkbox,
                    inputType: null,
                    scale: null,
                }),
            }),
            Mandatory: new DynamicLabel({
                label: 'Mandatory',
                value: this.messagedocument && this.messagedocument.hasOwnProperty('Mandatory') && this.messagedocument.Mandatory != null ? this.messagedocument.Mandatory : false,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Checkbox,
                    inputType: null,
                    scale: null,
                }),
            }),
            MessageFilterTypeId: new DynamicLabel({
                label: 'Message Filter Type',
                value: getMetaItemValue(this.messageFilterTypes as unknown as IMetaItem[], this.messagedocument && this.messagedocument.hasOwnProperty('MessageFilterTypeId') ? this.messagedocument.MessageFilterTypeId : null) ?? '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
            }),
            ModifiedById: new DynamicLabel({
                label: 'Modified By',
                value: getMetaItemValue(this.modifiedBies as unknown as IMetaItem[], this.messagedocument && this.messagedocument.hasOwnProperty('ModifiedById') ? this.messagedocument.ModifiedById : null) ?? '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
            }),
            ProviderId: new DynamicLabel({
                label: 'Provider',
                value: getMetaItemValue(this.providers as unknown as IMetaItem[], this.messagedocument && this.messagedocument.hasOwnProperty('ProviderId') ? this.messagedocument.ProviderId : null) ?? '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
            }),
            ProviderTitleId: new DynamicLabel({
                label: 'Provider Title',
                value: getMetaItemValue(this.providerTitles as unknown as IMetaItem[], this.messagedocument && this.messagedocument.hasOwnProperty('ProviderTitleId') ? this.messagedocument.ProviderTitleId : null) ?? '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
            }),
            SchoolDistrictId: new DynamicLabel({
                label: 'School District',
                value: getMetaItemValue(this.schoolDistricts as unknown as IMetaItem[], this.messagedocument && this.messagedocument.hasOwnProperty('SchoolDistrictId') ? this.messagedocument.SchoolDistrictId : null) ?? '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
            }),
            ServiceCodeId: new DynamicLabel({
                label: 'Service Code',
                value: getMetaItemValue(this.serviceCodes as unknown as IMetaItem[], this.messagedocument && this.messagedocument.hasOwnProperty('ServiceCodeId') ? this.messagedocument.ServiceCodeId : null) ?? '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
            }),
            TrainingTypeId: new DynamicLabel({
                label: 'Training Type',
                value: getMetaItemValue(this.trainingTypes as unknown as IMetaItem[], this.messagedocument && this.messagedocument.hasOwnProperty('TrainingTypeId') ? this.messagedocument.TrainingTypeId : null) ?? '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
            }),
            ValidTill: new DynamicLabel({
                label: 'Valid Till',
                value: this.messagedocument && this.messagedocument.ValidTill || null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: InputTypes.Datepicker,
                    scale: null,
                }),
            }),
        };

    }
}
