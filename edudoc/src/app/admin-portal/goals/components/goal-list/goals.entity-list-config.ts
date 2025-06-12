import { DeleteEntityCellComponent } from '@common/delete-entity-cell-component/delete-entity-cell.component';
import { IGoal } from '@model/interfaces/goal';
import { EntityListColumn, EntityListConfig, IEntityListConfig } from '@mt-ng2/entity-list-module';

export class GoalsEntityListConfig extends EntityListConfig {
    constructor() {
        const listConfig: IEntityListConfig = {
            columns: [
                new EntityListColumn({
                    name: 'Description',
                }),
                new EntityListColumn({
                    accessorFunction: (goal: IGoal) => {
                        return goal.ServiceCodes.map((sc) => sc.Name).join(', ');
                    },
                    name: 'Service Codes',
                    sort: { disableSort: true },
                }),
                new EntityListColumn({
                    accessorFunction: (goal: IGoal) => {
                        return goal.NursingGoalResponse?.ResponseNoteLabel ?? '';
                    },
                    name: 'Special Nurse Information',
                    sort: { disableSort: true },
                }),
                new EntityListColumn({
                    component: DeleteEntityCellComponent,
                    name: 'Archive',
                    sort: { disableSort: true },
                    style: { width: 50 },
                }),
            ],
            rowClass: (entity: IGoal) => (entity.Archived ? 'archived' : null),
        };
        super(listConfig);
    }
}
