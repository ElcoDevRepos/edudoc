
import { EntityListColumn, EntityListConfig, IEntityListConfig } from '@mt-ng2/entity-list-module';

export class BillingResponseFilesEntityListConfig extends EntityListConfig {
    constructor() {
        const listConfig: IEntityListConfig = {
            columns: [
                new EntityListColumn({
                    name: 'Name',
                    sort: {
                        disableSort: true,
                    }
                }),
                new EntityListColumn({
                    accessors: ['DateUploaded'],
                    name: 'Date Uploaded',
                    pipes: ['date:medium'],
                    sort: {
                        disableSort: true,
                    }
                }),
            ],
        };
        super(listConfig);
    }
}
