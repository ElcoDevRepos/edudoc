import { Component, OnInit } from '@angular/core';
import { IDiagnosisCode } from '@model/interfaces/diagnosis-code';
import { IEvaluationType } from '@model/interfaces/evaluation-type';
import { IEvaluationTypesDiagnosisCode } from '@model/interfaces/evaluation-types-diagnosis-code';
import { IMetaItem } from '@mt-ng2/base-service';
import { DynamicField, DynamicFieldType, DynamicFieldTypes, IDynamicFieldType, SelectInputTypes } from '@mt-ng2/dynamic-form';
import { forkJoin } from 'rxjs';
import { DiagnosisCodeService } from '../diagnosis-codes/services/diagnosiscode.service';
import { EvaluationTypesDiagnosisCodeService } from './services/evaluation-type-diagnosis-code.service';
import { EvaluationTypeService } from './services/evaluation-type.service';

@Component({
    selector: 'app-evaluation-type-management',
    styles: [
        `
            .border-right {
                border-right: 1px solid #00456d;
            }
        `,
    ],
    templateUrl: './evaluation-type-management.component.html',
})
export class EvaluationTypeManagementComponent implements OnInit {
    evaluationTypes: IEvaluationType[];
    selectedEvalType: IEvaluationType;
    diagnosisCodes: IMetaItem[];

    constructor(
        private evaluationTypeService: EvaluationTypeService,
        private evaluationTypeDiagnosisCodeService: EvaluationTypesDiagnosisCodeService,
        private diagnosisCodeService: DiagnosisCodeService,
    ) {}

    ngOnInit(): void {
        forkJoin(this.evaluationTypeService.getAll(), this.diagnosisCodeService.getAll()).subscribe(([evalTypes, diagnosisCodes]) => {
            this.evaluationTypes = evalTypes;
            this.diagnosisCodes = diagnosisCodes.map(
                (dc) =>
                    ({
                        Id: dc.Id,
                        Name: `${dc.Code} - ${dc.Description || 'No Description'}`,
                    }),
            );
        });
    }

    getEvaluationTypeField(): DynamicField {
        return new DynamicField({
            formGroup: null,
            label: 'Evaluation Types',
            name: 'evaluationTypes',
            options: this.evaluationTypes,
            type: new DynamicFieldType({
                fieldType: DynamicFieldTypes.Select,
                inputType: SelectInputTypes.Dropdown,
            }),
            value: null,
        });
    }

    evalTypeSelected(evt: number): void {
        this.selectedEvalType = this.evaluationTypes.find((et) => et.Id === evt);
    }

    saveAssociation(diagnosisCode: IDiagnosisCode): void {
        const newAssociation: IEvaluationTypesDiagnosisCode = this.evaluationTypeDiagnosisCodeService.getEmptyEvaluationTypeDiagnosisCode();
        newAssociation.DiagnosisCodeId = diagnosisCode.Id;
        newAssociation.EvaluationTypeId = this.selectedEvalType.Id;
        this.evaluationTypeDiagnosisCodeService.create(newAssociation).subscribe((id) => {
            newAssociation.Id = id;
            this.selectedEvalType.EvaluationTypesDiagnosisCodes.push(newAssociation);
        });
    }

    archiveAssociation(diagnosisCodeId: number): void {
        const selectedAssociation = this.selectedEvalType.EvaluationTypesDiagnosisCodes.find((code) => code.DiagnosisCodeId === diagnosisCodeId);
        selectedAssociation.Archived = true;
        this.evaluationTypeDiagnosisCodeService.update(selectedAssociation).subscribe(() => {
            this.selectedEvalType.EvaluationTypesDiagnosisCodes = this.selectedEvalType.EvaluationTypesDiagnosisCodes.filter(
                (d) => d.DiagnosisCodeId !== diagnosisCodeId,
            );
        });
    }
}
