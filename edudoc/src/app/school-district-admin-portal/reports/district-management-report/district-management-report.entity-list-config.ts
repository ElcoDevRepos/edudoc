import { EntityListColumn, EntityListConfig, IEntityListConfig } from '@mt-ng2/entity-list-module';

export class IepServicesEntityListConfig extends EntityListConfig {
    constructor() {
        const listConfig: IEntityListConfig = {
            columns: [
                new EntityListColumn({
                    accessors: ['StudentName'],
                    name: 'Student Name',
                }),
                new EntityListColumn({
                    accessors: ['StudentId'],
                    name: 'Student Id',
                    sort: { disableSort: true },
                }),
                new EntityListColumn({
                    accessors: ['DateOfBirth'],
                    name: 'Date of Birth',
                    pipes: ['date'],
                    sort: { disableSort: true },
                }),
                new EntityListColumn({
                    accessors: ['IEPStartDate'],
                    name: 'IEP Start Date',
                    pipes: ['date'],
                }),
                new EntityListColumn({
                    accessors: ['IEPEndDate'],
                    name: 'IEP End Date',
                    pipes: ['date'],
                }),
                new EntityListColumn({
                    accessors: ['ETRExpirationDate'],
                    name: 'ETR Expiration Date',
                    pipes: ['date'],
                }),
                new EntityListColumn({
                    accessors: ['ServiceArea'],
                    name: 'T/TH Services',
                    sort: { disableSort: true },
                }),
                new EntityListColumn({
                    accessors: ['TotalMinutes'],
                    name: 'Total Minutes',
                    sort: { disableSort: true },
                }),
                new EntityListColumn({
                    accessors: ['MinutesUsed'],
                    name: 'Minutes Used',
                    sort: { disableSort: true },
                }),
            ],
        };
        super(listConfig);
    }
}
