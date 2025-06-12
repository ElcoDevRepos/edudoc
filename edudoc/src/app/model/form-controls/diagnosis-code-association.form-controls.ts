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
import { IDiagnosisCodeAssociation } from '../interfaces/diagnosis-code-association';
import { IUser } from '../interfaces/user';
import { IDiagnosisCode } from '../interfaces/diagnosis-code';
import { IServiceCode } from '../interfaces/service-code';
import { IServiceType } from '../interfaces/service-type';

export interface IDiagnosisCodeAssociationDynamicControlsParameters {
    formGroup?: string;
    diagnosisCodes?: IDiagnosisCode[];
    serviceCodes?: IServiceCode[];
    serviceTypes?: IServiceType[];
    createdBies?: IUser[];
    modifiedBies?: IUser[];
}

export class DiagnosisCodeAssociationDynamicControls {

    formGroup: string;
    diagnosisCodes?: IDiagnosisCode[];
    serviceCodes?: IServiceCode[];
    serviceTypes?: IServiceType[];
    createdBies?: IUser[];
    modifiedBies?: IUser[];

    Form: IExpandableObject;
    View: IExpandableObject;

    constructor(private diagnosiscodeassociation?: IDiagnosisCodeAssociation, additionalParameters?: IDiagnosisCodeAssociationDynamicControlsParameters) {
        this.formGroup = additionalParameters && additionalParameters.formGroup || 'DiagnosisCodeAssociation';
        this.diagnosisCodes = additionalParameters && additionalParameters.diagnosisCodes || undefined;
        this.serviceCodes = additionalParameters && additionalParameters.serviceCodes || undefined;
        this.serviceTypes = additionalParameters && additionalParameters.serviceTypes || undefined;
        this.createdBies = additionalParameters && additionalParameters.createdBies || undefined;
        this.modifiedBies = additionalParameters && additionalParameters.modifiedBies || undefined;

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
                value: this.diagnosiscodeassociation && this.diagnosiscodeassociation.hasOwnProperty('Archived') && this.diagnosiscodeassociation.Archived != null ? this.diagnosiscodeassociation.Archived : false,
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
                value: this.diagnosiscodeassociation && this.diagnosiscodeassociation.CreatedById || 1,
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
                value: this.diagnosiscodeassociation && this.diagnosiscodeassociation.DateCreated || null,
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
                value: this.diagnosiscodeassociation && this.diagnosiscodeassociation.DateModified || null,
            }),
            DiagnosisCodeId: new DynamicField({
                formGroup: this.formGroup,
                label: 'Diagnosis Code',
                name: 'DiagnosisCodeId',
                options: this.diagnosisCodes,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
                validation: [ noZeroRequiredValidator ],
                validators: { 'required': true },
                value: this.diagnosiscodeassociation && this.diagnosiscodeassociation.DiagnosisCodeId || null,
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
                value: this.diagnosiscodeassociation && this.diagnosiscodeassociation.ModifiedById || null,
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
                validation: [ noZeroRequiredValidator ],
                validators: { 'required': true },
                value: this.diagnosiscodeassociation && this.diagnosiscodeassociation.ServiceCodeId || null,
            }),
            ServiceTypeId: new DynamicField({
                formGroup: this.formGroup,
                label: 'Service Type',
                name: 'ServiceTypeId',
                options: this.serviceTypes,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
                validation: [ noZeroRequiredValidator ],
                validators: { 'required': true },
                value: this.diagnosiscodeassociation && this.diagnosiscodeassociation.ServiceTypeId || null,
            }),
        };

        this.View = {
            Archived: new DynamicLabel({
                label: 'Archived',
                value: this.diagnosiscodeassociation && this.diagnosiscodeassociation.hasOwnProperty('Archived') && this.diagnosiscodeassociation.Archived != null ? this.diagnosiscodeassociation.Archived : false,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Checkbox,
                    inputType: null,
                    scale: null,
                }),
            }),
            CreatedById: new DynamicLabel({
                label: 'Created By',
                value: getMetaItemValue(this.createdBies as unknown as IMetaItem[], this.diagnosiscodeassociation && this.diagnosiscodeassociation.hasOwnProperty('CreatedById') ? this.diagnosiscodeassociation.CreatedById : null) ?? '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
            }),
            DateCreated: new DynamicLabel({
                label: 'Date Created',
                value: this.diagnosiscodeassociation && this.diagnosiscodeassociation.DateCreated || null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: InputTypes.Datepicker,
                    scale: null,
                }),
            }),
            DateModified: new DynamicLabel({
                label: 'Date Modified',
                value: this.diagnosiscodeassociation && this.diagnosiscodeassociation.DateModified || null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: InputTypes.Datepicker,
                    scale: null,
                }),
            }),
            DiagnosisCodeId: new DynamicLabel({
                label: 'Diagnosis Code',
                value: getMetaItemValue(this.diagnosisCodes as unknown as IMetaItem[], this.diagnosiscodeassociation && this.diagnosiscodeassociation.hasOwnProperty('DiagnosisCodeId') ? this.diagnosiscodeassociation.DiagnosisCodeId : null) ?? '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
            }),
            ModifiedById: new DynamicLabel({
                label: 'Modified By',
                value: getMetaItemValue(this.modifiedBies as unknown as IMetaItem[], this.diagnosiscodeassociation && this.diagnosiscodeassociation.hasOwnProperty('ModifiedById') ? this.diagnosiscodeassociation.ModifiedById : null) ?? '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
            }),
            ServiceCodeId: new DynamicLabel({
                label: 'Service Code',
                value: getMetaItemValue(this.serviceCodes as unknown as IMetaItem[], this.diagnosiscodeassociation && this.diagnosiscodeassociation.hasOwnProperty('ServiceCodeId') ? this.diagnosiscodeassociation.ServiceCodeId : null) ?? '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
            }),
            ServiceTypeId: new DynamicLabel({
                label: 'Service Type',
                value: getMetaItemValue(this.serviceTypes as unknown as IMetaItem[], this.diagnosiscodeassociation && this.diagnosiscodeassociation.hasOwnProperty('ServiceTypeId') ? this.diagnosiscodeassociation.ServiceTypeId : null) ?? '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
            }),
        };

    }
}
