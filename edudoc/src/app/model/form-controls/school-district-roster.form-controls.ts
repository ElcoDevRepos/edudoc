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
import { ISchoolDistrictRoster } from '../interfaces/school-district-roster';
import { ISchoolDistrict } from '../interfaces/school-district';
import { ISchoolDistrictRosterDocument } from '../interfaces/school-district-roster-document';
import { IStudent } from '../interfaces/student';

export interface ISchoolDistrictRosterDynamicControlsParameters {
    formGroup?: string;
    schoolDistricts?: ISchoolDistrict[];
    schoolDistrictRosterDocuments?: ISchoolDistrictRosterDocument[];
    students?: IStudent[];
}

export class SchoolDistrictRosterDynamicControls {

    formGroup: string;
    schoolDistricts?: ISchoolDistrict[];
    schoolDistrictRosterDocuments?: ISchoolDistrictRosterDocument[];
    students?: IStudent[];

    Form: IExpandableObject;
    View: IExpandableObject;

    constructor(private schooldistrictroster?: ISchoolDistrictRoster, additionalParameters?: ISchoolDistrictRosterDynamicControlsParameters) {
        this.formGroup = additionalParameters && additionalParameters.formGroup || 'SchoolDistrictRoster';
        this.schoolDistricts = additionalParameters && additionalParameters.schoolDistricts || undefined;
        this.schoolDistrictRosterDocuments = additionalParameters && additionalParameters.schoolDistrictRosterDocuments || undefined;
        this.students = additionalParameters && additionalParameters.students || undefined;

        this.Form = {
            Address1: new DynamicField({
                formGroup: this.formGroup,
                label: 'Address1',
                name: 'Address1',
                options: null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: InputTypes.Textarea,
                    scale: null,
                }),
                validation: [  ],
                validators: {  },
                value: this.schooldistrictroster && this.schooldistrictroster.hasOwnProperty('Address1') && this.schooldistrictroster.Address1 != null ? this.schooldistrictroster.Address1.toString() : '',
            }),
            Address2: new DynamicField({
                formGroup: this.formGroup,
                label: 'Address2',
                name: 'Address2',
                options: null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: InputTypes.Textarea,
                    scale: null,
                }),
                validation: [  ],
                validators: {  },
                value: this.schooldistrictroster && this.schooldistrictroster.hasOwnProperty('Address2') && this.schooldistrictroster.Address2 != null ? this.schooldistrictroster.Address2.toString() : '',
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
                value: this.schooldistrictroster && this.schooldistrictroster.hasOwnProperty('Archived') && this.schooldistrictroster.Archived != null ? this.schooldistrictroster.Archived : false,
            }),
            City: new DynamicField({
                formGroup: this.formGroup,
                label: 'City',
                name: 'City',
                options: null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: InputTypes.Textarea,
                    scale: null,
                }),
                validation: [  ],
                validators: {  },
                value: this.schooldistrictroster && this.schooldistrictroster.hasOwnProperty('City') && this.schooldistrictroster.City != null ? this.schooldistrictroster.City.toString() : '',
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
                value: this.schooldistrictroster && this.schooldistrictroster.DateCreated || null,
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
                value: this.schooldistrictroster && this.schooldistrictroster.DateModified || null,
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
                value: this.schooldistrictroster && this.schooldistrictroster.hasOwnProperty('DateOfBirth') && this.schooldistrictroster.DateOfBirth != null ? this.schooldistrictroster.DateOfBirth.toString() : '',
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
                value: this.schooldistrictroster && this.schooldistrictroster.hasOwnProperty('FirstName') && this.schooldistrictroster.FirstName != null ? this.schooldistrictroster.FirstName.toString() : '',
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
                value: this.schooldistrictroster && this.schooldistrictroster.hasOwnProperty('Grade') && this.schooldistrictroster.Grade != null ? this.schooldistrictroster.Grade.toString() : '',
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
                value: this.schooldistrictroster && this.schooldistrictroster.hasOwnProperty('HasDataIssues') && this.schooldistrictroster.HasDataIssues != null ? this.schooldistrictroster.HasDataIssues : false,
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
                value: this.schooldistrictroster && this.schooldistrictroster.hasOwnProperty('HasDuplicates') && this.schooldistrictroster.HasDuplicates != null ? this.schooldistrictroster.HasDuplicates : false,
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
                value: this.schooldistrictroster && this.schooldistrictroster.hasOwnProperty('LastName') && this.schooldistrictroster.LastName != null ? this.schooldistrictroster.LastName.toString() : '',
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
                value: this.schooldistrictroster && this.schooldistrictroster.hasOwnProperty('MiddleName') && this.schooldistrictroster.MiddleName != null ? this.schooldistrictroster.MiddleName.toString() : '',
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
                value: this.schooldistrictroster && this.schooldistrictroster.ModifiedById || null,
            }),
            SchoolBuilding: new DynamicField({
                formGroup: this.formGroup,
                label: 'School Building',
                name: 'SchoolBuilding',
                options: null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: InputTypes.Textarea,
                    scale: null,
                }),
                validation: [  ],
                validators: {  },
                value: this.schooldistrictroster && this.schooldistrictroster.hasOwnProperty('SchoolBuilding') && this.schooldistrictroster.SchoolBuilding != null ? this.schooldistrictroster.SchoolBuilding.toString() : '',
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
                value: this.schooldistrictroster && this.schooldistrictroster.SchoolDistrictId || null,
            }),
            SchoolDistrictRosterDocumentId: new DynamicField({
                formGroup: this.formGroup,
                label: 'School District Roster Document',
                name: 'SchoolDistrictRosterDocumentId',
                options: this.schoolDistrictRosterDocuments,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
                validation: [ noZeroRequiredValidator ],
                validators: { 'required': true },
                value: this.schooldistrictroster && this.schooldistrictroster.SchoolDistrictRosterDocumentId || null,
            }),
            StateCode: new DynamicField({
                formGroup: this.formGroup,
                label: 'State Code',
                name: 'StateCode',
                options: null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: InputTypes.Textarea,
                    scale: null,
                }),
                validation: [  ],
                validators: {  },
                value: this.schooldistrictroster && this.schooldistrictroster.hasOwnProperty('StateCode') && this.schooldistrictroster.StateCode != null ? this.schooldistrictroster.StateCode.toString() : '',
            }),
            StudentCode: new DynamicField({
                formGroup: this.formGroup,
                label: 'Student Code',
                name: 'StudentCode',
                options: null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: InputTypes.Textarea,
                    scale: null,
                }),
                validation: [  ],
                validators: {  },
                value: this.schooldistrictroster && this.schooldistrictroster.hasOwnProperty('StudentCode') && this.schooldistrictroster.StudentCode != null ? this.schooldistrictroster.StudentCode.toString() : '',
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
                value: this.schooldistrictroster && this.schooldistrictroster.StudentId || null,
            }),
            Zip: new DynamicField({
                formGroup: this.formGroup,
                label: 'Zip',
                name: 'Zip',
                options: null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: InputTypes.Textarea,
                    scale: null,
                }),
                validation: [ Validators.required ],
                validators: { 'required': true },
                value: this.schooldistrictroster && this.schooldistrictroster.hasOwnProperty('Zip') && this.schooldistrictroster.Zip != null ? this.schooldistrictroster.Zip.toString() : '',
            }),
        };

        this.View = {
            Address1: new DynamicLabel({
                label: 'Address1',
                value: this.schooldistrictroster && this.schooldistrictroster.hasOwnProperty('Address1') && this.schooldistrictroster.Address1 != null ? this.schooldistrictroster.Address1.toString() : '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: InputTypes.Textarea,
                    scale: null,
                }),
            }),
            Address2: new DynamicLabel({
                label: 'Address2',
                value: this.schooldistrictroster && this.schooldistrictroster.hasOwnProperty('Address2') && this.schooldistrictroster.Address2 != null ? this.schooldistrictroster.Address2.toString() : '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: InputTypes.Textarea,
                    scale: null,
                }),
            }),
            Archived: new DynamicLabel({
                label: 'Archived',
                value: this.schooldistrictroster && this.schooldistrictroster.hasOwnProperty('Archived') && this.schooldistrictroster.Archived != null ? this.schooldistrictroster.Archived : false,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Checkbox,
                    inputType: null,
                    scale: null,
                }),
            }),
            City: new DynamicLabel({
                label: 'City',
                value: this.schooldistrictroster && this.schooldistrictroster.hasOwnProperty('City') && this.schooldistrictroster.City != null ? this.schooldistrictroster.City.toString() : '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: InputTypes.Textarea,
                    scale: null,
                }),
            }),
            DateCreated: new DynamicLabel({
                label: 'Date Created',
                value: this.schooldistrictroster && this.schooldistrictroster.DateCreated || null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: InputTypes.Datepicker,
                    scale: null,
                }),
            }),
            DateModified: new DynamicLabel({
                label: 'Date Modified',
                value: this.schooldistrictroster && this.schooldistrictroster.DateModified || null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: InputTypes.Datepicker,
                    scale: null,
                }),
            }),
            DateOfBirth: new DynamicLabel({
                label: 'Date Of Birth',
                value: this.schooldistrictroster && this.schooldistrictroster.hasOwnProperty('DateOfBirth') && this.schooldistrictroster.DateOfBirth != null ? this.schooldistrictroster.DateOfBirth.toString() : '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: InputTypes.Textarea,
                    scale: null,
                }),
            }),
            FirstName: new DynamicLabel({
                label: 'First Name',
                value: this.schooldistrictroster && this.schooldistrictroster.hasOwnProperty('FirstName') && this.schooldistrictroster.FirstName != null ? this.schooldistrictroster.FirstName.toString() : '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: InputTypes.Textarea,
                    scale: null,
                }),
            }),
            Grade: new DynamicLabel({
                label: 'Grade',
                value: this.schooldistrictroster && this.schooldistrictroster.hasOwnProperty('Grade') && this.schooldistrictroster.Grade != null ? this.schooldistrictroster.Grade.toString() : '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: InputTypes.Textarea,
                    scale: null,
                }),
            }),
            HasDataIssues: new DynamicLabel({
                label: 'Has Data Issues',
                value: this.schooldistrictroster && this.schooldistrictroster.hasOwnProperty('HasDataIssues') && this.schooldistrictroster.HasDataIssues != null ? this.schooldistrictroster.HasDataIssues : false,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Checkbox,
                    inputType: null,
                    scale: null,
                }),
            }),
            HasDuplicates: new DynamicLabel({
                label: 'Has Duplicates',
                value: this.schooldistrictroster && this.schooldistrictroster.hasOwnProperty('HasDuplicates') && this.schooldistrictroster.HasDuplicates != null ? this.schooldistrictroster.HasDuplicates : false,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Checkbox,
                    inputType: null,
                    scale: null,
                }),
            }),
            LastName: new DynamicLabel({
                label: 'Last Name',
                value: this.schooldistrictroster && this.schooldistrictroster.hasOwnProperty('LastName') && this.schooldistrictroster.LastName != null ? this.schooldistrictroster.LastName.toString() : '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: InputTypes.Textarea,
                    scale: null,
                }),
            }),
            MiddleName: new DynamicLabel({
                label: 'Middle Name',
                value: this.schooldistrictroster && this.schooldistrictroster.hasOwnProperty('MiddleName') && this.schooldistrictroster.MiddleName != null ? this.schooldistrictroster.MiddleName.toString() : '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: InputTypes.Textarea,
                    scale: null,
                }),
            }),
            ModifiedById: new DynamicLabel({
                label: 'Modified By',
                value: this.schooldistrictroster && this.schooldistrictroster.ModifiedById || null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Numeric,
                    inputType: NumericInputTypes.Integer,
                    scale: null,
                }),
            }),
            SchoolBuilding: new DynamicLabel({
                label: 'School Building',
                value: this.schooldistrictroster && this.schooldistrictroster.hasOwnProperty('SchoolBuilding') && this.schooldistrictroster.SchoolBuilding != null ? this.schooldistrictroster.SchoolBuilding.toString() : '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: InputTypes.Textarea,
                    scale: null,
                }),
            }),
            SchoolDistrictId: new DynamicLabel({
                label: 'School District',
                value: getMetaItemValue(this.schoolDistricts as unknown as IMetaItem[], this.schooldistrictroster && this.schooldistrictroster.hasOwnProperty('SchoolDistrictId') ? this.schooldistrictroster.SchoolDistrictId : null) ?? '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
            }),
            SchoolDistrictRosterDocumentId: new DynamicLabel({
                label: 'School District Roster Document',
                value: getMetaItemValue(this.schoolDistrictRosterDocuments as unknown as IMetaItem[], this.schooldistrictroster && this.schooldistrictroster.hasOwnProperty('SchoolDistrictRosterDocumentId') ? this.schooldistrictroster.SchoolDistrictRosterDocumentId : null) ?? '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
            }),
            StateCode: new DynamicLabel({
                label: 'State Code',
                value: this.schooldistrictroster && this.schooldistrictroster.hasOwnProperty('StateCode') && this.schooldistrictroster.StateCode != null ? this.schooldistrictroster.StateCode.toString() : '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: InputTypes.Textarea,
                    scale: null,
                }),
            }),
            StudentCode: new DynamicLabel({
                label: 'Student Code',
                value: this.schooldistrictroster && this.schooldistrictroster.hasOwnProperty('StudentCode') && this.schooldistrictroster.StudentCode != null ? this.schooldistrictroster.StudentCode.toString() : '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: InputTypes.Textarea,
                    scale: null,
                }),
            }),
            StudentId: new DynamicLabel({
                label: 'Student',
                value: getMetaItemValue(this.students as unknown as IMetaItem[], this.schooldistrictroster && this.schooldistrictroster.hasOwnProperty('StudentId') ? this.schooldistrictroster.StudentId : null) ?? '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
            }),
            Zip: new DynamicLabel({
                label: 'Zip',
                value: this.schooldistrictroster && this.schooldistrictroster.hasOwnProperty('Zip') && this.schooldistrictroster.Zip != null ? this.schooldistrictroster.Zip.toString() : '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: InputTypes.Textarea,
                    scale: null,
                }),
            }),
        };

    }
}
