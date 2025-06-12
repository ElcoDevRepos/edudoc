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
import { IProviderEscAssignment } from '../interfaces/provider-esc-assignment';
import { IAgency } from '../interfaces/agency';
import { IAgencyType } from '../interfaces/agency-type';
import { IUser } from '../interfaces/user';
import { IEsc } from '../interfaces/esc';
import { IProvider } from '../interfaces/provider';

export interface IProviderEscAssignmentDynamicControlsParameters {
    formGroup?: string;
    providers?: IProvider[];
    escs?: IEsc[];
    createdBies?: IUser[];
    modifiedBies?: IUser[];
    agencyTypes?: IAgencyType[];
    agencies?: IAgency[];
}

export class ProviderEscAssignmentDynamicControls {

    formGroup: string;
    providers?: IProvider[];
    escs?: IEsc[];
    createdBies?: IUser[];
    modifiedBies?: IUser[];
    agencyTypes?: IAgencyType[];
    agencies?: IAgency[];

    Form: IExpandableObject;
    View: IExpandableObject;

    constructor(private providerescassignment?: IProviderEscAssignment, additionalParameters?: IProviderEscAssignmentDynamicControlsParameters) {
        this.formGroup = additionalParameters && additionalParameters.formGroup || 'ProviderEscAssignment';
        this.providers = additionalParameters && additionalParameters.providers || undefined;
        this.escs = additionalParameters && additionalParameters.escs || undefined;
        this.createdBies = additionalParameters && additionalParameters.createdBies || undefined;
        this.modifiedBies = additionalParameters && additionalParameters.modifiedBies || undefined;
        this.agencyTypes = additionalParameters && additionalParameters.agencyTypes || undefined;
        this.agencies = additionalParameters && additionalParameters.agencies || undefined;

        this.Form = {
            AgencyId: new DynamicField({
                formGroup: this.formGroup,
                label: 'Agency',
                name: 'AgencyId',
                options: this.agencies,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
                validation: [  ],
                validators: {  },
                value: this.providerescassignment && this.providerescassignment.AgencyId || null,
            }),
            AgencyTypeId: new DynamicField({
                formGroup: this.formGroup,
                label: 'Agency Type',
                name: 'AgencyTypeId',
                options: this.agencyTypes,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
                validation: [  ],
                validators: {  },
                value: this.providerescassignment && this.providerescassignment.AgencyTypeId || null,
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
                value: this.providerescassignment && this.providerescassignment.hasOwnProperty('Archived') && this.providerescassignment.Archived != null ? this.providerescassignment.Archived : false,
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
                value: this.providerescassignment && this.providerescassignment.CreatedById || null,
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
                value: this.providerescassignment && this.providerescassignment.DateCreated || null,
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
                value: this.providerescassignment && this.providerescassignment.DateModified || null,
            }),
            EndDate: new DynamicField({
                formGroup: this.formGroup,
                label: 'End Date',
                name: 'EndDate',
                options: null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: InputTypes.Datepicker,
                    scale: null,
                }),
                validation: [  ],
                validators: {  },
                value: this.providerescassignment && this.providerescassignment.EndDate || null,
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
                value: this.providerescassignment && this.providerescassignment.EscId || null,
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
                value: this.providerescassignment && this.providerescassignment.ModifiedById || null,
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
                value: this.providerescassignment && this.providerescassignment.ProviderId || null,
            }),
            StartDate: new DynamicField({
                formGroup: this.formGroup,
                label: 'Start Date',
                name: 'StartDate',
                options: null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: InputTypes.Datepicker,
                    scale: null,
                }),
                validation: [  ],
                validators: {  },
                value: this.providerescassignment && this.providerescassignment.StartDate || null,
            }),
        };

        this.View = {
            AgencyId: new DynamicLabel({
                label: 'Agency',
                value: getMetaItemValue(this.agencies as unknown as IMetaItem[], this.providerescassignment && this.providerescassignment.hasOwnProperty('AgencyId') ? this.providerescassignment.AgencyId : null) ?? '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
            }),
            AgencyTypeId: new DynamicLabel({
                label: 'Agency Type',
                value: getMetaItemValue(this.agencyTypes as unknown as IMetaItem[], this.providerescassignment && this.providerescassignment.hasOwnProperty('AgencyTypeId') ? this.providerescassignment.AgencyTypeId : null) ?? '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
            }),
            Archived: new DynamicLabel({
                label: 'Archived',
                value: this.providerescassignment && this.providerescassignment.hasOwnProperty('Archived') && this.providerescassignment.Archived != null ? this.providerescassignment.Archived : false,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Checkbox,
                    inputType: null,
                    scale: null,
                }),
            }),
            CreatedById: new DynamicLabel({
                label: 'Created By',
                value: getMetaItemValue(this.createdBies as unknown as IMetaItem[], this.providerescassignment && this.providerescassignment.hasOwnProperty('CreatedById') ? this.providerescassignment.CreatedById : null) ?? '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
            }),
            DateCreated: new DynamicLabel({
                label: 'Date Created',
                value: this.providerescassignment && this.providerescassignment.DateCreated || null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: InputTypes.Datepicker,
                    scale: null,
                }),
            }),
            DateModified: new DynamicLabel({
                label: 'Date Modified',
                value: this.providerescassignment && this.providerescassignment.DateModified || null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: InputTypes.Datepicker,
                    scale: null,
                }),
            }),
            EndDate: new DynamicLabel({
                label: 'End Date',
                value: this.providerescassignment && this.providerescassignment.EndDate || null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: InputTypes.Datepicker,
                    scale: null,
                }),
            }),
            EscId: new DynamicLabel({
                label: 'Esc',
                value: getMetaItemValue(this.escs as unknown as IMetaItem[], this.providerescassignment && this.providerescassignment.hasOwnProperty('EscId') ? this.providerescassignment.EscId : null) ?? '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
            }),
            ModifiedById: new DynamicLabel({
                label: 'Modified By',
                value: getMetaItemValue(this.modifiedBies as unknown as IMetaItem[], this.providerescassignment && this.providerescassignment.hasOwnProperty('ModifiedById') ? this.providerescassignment.ModifiedById : null) ?? '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
            }),
            ProviderId: new DynamicLabel({
                label: 'Provider',
                value: getMetaItemValue(this.providers as unknown as IMetaItem[], this.providerescassignment && this.providerescassignment.hasOwnProperty('ProviderId') ? this.providerescassignment.ProviderId : null) ?? '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
            }),
            StartDate: new DynamicLabel({
                label: 'Start Date',
                value: this.providerescassignment && this.providerescassignment.StartDate || null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: InputTypes.Datepicker,
                    scale: null,
                }),
            }),
        };

    }
}
