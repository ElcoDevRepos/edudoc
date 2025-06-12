import { IPendingReferral } from '@model/interfaces/pending-referral';
import { EntityListColumn, EntityListConfig, IEntityListConfig } from '@mt-ng2/entity-list-module';

export class PendingReferralReportEntityListConfig extends EntityListConfig {
    constructor() {
        super({
            columns: [
                new EntityListColumn({
                    accessorFunction: function (referral: IPendingReferral): string {
                        return `${referral.StudentLastName}, ${referral.StudentFirstName}`;
                    },
                    name: 'Student',
                    sort: {
                        disableSort: true,
                    },
                }),
                new EntityListColumn({
                    accessors: ['DistrictCode'],
                    name: 'District Code',
                    sort: {
                        disableSort: true,
                    },
                }),
                new EntityListColumn({
                    accessorFunction: function (referral: IPendingReferral): string {
                        return `${referral.ProviderLastName}, ${referral.ProviderFirstName}`;
                    },
                    name: 'Provider',
                    sort: {
                        disableSort: true,
                    },
                }),
                new EntityListColumn({
                    accessors: ['ProviderTitle'],
                    name: 'Provider Title',
                    sort: {
                        disableSort: true,
                    },
                }),
                new EntityListColumn({
                    accessors: ['ServiceName'],
                    name: 'Service Type',
                    sort: {
                        disableSort: true,
                    },
                }),
            ],
        });
    }
}
