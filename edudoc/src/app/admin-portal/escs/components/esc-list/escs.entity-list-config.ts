import { DeleteEntityCellComponent } from '@common/delete-entity-cell-component/delete-entity-cell.component';
import { IEsc } from '@model/interfaces/esc';
import { EntityListColumn, EntityListConfig, IEntityListConfig } from '@mt-ng2/entity-list-module';

export class EscsEntityListConfig extends EntityListConfig {
    constructor() {
        const listConfig: IEntityListConfig = {
            columns: [
                new EntityListColumn({
                    name: 'Name',
                }),
                new EntityListColumn({
                    name: 'Code',
                }),
                new EntityListColumn({
                    name: 'Notes',
                }),
                new EntityListColumn({
                    component: DeleteEntityCellComponent,
                    name: 'Archive',
                    sort: { disableSort: true },
                    style: { width: 50 },
                }),
            ],
            rowClass: (entity: IEsc) => (entity.Archived ? 'archived' : null),
        };
        super(listConfig);
    }
}
