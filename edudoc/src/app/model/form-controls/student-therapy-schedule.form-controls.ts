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
import { IStudentTherapySchedule } from '../interfaces/student-therapy-schedule';
import { IUser } from '../interfaces/user';
import { IStudentTherapy } from '../interfaces/student-therapy';

export interface IStudentTherapyScheduleDynamicControlsParameters {
    formGroup?: string;
    studentTherapies?: IStudentTherapy[];
    createdBies?: IUser[];
    modifiedBies?: IUser[];
}

export class StudentTherapyScheduleDynamicControls {

    formGroup: string;
    studentTherapies?: IStudentTherapy[];
    createdBies?: IUser[];
    modifiedBies?: IUser[];

    Form: IExpandableObject;
    View: IExpandableObject;

    constructor(private studenttherapyschedule?: IStudentTherapySchedule, additionalParameters?: IStudentTherapyScheduleDynamicControlsParameters) {
        this.formGroup = additionalParameters && additionalParameters.formGroup || 'StudentTherapySchedule';
        this.studentTherapies = additionalParameters && additionalParameters.studentTherapies || undefined;
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
                value: this.studenttherapyschedule && this.studenttherapyschedule.hasOwnProperty('Archived') && this.studenttherapyschedule.Archived != null ? this.studenttherapyschedule.Archived : false,
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
                value: this.studenttherapyschedule && this.studenttherapyschedule.CreatedById || 1,
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
                value: this.studenttherapyschedule && this.studenttherapyschedule.DateCreated || null,
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
                value: this.studenttherapyschedule && this.studenttherapyschedule.DateModified || null,
            }),
            DeviationReasonDate: new DynamicField({
                formGroup: this.formGroup,
                label: 'Deviation Reason Date',
                name: 'DeviationReasonDate',
                options: null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: InputTypes.Datepicker,
                    scale: null,
                }),
                validation: [  ],
                validators: {  },
                value: this.studenttherapyschedule && this.studenttherapyschedule.DeviationReasonDate || null,
            }),
            DeviationReasonId: new DynamicField({
                formGroup: this.formGroup,
                label: 'Deviation Reason',
                name: 'DeviationReasonId',
                options: null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Numeric,
                    inputType: NumericInputTypes.Integer,
                    scale: null,
                }),
                validation: [  ],
                validators: {  },
                value: this.studenttherapyschedule && this.studenttherapyschedule.DeviationReasonId || null,
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
                value: this.studenttherapyschedule && this.studenttherapyschedule.ModifiedById || null,
            }),
            ScheduleDate: new DynamicField({
                formGroup: this.formGroup,
                label: 'Schedule Date',
                name: 'ScheduleDate',
                options: null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: InputTypes.Datepicker,
                    scale: null,
                }),
                validation: [  ],
                validators: {  },
                value: this.studenttherapyschedule && this.studenttherapyschedule.ScheduleDate || null,
            }),
            ScheduleEndTime: new DynamicField({
                formGroup: this.formGroup,
                label: 'Schedule End Time',
                name: 'ScheduleEndTime',
                options: null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: null,
                    scale: null,
                }),
                validation: [  ],
                validators: {  },
                value: this.studenttherapyschedule && this.studenttherapyschedule.hasOwnProperty('ScheduleEndTime') && this.studenttherapyschedule.ScheduleEndTime != null ? this.studenttherapyschedule.ScheduleEndTime.toString() : '',
            }),
            ScheduleStartTime: new DynamicField({
                formGroup: this.formGroup,
                label: 'Schedule Start Time',
                name: 'ScheduleStartTime',
                options: null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: null,
                    scale: null,
                }),
                validation: [  ],
                validators: {  },
                value: this.studenttherapyschedule && this.studenttherapyschedule.hasOwnProperty('ScheduleStartTime') && this.studenttherapyschedule.ScheduleStartTime != null ? this.studenttherapyschedule.ScheduleStartTime.toString() : '',
            }),
            StudentTherapyId: new DynamicField({
                formGroup: this.formGroup,
                label: 'Student Therapy',
                name: 'StudentTherapyId',
                options: this.studentTherapies,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
                validation: [ noZeroRequiredValidator ],
                validators: { 'required': true },
                value: this.studenttherapyschedule && this.studenttherapyschedule.StudentTherapyId || null,
            }),
        };

        this.View = {
            Archived: new DynamicLabel({
                label: 'Archived',
                value: this.studenttherapyschedule && this.studenttherapyschedule.hasOwnProperty('Archived') && this.studenttherapyschedule.Archived != null ? this.studenttherapyschedule.Archived : false,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Checkbox,
                    inputType: null,
                    scale: null,
                }),
            }),
            CreatedById: new DynamicLabel({
                label: 'Created By',
                value: getMetaItemValue(this.createdBies as unknown as IMetaItem[], this.studenttherapyschedule && this.studenttherapyschedule.hasOwnProperty('CreatedById') ? this.studenttherapyschedule.CreatedById : null) ?? '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
            }),
            DateCreated: new DynamicLabel({
                label: 'Date Created',
                value: this.studenttherapyschedule && this.studenttherapyschedule.DateCreated || null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: InputTypes.Datepicker,
                    scale: null,
                }),
            }),
            DateModified: new DynamicLabel({
                label: 'Date Modified',
                value: this.studenttherapyschedule && this.studenttherapyschedule.DateModified || null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: InputTypes.Datepicker,
                    scale: null,
                }),
            }),
            DeviationReasonDate: new DynamicLabel({
                label: 'Deviation Reason Date',
                value: this.studenttherapyschedule && this.studenttherapyschedule.DeviationReasonDate || null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: InputTypes.Datepicker,
                    scale: null,
                }),
            }),
            DeviationReasonId: new DynamicLabel({
                label: 'Deviation Reason',
                value: this.studenttherapyschedule && this.studenttherapyschedule.DeviationReasonId || null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Numeric,
                    inputType: NumericInputTypes.Integer,
                    scale: null,
                }),
            }),
            ModifiedById: new DynamicLabel({
                label: 'Modified By',
                value: getMetaItemValue(this.modifiedBies as unknown as IMetaItem[], this.studenttherapyschedule && this.studenttherapyschedule.hasOwnProperty('ModifiedById') ? this.studenttherapyschedule.ModifiedById : null) ?? '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
            }),
            ScheduleDate: new DynamicLabel({
                label: 'Schedule Date',
                value: this.studenttherapyschedule && this.studenttherapyschedule.ScheduleDate || null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: InputTypes.Datepicker,
                    scale: null,
                }),
            }),
            ScheduleEndTime: new DynamicLabel({
                label: 'Schedule End Time',
                value: this.studenttherapyschedule && this.studenttherapyschedule.hasOwnProperty('ScheduleEndTime') && this.studenttherapyschedule.ScheduleEndTime != null ? this.studenttherapyschedule.ScheduleEndTime.toString() : '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: null,
                    scale: null,
                }),
            }),
            ScheduleStartTime: new DynamicLabel({
                label: 'Schedule Start Time',
                value: this.studenttherapyschedule && this.studenttherapyschedule.hasOwnProperty('ScheduleStartTime') && this.studenttherapyschedule.ScheduleStartTime != null ? this.studenttherapyschedule.ScheduleStartTime.toString() : '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: null,
                    scale: null,
                }),
            }),
            StudentTherapyId: new DynamicLabel({
                label: 'Student Therapy',
                value: getMetaItemValue(this.studentTherapies as unknown as IMetaItem[], this.studenttherapyschedule && this.studenttherapyschedule.hasOwnProperty('StudentTherapyId') ? this.studenttherapyschedule.StudentTherapyId : null) ?? '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
            }),
        };

    }
}
