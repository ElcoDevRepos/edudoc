import { Component } from '@angular/core';
import { IEncounterStudent } from '@model/interfaces/encounter-student';
import { IEntity } from '@mt-ng2/base-service';
import { IEntityListComponentMembers, IEntityListDynamicCellComponent } from '@mt-ng2/entity-list-module';
import { IModalOptions } from '@mt-ng2/modal-module';
import { EncounterStudentService } from '@provider/encounters/services/encounter-student.service';

@Component({
    styles: [],
    template: `
        <div class="text-center">
            <button type="button" (click)="edit()">
                <i class="fa fa-edit fa-2x" aria-hidden="true"></i>
            </button>
        </div>
    `,
})
export class EvaluationEditCellComponent implements IEntityListDynamicCellComponent {
    entityListComponentMembers: IEntityListComponentMembers;
    set entity(value: IEntity) {
        this.encounterStudent = value as IEncounterStudent;
    }

    encounterStudent: IEncounterStudent;

    constructor(
        private encounterStudentService: EncounterStudentService
    ) {}

    edit(): void {
        this.encounterStudentService.emitEvaluationEditChange(this.encounterStudent.Id);
    }
}
