import { DatePipe } from '@angular/common';
import { DeleteEntityCellComponent } from '@common/delete-entity-cell-component/delete-entity-cell.component';
import { IEncounterStudent } from '@model/interfaces/encounter-student';
import { EntityListColumn, EntityListConfig, IEntityListConfig } from '@mt-ng2/entity-list-module';
import moment from 'moment';
import { EvaluationCptCodeCellComponent } from './evaluation-cpt-code-cell/evaluation-cpt-code-cell.component';
import { EvaluationEditCellComponent } from './evaluation-edit-cell/evaluation-edit-cell.component';

export class EvaluationListEntityListConfig extends EntityListConfig {
    constructor() {
        super({
            columns: [
                new EntityListColumn({
                    accessors: ['EncounterNumber'],
                    name: 'Encounter Number',
                    sort: { disableSort: true },
                }),
                new EntityListColumn({
                    accessorFunction: function (es: IEncounterStudent): string {
                        return new DatePipe('en-US').transform(es.EncounterDate, 'MMM d, y', 'UTC');
                    },
                    name: 'Encounter Date',
                    sort: { disableSort: true },
                }),
                new EntityListColumn({
                    accessorFunction: function(es: IEncounterStudent): string {
                        const date = new Date(es.EncounterDate);
                        return moment.utc(`${date.toDateString()} ${es.EncounterStartTime}`).format('hh:mmA');
                    },
                    name: 'Start Time',
                    sort: { disableSort: true },
                }),
                new EntityListColumn({
                    accessorFunction: function(es: IEncounterStudent): string {
                        const date = new Date(es.EncounterDate);
                        return moment.utc(`${date.toDateString()} ${es.EncounterEndTime}`).format('hh:mmA');
                    },
                    name: 'End Time',
                    sort: { disableSort: true },
                }),
                new EntityListColumn({
                    accessors: ['EncounterLocation', 'Name'],
                    name: 'Location',
                    sort: { disableSort: true },
                }),
                new EntityListColumn({
                    component: EvaluationCptCodeCellComponent,
                    name: 'CPT Codes (Procedure Codes)',
                    fireOnColumnSelected: false,
                    excludeFromExport: true,
                    sort: { disableSort: true },
                    style: { width: 500 },
                }),
                new EntityListColumn({
                    accessors: ['TherapyCaseNotes'],
                    name: 'Case Notes',
                    sort: { disableSort: true },
                    style: { width: 400 },
                }),
                new EntityListColumn({
                    component: EvaluationEditCellComponent,
                    name: 'Edit',
                    sort: { disableSort: true },
                    style: { width: 50 },
                }),
                new EntityListColumn({
                    component: DeleteEntityCellComponent,
                    name: 'Delete',
                    sort: { disableSort: true },
                    style: { width: 50 },
                }),
            ],
        } as IEntityListConfig);
    }
}
