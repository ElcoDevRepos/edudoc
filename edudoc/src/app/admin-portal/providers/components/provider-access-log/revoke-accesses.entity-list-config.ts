import { IRevokeAccess } from '@model/interfaces/revoke-access';
import { EntityListColumn, EntityListConfig, IEntityListConfig, SortDirection } from '@mt-ng2/entity-list-module';

export class RevokeAccessesEntityListConfig extends EntityListConfig {
    constructor() {
        const listConfig: IEntityListConfig = {
            columns: [
                new EntityListColumn({
                    name: 'Date',
                    pipes: ['date:shortDate'],
                    sort: {
                        defaultDirection: SortDirection.Desc,
                        disableSort: true,
                        isDefaultForSort: true,
                        sortProperty: 'Date',
                    },
                }),
                new EntityListColumn({
                    accessorFunction: function(access: IRevokeAccess): string {
                        return access.AccessGranted ? 'Granted' : 'Revoked';
                    },
                    name: 'Access Status',
                    sort: {
                        disableSort: true,
                    },
                }),
                new EntityListColumn({
                    accessorFunction: function (access: IRevokeAccess): string {
                        return access.ProviderDoNotBillReason?.Name ?? '';
                    },
                    name: 'Revocation Reason',
                    sort: {
                        disableSort: true,
                    },
                }),
                new EntityListColumn({
                    accessors: ['OtherReason'],
                    name: 'Other Reason',
                    sort: {
                        disableSort: true,
                    },
                }),
            ],
        };
        super(listConfig);
    }
}
