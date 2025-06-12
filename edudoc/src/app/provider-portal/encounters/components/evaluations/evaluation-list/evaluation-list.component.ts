import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from "@angular/core";
import { EvaluationListEntityListConfig } from "./evaluation-list.entity-list-config";
import { IEncounterStudent } from "@model/interfaces/encounter-student";
import { IItemDeletedEvent, IItemSelectedEvent } from "@mt-ng2/entity-list-module";
import { EncounterStudentService } from "@provider/encounters/services/encounter-student.service";
import { NotificationsService } from "@mt-ng2/notifications-module";

@Component({
    selector: 'app-evaluation-list',
    templateUrl: './evaluation-list.component.html',
})
export class EvaluationListComponent {
    @Input() encounterStudents: IEncounterStudent[];
    @Output() encounterStudentsChange = new EventEmitter<IEncounterStudent[]>();
    @Output() encounterStudentSelected = new EventEmitter<number>();

    entityListConfig = new EvaluationListEntityListConfig();
    total: number;
    currentPage = 1;
    order = this.entityListConfig.getDefaultSortProperty();
    orderDirection: string = this.entityListConfig.getDefaultSortDirection()

    constructor(
        private encounterStudentService: EncounterStudentService,
        private notificationsService: NotificationsService,
    ) {}

    archiveEncounter(event: IItemDeletedEvent): void {
        const selectedEncounter = event.entity as IEncounterStudent;
        selectedEncounter.Archived = !selectedEncounter.Archived;
        this.encounterStudentService.update(selectedEncounter).subscribe(() => {
            this.notificationsService.success(`Encounter successfully archived.`);
                this.encounterStudents = this.encounterStudents.filter(es => es.Id !== selectedEncounter.Id);
                this.encounterStudentsChange.emit(this.encounterStudents);
        });
    }

    encounterSelected(event: IItemSelectedEvent): void {
        this.encounterStudentSelected.emit((<IEncounterStudent>event.entity).Id);
    }
}