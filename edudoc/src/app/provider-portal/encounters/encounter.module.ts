import { NgModule } from '@angular/core';

import { SharedModule } from '@common/shared.module';
import { ModalModule } from '@mt-ng2/modal-module';
import { EncounterBasicInfoComponent } from './components/encounter-basic-info/encounter-basic-info.component';
import { EncounterDetailComponent } from './components/encounter-detail/encounter-detail.component';
import { EncounterHeaderComponent } from './components/encounter-header/encounter-header.component';
import { EncounterLandingComponent } from './components/encounter-landing/encounter-landing.component';
import { EncountersComponent } from './components/encounter-list/encounter.component';
import { EncounterApprovalCellDynamicCellComponent } from './components/encounter-student/encounter-student-list/approval-cell/approval-cell.component';
import { EncounterStudentsComponent } from './components/encounter-student/encounter-student-list/encounter-student-list.component';
import { ReviseEncounterAbandonComponent } from './components/encounter-student/encounter-student-list/revise-encounter-abandon.component';
import { EncounterStudentCptCodesTimeCellComponent } from './components/encounter-student/encounter-student-options/encounter-student-cpt-codes/encounter-student-cpt-codes-time-cell-component';
import { EncounterStudentCptCodesComponent } from './components/encounter-student/encounter-student-options/encounter-student-cpt-codes/encounter-student-cpt-codes.component';
import { EncounterStudentGoalsComponent } from './components/encounter-student/encounter-student-options/encounter-student-goals/encounter-student-goals.component';
import { EncounterStudentMethodsComponent } from './components/encounter-student/encounter-student-options/encounter-student-methods/encounter-student-methods.component';
import { EncounterStudentComponent } from './components/encounter-student/encounter-student.component';
import { ReturnEncountersComponent } from './components/return-encounters/return-encounters.component';
import { EncounterAddStudentModalComponent } from './components/encounter-add-student-modal/encounter-add-student-modal.component';
import { EvaluationHeaderComponent } from './components/evaluations/evaluation-header/evaluation-header.component';
import { EvaluationDetailComponent } from './components/evaluations/evaluation-detail/evaluation-detail.component';
import { EvaluationListComponent } from './components/evaluations/evaluation-list/evaluation-list.component';
import { EvaluationAddEncounterStudentComponent } from './components/evaluations/evaluation-add-encounter-student/evaluation-add-encounter-student.component';
import { EvaluationCptCodeCellComponent } from './components/evaluations/evaluation-list/evaluation-cpt-code-cell/evaluation-cpt-code-cell.component';
import { EvaluationEditCellComponent } from './components/evaluations/evaluation-list/evaluation-edit-cell/evaluation-edit-cell.component';
import { NgSelectModule } from '@ng-select/ng-select';

@NgModule({
    declarations: [
        EncounterHeaderComponent,
        EncounterBasicInfoComponent,
        EncountersComponent,
        EncounterStudentsComponent,
        EncounterDetailComponent,
        EncounterStudentComponent,
        EncounterStudentCptCodesComponent,
        EncounterStudentMethodsComponent,
        EncounterStudentGoalsComponent,
        EncounterStudentCptCodesTimeCellComponent,
        EncounterApprovalCellDynamicCellComponent,
        EncounterLandingComponent,
        ReturnEncountersComponent,
        ReviseEncounterAbandonComponent,
        EvaluationHeaderComponent,
        EvaluationDetailComponent,
        EvaluationListComponent,
        EncounterAddStudentModalComponent,
        EvaluationAddEncounterStudentComponent,
        EvaluationCptCodeCellComponent,
        EvaluationEditCellComponent,
    ],
    imports: [SharedModule, ModalModule, NgSelectModule],
})
export class EncounterModule {}
