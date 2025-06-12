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
import { IEncounterStudent } from '../interfaces/encounter-student';
import { ICaseLoad } from '../interfaces/case-load';
import { IUser } from '../interfaces/user';
import { IDiagnosisCode } from '../interfaces/diagnosis-code';
import { IDocumentType } from '../interfaces/document-type';
import { IEncounter } from '../interfaces/encounter';
import { IEncounterLocation } from '../interfaces/encounter-location';
import { IEncounterStatus } from '../interfaces/encounter-status';
import { IStudentDeviationReason } from '../interfaces/student-deviation-reason';
import { IStudent } from '../interfaces/student';
import { IStudentTherapySchedule } from '../interfaces/student-therapy-schedule';

export interface IEncounterStudentDynamicControlsParameters {
    formGroup?: string;
    encounters?: IEncounter[];
    students?: IStudent[];
    encounterStatuses?: IEncounterStatus[];
    encounterLocations?: IEncounterLocation[];
    caseLoads?: ICaseLoad[];
    studentTherapySchedules?: IStudentTherapySchedule[];
    eSignedBies?: IUser[];
    supervisorESignedBies?: IUser[];
    studentDeviationReasons?: IStudentDeviationReason[];
    diagnosisCodes?: IDiagnosisCode[];
    documentTypes?: IDocumentType[];
    createdBies?: IUser[];
    modifiedBies?: IUser[];
}

export class EncounterStudentDynamicControls {

    formGroup: string;
    encounters?: IEncounter[];
    students?: IStudent[];
    encounterStatuses?: IEncounterStatus[];
    encounterLocations?: IEncounterLocation[];
    caseLoads?: ICaseLoad[];
    studentTherapySchedules?: IStudentTherapySchedule[];
    eSignedBies?: IUser[];
    supervisorESignedBies?: IUser[];
    studentDeviationReasons?: IStudentDeviationReason[];
    diagnosisCodes?: IDiagnosisCode[];
    documentTypes?: IDocumentType[];
    createdBies?: IUser[];
    modifiedBies?: IUser[];

    Form: IExpandableObject;
    View: IExpandableObject;

