import { EntityListColumn, EntityListConfig, IEntityListConfig } from '@mt-ng2/entity-list-module';

export class ClaimsEncountersEntityListConfig extends EntityListConfig {
    constructor() {
        const listConfig: IEntityListConfig = {
            columns: [
                new EntityListColumn({
                    accessors: ['ClaimAmount'],
                    name: 'Claim Amount',
                }),
                new EntityListColumn({
                    accessors: ['ProcedureIdentifier'],
                    name: 'Procedure Identifier',
                    sort: {
                        disableSort: true,
                    },
                }),
                new EntityListColumn({
                    accessors: ['ServiceDate'],
                    name: 'Service Date',
                }),
                new EntityListColumn({
                    accessors: ['ReferringProviderFirstName'],
                    name: 'Referring Provider First Name',
                }),
                new EntityListColumn({
                    accessors: ['ReferringProviderLastName'],
                    name: 'Referring Provider Last Name',
                }),
                new EntityListColumn({
                    accessors: ['EdiErrorCode', 'ErrorCode'],
                    name: 'Edi Error Code',
                    sort: {
                        disableSort: true,
                    },
                }),
            ],
        };
        super(listConfig);
    }
}
