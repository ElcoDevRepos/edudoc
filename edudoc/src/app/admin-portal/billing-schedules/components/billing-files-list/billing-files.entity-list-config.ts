import { IBillingFile } from '@model/interfaces/billing-file';
import { EntityListColumn, EntityListConfig, EntityListDeleteColumn, IEntityListConfig } from '@mt-ng2/entity-list-module';

export class BillingFilesEntityListConfig extends EntityListConfig {
    constructor() {
        const listConfig: IEntityListConfig = {
            columns: [
                new EntityListColumn({
                    accessors: ['DateCreated'],
                    name: 'Date Created',
                    pipes: ['date'],
                }),
                new EntityListColumn({
                    name: 'Name',
                }),
                new EntityListColumn({
                    accessorFunction: function (file: IBillingFile): string {
                        return file.HealthCareClaim.BillingSchedule ? `${file.HealthCareClaim.BillingSchedule.Name}` : '';
                    },
                    name: 'Schedule',
                    sort: {
                        sortProperty: 'HealthCareClaim.BillingSchedule.Name',
                    },
                }),
                new EntityListColumn({
                    accessorFunction: function (file: IBillingFile): string {
                        return file.HealthCareClaim.BillingSchedule.IsReversal ? 'Yes' : 'No';
                    },
                    name: 'Is Reversal',
                    sort: {
                        disableSort: true,
                    },
                }),
            ],
            // Did this to give a visual cue to the user that they can click to download.
            delete: new EntityListDeleteColumn({
                columnHtml: '<i class="fa fa-2x fa-fw fa-download"></i>',
                confirm: false,
                headerText: 'Download',
            }),
        };
        super(listConfig);
    }
}
