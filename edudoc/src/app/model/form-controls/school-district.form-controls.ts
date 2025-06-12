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
import { ISchoolDistrict } from '../interfaces/school-district';
import { IUser } from '../interfaces/user';
import { IAddress } from '../interfaces/address';
import { IContact } from '../interfaces/contact';

export interface ISchoolDistrictDynamicControlsParameters {
    formGroup?: string;
    createdBies?: IUser[];
    modifiedBies?: IUser[];
    addresses?: IAddress[];
    accountManagers?: IUser[];
    accountAssistants?: IUser[];
    treasurers?: IContact[];
    specialEducationDirectors?: IContact[];
}

export class SchoolDistrictDynamicControls {

    formGroup: string;
    createdBies?: IUser[];
    modifiedBies?: IUser[];
    addresses?: IAddress[];
    accountManagers?: IUser[];
    accountAssistants?: IUser[];
    treasurers?: IContact[];
    specialEducationDirectors?: IContact[];

    Form: IExpandableObject;
    View: IExpandableObject;

    constructor(private schooldistrict?: ISchoolDistrict, additionalParameters?: ISchoolDistrictDynamicControlsParameters) {
        this.formGroup = additionalParameters && additionalParameters.formGroup || 'SchoolDistrict';
        this.createdBies = additionalParameters && additionalParameters.createdBies || undefined;
        this.modifiedBies = additionalParameters && additionalParameters.modifiedBies || undefined;
        this.addresses = additionalParameters && additionalParameters.addresses || undefined;
        this.accountManagers = additionalParameters && additionalParameters.accountManagers || undefined;
        this.accountAssistants = additionalParameters && additionalParameters.accountAssistants || undefined;
        this.treasurers = additionalParameters && additionalParameters.treasurers || undefined;
        this.specialEducationDirectors = additionalParameters && additionalParameters.specialEducationDirectors || undefined;

        this.Form = {
            AccountAssistantId: new DynamicField({
                formGroup: this.formGroup,
                label: 'Account Assistant',
                name: 'AccountAssistantId',
                options: this.accountAssistants,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
                validation: [  ],
                validators: {  },
                value: this.schooldistrict && this.schooldistrict.AccountAssistantId || null,
            }),
            AccountManagerId: new DynamicField({
                formGroup: this.formGroup,
                label: 'Account Manager',
                name: 'AccountManagerId',
                options: this.accountManagers,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
                validation: [  ],
                validators: {  },
                value: this.schooldistrict && this.schooldistrict.AccountManagerId || null,
            }),
            ActiveStatus: new DynamicField({
                formGroup: this.formGroup,
                label: 'Active Status',
                name: 'ActiveStatus',
                options: null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Checkbox,
                    inputType: null,
                    scale: null,
                }),
                validation: [  ],
                validators: {  },
                value: this.schooldistrict && this.schooldistrict.hasOwnProperty('ActiveStatus') && this.schooldistrict.ActiveStatus != null ? this.schooldistrict.ActiveStatus : true,
            }),
            AddressId: new DynamicField({
                formGroup: this.formGroup,
                label: 'Address',
                name: 'AddressId',
                options: this.addresses,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
                validation: [  ],
                validators: {  },
                value: this.schooldistrict && this.schooldistrict.AddressId || null,
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
                value: this.schooldistrict && this.schooldistrict.hasOwnProperty('Archived') && this.schooldistrict.Archived != null ? this.schooldistrict.Archived : false,
            }),
            BecameClientDate: new DynamicField({
                formGroup: this.formGroup,
                label: 'Became Client Date',
                name: 'BecameClientDate',
                options: null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: InputTypes.Datepicker,
                    scale: null,
                }),
                validation: [  ],
                validators: {  },
                value: this.schooldistrict && this.schooldistrict.BecameClientDate || null,
            }),
            BecameTradingPartnerDate: new DynamicField({
                formGroup: this.formGroup,
                label: 'Became Trading Partner Date',
                name: 'BecameTradingPartnerDate',
                options: null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: InputTypes.Datepicker,
                    scale: null,
                }),
                validation: [  ],
                validators: {  },
                value: this.schooldistrict && this.schooldistrict.BecameTradingPartnerDate || null,
            }),
            CaseNotesRequired: new DynamicField({
                formGroup: this.formGroup,
                label: 'Case Notes Required',
                name: 'CaseNotesRequired',
                options: null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Checkbox,
                    inputType: null,
                    scale: null,
                }),
                validation: [  ],
                validators: {  },
                value: this.schooldistrict && this.schooldistrict.hasOwnProperty('CaseNotesRequired') && this.schooldistrict.CaseNotesRequired != null ? this.schooldistrict.CaseNotesRequired : false,
            }),
            Code: new DynamicField({
                formGroup: this.formGroup,
                label: 'Code',
                name: 'Code',
                options: null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: null,
                    scale: null,
                }),
                validation: [ Validators.required, Validators.maxLength(50) ],
                validators: { 'required': true, 'maxlength': 50 },
                value: this.schooldistrict && this.schooldistrict.hasOwnProperty('Code') && this.schooldistrict.Code != null ? this.schooldistrict.Code.toString() : '',
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
                value: this.schooldistrict && this.schooldistrict.CreatedById || 1,
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
                value: this.schooldistrict && this.schooldistrict.DateCreated || null,
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
                value: this.schooldistrict && this.schooldistrict.DateModified || null,
            }),
            EinNumber: new DynamicField({
                formGroup: this.formGroup,
                label: 'Ein Number',
                name: 'EinNumber',
                options: null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: null,
                    scale: null,
                }),
                validation: [ Validators.required, Validators.maxLength(9) ],
                validators: { 'required': true, 'maxlength': 9 },
                value: this.schooldistrict && this.schooldistrict.hasOwnProperty('EinNumber') && this.schooldistrict.EinNumber != null ? this.schooldistrict.EinNumber.toString() : '',
            }),
            IepDatesRequired: new DynamicField({
                formGroup: this.formGroup,
                label: 'Iep Dates Required',
                name: 'IepDatesRequired',
                options: null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Checkbox,
                    inputType: null,
                    scale: null,
                }),
                validation: [  ],
                validators: {  },
                value: this.schooldistrict && this.schooldistrict.hasOwnProperty('IepDatesRequired') && this.schooldistrict.IepDatesRequired != null ? this.schooldistrict.IepDatesRequired : false,
            }),
            IrnNumber: new DynamicField({
                formGroup: this.formGroup,
                label: 'Irn Number',
                name: 'IrnNumber',
                options: null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: null,
                    scale: null,
                }),
                validation: [ Validators.required, Validators.maxLength(6) ],
                validators: { 'required': true, 'maxlength': 6 },
                value: this.schooldistrict && this.schooldistrict.hasOwnProperty('IrnNumber') && this.schooldistrict.IrnNumber != null ? this.schooldistrict.IrnNumber.toString() : '',
            }),
            MerId: new DynamicField({
                formGroup: this.formGroup,
                label: 'Mer',
                name: 'MerId',
                options: null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Numeric,
                    inputType: NumericInputTypes.Integer,
                    scale: null,
                }),
                validation: [  ],
                validators: {  },
                value: this.schooldistrict && this.schooldistrict.MerId || null,
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
                value: this.schooldistrict && this.schooldistrict.ModifiedById || null,
            }),
            Name: new DynamicField({
                formGroup: this.formGroup,
                label: 'Name',
                name: 'Name',
                options: null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: null,
                    scale: null,
                }),
                validation: [ Validators.required, Validators.maxLength(250) ],
                validators: { 'required': true, 'maxlength': 250 },
                value: this.schooldistrict && this.schooldistrict.hasOwnProperty('Name') && this.schooldistrict.Name != null ? this.schooldistrict.Name.toString() : '',
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
                validation: [ Validators.maxLength(1000) ],
                validators: { 'maxlength': 1000 },
                value: this.schooldistrict && this.schooldistrict.hasOwnProperty('Notes') && this.schooldistrict.Notes != null ? this.schooldistrict.Notes.toString() : '',
            }),
            NotesRequiredDate: new DynamicField({
                formGroup: this.formGroup,
                label: 'Notes Required Date',
                name: 'NotesRequiredDate',
                options: null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: InputTypes.Datepicker,
                    scale: null,
                }),
                validation: [  ],
                validators: {  },
                value: this.schooldistrict && this.schooldistrict.NotesRequiredDate || null,
            }),
            NpiNumber: new DynamicField({
                formGroup: this.formGroup,
                label: 'Npi Number',
                name: 'NpiNumber',
                options: null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: null,
                    scale: null,
                }),
                validation: [ Validators.required, Validators.maxLength(10) ],
                validators: { 'required': true, 'maxlength': 10 },
                value: this.schooldistrict && this.schooldistrict.hasOwnProperty('NpiNumber') && this.schooldistrict.NpiNumber != null ? this.schooldistrict.NpiNumber.toString() : '',
            }),
            ProgressReports: new DynamicField({
                formGroup: this.formGroup,
                label: 'Progress Reports',
                name: 'ProgressReports',
                options: null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Checkbox,
                    inputType: null,
                    scale: null,
                }),
                validation: [  ],
                validators: {  },
                value: this.schooldistrict && this.schooldistrict.hasOwnProperty('ProgressReports') && this.schooldistrict.ProgressReports != null ? this.schooldistrict.ProgressReports : false,
            }),
            ProgressReportsSent: new DynamicField({
                formGroup: this.formGroup,
                label: 'Progress Reports Sent',
                name: 'ProgressReportsSent',
                options: null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: InputTypes.Datepicker,
                    scale: null,
                }),
                validation: [  ],
                validators: {  },
                value: this.schooldistrict && this.schooldistrict.ProgressReportsSent || null,
            }),
            ProviderNumber: new DynamicField({
                formGroup: this.formGroup,
                label: 'Provider Number',
                name: 'ProviderNumber',
                options: null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: null,
                    scale: null,
                }),
                validation: [ Validators.required, Validators.maxLength(7) ],
                validators: { 'required': true, 'maxlength': 7 },
                value: this.schooldistrict && this.schooldistrict.hasOwnProperty('ProviderNumber') && this.schooldistrict.ProviderNumber != null ? this.schooldistrict.ProviderNumber.toString() : '',
            }),
            RequireNotesForAllEncountersSent: new DynamicField({
                formGroup: this.formGroup,
                label: 'Require Notes For All Encounters Sent',
                name: 'RequireNotesForAllEncountersSent',
                options: null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Checkbox,
                    inputType: null,
                    scale: null,
                }),
                validation: [  ],
                validators: {  },
                value: this.schooldistrict && this.schooldistrict.hasOwnProperty('RequireNotesForAllEncountersSent') && this.schooldistrict.RequireNotesForAllEncountersSent != null ? this.schooldistrict.RequireNotesForAllEncountersSent : false,
            }),
            RevalidationDate: new DynamicField({
                formGroup: this.formGroup,
                label: 'Revalidation Date',
                name: 'RevalidationDate',
                options: null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: InputTypes.Datepicker,
                    scale: null,
                }),
                validation: [  ],
                validators: {  },
                value: this.schooldistrict && this.schooldistrict.RevalidationDate || null,
            }),
            SpecialEducationDirectorId: new DynamicField({
                formGroup: this.formGroup,
                label: 'Special Education Director',
                name: 'SpecialEducationDirectorId',
                options: this.specialEducationDirectors,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
                validation: [  ],
                validators: {  },
                value: this.schooldistrict && this.schooldistrict.SpecialEducationDirectorId || null,
            }),
            TreasurerId: new DynamicField({
                formGroup: this.formGroup,
                label: 'Treasurer',
                name: 'TreasurerId',
                options: this.treasurers,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
                validation: [  ],
                validators: {  },
                value: this.schooldistrict && this.schooldistrict.TreasurerId || null,
            }),
            UseDisabilityCodes: new DynamicField({
                formGroup: this.formGroup,
                label: 'Use Disability Codes',
                name: 'UseDisabilityCodes',
                options: null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Checkbox,
                    inputType: null,
                    scale: null,
                }),
                validation: [  ],
                validators: {  },
                value: this.schooldistrict && this.schooldistrict.hasOwnProperty('UseDisabilityCodes') && this.schooldistrict.UseDisabilityCodes != null ? this.schooldistrict.UseDisabilityCodes : false,
            }),
            ValidationExpirationDate: new DynamicField({
                formGroup: this.formGroup,
                label: 'Validation Expiration Date',
                name: 'ValidationExpirationDate',
                options: null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: InputTypes.Datepicker,
                    scale: null,
                }),
                validation: [  ],
                validators: {  },
                value: this.schooldistrict && this.schooldistrict.ValidationExpirationDate || null,
            }),
        };

        this.View = {
            AccountAssistantId: new DynamicLabel({
                label: 'Account Assistant',
                value: getMetaItemValue(this.accountAssistants as unknown as IMetaItem[], this.schooldistrict && this.schooldistrict.hasOwnProperty('AccountAssistantId') ? this.schooldistrict.AccountAssistantId : null) ?? '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
            }),
            AccountManagerId: new DynamicLabel({
                label: 'Account Manager',
                value: getMetaItemValue(this.accountManagers as unknown as IMetaItem[], this.schooldistrict && this.schooldistrict.hasOwnProperty('AccountManagerId') ? this.schooldistrict.AccountManagerId : null) ?? '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
            }),
            ActiveStatus: new DynamicLabel({
                label: 'Active Status',
                value: this.schooldistrict && this.schooldistrict.hasOwnProperty('ActiveStatus') && this.schooldistrict.ActiveStatus != null ? this.schooldistrict.ActiveStatus : true,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Checkbox,
                    inputType: null,
                    scale: null,
                }),
            }),
            AddressId: new DynamicLabel({
                label: 'Address',
                value: getMetaItemValue(this.addresses as unknown as IMetaItem[], this.schooldistrict && this.schooldistrict.hasOwnProperty('AddressId') ? this.schooldistrict.AddressId : null) ?? '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
            }),
            Archived: new DynamicLabel({
                label: 'Archived',
                value: this.schooldistrict && this.schooldistrict.hasOwnProperty('Archived') && this.schooldistrict.Archived != null ? this.schooldistrict.Archived : false,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Checkbox,
                    inputType: null,
                    scale: null,
                }),
            }),
            BecameClientDate: new DynamicLabel({
                label: 'Became Client Date',
                value: this.schooldistrict && this.schooldistrict.BecameClientDate || null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: InputTypes.Datepicker,
                    scale: null,
                }),
            }),
            BecameTradingPartnerDate: new DynamicLabel({
                label: 'Became Trading Partner Date',
                value: this.schooldistrict && this.schooldistrict.BecameTradingPartnerDate || null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: InputTypes.Datepicker,
                    scale: null,
                }),
            }),
            CaseNotesRequired: new DynamicLabel({
                label: 'Case Notes Required',
                value: this.schooldistrict && this.schooldistrict.hasOwnProperty('CaseNotesRequired') && this.schooldistrict.CaseNotesRequired != null ? this.schooldistrict.CaseNotesRequired : false,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Checkbox,
                    inputType: null,
                    scale: null,
                }),
            }),
            Code: new DynamicLabel({
                label: 'Code',
                value: this.schooldistrict && this.schooldistrict.hasOwnProperty('Code') && this.schooldistrict.Code != null ? this.schooldistrict.Code.toString() : '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: null,
                    scale: null,
                }),
            }),
            CreatedById: new DynamicLabel({
                label: 'Created By',
                value: getMetaItemValue(this.createdBies as unknown as IMetaItem[], this.schooldistrict && this.schooldistrict.hasOwnProperty('CreatedById') ? this.schooldistrict.CreatedById : null) ?? '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
            }),
            DateCreated: new DynamicLabel({
                label: 'Date Created',
                value: this.schooldistrict && this.schooldistrict.DateCreated || null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: InputTypes.Datepicker,
                    scale: null,
                }),
            }),
            DateModified: new DynamicLabel({
                label: 'Date Modified',
                value: this.schooldistrict && this.schooldistrict.DateModified || null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: InputTypes.Datepicker,
                    scale: null,
                }),
            }),
            EinNumber: new DynamicLabel({
                label: 'Ein Number',
                value: this.schooldistrict && this.schooldistrict.hasOwnProperty('EinNumber') && this.schooldistrict.EinNumber != null ? this.schooldistrict.EinNumber.toString() : '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: null,
                    scale: null,
                }),
            }),
            IepDatesRequired: new DynamicLabel({
                label: 'Iep Dates Required',
                value: this.schooldistrict && this.schooldistrict.hasOwnProperty('IepDatesRequired') && this.schooldistrict.IepDatesRequired != null ? this.schooldistrict.IepDatesRequired : false,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Checkbox,
                    inputType: null,
                    scale: null,
                }),
            }),
            IrnNumber: new DynamicLabel({
                label: 'Irn Number',
                value: this.schooldistrict && this.schooldistrict.hasOwnProperty('IrnNumber') && this.schooldistrict.IrnNumber != null ? this.schooldistrict.IrnNumber.toString() : '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: null,
                    scale: null,
                }),
            }),
            MerId: new DynamicLabel({
                label: 'Mer',
                value: this.schooldistrict && this.schooldistrict.MerId || null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Numeric,
                    inputType: NumericInputTypes.Integer,
                    scale: null,
                }),
            }),
            ModifiedById: new DynamicLabel({
                label: 'Modified By',
                value: getMetaItemValue(this.modifiedBies as unknown as IMetaItem[], this.schooldistrict && this.schooldistrict.hasOwnProperty('ModifiedById') ? this.schooldistrict.ModifiedById : null) ?? '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
            }),
            Name: new DynamicLabel({
                label: 'Name',
                value: this.schooldistrict && this.schooldistrict.hasOwnProperty('Name') && this.schooldistrict.Name != null ? this.schooldistrict.Name.toString() : '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: null,
                    scale: null,
                }),
            }),
            Notes: new DynamicLabel({
                label: 'Notes',
                value: this.schooldistrict && this.schooldistrict.hasOwnProperty('Notes') && this.schooldistrict.Notes != null ? this.schooldistrict.Notes.toString() : '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: null,
                    scale: null,
                }),
            }),
            NotesRequiredDate: new DynamicLabel({
                label: 'Notes Required Date',
                value: this.schooldistrict && this.schooldistrict.NotesRequiredDate || null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: InputTypes.Datepicker,
                    scale: null,
                }),
            }),
            NpiNumber: new DynamicLabel({
                label: 'Npi Number',
                value: this.schooldistrict && this.schooldistrict.hasOwnProperty('NpiNumber') && this.schooldistrict.NpiNumber != null ? this.schooldistrict.NpiNumber.toString() : '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: null,
                    scale: null,
                }),
            }),
            ProgressReports: new DynamicLabel({
                label: 'Progress Reports',
                value: this.schooldistrict && this.schooldistrict.hasOwnProperty('ProgressReports') && this.schooldistrict.ProgressReports != null ? this.schooldistrict.ProgressReports : false,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Checkbox,
                    inputType: null,
                    scale: null,
                }),
            }),
            ProgressReportsSent: new DynamicLabel({
                label: 'Progress Reports Sent',
                value: this.schooldistrict && this.schooldistrict.ProgressReportsSent || null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: InputTypes.Datepicker,
                    scale: null,
                }),
            }),
            ProviderNumber: new DynamicLabel({
                label: 'Provider Number',
                value: this.schooldistrict && this.schooldistrict.hasOwnProperty('ProviderNumber') && this.schooldistrict.ProviderNumber != null ? this.schooldistrict.ProviderNumber.toString() : '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: null,
                    scale: null,
                }),
            }),
            RequireNotesForAllEncountersSent: new DynamicLabel({
                label: 'Require Notes For All Encounters Sent',
                value: this.schooldistrict && this.schooldistrict.hasOwnProperty('RequireNotesForAllEncountersSent') && this.schooldistrict.RequireNotesForAllEncountersSent != null ? this.schooldistrict.RequireNotesForAllEncountersSent : false,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Checkbox,
                    inputType: null,
                    scale: null,
                }),
            }),
            RevalidationDate: new DynamicLabel({
                label: 'Revalidation Date',
                value: this.schooldistrict && this.schooldistrict.RevalidationDate || null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: InputTypes.Datepicker,
                    scale: null,
                }),
            }),
            SpecialEducationDirectorId: new DynamicLabel({
                label: 'Special Education Director',
                value: getMetaItemValue(this.specialEducationDirectors as unknown as IMetaItem[], this.schooldistrict && this.schooldistrict.hasOwnProperty('SpecialEducationDirectorId') ? this.schooldistrict.SpecialEducationDirectorId : null) ?? '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
            }),
            TreasurerId: new DynamicLabel({
                label: 'Treasurer',
                value: getMetaItemValue(this.treasurers as unknown as IMetaItem[], this.schooldistrict && this.schooldistrict.hasOwnProperty('TreasurerId') ? this.schooldistrict.TreasurerId : null) ?? '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
            }),
            UseDisabilityCodes: new DynamicLabel({
                label: 'Use Disability Codes',
                value: this.schooldistrict && this.schooldistrict.hasOwnProperty('UseDisabilityCodes') && this.schooldistrict.UseDisabilityCodes != null ? this.schooldistrict.UseDisabilityCodes : false,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Checkbox,
                    inputType: null,
                    scale: null,
                }),
            }),
            ValidationExpirationDate: new DynamicLabel({
                label: 'Validation Expiration Date',
                value: this.schooldistrict && this.schooldistrict.ValidationExpirationDate || null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: InputTypes.Datepicker,
                    scale: null,
                }),
            }),
        };

    }
}
