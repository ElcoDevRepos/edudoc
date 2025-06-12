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
import { IContact } from '../interfaces/contact';
import { IAddress } from '../interfaces/address';
import { IUser } from '../interfaces/user';
import { IContactRole } from '../interfaces/contact-role';
import { IContactStatus } from '../interfaces/contact-status';

export interface IContactDynamicControlsParameters {
    formGroup?: string;
    addresses?: IAddress[];
    roles?: IContactRole[];
    statuses?: IContactStatus[];
    createdBies?: IUser[];
    modifiedBies?: IUser[];
}

export class ContactDynamicControls {

    formGroup: string;
    addresses?: IAddress[];
    roles?: IContactRole[];
    statuses?: IContactStatus[];
    createdBies?: IUser[];
    modifiedBies?: IUser[];

    Form: IExpandableObject;
    View: IExpandableObject;

    constructor(private contact?: IContact, additionalParameters?: IContactDynamicControlsParameters) {
        this.formGroup = additionalParameters && additionalParameters.formGroup || 'Contact';
        this.addresses = additionalParameters && additionalParameters.addresses || undefined;
        this.roles = additionalParameters && additionalParameters.roles || undefined;
        this.statuses = additionalParameters && additionalParameters.statuses || undefined;
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
                value: this.contact && this.contact.AddressId || null,
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
                value: this.contact && this.contact.hasOwnProperty('Archived') && this.contact.Archived != null ? this.contact.Archived : false,
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
                value: this.contact && this.contact.CreatedById || null,
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
                value: this.contact && this.contact.DateCreated || null,
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
                value: this.contact && this.contact.DateModified || null,
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
                validation: [ Validators.required, Validators.maxLength(100), Validators.email ],
                validators: { 'required': true, 'maxlength': 100, 'email': true },
                value: this.contact && this.contact.hasOwnProperty('Email') && this.contact.Email != null ? this.contact.Email.toString() : '',
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
                validation: [ Validators.required, Validators.maxLength(100) ],
                validators: { 'required': true, 'maxlength': 100 },
                value: this.contact && this.contact.hasOwnProperty('FirstName') && this.contact.FirstName != null ? this.contact.FirstName.toString() : '',
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
                validation: [ Validators.required, Validators.maxLength(100) ],
                validators: { 'required': true, 'maxlength': 100 },
                value: this.contact && this.contact.hasOwnProperty('LastName') && this.contact.LastName != null ? this.contact.LastName.toString() : '',
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
                value: this.contact && this.contact.ModifiedById || null,
            }),
            RoleId: new DynamicField({
                formGroup: this.formGroup,
                label: 'Role',
                name: 'RoleId',
                options: this.roles,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
                validation: [ noZeroRequiredValidator ],
                validators: { 'required': true },
                value: this.contact && this.contact.RoleId || null,
            }),
            StatusId: new DynamicField({
                formGroup: this.formGroup,
                label: 'Status',
                name: 'StatusId',
                options: this.statuses,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
                validation: [  ],
                validators: {  },
                value: this.contact && this.contact.StatusId || 0,
            }),
            Title: new DynamicField({
                formGroup: this.formGroup,
                label: 'Title',
                name: 'Title',
                options: null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: null,
                    scale: null,
                }),
                validation: [ Validators.maxLength(100) ],
                validators: { 'maxlength': 100 },
                value: this.contact && this.contact.hasOwnProperty('Title') && this.contact.Title != null ? this.contact.Title.toString() : '',
            }),
        };

        this.View = {
            AddressId: new DynamicLabel({
                label: 'Address',
                value: getMetaItemValue(this.addresses as unknown as IMetaItem[], this.contact && this.contact.hasOwnProperty('AddressId') ? this.contact.AddressId : null) ?? '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
            }),
            Archived: new DynamicLabel({
                label: 'Archived',
                value: this.contact && this.contact.hasOwnProperty('Archived') && this.contact.Archived != null ? this.contact.Archived : false,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Checkbox,
                    inputType: null,
                    scale: null,
                }),
            }),
            CreatedById: new DynamicLabel({
                label: 'Created By',
                value: getMetaItemValue(this.createdBies as unknown as IMetaItem[], this.contact && this.contact.hasOwnProperty('CreatedById') ? this.contact.CreatedById : null) ?? '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
            }),
            DateCreated: new DynamicLabel({
                label: 'Date Created',
                value: this.contact && this.contact.DateCreated || null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: InputTypes.Datepicker,
                    scale: null,
                }),
            }),
            DateModified: new DynamicLabel({
                label: 'Date Modified',
                value: this.contact && this.contact.DateModified || null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: InputTypes.Datepicker,
                    scale: null,
                }),
            }),
            Email: new DynamicLabel({
                label: 'Email',
                value: this.contact && this.contact.hasOwnProperty('Email') && this.contact.Email != null ? this.contact.Email.toString() : '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: null,
                    scale: null,
                }),
            }),
            FirstName: new DynamicLabel({
                label: 'First Name',
                value: this.contact && this.contact.hasOwnProperty('FirstName') && this.contact.FirstName != null ? this.contact.FirstName.toString() : '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: null,
                    scale: null,
                }),
            }),
            LastName: new DynamicLabel({
                label: 'Last Name',
                value: this.contact && this.contact.hasOwnProperty('LastName') && this.contact.LastName != null ? this.contact.LastName.toString() : '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: null,
                    scale: null,
                }),
            }),
            ModifiedById: new DynamicLabel({
                label: 'Modified By',
                value: getMetaItemValue(this.modifiedBies as unknown as IMetaItem[], this.contact && this.contact.hasOwnProperty('ModifiedById') ? this.contact.ModifiedById : null) ?? '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
            }),
            RoleId: new DynamicLabel({
                label: 'Role',
                value: getMetaItemValue(this.roles as unknown as IMetaItem[], this.contact && this.contact.hasOwnProperty('RoleId') ? this.contact.RoleId : null) ?? '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
            }),
            StatusId: new DynamicLabel({
                label: 'Status',
                value: getMetaItemValue(this.statuses as unknown as IMetaItem[], this.contact && this.contact.hasOwnProperty('StatusId') ? this.contact.StatusId : null) ?? '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
            }),
            Title: new DynamicLabel({
                label: 'Title',
                value: this.contact && this.contact.hasOwnProperty('Title') && this.contact.Title != null ? this.contact.Title.toString() : '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: null,
                    scale: null,
                }),
            }),
        };

    }
}
