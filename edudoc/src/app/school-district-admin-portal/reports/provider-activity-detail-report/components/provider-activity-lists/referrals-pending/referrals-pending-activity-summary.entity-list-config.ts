import { DatePipe } from '@angular/common';
import { IReferralsPendingDTO } from '@model/interfaces/custom/referrals-pending.dto';
import { EntityListColumn, EntityListConfig, IEntityListConfig } from '@mt-ng2/entity-list-module';

export class ReferralsPendingActivitySummaryEntityListConfig extends EntityListConfig {
    constructor() {
        const listConfig: IEntityListConfig = {
            columns: [
                new EntityListColumn({
                    accessorFunction: function (response: IReferralsPendingDTO): string {
                        return response.LastName;
                    },
                    name: 'Last Name',
                    sort: {
                        sortProperty: 'LastName',
                    },
                }),
                new EntityListColumn({
                    accessorFunction: function (response: IReferralsPendingDTO): string {
                        return response.FirstName;
                    },
                    name: 'First Name',
                    sort: {
                        sortProperty: 'FirstName',
                    },
                }),
                new EntityListColumn({
                    accessorFunction: function (response: IReferralsPendingDTO): string {
                        return response.StudentCode;
                    },
                    name: 'StudentCode',
                    sort: {
                        sortProperty: 'StudentCode',
                    },
                }),
                new EntityListColumn({
                    accessorFunction: function (response: IReferralsPendingDTO): string {
                        return new DatePipe('en-US').transform(response.DateOfBirth, 'MMM d, y', 'UTC');
                    },
                    name: 'Birth Date',
                    sort: {
                        sortProperty: 'DateOfBirth',
                    },
                }),
                new EntityListColumn({
                    accessorFunction: function (response: IReferralsPendingDTO): string {
                        return response.Grade.toString();
                    },
                    name: 'Grade',
                    sort: {
                        sortProperty: 'Grade',
                    },
                }),
                new EntityListColumn({
                    accessorFunction: function (response: IReferralsPendingDTO): string {
                        return response.TotalBillableClaims.toString();
                    },
                    name: 'Total Billable Claims',
                    sort: {
                        sortProperty: 'TotalBillableClaims',
                    },
                }),
            ],
        };
        super(listConfig);
    }
}
