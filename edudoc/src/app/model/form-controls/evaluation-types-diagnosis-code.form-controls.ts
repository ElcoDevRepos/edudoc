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
import { IEvaluationTypesDiagnosisCode } from '../interfaces/evaluation-types-diagnosis-code';
import { IUser } from '../interfaces/user';
import { IDiagnosisCode } from '../interfaces/diagnosis-code';
import { IEvaluationType } from '../interfaces/evaluation-type';

export interface IEvaluationTypesDiagnosisCodeDynamicControlsParameters {
    formGroup?: string;
    evaluationTypes?: IEvaluationType[];
    diagnosisCodes?: IDiagnosisCode[];
    createdBies?: IUser[];
    modifiedBies?: IUser[];
}

export class EvaluationTypesDiagnosisCodeDynamicControls {

    formGroup: string;
    evaluationTypes?: IEvaluationType[];
    diagnosisCodes?: IDiagnosisCode[];
    createdBies?: IUser[];
    modifiedBies?: IUser[];

    Form: IExpandableObject;
    View: IExpandableObject;

    constructor(private evaluationtypesdiagnosiscode?: IEvaluationTypesDiagnosisCode, additionalParameters?: IEvaluationTypesDiagnosisCodeDynamicControlsParameters) {
        this.formGroup = additionalParameters && additionalParameters.formGroup || 'EvaluationTypesDiagnosisCode';
        this.evaluationTypes = additionalParameters && additionalParameters.evaluationTypes || undefined;
        this.diagnosisCodes = additionalParameters && additionalParameters.diagnosisCodes || undefined;
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
                value: this.evaluationtypesdiagnosiscode && this.evaluationtypesdiagnosiscode.hasOwnProperty('Archived') && this.evaluationtypesdiagnosiscode.Archived != null ? this.evaluationtypesdiagnosiscode.Archived : false,
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
                value: this.evaluationtypesdiagnosiscode && this.evaluationtypesdiagnosiscode.CreatedById || 1,
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
                value: this.evaluationtypesdiagnosiscode && this.evaluationtypesdiagnosiscode.DateCreated || null,
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
                value: this.evaluationtypesdiagnosiscode && this.evaluationtypesdiagnosiscode.DateModified || null,
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
                validation: [ noZeroRequiredValidator ],
                validators: { 'required': true },
                value: this.evaluationtypesdiagnosiscode && this.evaluationtypesdiagnosiscode.DiagnosisCodeId || null,
            }),
            EvaluationTypeId: new DynamicField({
                formGroup: this.formGroup,
                label: 'Evaluation Type',
                name: 'EvaluationTypeId',
                options: this.evaluationTypes,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
                validation: [ noZeroRequiredValidator ],
                validators: { 'required': true },
                value: this.evaluationtypesdiagnosiscode && this.evaluationtypesdiagnosiscode.EvaluationTypeId || null,
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
                value: this.evaluationtypesdiagnosiscode && this.evaluationtypesdiagnosiscode.ModifiedById || null,
            }),
        };

        this.View = {
            Archived: new DynamicLabel({
                label: 'Archived',
                value: this.evaluationtypesdiagnosiscode && this.evaluationtypesdiagnosiscode.hasOwnProperty('Archived') && this.evaluationtypesdiagnosiscode.Archived != null ? this.evaluationtypesdiagnosiscode.Archived : false,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Checkbox,
                    inputType: null,
                    scale: null,
                }),
            }),
            CreatedById: new DynamicLabel({
                label: 'Created By',
                value: getMetaItemValue(this.createdBies as unknown as IMetaItem[], this.evaluationtypesdiagnosiscode && this.evaluationtypesdiagnosiscode.hasOwnProperty('CreatedById') ? this.evaluationtypesdiagnosiscode.CreatedById : null) ?? '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
            }),
            DateCreated: new DynamicLabel({
                label: 'Date Created',
                value: this.evaluationtypesdiagnosiscode && this.evaluationtypesdiagnosiscode.DateCreated || null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: InputTypes.Datepicker,
                    scale: null,
                }),
            }),
            DateModified: new DynamicLabel({
                label: 'Date Modified',
                value: this.evaluationtypesdiagnosiscode && this.evaluationtypesdiagnosiscode.DateModified || null,
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Input,
                    inputType: InputTypes.Datepicker,
                    scale: null,
                }),
            }),
            DiagnosisCodeId: new DynamicLabel({
                label: 'Diagnosis Code',
                value: getMetaItemValue(this.diagnosisCodes as unknown as IMetaItem[], this.evaluationtypesdiagnosiscode && this.evaluationtypesdiagnosiscode.hasOwnProperty('DiagnosisCodeId') ? this.evaluationtypesdiagnosiscode.DiagnosisCodeId : null) ?? '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
            }),
            EvaluationTypeId: new DynamicLabel({
                label: 'Evaluation Type',
                value: getMetaItemValue(this.evaluationTypes as unknown as IMetaItem[], this.evaluationtypesdiagnosiscode && this.evaluationtypesdiagnosiscode.hasOwnProperty('EvaluationTypeId') ? this.evaluationtypesdiagnosiscode.EvaluationTypeId : null) ?? '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
            }),
            ModifiedById: new DynamicLabel({
                label: 'Modified By',
                value: getMetaItemValue(this.modifiedBies as unknown as IMetaItem[], this.evaluationtypesdiagnosiscode && this.evaluationtypesdiagnosiscode.hasOwnProperty('ModifiedById') ? this.evaluationtypesdiagnosiscode.ModifiedById : null) ?? '',
                type: new DynamicFieldType({
                    fieldType: DynamicFieldTypes.Select,
                    inputType: null,
                    scale: null,
                }),
            }),
        };

    }
}
