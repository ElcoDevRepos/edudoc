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
import { IProviderCaseUpload } from '../interfaces/provider-case-upload';
import { ISchoolDistrict } from '../interfaces/school-district';
import { IProviderCaseUploadDocument } from '../interfaces/provider-case-upload-document';
import { IProvider } from '../interfaces/provider';
import { IStudent } from '../interfaces/student';

export interface IProviderCaseUploadDynamicControlsParameters {
    formGroup?: string;
    providers?: IProvider[];
    districts?: ISchoolDistrict[];
    providerCaseUploadDocuments?: IProviderCaseUploadDocument[];
    students?: IStudent[];
}

export class ProviderCaseUploadDynamicControls {

    formGroup: string;
    providers?: IProvider[];
    districts?: ISchoolDistrict[];
    providerCaseUploadDocuments?: IProviderCaseUploadDocument[];
    students?: IStudent[];

    Form: IExpandableObject;
    View: IExpandableObject;

    constructor(private providercaseupload?: IProviderCaseUpload, additionalParameters?: IProviderCaseUploadDynamicControlsParameters) {
        this.formGroup = additionalParameters && additionalParameters.formGroup || 'ProviderCaseUpload';
        this.providers = additionalParameters && additionalParameters.providers || undefined;
        this.districts = additionalParameters && additionalParameters.districts || undefined;
        this.providerCaseUploadDocuments = additionalParameters && additionalParameters.providerCaseUploadDocuments || undefined;
        this.students = additionalParameters && additionalParameters.students || undefined;

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
                value: this.providercaseupload && this.providercaseupload.hasOwnProperty('Archived') && this.providercaseupload.Archived != null ? this.providercaseupload.Archived : false,
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
                value: this.providercaseupload && this.providercaseupload.DateCreated || null,
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
                value: this.providercaseupload && this.providercaseupload.DateModified || null,
            }),
            DateOfBirth: new DynamicField({
                formGroup: this.formGroup,
                label: 'Date Of Birth',
                name: 'DateOfBirth',
                options: null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: InputTypes.Textarea,
                    scale: null,
                }),
                validation: [  ],
                validators: {  },
                value: this.providercaseupload && this.providercaseupload.hasOwnProperty('DateOfBirth') && this.providercaseupload.DateOfBirth != null ? this.providercaseupload.DateOfBirth.toString() : '',
            }),
            DistrictId: new DynamicField({
                formGroup: this.formGroup,
                label: 'District',
                name: 'DistrictId',
                options: this.districts,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
                validation: [ noZeroRequiredValidator ],
                validators: { 'required': true },
                value: this.providercaseupload && this.providercaseupload.DistrictId || null,
            }),
            FirstName: new DynamicField({
                formGroup: this.formGroup,
                label: 'First Name',
                name: 'FirstName',
                options: null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: InputTypes.Textarea,
                    scale: null,
                }),
                validation: [  ],
                validators: {  },
                value: this.providercaseupload && this.providercaseupload.hasOwnProperty('FirstName') && this.providercaseupload.FirstName != null ? this.providercaseupload.FirstName.toString() : '',
            }),
            Grade: new DynamicField({
                formGroup: this.formGroup,
                label: 'Grade',
                name: 'Grade',
                options: null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: InputTypes.Textarea,
                    scale: null,
                }),
                validation: [  ],
                validators: {  },
                value: this.providercaseupload && this.providercaseupload.hasOwnProperty('Grade') && this.providercaseupload.Grade != null ? this.providercaseupload.Grade.toString() : '',
            }),
            HasDataIssues: new DynamicField({
                formGroup: this.formGroup,
                label: 'Has Data Issues',
                name: 'HasDataIssues',
                options: null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Checkbox,
                    inputType: null,
                    scale: null,
                }),
                validation: [  ],
                validators: {  },
                value: this.providercaseupload && this.providercaseupload.hasOwnProperty('HasDataIssues') && this.providercaseupload.HasDataIssues != null ? this.providercaseupload.HasDataIssues : false,
            }),
            HasDuplicates: new DynamicField({
                formGroup: this.formGroup,
                label: 'Has Duplicates',
                name: 'HasDuplicates',
                options: null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Checkbox,
                    inputType: null,
                    scale: null,
                }),
                validation: [  ],
                validators: {  },
                value: this.providercaseupload && this.providercaseupload.hasOwnProperty('HasDuplicates') && this.providercaseupload.HasDuplicates != null ? this.providercaseupload.HasDuplicates : false,
            }),
            LastName: new DynamicField({
                formGroup: this.formGroup,
                label: 'Last Name',
                name: 'LastName',
                options: null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: InputTypes.Textarea,
                    scale: null,
                }),
                validation: [  ],
                validators: {  },
                value: this.providercaseupload && this.providercaseupload.hasOwnProperty('LastName') && this.providercaseupload.LastName != null ? this.providercaseupload.LastName.toString() : '',
            }),
            MiddleName: new DynamicField({
                formGroup: this.formGroup,
                label: 'Middle Name',
                name: 'MiddleName',
                options: null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: InputTypes.Textarea,
                    scale: null,
                }),
                validation: [  ],
                validators: {  },
                value: this.providercaseupload && this.providercaseupload.hasOwnProperty('MiddleName') && this.providercaseupload.MiddleName != null ? this.providercaseupload.MiddleName.toString() : '',
            }),
            ModifiedById: new DynamicField({
                formGroup: this.formGroup,
                label: 'Modified By',
                name: 'ModifiedById',
                options: null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Numeric,
                    inputType: NumericInputTypes.Integer,
                    scale: null,
                }),
                validation: [  ],
                validators: {  },
                value: this.providercaseupload && this.providercaseupload.ModifiedById || null,
            }),
            ProviderCaseUploadDocumentId: new DynamicField({
                formGroup: this.formGroup,
                label: 'Provider Case Upload Document',
                name: 'ProviderCaseUploadDocumentId',
                options: this.providerCaseUploadDocuments,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
                validation: [ noZeroRequiredValidator ],
                validators: { 'required': true },
                value: this.providercaseupload && this.providercaseupload.ProviderCaseUploadDocumentId || null,
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
                value: this.providercaseupload && this.providercaseupload.ProviderId || null,
            }),
            School: new DynamicField({
                formGroup: this.formGroup,
                label: 'School',
                name: 'School',
                options: null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: InputTypes.Textarea,
                    scale: null,
                }),
                validation: [  ],
                validators: {  },
                value: this.providercaseupload && this.providercaseupload.hasOwnProperty('School') && this.providercaseupload.School != null ? this.providercaseupload.School.toString() : '',
            }),
            StudentId: new DynamicField({
                formGroup: this.formGroup,
                label: 'Student',
                name: 'StudentId',
                options: this.students,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
                validation: [  ],
                validators: {  },
                value: this.providercaseupload && this.providercaseupload.StudentId || null,
            }),
        };

        this.View = {
            Archived: new DynamicLabel({
                label: 'Archived',
                value: this.providercaseupload && this.providercaseupload.hasOwnProperty('Archived') && this.providercaseupload.Archived != null ? this.providercaseupload.Archived : false,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Checkbox,
                    inputType: null,
                    scale: null,
                }),
            }),
            DateCreated: new DynamicLabel({
                label: 'Date Created',
                value: this.providercaseupload && this.providercaseupload.DateCreated || null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: InputTypes.Datepicker,
                    scale: null,
                }),
            }),
            DateModified: new DynamicLabel({
                label: 'Date Modified',
                value: this.providercaseupload && this.providercaseupload.DateModified || null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: InputTypes.Datepicker,
                    scale: null,
                }),
            }),
            DateOfBirth: new DynamicLabel({
                label: 'Date Of Birth',
                value: this.providercaseupload && this.providercaseupload.hasOwnProperty('DateOfBirth') && this.providercaseupload.DateOfBirth != null ? this.providercaseupload.DateOfBirth.toString() : '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: InputTypes.Textarea,
                    scale: null,
                }),
            }),
            DistrictId: new DynamicLabel({
                label: 'District',
                value: getMetaItemValue(this.districts as unknown as IMetaItem[], this.providercaseupload && this.providercaseupload.hasOwnProperty('DistrictId') ? this.providercaseupload.DistrictId : null) ?? '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
            }),
            FirstName: new DynamicLabel({
                label: 'First Name',
                value: this.providercaseupload && this.providercaseupload.hasOwnProperty('FirstName') && this.providercaseupload.FirstName != null ? this.providercaseupload.FirstName.toString() : '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: InputTypes.Textarea,
                    scale: null,
                }),
            }),
            Grade: new DynamicLabel({
                label: 'Grade',
                value: this.providercaseupload && this.providercaseupload.hasOwnProperty('Grade') && this.providercaseupload.Grade != null ? this.providercaseupload.Grade.toString() : '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: InputTypes.Textarea,
                    scale: null,
                }),
            }),
            HasDataIssues: new DynamicLabel({
                label: 'Has Data Issues',
                value: this.providercaseupload && this.providercaseupload.hasOwnProperty('HasDataIssues') && this.providercaseupload.HasDataIssues != null ? this.providercaseupload.HasDataIssues : false,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Checkbox,
                    inputType: null,
                    scale: null,
                }),
            }),
            HasDuplicates: new DynamicLabel({
                label: 'Has Duplicates',
                value: this.providercaseupload && this.providercaseupload.hasOwnProperty('HasDuplicates') && this.providercaseupload.HasDuplicates != null ? this.providercaseupload.HasDuplicates : false,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Checkbox,
                    inputType: null,
                    scale: null,
                }),
            }),
            LastName: new DynamicLabel({
                label: 'Last Name',
                value: this.providercaseupload && this.providercaseupload.hasOwnProperty('LastName') && this.providercaseupload.LastName != null ? this.providercaseupload.LastName.toString() : '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: InputTypes.Textarea,
                    scale: null,
                }),
            }),
            MiddleName: new DynamicLabel({
                label: 'Middle Name',
                value: this.providercaseupload && this.providercaseupload.hasOwnProperty('MiddleName') && this.providercaseupload.MiddleName != null ? this.providercaseupload.MiddleName.toString() : '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: InputTypes.Textarea,
                    scale: null,
                }),
            }),
            ModifiedById: new DynamicLabel({
                label: 'Modified By',
                value: this.providercaseupload && this.providercaseupload.ModifiedById || null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Numeric,
                    inputType: NumericInputTypes.Integer,
                    scale: null,
                }),
            }),
            ProviderCaseUploadDocumentId: new DynamicLabel({
                label: 'Provider Case Upload Document',
                value: getMetaItemValue(this.providerCaseUploadDocuments as unknown as IMetaItem[], this.providercaseupload && this.providercaseupload.hasOwnProperty('ProviderCaseUploadDocumentId') ? this.providercaseupload.ProviderCaseUploadDocumentId : null) ?? '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
            }),
            ProviderId: new DynamicLabel({
                label: 'Provider',
                value: getMetaItemValue(this.providers as unknown as IMetaItem[], this.providercaseupload && this.providercaseupload.hasOwnProperty('ProviderId') ? this.providercaseupload.ProviderId : null) ?? '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
            }),
            School: new DynamicLabel({
                label: 'School',
                value: this.providercaseupload && this.providercaseupload.hasOwnProperty('School') && this.providercaseupload.School != null ? this.providercaseupload.School.toString() : '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: InputTypes.Textarea,
                    scale: null,
                }),
            }),
            StudentId: new DynamicLabel({
                label: 'Student',
                value: getMetaItemValue(this.students as unknown as IMetaItem[], this.providercaseupload && this.providercaseupload.hasOwnProperty('StudentId') ? this.providercaseupload.StudentId : null) ?? '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
            }),
        };

    }
}
