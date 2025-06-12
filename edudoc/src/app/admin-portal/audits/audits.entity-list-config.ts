import { EntityListColumn, EntityListConfig, IEntityListConfig } from '@mt-ng2/entity-list-module';

export class AuditEntityListConfig extends EntityListConfig {
    constructor() {
        const listConfig: IEntityListConfig = {
            columns: [
                new EntityListColumn({
                    accessors: ['CurrentStatus'],
                    name: 'Status',
                    sort: {
                        disableSort: true,
                    },
                }),
            ],
        };
        super(listConfig);
    }
}
