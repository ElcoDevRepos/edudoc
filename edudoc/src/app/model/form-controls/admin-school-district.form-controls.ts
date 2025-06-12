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
import { IAdminSchoolDistrict } from '../interfaces/admin-school-district';
import { IUser } from '../interfaces/user';
import { ISchoolDistrict } from '../interfaces/school-district';

export interface IAdminSchoolDistrictDynamicControlsParameters {
    formGroup?: string;
    admins?: IUser[];
    schoolDistricts?: ISchoolDistrict[];
    createdBies?: IUser[];
    modifiedBies?: IUser[];
}

export class AdminSchoolDistrictDynamicControls {

    formGroup: string;
    admins?: IUser[];
    schoolDistricts?: ISchoolDistrict[];
    createdBies?: IUser[];
    modifiedBies?: IUser[];

    Form: IExpandableObject;
    View: IExpandableObject;

    constructor(private adminschooldistrict?: IAdminSchoolDistrict, additionalParameters?: IAdminSchoolDistrictDynamicControlsParameters) {
        this.formGroup = additionalParameters && additionalParameters.formGroup || 'AdminSchoolDistrict';
        this.admins = additionalParameters && additionalParameters.admins || undefined;
        this.schoolDistricts = additionalParameters && additionalParameters.schoolDistricts || undefined;
        this.createdBies = additionalParameters && additionalParameters.createdBies || undefined;
        this.modifiedBies = additionalParameters && additionalParameters.modifiedBies || undefined;

        this.Form = {
            AdminId: new DynamicField({
                formGroup: this.formGroup,
                label: 'Admin',
                name: 'AdminId',
                options: this.admins,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
                validation: [ noZeroRequiredValidator ],
                validators: { 'required': true },
                value: this.adminschooldistrict && this.adminschooldistrict.AdminId || null,
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
                value: this.adminschooldistrict && this.adminschooldistrict.hasOwnProperty('Archived') && this.adminschooldistrict.Archived != null ? this.adminschooldistrict.Archived : false,
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
                value: this.adminschooldistrict && this.adminschooldistrict.CreatedById || 1,
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
                value: this.adminschooldistrict && this.adminschooldistrict.DateCreated || null,
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
                value: this.adminschooldistrict && this.adminschooldistrict.DateModified || null,
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
                value: this.adminschooldistrict && this.adminschooldistrict.ModifiedById || null,
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
                value: this.adminschooldistrict && this.adminschooldistrict.SchoolDistrictId || null,
            }),
        };

        this.View = {
            AdminId: new DynamicLabel({
                label: 'Admin',
                value: getMetaItemValue(this.admins as unknown as IMetaItem[], this.adminschooldistrict && this.adminschooldistrict.hasOwnProperty('AdminId') ? this.adminschooldistrict.AdminId : null) ?? '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
            }),
            Archived: new DynamicLabel({
                label: 'Archived',
                value: this.adminschooldistrict && this.adminschooldistrict.hasOwnProperty('Archived') && this.adminschooldistrict.Archived != null ? this.adminschooldistrict.Archived : false,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Checkbox,
                    inputType: null,
                    scale: null,
                }),
            }),
            CreatedById: new DynamicLabel({
                label: 'Created By',
                value: getMetaItemValue(this.createdBies as unknown as IMetaItem[], this.adminschooldistrict && this.adminschooldistrict.hasOwnProperty('CreatedById') ? this.adminschooldistrict.CreatedById : null) ?? '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
            }),
            DateCreated: new DynamicLabel({
                label: 'Date Created',
                value: this.adminschooldistrict && this.adminschooldistrict.DateCreated || null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: InputTypes.Datepicker,
                    scale: null,
                }),
            }),
            DateModified: new DynamicLabel({
                label: 'Date Modified',
                value: this.adminschooldistrict && this.adminschooldistrict.DateModified || null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: InputTypes.Datepicker,
                    scale: null,
                }),
            }),
            ModifiedById: new DynamicLabel({
                label: 'Modified By',
                value: getMetaItemValue(this.modifiedBies as unknown as IMetaItem[], this.adminschooldistrict && this.adminschooldistrict.hasOwnProperty('ModifiedById') ? this.adminschooldistrict.ModifiedById : null) ?? '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
            }),
            SchoolDistrictId: new DynamicLabel({
                label: 'School District',
                value: getMetaItemValue(this.schoolDistricts as unknown as IMetaItem[], this.adminschooldistrict && this.adminschooldistrict.hasOwnProperty('SchoolDistrictId') ? this.adminschooldistrict.SchoolDistrictId : null) ?? '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
            }),
        };

    }
}
