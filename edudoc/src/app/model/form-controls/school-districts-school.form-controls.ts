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
import { ISchoolDistrictsSchool } from '../interfaces/school-districts-school';
import { IUser } from '../interfaces/user';
import { ISchoolDistrict } from '../interfaces/school-district';
import { ISchool } from '../interfaces/school';

export interface ISchoolDistrictsSchoolDynamicControlsParameters {
    formGroup?: string;
    schoolDistricts?: ISchoolDistrict[];
    schools?: ISchool[];
    createdBies?: IUser[];
    modifiedBies?: IUser[];
}

export class SchoolDistrictsSchoolDynamicControls {

    formGroup: string;
    schoolDistricts?: ISchoolDistrict[];
    schools?: ISchool[];
    createdBies?: IUser[];
    modifiedBies?: IUser[];

    Form: IExpandableObject;
    View: IExpandableObject;

    constructor(private schooldistrictsschool?: ISchoolDistrictsSchool, additionalParameters?: ISchoolDistrictsSchoolDynamicControlsParameters) {
        this.formGroup = additionalParameters && additionalParameters.formGroup || 'SchoolDistrictsSchool';
        this.schoolDistricts = additionalParameters && additionalParameters.schoolDistricts || undefined;
        this.schools = additionalParameters && additionalParameters.schools || undefined;
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
                value: this.schooldistrictsschool && this.schooldistrictsschool.hasOwnProperty('Archived') && this.schooldistrictsschool.Archived != null ? this.schooldistrictsschool.Archived : false,
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
                value: this.schooldistrictsschool && this.schooldistrictsschool.CreatedById || 1,
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
                value: this.schooldistrictsschool && this.schooldistrictsschool.DateCreated || null,
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
                value: this.schooldistrictsschool && this.schooldistrictsschool.DateModified || null,
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
                value: this.schooldistrictsschool && this.schooldistrictsschool.ModifiedById || null,
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
                value: this.schooldistrictsschool && this.schooldistrictsschool.SchoolDistrictId || null,
            }),
            SchoolId: new DynamicField({
                formGroup: this.formGroup,
                label: 'School',
                name: 'SchoolId',
                options: this.schools,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
                validation: [ noZeroRequiredValidator ],
                validators: { 'required': true },
                value: this.schooldistrictsschool && this.schooldistrictsschool.SchoolId || null,
            }),
        };

        this.View = {
            Archived: new DynamicLabel({
                label: 'Archived',
                value: this.schooldistrictsschool && this.schooldistrictsschool.hasOwnProperty('Archived') && this.schooldistrictsschool.Archived != null ? this.schooldistrictsschool.Archived : false,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Checkbox,
                    inputType: null,
                    scale: null,
                }),
            }),
            CreatedById: new DynamicLabel({
                label: 'Created By',
                value: getMetaItemValue(this.createdBies as unknown as IMetaItem[], this.schooldistrictsschool && this.schooldistrictsschool.hasOwnProperty('CreatedById') ? this.schooldistrictsschool.CreatedById : null) ?? '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
            }),
            DateCreated: new DynamicLabel({
                label: 'Date Created',
                value: this.schooldistrictsschool && this.schooldistrictsschool.DateCreated || null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: InputTypes.Datepicker,
                    scale: null,
                }),
            }),
            DateModified: new DynamicLabel({
                label: 'Date Modified',
                value: this.schooldistrictsschool && this.schooldistrictsschool.DateModified || null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: InputTypes.Datepicker,
                    scale: null,
                }),
            }),
            ModifiedById: new DynamicLabel({
                label: 'Modified By',
                value: getMetaItemValue(this.modifiedBies as unknown as IMetaItem[], this.schooldistrictsschool && this.schooldistrictsschool.hasOwnProperty('ModifiedById') ? this.schooldistrictsschool.ModifiedById : null) ?? '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
            }),
            SchoolDistrictId: new DynamicLabel({
                label: 'School District',
                value: getMetaItemValue(this.schoolDistricts as unknown as IMetaItem[], this.schooldistrictsschool && this.schooldistrictsschool.hasOwnProperty('SchoolDistrictId') ? this.schooldistrictsschool.SchoolDistrictId : null) ?? '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
            }),
            SchoolId: new DynamicLabel({
                label: 'School',
                value: getMetaItemValue(this.schools as unknown as IMetaItem[], this.schooldistrictsschool && this.schooldistrictsschool.hasOwnProperty('SchoolId') ? this.schooldistrictsschool.SchoolId : null) ?? '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
            }),
        };

    }
}
