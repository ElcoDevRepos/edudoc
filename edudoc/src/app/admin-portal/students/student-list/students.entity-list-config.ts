import { DeleteEntityCellComponent } from '@common/delete-entity-cell-component/delete-entity-cell.component';
import { IStudent } from '@model/interfaces/student';
import { EntityListColumn, EntityListConfig, IEntityListConfig } from '@mt-ng2/entity-list-module';

export class StudentsEntityListConfig extends EntityListConfig {
    constructor() {
        const listConfig: IEntityListConfig = {
            columns: [
                new EntityListColumn({
                    accessors: ['Student', 'LastName'],
                    name: 'Last Name',
                }),
                new EntityListColumn({
                    accessors: ['Student', 'FirstName'],
                    name: 'First Name',
                }),
                new EntityListColumn({
                    accessors: ['Student', 'DateOfBirth'],
                    name: 'Date Of Birth',
                    pipes: ['date:mediumDate:UTC'],
                    sort: { disableSort: true },
                }),
                new EntityListColumn({
                    accessors: ['Student', 'StudentCode'],
                    name: 'Student Code',
                }),
                new EntityListColumn({
                    accessors: ['Student', 'MedicaidNo'],
                    name: 'Medicaid No',
                }),
                new EntityListColumn({
                    accessors: ['Student', 'Grade'],
                    name: 'Grade',
                }),
                new EntityListColumn({
                    accessors: ['Student', 'School', 'Name'],
                    name: 'School',
                }),
                new EntityListColumn({
                    accessors: ['Student', 'Notes'],
                    name: 'Notes',
                }),
                new EntityListColumn({
                    component: DeleteEntityCellComponent,
                    name: 'Archive',
                    sort: { disableSort: true },
                    style: { width: 50 },
                }),
            ],
            rowClass: (entity: IStudent) => (entity.Archived ? 'archived' : null),
        };
        super(listConfig);
    }
}
