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
import { IProgressReport } from '../interfaces/progress-report';
import { IUser } from '../interfaces/user';
import { IStudent } from '../interfaces/student';

export interface IProgressReportDynamicControlsParameters {
    formGroup?: string;
    students?: IStudent[];
    eSignedBies?: IUser[];
    supervisorESignedBies?: IUser[];
    createdBies?: IUser[];
    modifiedBies?: IUser[];
}

export class ProgressReportDynamicControls {

    formGroup: string;
    students?: IStudent[];
    eSignedBies?: IUser[];
    supervisorESignedBies?: IUser[];
    createdBies?: IUser[];
    modifiedBies?: IUser[];

    Form: IExpandableObject;
    View: IExpandableObject;

    constructor(private progressreport?: IProgressReport, additionalParameters?: IProgressReportDynamicControlsParameters) {
        this.formGroup = additionalParameters && additionalParameters.formGroup || 'ProgressReport';
        this.students = additionalParameters && additionalParameters.students || undefined;
        this.eSignedBies = additionalParameters && additionalParameters.eSignedBies || undefined;
        this.supervisorESignedBies = additionalParameters && additionalParameters.supervisorESignedBies || undefined;
        this.createdBies = additionalParameters && additionalParameters.createdBies || undefined;
        this.modifiedBies = additionalParameters && additionalParameters.modifiedBies || undefined;

        this.Form = {
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
                value: this.progressreport && this.progressreport.CreatedById || 1,
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
                value: this.progressreport && this.progressreport.DateCreated || null,
            }),
            DateESigned: new DynamicField({
                formGroup: this.formGroup,
                label: 'Date E Signed',
                name: 'DateESigned',
                options: null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: InputTypes.Datepicker,
                    scale: null,
                }),
                validation: [  ],
                validators: {  },
                value: this.progressreport && this.progressreport.DateESigned || null,
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
                value: this.progressreport && this.progressreport.DateModified || null,
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
                validation: [  ],
                validators: {  },
                value: this.progressreport && this.progressreport.EndDate || null,
            }),
            ESignedById: new DynamicField({
                formGroup: this.formGroup,
                label: 'E Signed By',
                name: 'ESignedById',
                options: this.eSignedBies,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
                validation: [  ],
                validators: {  },
                value: this.progressreport && this.progressreport.ESignedById || null,
            }),
            MedicalStatusChange: new DynamicField({
                formGroup: this.formGroup,
                label: 'Medical Status Change',
                name: 'MedicalStatusChange',
                options: null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Checkbox,
                    inputType: null,
                    scale: null,
                }),
                validation: [  ],
                validators: {  },
                value: this.progressreport && this.progressreport.hasOwnProperty('MedicalStatusChange') && this.progressreport.MedicalStatusChange != null ? this.progressreport.MedicalStatusChange : false,
            }),
            MedicalStatusChangeNotes: new DynamicField({
                formGroup: this.formGroup,
                label: 'Medical Status Change Notes',
                name: 'MedicalStatusChangeNotes',
                options: null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: null,
                    scale: null,
                }),
                validation: [ Validators.maxLength(5000) ],
                validators: { 'maxlength': 5000 },
                value: this.progressreport && this.progressreport.hasOwnProperty('MedicalStatusChangeNotes') && this.progressreport.MedicalStatusChangeNotes != null ? this.progressreport.MedicalStatusChangeNotes.toString() : '',
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
                value: this.progressreport && this.progressreport.ModifiedById || null,
            }),
            Progress: new DynamicField({
                formGroup: this.formGroup,
                label: 'Progress',
                name: 'Progress',
                options: null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Checkbox,
                    inputType: null,
                    scale: null,
                }),
                validation: [  ],
                validators: {  },
                value: this.progressreport && this.progressreport.hasOwnProperty('Progress') && this.progressreport.Progress != null ? this.progressreport.Progress : false,
            }),
            ProgressNotes: new DynamicField({
                formGroup: this.formGroup,
                label: 'Progress Notes',
                name: 'ProgressNotes',
                options: null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: null,
                    scale: null,
                }),
                validation: [ Validators.maxLength(5000) ],
                validators: { 'maxlength': 5000 },
                value: this.progressreport && this.progressreport.hasOwnProperty('ProgressNotes') && this.progressreport.ProgressNotes != null ? this.progressreport.ProgressNotes.toString() : '',
            }),
            Quarter: new DynamicField({
                formGroup: this.formGroup,
                label: 'Quarter',
                name: 'Quarter',
                options: null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Numeric,
                    inputType: NumericInputTypes.Integer,
                    scale: null,
                }),
                validation: [  ],
                validators: {  },
                value: this.progressreport && this.progressreport.Quarter || null,
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
                validation: [  ],
                validators: {  },
                value: this.progressreport && this.progressreport.StartDate || null,
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
                value: this.progressreport && this.progressreport.StudentId || null,
            }),
            SupervisorDateESigned: new DynamicField({
                formGroup: this.formGroup,
                label: 'Supervisor Date E Signed',
                name: 'SupervisorDateESigned',
                options: null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: InputTypes.Datepicker,
                    scale: null,
                }),
                validation: [  ],
                validators: {  },
                value: this.progressreport && this.progressreport.SupervisorDateESigned || null,
            }),
            SupervisorESignedById: new DynamicField({
                formGroup: this.formGroup,
                label: 'Supervisor E Signed By',
                name: 'SupervisorESignedById',
                options: this.supervisorESignedBies,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
                validation: [  ],
                validators: {  },
                value: this.progressreport && this.progressreport.SupervisorESignedById || null,
            }),
            TreatmentChange: new DynamicField({
                formGroup: this.formGroup,
                label: 'Treatment Change',
                name: 'TreatmentChange',
                options: null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Checkbox,
                    inputType: null,
                    scale: null,
                }),
                validation: [  ],
                validators: {  },
                value: this.progressreport && this.progressreport.hasOwnProperty('TreatmentChange') && this.progressreport.TreatmentChange != null ? this.progressreport.TreatmentChange : false,
            }),
            TreatmentChangeNotes: new DynamicField({
                formGroup: this.formGroup,
                label: 'Treatment Change Notes',
                name: 'TreatmentChangeNotes',
                options: null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: null,
                    scale: null,
                }),
                validation: [ Validators.maxLength(5000) ],
                validators: { 'maxlength': 5000 },
                value: this.progressreport && this.progressreport.hasOwnProperty('TreatmentChangeNotes') && this.progressreport.TreatmentChangeNotes != null ? this.progressreport.TreatmentChangeNotes.toString() : '',
            }),
        };

        this.View = {
            CreatedById: new DynamicLabel({
                label: 'Created By',
                value: getMetaItemValue(this.createdBies as unknown as IMetaItem[], this.progressreport && this.progressreport.hasOwnProperty('CreatedById') ? this.progressreport.CreatedById : null) ?? '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
            }),
            DateCreated: new DynamicLabel({
                label: 'Date Created',
                value: this.progressreport && this.progressreport.DateCreated || null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: InputTypes.Datepicker,
                    scale: null,
                }),
            }),
            DateESigned: new DynamicLabel({
                label: 'Date E Signed',
                value: this.progressreport && this.progressreport.DateESigned || null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: InputTypes.Datepicker,
                    scale: null,
                }),
            }),
            DateModified: new DynamicLabel({
                label: 'Date Modified',
                value: this.progressreport && this.progressreport.DateModified || null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: InputTypes.Datepicker,
                    scale: null,
                }),
            }),
            EndDate: new DynamicLabel({
                label: 'End Date',
                value: this.progressreport && this.progressreport.EndDate || null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: InputTypes.Datepicker,
                    scale: null,
                }),
            }),
            ESignedById: new DynamicLabel({
                label: 'E Signed By',
                value: getMetaItemValue(this.eSignedBies as unknown as IMetaItem[], this.progressreport && this.progressreport.hasOwnProperty('ESignedById') ? this.progressreport.ESignedById : null) ?? '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
            }),
            MedicalStatusChange: new DynamicLabel({
                label: 'Medical Status Change',
                value: this.progressreport && this.progressreport.hasOwnProperty('MedicalStatusChange') && this.progressreport.MedicalStatusChange != null ? this.progressreport.MedicalStatusChange : false,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Checkbox,
                    inputType: null,
                    scale: null,
                }),
            }),
            MedicalStatusChangeNotes: new DynamicLabel({
                label: 'Medical Status Change Notes',
                value: this.progressreport && this.progressreport.hasOwnProperty('MedicalStatusChangeNotes') && this.progressreport.MedicalStatusChangeNotes != null ? this.progressreport.MedicalStatusChangeNotes.toString() : '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: null,
                    scale: null,
                }),
            }),
            ModifiedById: new DynamicLabel({
                label: 'Modified By',
                value: getMetaItemValue(this.modifiedBies as unknown as IMetaItem[], this.progressreport && this.progressreport.hasOwnProperty('ModifiedById') ? this.progressreport.ModifiedById : null) ?? '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
            }),
            Progress: new DynamicLabel({
                label: 'Progress',
                value: this.progressreport && this.progressreport.hasOwnProperty('Progress') && this.progressreport.Progress != null ? this.progressreport.Progress : false,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Checkbox,
                    inputType: null,
                    scale: null,
                }),
            }),
            ProgressNotes: new DynamicLabel({
                label: 'Progress Notes',
                value: this.progressreport && this.progressreport.hasOwnProperty('ProgressNotes') && this.progressreport.ProgressNotes != null ? this.progressreport.ProgressNotes.toString() : '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: null,
                    scale: null,
                }),
            }),
            Quarter: new DynamicLabel({
                label: 'Quarter',
                value: this.progressreport && this.progressreport.Quarter || null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Numeric,
                    inputType: NumericInputTypes.Integer,
                    scale: null,
                }),
            }),
            StartDate: new DynamicLabel({
                label: 'Start Date',
                value: this.progressreport && this.progressreport.StartDate || null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: InputTypes.Datepicker,
                    scale: null,
                }),
            }),
            StudentId: new DynamicLabel({
                label: 'Student',
                value: getMetaItemValue(this.students as unknown as IMetaItem[], this.progressreport && this.progressreport.hasOwnProperty('StudentId') ? this.progressreport.StudentId : null) ?? '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
            }),
            SupervisorDateESigned: new DynamicLabel({
                label: 'Supervisor Date E Signed',
                value: this.progressreport && this.progressreport.SupervisorDateESigned || null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: InputTypes.Datepicker,
                    scale: null,
                }),
            }),
            SupervisorESignedById: new DynamicLabel({
                label: 'Supervisor E Signed By',
                value: getMetaItemValue(this.supervisorESignedBies as unknown as IMetaItem[], this.progressreport && this.progressreport.hasOwnProperty('SupervisorESignedById') ? this.progressreport.SupervisorESignedById : null) ?? '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
            }),
            TreatmentChange: new DynamicLabel({
                label: 'Treatment Change',
                value: this.progressreport && this.progressreport.hasOwnProperty('TreatmentChange') && this.progressreport.TreatmentChange != null ? this.progressreport.TreatmentChange : false,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Checkbox,
                    inputType: null,
                    scale: null,
                }),
            }),
            TreatmentChangeNotes: new DynamicLabel({
                label: 'Treatment Change Notes',
                value: this.progressreport && this.progressreport.hasOwnProperty('TreatmentChangeNotes') && this.progressreport.TreatmentChangeNotes != null ? this.progressreport.TreatmentChangeNotes.toString() : '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: null,
                    scale: null,
                }),
            }),
        };

    }
}
