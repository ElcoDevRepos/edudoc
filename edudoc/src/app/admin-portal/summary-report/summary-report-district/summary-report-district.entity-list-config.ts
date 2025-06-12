import { IActivitySummaryDistrict } from '@model/interfaces/activity-summary-district';
import { EntityListColumn, EntityListConfig, IEntityListConfig } from '@mt-ng2/entity-list-module';

export class SummaryReportDistrictEntityListConfig extends EntityListConfig {
    constructor(private entityName: string) {
        super({
            columns: [
                new EntityListColumn({
                    accessorFunction: function (response: IActivitySummaryDistrict): string {
                        return response.SchoolDistrict.Name;
                    },
                    name: entityName,
                    sort: {
                        disableSort: true,
                    },
                }),
                new EntityListColumn({
                    accessorFunction: function (response: IActivitySummaryDistrict): string {
                        return response.ReferralsPending.toString();
                    },
                    name: 'Referrals Pending',
                    sort: {
                        disableSort: true,
                    },
                }),
                new EntityListColumn({
                    accessorFunction: function (response: IActivitySummaryDistrict): string {
                        return response.EncountersReturned.toString();
                    },
                    name: 'Returned Encounters',
                    sort: {
                        disableSort: true,
                    },
                }),
                new EntityListColumn({
                    accessorFunction: function (response: IActivitySummaryDistrict): string {
                        return response.PendingSupervisorCoSign.toString();
                    },
                    name: 'Pending Supervisor Co-Signature',
                    sort: {
                        disableSort: true,
                    },
                }),
                new EntityListColumn({
                    accessorFunction: function (response: IActivitySummaryDistrict): string {
                        return response.PendingEvaluations.toString();
                    },
                    name: 'Pending Evaluations',
                    sort: {
                        disableSort: true,
                    },
                }),
            ],
        });
    }
}
