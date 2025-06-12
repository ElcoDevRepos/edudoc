import { DatePipe } from '@angular/common';
import { DeleteEntityCellComponent } from '@common/delete-entity-cell-component/delete-entity-cell.component';
import { IEncounter } from '@model/interfaces/encounter';
import {
    EntityListColumn, EntityListConfig, IEntityListConfig
} from '@mt-ng2/entity-list-module';

// TODO: Currently hardcoding Timezone, will need to figure out / test if the function is timezone aware.
export class EvaluationEncounterEntityListConfig extends EntityListConfig {
    constructor() {
        const listConfig: IEntityListConfig = {
            columns: [
                new EntityListColumn({
                    accessorFunction: function (encounter: IEncounter): string {
                        return encounter.EncounterStudents[0].Student.FirstName ?? '';
                    },
                    name: 'Student First Name',
                    sort: {
                        disableSort: true,
                    },
                }),
                new EntityListColumn({
                    accessorFunction: function (encounter: IEncounter): string {
                        return encounter.EncounterStudents[0].Student.LastName ?? '';
                    },
                    name: 'Student Last Name',
                    sort: {
                        disableSort: true,
                    },
                }),
                new EntityListColumn({
                    accessorFunction: function (encounter: IEncounter): string {
                        return encounter.EncounterStudents[0].Student.StudentCode ?? '';
                    },
                    name: 'Student Code',
                    sort: {
                        disableSort: true,
                    },
                }),
                new EntityListColumn({
                    accessorFunction: function (encounter: IEncounter): string {
                        return new DatePipe('en-US').transform(encounter.EncounterStudents[0].Student.DateOfBirth, 'MMM d, y', 'UTC');
                    },
                    name: 'Student Birthdate',
                    sort: {
                        disableSort: true,
                    },
                }),
                new EntityListColumn({
                    component: DeleteEntityCellComponent,
                    name: 'Delete',
                    sort: { disableSort: true },
                    style: { width: 50 },
                }),
            ],
            rowClass: (entity: IEncounter) => (entity.Archived ? 'archived' : null),
        };
        super(listConfig);
    }
}
