import { IBillingSchedule } from '@model/interfaces/billing-schedule';
import { EntityListColumn, EntityListConfig, IEntityListConfig } from '@mt-ng2/entity-list-module';
import { BillingGroupArchiveDynamicCellComponent } from './billing-group-archive-cell/billing-group-archive-cell.component';

export class BillingSchedulesEntityListConfig extends EntityListConfig {
    constructor() {
        const listConfig: IEntityListConfig = {
            columns: [
                new EntityListColumn({
                    name: 'Name',
                }),
                new EntityListColumn({
                    accessors: ['ScheduledDate'],
                    name: 'Scheduled Date',
                    pipes: ['date'],
                }),
                new EntityListColumn({
                    accessorFunction: function (schedule: IBillingSchedule): string {
                        return schedule.IsReversal ? 'Yes' : 'No';
                    },
                    name: 'Is Reversal',
                    sort: {
                        disableSort: true,
                    },
                }),
                new EntityListColumn({
                    accessorFunction: function (schedule: IBillingSchedule): string {
                        return schedule.Notes.length > 50 ?
                                            `<i data-toggle="tooltip"
                                                [title]="schedule.Notes"
                                            >
                                                ${ schedule.Notes.substr(0, 50) + '...'}
                                            </i>` : schedule.Notes;
                    },
                    bindToInnerHtml: true,
                    name: 'Notes',
                    sort: {
                        disableSort: true,
                    },
                }),
                new EntityListColumn({
                    columnClass: 'referral-cell',
                    component: BillingGroupArchiveDynamicCellComponent,
                    excludeFromExport: true,
                    name: 'Archive',
                    sort: { disableSort: true },
                    style: { width: 50 },
                }),
            ],
        };
        super(listConfig);
    }
}
