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
import { ISchoolDistrictRosterDocument } from '../interfaces/school-district-roster-document';
import { ISchoolDistrict } from '../interfaces/school-district';

export interface ISchoolDistrictRosterDocumentDynamicControlsParameters {
    formGroup?: string;
    schoolDistricts?: ISchoolDistrict[];
}

export class SchoolDistrictRosterDocumentDynamicControls {

    formGroup: string;
    schoolDistricts?: ISchoolDistrict[];

    Form: IExpandableObject;
    View: IExpandableObject;

    constructor(private schooldistrictrosterdocument?: ISchoolDistrictRosterDocument, additionalParameters?: ISchoolDistrictRosterDocumentDynamicControlsParameters) {
        this.formGroup = additionalParameters && additionalParameters.formGroup || 'SchoolDistrictRosterDocument';
        this.schoolDistricts = additionalParameters && additionalParameters.schoolDistricts || undefined;

        this.Form = {
            DateError: new DynamicField({
                formGroup: this.formGroup,
                label: 'Date Error',
                name: 'DateError',
                options: null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: InputTypes.Datepicker,
                    scale: null,
                }),
                validation: [  ],
                validators: {  },
                value: this.schooldistrictrosterdocument && this.schooldistrictrosterdocument.DateError || null,
            }),
            DateProcessed: new DynamicField({
                formGroup: this.formGroup,
                label: 'Date Processed',
                name: 'DateProcessed',
                options: null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: InputTypes.Datepicker,
                    scale: null,
                }),
                validation: [  ],
                validators: {  },
                value: this.schooldistrictrosterdocument && this.schooldistrictrosterdocument.DateProcessed || null,
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
                value: this.schooldistrictrosterdocument && this.schooldistrictrosterdocument.DateUpload || null,
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
                value: this.schooldistrictrosterdocument && this.schooldistrictrosterdocument.hasOwnProperty('FilePath') && this.schooldistrictrosterdocument.FilePath != null ? this.schooldistrictrosterdocument.FilePath.toString() : '',
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
                validation: [ Validators.required, Validators.maxLength(200) ],
                validators: { 'required': true, 'maxlength': 200 },
                value: this.schooldistrictrosterdocument && this.schooldistrictrosterdocument.hasOwnProperty('Name') && this.schooldistrictrosterdocument.Name != null ? this.schooldistrictrosterdocument.Name.toString() : '',
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
                validation: [ noZeroRequiredValidator ],
                validators: { 'required': true },
                value: this.schooldistrictrosterdocument && this.schooldistrictrosterdocument.SchoolDistrictId || null,
            }),
            UploadedBy: new DynamicField({
                formGroup: this.formGroup,
                label: 'Uploaded By',
                name: 'UploadedBy',
                options: null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Numeric,
                    inputType: NumericInputTypes.Integer,
                    scale: null,
                }),
                validation: [  ],
                validators: {  },
                value: this.schooldistrictrosterdocument && this.schooldistrictrosterdocument.UploadedBy || null,
            }),
        };

        this.View = {
            DateError: new DynamicLabel({
                label: 'Date Error',
                value: this.schooldistrictrosterdocument && this.schooldistrictrosterdocument.DateError || null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: InputTypes.Datepicker,
                    scale: null,
                }),
            }),
            DateProcessed: new DynamicLabel({
                label: 'Date Processed',
                value: this.schooldistrictrosterdocument && this.schooldistrictrosterdocument.DateProcessed || null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: InputTypes.Datepicker,
                    scale: null,
                }),
            }),
            DateUpload: new DynamicLabel({
                label: 'Date Upload',
                value: this.schooldistrictrosterdocument && this.schooldistrictrosterdocument.DateUpload || null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: InputTypes.Datepicker,
                    scale: null,
                }),
            }),
            FilePath: new DynamicLabel({
                label: 'File Path',
                value: this.schooldistrictrosterdocument && this.schooldistrictrosterdocument.hasOwnProperty('FilePath') && this.schooldistrictrosterdocument.FilePath != null ? this.schooldistrictrosterdocument.FilePath.toString() : '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: null,
                    scale: null,
                }),
            }),
            Name: new DynamicLabel({
                label: 'Name',
                value: this.schooldistrictrosterdocument && this.schooldistrictrosterdocument.hasOwnProperty('Name') && this.schooldistrictrosterdocument.Name != null ? this.schooldistrictrosterdocument.Name.toString() : '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: null,
                    scale: null,
                }),
            }),
            SchoolDistrictId: new DynamicLabel({
                label: 'School District',
                value: getMetaItemValue(this.schoolDistricts as unknown as IMetaItem[], this.schooldistrictrosterdocument && this.schooldistrictrosterdocument.hasOwnProperty('SchoolDistrictId') ? this.schooldistrictrosterdocument.SchoolDistrictId : null) ?? '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
            }),
            UploadedBy: new DynamicLabel({
                label: 'Uploaded By',
                value: this.schooldistrictrosterdocument && this.schooldistrictrosterdocument.UploadedBy || null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Numeric,
                    inputType: NumericInputTypes.Integer,
                    scale: null,
                }),
            }),
        };

    }
}
