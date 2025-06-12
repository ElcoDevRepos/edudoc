import { IActivitySummaryProvider } from '@model/interfaces/activity-summary-provider';
import { IActivitySummaryServiceArea } from '@model/interfaces/activity-summary-service-area';
import { IDistrictSummaryDto } from '@model/interfaces/custom/district-summary-dto.dto';
import { EntityListColumn, EntityListConfig } from '@mt-ng2/entity-list-module';
import { ActivitySummaryService } from './services/activity-summary.service';

export class OpenActivitySummaryEntityListConfig extends EntityListConfig {
    constructor(private entityName: string, private activitySummaryService: ActivitySummaryService) {
        super({
            columns: [
                new EntityListColumn({
                    accessorFunction: function (response: IActivitySummaryServiceArea): string {
                        return response.ServiceCode.Name;
                    },
                    name: entityName,
                    sort: {
                        disableSort: true,
                    },
                }),
                new EntityListColumn({
                    accessorFunction: function (response: IActivitySummaryServiceArea): string {
                        return response.ReferralsPending.toString();
                    },
                    name: 'Referrals Pending',
                    sort: {
                        disableSort: true,
                    },
                }),
                new EntityListColumn({
                    accessorFunction: function (response: IActivitySummaryServiceArea): string {
                        return response.EncountersReturned.toString();
                    },
                    name: 'Returned Encounters',
                    sort: {
                        disableSort: true,
                    },
                }),
                new EntityListColumn({
                    accessorFunction: function (response: IActivitySummaryServiceArea): string {
                        return response.PendingSupervisorCoSign.toString();
                    },
                    name: 'Pending Supervisor Co-Signature',
                    sort: {
                        disableSort: true,
                    },
                }),
                new EntityListColumn({
                    accessorFunction: function (response: IActivitySummaryServiceArea): string {
                        return response.PendingEvaluations.toString();
                    },
                    excludeFromView: !activitySummaryService.isAdmin,
                    excludeFromExport: !activitySummaryService.isAdmin,
                    name: 'Pending Evaluations',
                    sort: {
                        disableSort: true,
                    },
                }),
            ],
        });
    }
}

export class CompletedActivitySummaryEntityListConfig extends EntityListConfig {
    constructor(private entityName: string) {
        super({
            columns: [
                new EntityListColumn({
                    accessorFunction: function (response: IDistrictSummaryDto): string {
                        return response.Name;
                    },
                    name: entityName,
                    sort: {
                        disableSort: true,
                    },
                }),
                new EntityListColumn({
                    accessorFunction: function (response: IDistrictSummaryDto): string {
                        return response.CompletedPendingReferrals.toString();
                    },
                    name: 'Completed Referrals',
                    sort: {
                        disableSort: true,
                    },
                }),
                new EntityListColumn({
                    accessorFunction: function (response: IDistrictSummaryDto): string {
                        return response.CompletedEncounters.toString();
                    },
                    name: 'Completed Encounters',
                    sort: {
                        disableSort: true,
                    },
                }),
            ],
        });
    }
}

export class ActivitySummaryByProvidersEntityListConfig extends EntityListConfig {
    constructor(entityName: string, activitySummaryService: ActivitySummaryService) {
        super({
            columns: [
                new EntityListColumn({
                    accessorFunction: function (response: IActivitySummaryProvider): string {
                        return response.ProviderName;
                    },
                    name: entityName,
                    sort: {
                        disableSort: true,
                    },
                }),
                new EntityListColumn({
                    accessorFunction: function (response: IActivitySummaryProvider): string {
                        return response.ReferralsPending.toString();
                    },
                    name: 'Referrals Pending',
                    sort: {
                        disableSort: true,
                    },
                }),
                new EntityListColumn({
                    accessorFunction: function (response: IActivitySummaryProvider): string {
                        return response.EncountersReturned.toString();
                    },
                    name: 'Returned Encounters',
                    sort: {
                        disableSort: true,
                    },
                }),
                new EntityListColumn({
                    accessorFunction: function (response: IActivitySummaryProvider): string {
                        return response.PendingSupervisorCoSign.toString();
                    },
                    name: 'Pending Supervisor Co-Signature',
                    sort: {
                        disableSort: true,
                    },
                }),
                new EntityListColumn({
                    accessorFunction: function (response: IActivitySummaryProvider): string {
                        return response.PendingEvaluations.toString();
                    },
                    excludeFromView: !activitySummaryService.isAdmin,
                    name: 'Pending Evaluations',
                    sort: {
                        disableSort: true,
                    },
                }),
            ],
        });
    }
}

export class CompletedActivitySummaryByProviderEntityListConfig extends EntityListConfig {
    constructor(private entityName: string) {
        super({
            columns: [
                new EntityListColumn({
                    accessorFunction: function (response: IDistrictSummaryDto): string {
                        return response.Name;
                    },
                    name: entityName,
                    sort: {
                        disableSort: true,
                    },
                }),
                new EntityListColumn({
                    accessorFunction: function (response: IDistrictSummaryDto): string {
                        return response.ProviderTitle.toString();
                    },
                    name: 'Provider Title',
                    sort: {
                        disableSort: true,
                    },
                }),
                new EntityListColumn({
                    accessorFunction: function (response: IDistrictSummaryDto): string {
                        return response.CompletedPendingReferrals.toString();
                    },
                    name: 'Completed Referrals',
                    sort: {
                        disableSort: true,
                    },
                }),
                new EntityListColumn({
                    accessorFunction: function (response: IDistrictSummaryDto): string {
                        return response.CompletedEncounters.toString();
                    },
                    name: 'Completed Encounters',
                    sort: {
                        disableSort: true,
                    },
                }),
            ],
        });
    }
}
