import { DeleteEntityCellComponent } from '@common/delete-entity-cell-component/delete-entity-cell.component';
import { IProviderTitle } from '@model/interfaces/provider-title';
import { EntityListColumn, EntityListConfig, IEntityListConfig } from '@mt-ng2/entity-list-module';

export class ProviderTitlesEntityListConfig extends EntityListConfig {
    constructor() {
        const listConfig: IEntityListConfig = {
            columns: [
                new EntityListColumn({
                    name: 'Name',
                    sort: {
                        disableSort: true,
                    },
                }),
                new EntityListColumn({
                    accessors: ['ServiceCode', 'Name'],
                    name: 'Service Area',
                    sort: {
                        disableSort: true,
                    },
                }),
                new EntityListColumn({
                    accessorFunction: function (providerTitle: IProviderTitle): string {
                        return providerTitle.SupervisorTitle ? `${providerTitle.SupervisorTitle.Name}` : 'None';
                    },
                    name: 'Supervisor Title',
                    sort: {
                        sortProperty: 'SupervisorTitle.Name',
                    },
                }),
                new EntityListColumn({
                    component: DeleteEntityCellComponent,
                    name: 'Archive',
                    sort: { disableSort: true },
                    style: { width: 50 },
                }),
            ],
            rowClass: (entity: IProviderTitle) => (entity.Archived ? 'archived' : null),
        };
        super(listConfig);
    }
}