    constructor(private encounterstudent?: IEncounterStudent, additionalParameters?: IEncounterStudentDynamicControlsParameters) {
        this.formGroup = additionalParameters && additionalParameters.formGroup || 'EncounterStudent';
        this.encounters = additionalParameters && additionalParameters.encounters || undefined;
        this.students = additionalParameters && additionalParameters.students || undefined;
        this.encounterStatuses = additionalParameters && additionalParameters.encounterStatuses || undefined;
        this.encounterLocations = additionalParameters && additionalParameters.encounterLocations || undefined;
        this.caseLoads = additionalParameters && additionalParameters.caseLoads || undefined;
        this.studentTherapySchedules = additionalParameters && additionalParameters.studentTherapySchedules || undefined;
        this.eSignedBies = additionalParameters && additionalParameters.eSignedBies || undefined;
        this.supervisorESignedBies = additionalParameters && additionalParameters.supervisorESignedBies || undefined;
        this.studentDeviationReasons = additionalParameters && additionalParameters.studentDeviationReasons || undefined;
        this.diagnosisCodes = additionalParameters && additionalParameters.diagnosisCodes || undefined;
        this.documentTypes = additionalParameters && additionalParameters.documentTypes || undefined;
        this.createdBies = additionalParameters && additionalParameters.createdBies || undefined;
        this.modifiedBies = additionalParameters && additionalParameters.modifiedBies || undefined;

        this.Form = {
            AbandonmentNotes: new DynamicField({
                formGroup: this.formGroup,
                label: 'Abandonment Notes',
                name: 'AbandonmentNotes',
                options: null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: null,
                    scale: null,
                }),
                validation: [ Validators.maxLength(1000) ],
                validators: { 'maxlength': 1000 },
                value: this.encounterstudent && this.encounterstudent.hasOwnProperty('AbandonmentNotes') && this.encounterstudent.AbandonmentNotes != null ? this.encounterstudent.AbandonmentNotes.toString() : '',
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
                value: this.encounterstudent && this.encounterstudent.hasOwnProperty('Archived') && this.encounterstudent.Archived != null ? this.encounterstudent.Archived : false,
            }),
            CaseLoadId: new DynamicField({
                formGroup: this.formGroup,
                label: 'Case Load',
                name: 'CaseLoadId',
                options: this.caseLoads,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
                validation: [  ],
                validators: {  },
                value: this.encounterstudent && this.encounterstudent.CaseLoadId || null,
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
                value: this.encounterstudent && this.encounterstudent.CreatedById || 1,
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
                value: this.encounterstudent && this.encounterstudent.DateCreated || null,
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
                value: this.encounterstudent && this.encounterstudent.DateESigned || null,
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
                value: this.encounterstudent && this.encounterstudent.DateModified || null,
            }),
            DiagnosisCodeId: new DynamicField({
                formGroup: this.formGroup,
                label: 'Diagnosis Code',
                name: 'DiagnosisCodeId',
                options: this.diagnosisCodes,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
                validation: [  ],
                validators: {  },
                value: this.encounterstudent && this.encounterstudent.DiagnosisCodeId || null,
            }),
            DocumentTypeId: new DynamicField({
                formGroup: this.formGroup,
                label: 'Document Type',
                name: 'DocumentTypeId',
                options: this.documentTypes,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
                validation: [  ],
                validators: {  },
                value: this.encounterstudent && this.encounterstudent.DocumentTypeId || null,
            }),
            EncounterDate: new DynamicField({
                formGroup: this.formGroup,
                label: 'Encounter Date',
                name: 'EncounterDate',
                options: null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: InputTypes.Datepicker,
                    scale: null,
                }),
                validation: [ Validators.required ],
                validators: { 'required': true },
                value: this.encounterstudent && this.encounterstudent.EncounterDate || null,
            }),
            EncounterEndTime: new DynamicField({
                formGroup: this.formGroup,
                label: 'Encounter End Time',
                name: 'EncounterEndTime',
                options: null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: null,
                    scale: null,
                }),
                validation: [ Validators.required ],
                validators: { 'required': true },
                value: this.encounterstudent && this.encounterstudent.hasOwnProperty('EncounterEndTime') && this.encounterstudent.EncounterEndTime != null ? this.encounterstudent.EncounterEndTime.toString() : '',
            }),
            EncounterId: new DynamicField({
                formGroup: this.formGroup,
                label: 'Encounter',
                name: 'EncounterId',
                options: this.encounters,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
                validation: [ noZeroRequiredValidator ],
                validators: { 'required': true },
                value: this.encounterstudent && this.encounterstudent.EncounterId || null,
            }),
            EncounterLocationId: new DynamicField({
                formGroup: this.formGroup,
                label: 'Encounter Location',
                name: 'EncounterLocationId',
                options: this.encounterLocations,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
                validation: [ noZeroRequiredValidator ],
                validators: { 'required': true },
                value: this.encounterstudent && this.encounterstudent.EncounterLocationId || null,
            }),
            EncounterNumber: new DynamicField({
                formGroup: this.formGroup,
                label: 'Encounter Number',
                name: 'EncounterNumber',
                options: null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: null,
                    scale: null,
                }),
                validation: [ Validators.maxLength(14) ],
                validators: { 'maxlength': 14 },
                value: this.encounterstudent && this.encounterstudent.hasOwnProperty('EncounterNumber') && this.encounterstudent.EncounterNumber != null ? this.encounterstudent.EncounterNumber.toString() : '',
            }),
            EncounterStartTime: new DynamicField({
                formGroup: this.formGroup,
                label: 'Encounter Start Time',
                name: 'EncounterStartTime',
                options: null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: null,
                    scale: null,
                }),
                validation: [ Validators.required ],
                validators: { 'required': true },
                value: this.encounterstudent && this.encounterstudent.hasOwnProperty('EncounterStartTime') && this.encounterstudent.EncounterStartTime != null ? this.encounterstudent.EncounterStartTime.toString() : '',
            }),
            EncounterStatusId: new DynamicField({
                formGroup: this.formGroup,
                label: 'Encounter Status',
                name: 'EncounterStatusId',
                options: this.encounterStatuses,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
                validation: [  ],
                validators: {  },
                value: this.encounterstudent && this.encounterstudent.EncounterStatusId || 1,
            }),
            ESignatureText: new DynamicField({
                formGroup: this.formGroup,
                label: 'E Signature Text',
                name: 'ESignatureText',
                options: null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: null,
                    scale: null,
                }),
                validation: [ Validators.maxLength(1000) ],
                validators: { 'maxlength': 1000 },
                value: this.encounterstudent && this.encounterstudent.hasOwnProperty('ESignatureText') && this.encounterstudent.ESignatureText != null ? this.encounterstudent.ESignatureText.toString() : '',
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
                value: this.encounterstudent && this.encounterstudent.ESignedById || null,
            }),
            IsTelehealth: new DynamicField({
                formGroup: this.formGroup,
                label: 'Is Telehealth',
                name: 'IsTelehealth',
                options: null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Checkbox,
                    inputType: null,
                    scale: null,
                }),
                validation: [  ],
                validators: {  },
                value: this.encounterstudent && this.encounterstudent.hasOwnProperty('IsTelehealth') && this.encounterstudent.IsTelehealth != null ? this.encounterstudent.IsTelehealth : false,
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
                value: this.encounterstudent && this.encounterstudent.ModifiedById || null,
            }),
            ReasonForReturn: new DynamicField({
                formGroup: this.formGroup,
                label: 'Reason For Return',
                name: 'ReasonForReturn',
                options: null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: null,
                    scale: null,
                }),
                validation: [ Validators.maxLength(250) ],
                validators: { 'maxlength': 250 },
                value: this.encounterstudent && this.encounterstudent.hasOwnProperty('ReasonForReturn') && this.encounterstudent.ReasonForReturn != null ? this.encounterstudent.ReasonForReturn.toString() : '',
            }),
            StudentDeviationReasonId: new DynamicField({
                formGroup: this.formGroup,
                label: 'Student Deviation Reason',
                name: 'StudentDeviationReasonId',
                options: this.studentDeviationReasons,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
                validation: [  ],
                validators: {  },
                value: this.encounterstudent && this.encounterstudent.StudentDeviationReasonId || null,
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
                value: this.encounterstudent && this.encounterstudent.StudentId || null,
            }),
            StudentTherapyScheduleId: new DynamicField({
                formGroup: this.formGroup,
                label: 'Student Therapy Schedule',
                name: 'StudentTherapyScheduleId',
                options: this.studentTherapySchedules,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
                validation: [  ],
                validators: {  },
                value: this.encounterstudent && this.encounterstudent.StudentTherapyScheduleId || null,
            }),
            SupervisorComments: new DynamicField({
                formGroup: this.formGroup,
                label: 'Supervisor Comments',
                name: 'SupervisorComments',
                options: null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: null,
                    scale: null,
                }),
                validation: [ Validators.maxLength(1000) ],
                validators: { 'maxlength': 1000 },
                value: this.encounterstudent && this.encounterstudent.hasOwnProperty('SupervisorComments') && this.encounterstudent.SupervisorComments != null ? this.encounterstudent.SupervisorComments.toString() : '',
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
                value: this.encounterstudent && this.encounterstudent.SupervisorDateESigned || null,
            }),
            SupervisorESignatureText: new DynamicField({
                formGroup: this.formGroup,
                label: 'Supervisor E Signature Text',
                name: 'SupervisorESignatureText',
                options: null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: null,
                    scale: null,
                }),
                validation: [ Validators.maxLength(1000) ],
                validators: { 'maxlength': 1000 },
                value: this.encounterstudent && this.encounterstudent.hasOwnProperty('SupervisorESignatureText') && this.encounterstudent.SupervisorESignatureText != null ? this.encounterstudent.SupervisorESignatureText.toString() : '',
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
                value: this.encounterstudent && this.encounterstudent.SupervisorESignedById || null,
            }),
            TherapyCaseNotes: new DynamicField({
                formGroup: this.formGroup,
                label: 'Therapy Case Notes',
                name: 'TherapyCaseNotes',
                options: null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: null,
                    scale: null,
                }),
                validation: [ Validators.maxLength(6000) ],
                validators: { 'maxlength': 6000 },
                value: this.encounterstudent && this.encounterstudent.hasOwnProperty('TherapyCaseNotes') && this.encounterstudent.TherapyCaseNotes != null ? this.encounterstudent.TherapyCaseNotes.toString() : '',
            }),
        };

        this.View = {
            AbandonmentNotes: new DynamicLabel({
                label: 'Abandonment Notes',
                value: this.encounterstudent && this.encounterstudent.hasOwnProperty('AbandonmentNotes') && this.encounterstudent.AbandonmentNotes != null ? this.encounterstudent.AbandonmentNotes.toString() : '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: null,
                    scale: null,
                }),
            }),
            Archived: new DynamicLabel({
                label: 'Archived',
                value: this.encounterstudent && this.encounterstudent.hasOwnProperty('Archived') && this.encounterstudent.Archived != null ? this.encounterstudent.Archived : false,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Checkbox,
                    inputType: null,
                    scale: null,
                }),
            }),
            CaseLoadId: new DynamicLabel({
                label: 'Case Load',
                value: getMetaItemValue(this.caseLoads as unknown as IMetaItem[], this.encounterstudent && this.encounterstudent.hasOwnProperty('CaseLoadId') ? this.encounterstudent.CaseLoadId : null) ?? '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
            }),
            CreatedById: new DynamicLabel({
                label: 'Created By',
                value: getMetaItemValue(this.createdBies as unknown as IMetaItem[], this.encounterstudent && this.encounterstudent.hasOwnProperty('CreatedById') ? this.encounterstudent.CreatedById : null) ?? '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
            }),
            DateCreated: new DynamicLabel({
                label: 'Date Created',
                value: this.encounterstudent && this.encounterstudent.DateCreated || null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: InputTypes.Datepicker,
                    scale: null,
                }),
            }),
            DateESigned: new DynamicLabel({
                label: 'Date E Signed',
                value: this.encounterstudent && this.encounterstudent.DateESigned || null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: InputTypes.Datepicker,
                    scale: null,
                }),
            }),
            DateModified: new DynamicLabel({
                label: 'Date Modified',
                value: this.encounterstudent && this.encounterstudent.DateModified || null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: InputTypes.Datepicker,
                    scale: null,
                }),
            }),
            DiagnosisCodeId: new DynamicLabel({
                label: 'Diagnosis Code',
                value: getMetaItemValue(this.diagnosisCodes as unknown as IMetaItem[], this.encounterstudent && this.encounterstudent.hasOwnProperty('DiagnosisCodeId') ? this.encounterstudent.DiagnosisCodeId : null) ?? '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
            }),
            DocumentTypeId: new DynamicLabel({
                label: 'Document Type',
                value: getMetaItemValue(this.documentTypes as unknown as IMetaItem[], this.encounterstudent && this.encounterstudent.hasOwnProperty('DocumentTypeId') ? this.encounterstudent.DocumentTypeId : null) ?? '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
            }),
            EncounterDate: new DynamicLabel({
                label: 'Encounter Date',
                value: this.encounterstudent && this.encounterstudent.EncounterDate || null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: InputTypes.Datepicker,
                    scale: null,
                }),
            }),
            EncounterEndTime: new DynamicLabel({
                label: 'Encounter End Time',
                value: this.encounterstudent && this.encounterstudent.hasOwnProperty('EncounterEndTime') && this.encounterstudent.EncounterEndTime != null ? this.encounterstudent.EncounterEndTime.toString() : '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: null,
                    scale: null,
                }),
            }),
            EncounterId: new DynamicLabel({
                label: 'Encounter',
                value: getMetaItemValue(this.encounters as unknown as IMetaItem[], this.encounterstudent && this.encounterstudent.hasOwnProperty('EncounterId') ? this.encounterstudent.EncounterId : null) ?? '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
            }),
            EncounterLocationId: new DynamicLabel({
                label: 'Encounter Location',
                value: getMetaItemValue(this.encounterLocations as unknown as IMetaItem[], this.encounterstudent && this.encounterstudent.hasOwnProperty('EncounterLocationId') ? this.encounterstudent.EncounterLocationId : null) ?? '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
            }),
            EncounterNumber: new DynamicLabel({
                label: 'Encounter Number',
                value: this.encounterstudent && this.encounterstudent.hasOwnProperty('EncounterNumber') && this.encounterstudent.EncounterNumber != null ? this.encounterstudent.EncounterNumber.toString() : '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: null,
                    scale: null,
                }),
            }),
            EncounterStartTime: new DynamicLabel({
                label: 'Encounter Start Time',
                value: this.encounterstudent && this.encounterstudent.hasOwnProperty('EncounterStartTime') && this.encounterstudent.EncounterStartTime != null ? this.encounterstudent.EncounterStartTime.toString() : '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: null,
                    scale: null,
                }),
            }),
            EncounterStatusId: new DynamicLabel({
                label: 'Encounter Status',
                value: getMetaItemValue(this.encounterStatuses as unknown as IMetaItem[], this.encounterstudent && this.encounterstudent.hasOwnProperty('EncounterStatusId') ? this.encounterstudent.EncounterStatusId : null) ?? '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
            }),
            ESignatureText: new DynamicLabel({
                label: 'E Signature Text',
                value: this.encounterstudent && this.encounterstudent.hasOwnProperty('ESignatureText') && this.encounterstudent.ESignatureText != null ? this.encounterstudent.ESignatureText.toString() : '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: null,
                    scale: null,
                }),
            }),
            ESignedById: new DynamicLabel({
                label: 'E Signed By',
                value: getMetaItemValue(this.eSignedBies as unknown as IMetaItem[], this.encounterstudent && this.encounterstudent.hasOwnProperty('ESignedById') ? this.encounterstudent.ESignedById : null) ?? '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
            }),
            IsTelehealth: new DynamicLabel({
                label: 'Is Telehealth',
                value: this.encounterstudent && this.encounterstudent.hasOwnProperty('IsTelehealth') && this.encounterstudent.IsTelehealth != null ? this.encounterstudent.IsTelehealth : false,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Checkbox,
                    inputType: null,
                    scale: null,
                }),
            }),
            ModifiedById: new DynamicLabel({
                label: 'Modified By',
                value: getMetaItemValue(this.modifiedBies as unknown as IMetaItem[], this.encounterstudent && this.encounterstudent.hasOwnProperty('ModifiedById') ? this.encounterstudent.ModifiedById : null) ?? '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
            }),
            ReasonForReturn: new DynamicLabel({
                label: 'Reason For Return',
                value: this.encounterstudent && this.encounterstudent.hasOwnProperty('ReasonForReturn') && this.encounterstudent.ReasonForReturn != null ? this.encounterstudent.ReasonForReturn.toString() : '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: null,
                    scale: null,
                }),
            }),
            StudentDeviationReasonId: new DynamicLabel({
                label: 'Student Deviation Reason',
                value: getMetaItemValue(this.studentDeviationReasons as unknown as IMetaItem[], this.encounterstudent && this.encounterstudent.hasOwnProperty('StudentDeviationReasonId') ? this.encounterstudent.StudentDeviationReasonId : null) ?? '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
            }),
            StudentId: new DynamicLabel({
                label: 'Student',
                value: getMetaItemValue(this.students as unknown as IMetaItem[], this.encounterstudent && this.encounterstudent.hasOwnProperty('StudentId') ? this.encounterstudent.StudentId : null) ?? '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
            }),
            StudentTherapyScheduleId: new DynamicLabel({
                label: 'Student Therapy Schedule',
                value: getMetaItemValue(this.studentTherapySchedules as unknown as IMetaItem[], this.encounterstudent && this.encounterstudent.hasOwnProperty('StudentTherapyScheduleId') ? this.encounterstudent.StudentTherapyScheduleId : null) ?? '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
            }),
            SupervisorComments: new DynamicLabel({
                label: 'Supervisor Comments',
                value: this.encounterstudent && this.encounterstudent.hasOwnProperty('SupervisorComments') && this.encounterstudent.SupervisorComments != null ? this.encounterstudent.SupervisorComments.toString() : '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: null,
                    scale: null,
                }),
            }),
            SupervisorDateESigned: new DynamicLabel({
                label: 'Supervisor Date E Signed',
                value: this.encounterstudent && this.encounterstudent.SupervisorDateESigned || null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: InputTypes.Datepicker,
                    scale: null,
                }),
            }),
            SupervisorESignatureText: new DynamicLabel({
                label: 'Supervisor E Signature Text',
                value: this.encounterstudent && this.encounterstudent.hasOwnProperty('SupervisorESignatureText') && this.encounterstudent.SupervisorESignatureText != null ? this.encounterstudent.SupervisorESignatureText.toString() : '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: null,
                    scale: null,
                }),
            }),
            SupervisorESignedById: new DynamicLabel({
                label: 'Supervisor E Signed By',
                value: getMetaItemValue(this.supervisorESignedBies as unknown as IMetaItem[], this.encounterstudent && this.encounterstudent.hasOwnProperty('SupervisorESignedById') ? this.encounterstudent.SupervisorESignedById : null) ?? '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
            }),
            TherapyCaseNotes: new DynamicLabel({
                label: 'Therapy Case Notes',
                value: this.encounterstudent && this.encounterstudent.hasOwnProperty('TherapyCaseNotes') && this.encounterstudent.TherapyCaseNotes != null ? this.encounterstudent.TherapyCaseNotes.toString() : '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: null,
                    scale: null,
                }),
            }),
        };

    }
}
