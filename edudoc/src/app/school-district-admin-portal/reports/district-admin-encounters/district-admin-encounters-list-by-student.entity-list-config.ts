import { EntityListColumn, EntityListConfig, IEntityListConfig } from '@mt-ng2/entity-list-module';

export class EncounterEntityListConfig extends EntityListConfig {
    constructor(onExportClick: () => void) {
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
            export: {
                exportName: '',
                onExportClick: onExportClick
            }
        };
        super(listConfig);
    }
}
