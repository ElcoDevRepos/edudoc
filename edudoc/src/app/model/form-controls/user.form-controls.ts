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
import { IUser } from '../interfaces/user';
import { IAddress } from '../interfaces/address';
import { IAuthUser } from '../interfaces/auth-user';
import { IImage } from '../interfaces/image';
import { ISchoolDistrict } from '../interfaces/school-district';

export interface IUserDynamicControlsParameters {
    formGroup?: string;
    authUsers?: IAuthUser[];
    images?: IImage[];
    addresses?: IAddress[];
    schoolDistricts?: ISchoolDistrict[];
    createdBies?: IUser[];
    modifiedBies?: IUser[];
}

export class UserDynamicControls {

    formGroup: string;
    authUsers?: IAuthUser[];
    images?: IImage[];
    addresses?: IAddress[];
    schoolDistricts?: ISchoolDistrict[];
    createdBies?: IUser[];
    modifiedBies?: IUser[];

    Form: IExpandableObject;
    View: IExpandableObject;

    constructor(private user?: IUser, additionalParameters?: IUserDynamicControlsParameters) {
        this.formGroup = additionalParameters && additionalParameters.formGroup || 'User';
        this.authUsers = additionalParameters && additionalParameters.authUsers || undefined;
        this.images = additionalParameters && additionalParameters.images || undefined;
        this.addresses = additionalParameters && additionalParameters.addresses || undefined;
        this.schoolDistricts = additionalParameters && additionalParameters.schoolDistricts || undefined;
        this.createdBies = additionalParameters && additionalParameters.createdBies || undefined;
        this.modifiedBies = additionalParameters && additionalParameters.modifiedBies || undefined;

        this.Form = {
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
                value: this.user && this.user.AddressId || null,
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
                value: this.user && this.user.hasOwnProperty('Archived') && this.user.Archived != null ? this.user.Archived : false,
            }),
            AuthUserId: new DynamicField({
                formGroup: this.formGroup,
                label: 'Auth User',
                name: 'AuthUserId',
                options: this.authUsers,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
                validation: [ noZeroRequiredValidator ],
                validators: { 'required': true },
                value: this.user && this.user.AuthUserId || null,
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
                value: this.user && this.user.CreatedById || null,
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
                value: this.user && this.user.DateCreated || null,
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
                value: this.user && this.user.DateModified || null,
            }),
            Email: new DynamicField({
                formGroup: this.formGroup,
                label: 'Email',
                name: 'Email',
                options: null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: null,
                    scale: null,
                }),
                validation: [ Validators.required, Validators.maxLength(254), Validators.email ],
                validators: { 'required': true, 'maxlength': 254, 'email': true },
                value: this.user && this.user.hasOwnProperty('Email') && this.user.Email != null ? this.user.Email.toString() : '',
            }),
            FirstName: new DynamicField({
                formGroup: this.formGroup,
                label: 'First Name',
                name: 'FirstName',
                options: null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: null,
                    scale: null,
                }),
                validation: [ Validators.required, Validators.maxLength(50) ],
                validators: { 'required': true, 'maxlength': 50 },
                value: this.user && this.user.hasOwnProperty('FirstName') && this.user.FirstName != null ? this.user.FirstName.toString() : '',
            }),
            ImageId: new DynamicField({
                formGroup: this.formGroup,
                label: 'Image',
                name: 'ImageId',
                options: this.images,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
                validation: [  ],
                validators: {  },
                value: this.user && this.user.ImageId || null,
            }),
            LastName: new DynamicField({
                formGroup: this.formGroup,
                label: 'Last Name',
                name: 'LastName',
                options: null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: null,
                    scale: null,
                }),
                validation: [ Validators.required, Validators.maxLength(50) ],
                validators: { 'required': true, 'maxlength': 50 },
                value: this.user && this.user.hasOwnProperty('LastName') && this.user.LastName != null ? this.user.LastName.toString() : '',
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
                value: this.user && this.user.ModifiedById || null,
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
                value: this.user && this.user.SchoolDistrictId || null,
            }),
        };

        this.View = {
            AddressId: new DynamicLabel({
                label: 'Address',
                value: getMetaItemValue(this.addresses as unknown as IMetaItem[], this.user && this.user.hasOwnProperty('AddressId') ? this.user.AddressId : null) ?? '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
            }),
            Archived: new DynamicLabel({
                label: 'Archived',
                value: this.user && this.user.hasOwnProperty('Archived') && this.user.Archived != null ? this.user.Archived : false,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Checkbox,
                    inputType: null,
                    scale: null,
                }),
            }),
            AuthUserId: new DynamicLabel({
                label: 'Auth User',
                value: getMetaItemValue(this.authUsers as unknown as IMetaItem[], this.user && this.user.hasOwnProperty('AuthUserId') ? this.user.AuthUserId : null) ?? '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
            }),
            CreatedById: new DynamicLabel({
                label: 'Created By',
                value: getMetaItemValue(this.createdBies as unknown as IMetaItem[], this.user && this.user.hasOwnProperty('CreatedById') ? this.user.CreatedById : null) ?? '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
            }),
            DateCreated: new DynamicLabel({
                label: 'Date Created',
                value: this.user && this.user.DateCreated || null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: InputTypes.Datepicker,
                    scale: null,
                }),
            }),
            DateModified: new DynamicLabel({
                label: 'Date Modified',
                value: this.user && this.user.DateModified || null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: InputTypes.Datepicker,
                    scale: null,
                }),
            }),
            Email: new DynamicLabel({
                label: 'Email',
                value: this.user && this.user.hasOwnProperty('Email') && this.user.Email != null ? this.user.Email.toString() : '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: null,
                    scale: null,
                }),
            }),
            FirstName: new DynamicLabel({
                label: 'First Name',
                value: this.user && this.user.hasOwnProperty('FirstName') && this.user.FirstName != null ? this.user.FirstName.toString() : '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: null,
                    scale: null,
                }),
            }),
            ImageId: new DynamicLabel({
                label: 'Image',
                value: getMetaItemValue(this.images as unknown as IMetaItem[], this.user && this.user.hasOwnProperty('ImageId') ? this.user.ImageId : null) ?? '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
            }),
            LastName: new DynamicLabel({
                label: 'Last Name',
                value: this.user && this.user.hasOwnProperty('LastName') && this.user.LastName != null ? this.user.LastName.toString() : '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: null,
                    scale: null,
                }),
            }),
            ModifiedById: new DynamicLabel({
                label: 'Modified By',
                value: getMetaItemValue(this.modifiedBies as unknown as IMetaItem[], this.user && this.user.hasOwnProperty('ModifiedById') ? this.user.ModifiedById : null) ?? '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
            }),
            SchoolDistrictId: new DynamicLabel({
                label: 'School District',
                value: getMetaItemValue(this.schoolDistricts as unknown as IMetaItem[], this.user && this.user.hasOwnProperty('SchoolDistrictId') ? this.user.SchoolDistrictId : null) ?? '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
            }),
        };

    }
}
