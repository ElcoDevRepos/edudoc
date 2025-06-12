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
import { ICaseLoadScript } from '../interfaces/case-load-script';
import { ICaseLoad } from '../interfaces/case-load';
import { IDiagnosisCode } from '../interfaces/diagnosis-code';
import { IUser } from '../interfaces/user';

export interface ICaseLoadScriptDynamicControlsParameters {
    formGroup?: string;
    diagnosisCodes?: IDiagnosisCode[];
    caseLoads?: ICaseLoad[];
    uploadedBies?: IUser[];
    modifiedBies?: IUser[];
}

export class CaseLoadScriptDynamicControls {

    formGroup: string;
    diagnosisCodes?: IDiagnosisCode[];
    caseLoads?: ICaseLoad[];
    uploadedBies?: IUser[];
    modifiedBies?: IUser[];

    Form: IExpandableObject;
    View: IExpandableObject;

    constructor(private caseloadscript?: ICaseLoadScript, additionalParameters?: ICaseLoadScriptDynamicControlsParameters) {
        this.formGroup = additionalParameters && additionalParameters.formGroup || 'CaseLoadScript';
        this.diagnosisCodes = additionalParameters && additionalParameters.diagnosisCodes || undefined;
        this.caseLoads = additionalParameters && additionalParameters.caseLoads || undefined;
        this.uploadedBies = additionalParameters && additionalParameters.uploadedBies || undefined;
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
                value: this.caseloadscript && this.caseloadscript.hasOwnProperty('Archived') && this.caseloadscript.Archived != null ? this.caseloadscript.Archived : false,
            }),
            CaseLoadId: new DynamicField({
                formGroup: this.formGroup,
                label: 'Case Load',
                name: 'CaseLoadId',
                options: this.caseLoads,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
                validation: [ noZeroRequiredValidator ],
                validators: { 'required': true },
                value: this.caseloadscript && this.caseloadscript.CaseLoadId || null,
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
                value: this.caseloadscript && this.caseloadscript.DateModified || null,
            }),
            DateUpload: new DynamicField({
                formGroup: this.formGroup,
                label: 'Date Upload',
                name: 'DateUpload',
                options: null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: InputTypes.Datepicker,
                    scale: null,
                }),
                validation: [  ],
                validators: {  },
                value: this.caseloadscript && this.caseloadscript.DateUpload || null,
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
                validation: [  ],
                validators: {  },
                value: this.caseloadscript && this.caseloadscript.DiagnosisCodeId || null,
            }),
            DoctorFirstName: new DynamicField({
                formGroup: this.formGroup,
                label: 'Doctor First Name',
                name: 'DoctorFirstName',
                options: null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: null,
                    scale: null,
                }),
                validation: [ Validators.required, Validators.maxLength(50) ],
                validators: { 'required': true, 'maxlength': 50 },
                value: this.caseloadscript && this.caseloadscript.hasOwnProperty('DoctorFirstName') && this.caseloadscript.DoctorFirstName != null ? this.caseloadscript.DoctorFirstName.toString() : '',
            }),
            DoctorLastName: new DynamicField({
                formGroup: this.formGroup,
                label: 'Doctor Last Name',
                name: 'DoctorLastName',
                options: null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: null,
                    scale: null,
                }),
                validation: [ Validators.required, Validators.maxLength(50) ],
                validators: { 'required': true, 'maxlength': 50 },
                value: this.caseloadscript && this.caseloadscript.hasOwnProperty('DoctorLastName') && this.caseloadscript.DoctorLastName != null ? this.caseloadscript.DoctorLastName.toString() : '',
            }),
            ExpirationDate: new DynamicField({
                formGroup: this.formGroup,
                label: 'Expiration Date',
                name: 'ExpirationDate',
                options: null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: InputTypes.Datepicker,
                    scale: null,
                }),
                validation: [  ],
                validators: {  },
                value: this.caseloadscript && this.caseloadscript.ExpirationDate || null,
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
                value: this.caseloadscript && this.caseloadscript.hasOwnProperty('FileName') && this.caseloadscript.FileName != null ? this.caseloadscript.FileName.toString() : '',
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
                validation: [ Validators.required, Validators.maxLength(200) ],
                validators: { 'required': true, 'maxlength': 200 },
                value: this.caseloadscript && this.caseloadscript.hasOwnProperty('FilePath') && this.caseloadscript.FilePath != null ? this.caseloadscript.FilePath.toString() : '',
            }),
            InitiationDate: new DynamicField({
                formGroup: this.formGroup,
                label: 'Initiation Date',
                name: 'InitiationDate',
                options: null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: InputTypes.Datepicker,
                    scale: null,
                }),
                validation: [ Validators.required ],
                validators: { 'required': true },
                value: this.caseloadscript && this.caseloadscript.InitiationDate || null,
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
                value: this.caseloadscript && this.caseloadscript.ModifiedById || null,
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
                validation: [ Validators.required, Validators.maxLength(10) ],
                validators: { 'required': true, 'maxlength': 10 },
                value: this.caseloadscript && this.caseloadscript.hasOwnProperty('Npi') && this.caseloadscript.Npi != null ? this.caseloadscript.Npi.toString() : '',
            }),
            UploadedById: new DynamicField({
                formGroup: this.formGroup,
                label: 'Uploaded By',
                name: 'UploadedById',
                options: this.uploadedBies,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
                validation: [  ],
                validators: {  },
                value: this.caseloadscript && this.caseloadscript.UploadedById || null,
            }),
        };

        this.View = {
            Archived: new DynamicLabel({
                label: 'Archived',
                value: this.caseloadscript && this.caseloadscript.hasOwnProperty('Archived') && this.caseloadscript.Archived != null ? this.caseloadscript.Archived : false,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Checkbox,
                    inputType: null,
                    scale: null,
                }),
            }),
            CaseLoadId: new DynamicLabel({
                label: 'Case Load',
                value: getMetaItemValue(this.caseLoads as unknown as IMetaItem[], this.caseloadscript && this.caseloadscript.hasOwnProperty('CaseLoadId') ? this.caseloadscript.CaseLoadId : null) ?? '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
            }),
            DateModified: new DynamicLabel({
                label: 'Date Modified',
                value: this.caseloadscript && this.caseloadscript.DateModified || null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: InputTypes.Datepicker,
                    scale: null,
                }),
            }),
            DateUpload: new DynamicLabel({
                label: 'Date Upload',
                value: this.caseloadscript && this.caseloadscript.DateUpload || null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: InputTypes.Datepicker,
                    scale: null,
                }),
            }),
            DiagnosisCodeId: new DynamicLabel({
                label: 'Diagnosis Code',
                value: getMetaItemValue(this.diagnosisCodes as unknown as IMetaItem[], this.caseloadscript && this.caseloadscript.hasOwnProperty('DiagnosisCodeId') ? this.caseloadscript.DiagnosisCodeId : null) ?? '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
            }),
            DoctorFirstName: new DynamicLabel({
                label: 'Doctor First Name',
                value: this.caseloadscript && this.caseloadscript.hasOwnProperty('DoctorFirstName') && this.caseloadscript.DoctorFirstName != null ? this.caseloadscript.DoctorFirstName.toString() : '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: null,
                    scale: null,
                }),
            }),
            DoctorLastName: new DynamicLabel({
                label: 'Doctor Last Name',
                value: this.caseloadscript && this.caseloadscript.hasOwnProperty('DoctorLastName') && this.caseloadscript.DoctorLastName != null ? this.caseloadscript.DoctorLastName.toString() : '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: null,
                    scale: null,
                }),
            }),
            ExpirationDate: new DynamicLabel({
                label: 'Expiration Date',
                value: this.caseloadscript && this.caseloadscript.ExpirationDate || null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: InputTypes.Datepicker,
                    scale: null,
                }),
            }),
            FileName: new DynamicLabel({
                label: 'File Name',
                value: this.caseloadscript && this.caseloadscript.hasOwnProperty('FileName') && this.caseloadscript.FileName != null ? this.caseloadscript.FileName.toString() : '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: null,
                    scale: null,
                }),
            }),
            FilePath: new DynamicLabel({
                label: 'File Path',
                value: this.caseloadscript && this.caseloadscript.hasOwnProperty('FilePath') && this.caseloadscript.FilePath != null ? this.caseloadscript.FilePath.toString() : '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: null,
                    scale: null,
                }),
            }),
            InitiationDate: new DynamicLabel({
                label: 'Initiation Date',
                value: this.caseloadscript && this.caseloadscript.InitiationDate || null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: InputTypes.Datepicker,
                    scale: null,
                }),
            }),
            ModifiedById: new DynamicLabel({
                label: 'Modified By',
                value: getMetaItemValue(this.modifiedBies as unknown as IMetaItem[], this.caseloadscript && this.caseloadscript.hasOwnProperty('ModifiedById') ? this.caseloadscript.ModifiedById : null) ?? '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
            }),
            Npi: new DynamicLabel({
                label: 'Npi',
                value: this.caseloadscript && this.caseloadscript.hasOwnProperty('Npi') && this.caseloadscript.Npi != null ? this.caseloadscript.Npi.toString() : '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: null,
                    scale: null,
                }),
            }),
            UploadedById: new DynamicLabel({
                label: 'Uploaded By',
                value: getMetaItemValue(this.uploadedBies as unknown as IMetaItem[], this.caseloadscript && this.caseloadscript.hasOwnProperty('UploadedById') ? this.caseloadscript.UploadedById : null) ?? '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
            }),
        };

    }
}
