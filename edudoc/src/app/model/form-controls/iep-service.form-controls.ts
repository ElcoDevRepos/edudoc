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
import { IIepService } from '../interfaces/iep-service';
import { IUser } from '../interfaces/user';
import { IStudent } from '../interfaces/student';

export interface IIepServiceDynamicControlsParameters {
    formGroup?: string;
    students?: IStudent[];
    createdBies?: IUser[];
    modifiedBies?: IUser[];
}

export class IepServiceDynamicControls {

    formGroup: string;
    students?: IStudent[];
    createdBies?: IUser[];
    modifiedBies?: IUser[];

    Form: IExpandableObject;
    View: IExpandableObject;

    constructor(private iepservice?: IIepService, additionalParameters?: IIepServiceDynamicControlsParameters) {
        this.formGroup = additionalParameters && additionalParameters.formGroup || 'IepService';
        this.students = additionalParameters && additionalParameters.students || undefined;
        this.createdBies = additionalParameters && additionalParameters.createdBies || undefined;
        this.modifiedBies = additionalParameters && additionalParameters.modifiedBies || undefined;

        this.Form = {
            AudDate: new DynamicField({
                formGroup: this.formGroup,
                label: 'Aud Date',
                name: 'AudDate',
                options: null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: InputTypes.Datepicker,
                    scale: null,
                }),
                validation: [  ],
                validators: {  },
                value: this.iepservice && this.iepservice.AudDate || null,
            }),
            AudTotalMinutes: new DynamicField({
                formGroup: this.formGroup,
                label: 'Aud Total Minutes',
                name: 'AudTotalMinutes',
                options: null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Numeric,
                    inputType: NumericInputTypes.Integer,
                    scale: null,
                }),
                validation: [  ],
                validators: {  },
                value: this.iepservice && this.iepservice.AudTotalMinutes || 0,
            }),
            CcDate: new DynamicField({
                formGroup: this.formGroup,
                label: 'Cc Date',
                name: 'CcDate',
                options: null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: InputTypes.Datepicker,
                    scale: null,
                }),
                validation: [  ],
                validators: {  },
                value: this.iepservice && this.iepservice.CcDate || null,
            }),
            CcTotalMinutes: new DynamicField({
                formGroup: this.formGroup,
                label: 'Cc Total Minutes',
                name: 'CcTotalMinutes',
                options: null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Numeric,
                    inputType: NumericInputTypes.Integer,
                    scale: null,
                }),
                validation: [  ],
                validators: {  },
                value: this.iepservice && this.iepservice.CcTotalMinutes || 0,
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
                value: this.iepservice && this.iepservice.CreatedById || 1,
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
                value: this.iepservice && this.iepservice.DateCreated || null,
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
                value: this.iepservice && this.iepservice.DateModified || null,
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
                validation: [ Validators.required ],
                validators: { 'required': true },
                value: this.iepservice && this.iepservice.EndDate || null,
            }),
            EtrExpirationDate: new DynamicField({
                formGroup: this.formGroup,
                label: 'Etr Expiration Date',
                name: 'EtrExpirationDate',
                options: null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: InputTypes.Datepicker,
                    scale: null,
                }),
                validation: [ Validators.required ],
                validators: { 'required': true },
                value: this.iepservice && this.iepservice.EtrExpirationDate || null,
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
                value: this.iepservice && this.iepservice.ModifiedById || null,
            }),
            NursingDate: new DynamicField({
                formGroup: this.formGroup,
                label: 'Nursing Date',
                name: 'NursingDate',
                options: null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: InputTypes.Datepicker,
                    scale: null,
                }),
                validation: [  ],
                validators: {  },
                value: this.iepservice && this.iepservice.NursingDate || null,
            }),
            NursingTotalMinutes: new DynamicField({
                formGroup: this.formGroup,
                label: 'Nursing Total Minutes',
                name: 'NursingTotalMinutes',
                options: null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Numeric,
                    inputType: NumericInputTypes.Integer,
                    scale: null,
                }),
                validation: [  ],
                validators: {  },
                value: this.iepservice && this.iepservice.NursingTotalMinutes || 0,
            }),
            OtpDate: new DynamicField({
                formGroup: this.formGroup,
                label: 'Otp Date',
                name: 'OtpDate',
                options: null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: InputTypes.Datepicker,
                    scale: null,
                }),
                validation: [  ],
                validators: {  },
                value: this.iepservice && this.iepservice.OtpDate || null,
            }),
            OtpTotalMinutes: new DynamicField({
                formGroup: this.formGroup,
                label: 'Otp Total Minutes',
                name: 'OtpTotalMinutes',
                options: null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Numeric,
                    inputType: NumericInputTypes.Integer,
                    scale: null,
                }),
                validation: [  ],
                validators: {  },
                value: this.iepservice && this.iepservice.OtpTotalMinutes || 0,
            }),
            PsyDate: new DynamicField({
                formGroup: this.formGroup,
                label: 'Psy Date',
                name: 'PsyDate',
                options: null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: InputTypes.Datepicker,
                    scale: null,
                }),
                validation: [  ],
                validators: {  },
                value: this.iepservice && this.iepservice.PsyDate || null,
            }),
            PsyTotalMinutes: new DynamicField({
                formGroup: this.formGroup,
                label: 'Psy Total Minutes',
                name: 'PsyTotalMinutes',
                options: null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Numeric,
                    inputType: NumericInputTypes.Integer,
                    scale: null,
                }),
                validation: [  ],
                validators: {  },
                value: this.iepservice && this.iepservice.PsyTotalMinutes || 0,
            }),
            PtDate: new DynamicField({
                formGroup: this.formGroup,
                label: 'Pt Date',
                name: 'PtDate',
                options: null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: InputTypes.Datepicker,
                    scale: null,
                }),
                validation: [  ],
                validators: {  },
                value: this.iepservice && this.iepservice.PtDate || null,
            }),
            PtTotalMinutes: new DynamicField({
                formGroup: this.formGroup,
                label: 'Pt Total Minutes',
                name: 'PtTotalMinutes',
                options: null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Numeric,
                    inputType: NumericInputTypes.Integer,
                    scale: null,
                }),
                validation: [  ],
                validators: {  },
                value: this.iepservice && this.iepservice.PtTotalMinutes || 0,
            }),
            SocDate: new DynamicField({
                formGroup: this.formGroup,
                label: 'Soc Date',
                name: 'SocDate',
                options: null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: InputTypes.Datepicker,
                    scale: null,
                }),
                validation: [  ],
                validators: {  },
                value: this.iepservice && this.iepservice.SocDate || null,
            }),
            SocTotalMinutes: new DynamicField({
                formGroup: this.formGroup,
                label: 'Soc Total Minutes',
                name: 'SocTotalMinutes',
                options: null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Numeric,
                    inputType: NumericInputTypes.Integer,
                    scale: null,
                }),
                validation: [  ],
                validators: {  },
                value: this.iepservice && this.iepservice.SocTotalMinutes || 0,
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
                validation: [ Validators.required ],
                validators: { 'required': true },
                value: this.iepservice && this.iepservice.StartDate || null,
            }),
            StpDate: new DynamicField({
                formGroup: this.formGroup,
                label: 'Stp Date',
                name: 'StpDate',
                options: null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: InputTypes.Datepicker,
                    scale: null,
                }),
                validation: [  ],
                validators: {  },
                value: this.iepservice && this.iepservice.StpDate || null,
            }),
            StpTotalMinutes: new DynamicField({
                formGroup: this.formGroup,
                label: 'Stp Total Minutes',
                name: 'StpTotalMinutes',
                options: null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Numeric,
                    inputType: NumericInputTypes.Integer,
                    scale: null,
                }),
                validation: [  ],
                validators: {  },
                value: this.iepservice && this.iepservice.StpTotalMinutes || 0,
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
                validation: [ noZeroRequiredValidator ],
                validators: { 'required': true },
                value: this.iepservice && this.iepservice.StudentId || null,
            }),
        };

        this.View = {
            AudDate: new DynamicLabel({
                label: 'Aud Date',
                value: this.iepservice && this.iepservice.AudDate || null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: InputTypes.Datepicker,
                    scale: null,
                }),
            }),
            AudTotalMinutes: new DynamicLabel({
                label: 'Aud Total Minutes',
                value: this.iepservice && this.iepservice.AudTotalMinutes || 0,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Numeric,
                    inputType: NumericInputTypes.Integer,
                    scale: null,
                }),
            }),
            CcDate: new DynamicLabel({
                label: 'Cc Date',
                value: this.iepservice && this.iepservice.CcDate || null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: InputTypes.Datepicker,
                    scale: null,
                }),
            }),
            CcTotalMinutes: new DynamicLabel({
                label: 'Cc Total Minutes',
                value: this.iepservice && this.iepservice.CcTotalMinutes || 0,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Numeric,
                    inputType: NumericInputTypes.Integer,
                    scale: null,
                }),
            }),
            CreatedById: new DynamicLabel({
                label: 'Created By',
                value: getMetaItemValue(this.createdBies as unknown as IMetaItem[], this.iepservice && this.iepservice.hasOwnProperty('CreatedById') ? this.iepservice.CreatedById : null) ?? '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
            }),
            DateCreated: new DynamicLabel({
                label: 'Date Created',
                value: this.iepservice && this.iepservice.DateCreated || null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: InputTypes.Datepicker,
                    scale: null,
                }),
            }),
            DateModified: new DynamicLabel({
                label: 'Date Modified',
                value: this.iepservice && this.iepservice.DateModified || null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: InputTypes.Datepicker,
                    scale: null,
                }),
            }),
            EndDate: new DynamicLabel({
                label: 'End Date',
                value: this.iepservice && this.iepservice.EndDate || null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: InputTypes.Datepicker,
                    scale: null,
                }),
            }),
            EtrExpirationDate: new DynamicLabel({
                label: 'Etr Expiration Date',
                value: this.iepservice && this.iepservice.EtrExpirationDate || null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: InputTypes.Datepicker,
                    scale: null,
                }),
            }),
            ModifiedById: new DynamicLabel({
                label: 'Modified By',
                value: getMetaItemValue(this.modifiedBies as unknown as IMetaItem[], this.iepservice && this.iepservice.hasOwnProperty('ModifiedById') ? this.iepservice.ModifiedById : null) ?? '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
            }),
            NursingDate: new DynamicLabel({
                label: 'Nursing Date',
                value: this.iepservice && this.iepservice.NursingDate || null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: InputTypes.Datepicker,
                    scale: null,
                }),
            }),
            NursingTotalMinutes: new DynamicLabel({
                label: 'Nursing Total Minutes',
                value: this.iepservice && this.iepservice.NursingTotalMinutes || 0,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Numeric,
                    inputType: NumericInputTypes.Integer,
                    scale: null,
                }),
            }),
            OtpDate: new DynamicLabel({
                label: 'Otp Date',
                value: this.iepservice && this.iepservice.OtpDate || null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: InputTypes.Datepicker,
                    scale: null,
                }),
            }),
            OtpTotalMinutes: new DynamicLabel({
                label: 'Otp Total Minutes',
                value: this.iepservice && this.iepservice.OtpTotalMinutes || 0,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Numeric,
                    inputType: NumericInputTypes.Integer,
                    scale: null,
                }),
            }),
            PsyDate: new DynamicLabel({
                label: 'Psy Date',
                value: this.iepservice && this.iepservice.PsyDate || null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: InputTypes.Datepicker,
                    scale: null,
                }),
            }),
            PsyTotalMinutes: new DynamicLabel({
                label: 'Psy Total Minutes',
                value: this.iepservice && this.iepservice.PsyTotalMinutes || 0,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Numeric,
                    inputType: NumericInputTypes.Integer,
                    scale: null,
                }),
            }),
            PtDate: new DynamicLabel({
                label: 'Pt Date',
                value: this.iepservice && this.iepservice.PtDate || null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: InputTypes.Datepicker,
                    scale: null,
                }),
            }),
            PtTotalMinutes: new DynamicLabel({
                label: 'Pt Total Minutes',
                value: this.iepservice && this.iepservice.PtTotalMinutes || 0,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Numeric,
                    inputType: NumericInputTypes.Integer,
                    scale: null,
                }),
            }),
            SocDate: new DynamicLabel({
                label: 'Soc Date',
                value: this.iepservice && this.iepservice.SocDate || null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: InputTypes.Datepicker,
                    scale: null,
                }),
            }),
            SocTotalMinutes: new DynamicLabel({
                label: 'Soc Total Minutes',
                value: this.iepservice && this.iepservice.SocTotalMinutes || 0,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Numeric,
                    inputType: NumericInputTypes.Integer,
                    scale: null,
                }),
            }),
            StartDate: new DynamicLabel({
                label: 'Start Date',
                value: this.iepservice && this.iepservice.StartDate || null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: InputTypes.Datepicker,
                    scale: null,
                }),
            }),
            StpDate: new DynamicLabel({
                label: 'Stp Date',
                value: this.iepservice && this.iepservice.StpDate || null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: InputTypes.Datepicker,
                    scale: null,
                }),
            }),
            StpTotalMinutes: new DynamicLabel({
                label: 'Stp Total Minutes',
                value: this.iepservice && this.iepservice.StpTotalMinutes || 0,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Numeric,
                    inputType: NumericInputTypes.Integer,
                    scale: null,
                }),
            }),
            StudentId: new DynamicLabel({
                label: 'Student',
                value: getMetaItemValue(this.students as unknown as IMetaItem[], this.iepservice && this.iepservice.hasOwnProperty('StudentId') ? this.iepservice.StudentId : null) ?? '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
            }),
        };

    }
}
