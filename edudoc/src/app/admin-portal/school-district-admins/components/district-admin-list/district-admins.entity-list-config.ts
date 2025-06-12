import { DeleteEntityCellComponent } from '@common/delete-entity-cell-component/delete-entity-cell.component';
import { IUser } from '@model/interfaces/user';
import { EntityListColumn, EntityListConfig, IEntityListConfig } from '@mt-ng2/entity-list-module';

export class DistrictAdminsEntityListConfig extends EntityListConfig {
    constructor() {
        const listConfig: IEntityListConfig = {
            columns: [
                new EntityListColumn({
                    accessorFunction: function (user: IUser): string {
                        return `${user.LastName}, ${user.FirstName}`;
                    },
                    name: 'Name',
                    sort: {
                        sortProperty: 'LastName',
                    },
                }),
                new EntityListColumn({
                    linkFunction: function (user: IUser): void {
                        window.open(`mailto:${user.Email}`);
                    },
                    name: 'Email',
                }),
                new EntityListColumn({
                    accessorFunction: function (user: IUser): string {
                        return user.SchoolDistrict?.Name || 'None';
                    },
                    name: 'School District',
                    sort: {
                        sortProperty: 'SchoolDistrict.Name',
                    },
                }),
                new EntityListColumn({
                    component: DeleteEntityCellComponent,
                    name: 'Archived',
                    sort: {
                        disableSort: true,
                    },
                }),
            ],
            rowClass: (entity: IUser) => (entity.Archived ? 'archived' : null),
        };
        super(listConfig);
    }
}
