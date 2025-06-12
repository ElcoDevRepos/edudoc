import { DeleteEntityCellComponent } from '@common/delete-entity-cell-component/delete-entity-cell.component';
import { IUser } from '@model/interfaces/user';
import { EntityListColumn, EntityListConfig, IEntityListConfig } from '@mt-ng2/entity-list-module';

export class UsersEntityListConfig extends EntityListConfig {
    constructor(canArchive = true) {
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
                    accessors: [],
                    name: 'Address',
                    pipes: ['address'],
                    sort: {
                        disableSort: true,
                    },
                }),
                new EntityListColumn({
                    accessors: ['AuthUser', 'UserRole', 'Name'],
                    name: 'User Role',
                }),
            ],
            rowClass: (entity: IUser) => (entity.Archived ? 'archived' : null),
        };
        if (canArchive) {
            listConfig.columns.push(
                new EntityListColumn({
                    component: DeleteEntityCellComponent,
                    name: 'Archived',
                    sort: {
                        disableSort: true,
                    },
                }),
            );
        }
        super(listConfig);
    }
}
