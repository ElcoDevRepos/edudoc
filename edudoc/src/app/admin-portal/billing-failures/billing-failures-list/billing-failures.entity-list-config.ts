import { IBillingFailure } from '@model/interfaces/billing-failure';
import { EntityListColumn, EntityListConfig, IEntityListConfig } from '@mt-ng2/entity-list-module';
import { BillingFailureResolveDynamicCellComponent } from './resolve-issue-cell/resolve-issue-cell.component';
import { DatePipe } from '@angular/common';

export class BillingFailuresEntityListConfig extends EntityListConfig {
    constructor() {
        const listConfig: IEntityListConfig = {
            columns: [
                new EntityListColumn({
                    accessorFunction: function (billingFailure: IBillingFailure): string {
                        return new Date(new DatePipe('en-Us').transform(billingFailure.DateOfFailure, 'yyyy-MM-ddThh:mm:ss', 'UTC')).toLocaleDateString();
                    },
                    name: 'Date Of Failure',
                    sort: {
                        sortProperty: 'DateOfFailure',
                    },
                }),
                new EntityListColumn({
                    accessors: ['BillingFailureReason', 'Name'],
                    name: 'Reason For Failure',
                }),
                new EntityListColumn({
                    accessorFunction: function (billingFailure: IBillingFailure): string {
                        return `${billingFailure.EncounterStudent.Encounter.Provider.ProviderUser.LastName}, ${billingFailure.EncounterStudent.Encounter.Provider.ProviderUser.FirstName}`;
                    },
                    name: 'Provider',
                    sort: {
                        sortProperty: 'EncounterStudent.Encounter.Provider.ProviderUser.LastName',
                    },
                }),
                new EntityListColumn({
                    accessorFunction: function (billingFailure: IBillingFailure): string {
                        return new Date(new DatePipe('en-Us').transform(billingFailure.EncounterStudent.EncounterDate, 'yyyy-MM-ddThh:mm:ss', 'UTC')).toLocaleDateString();
                    },
                    name: 'Scheduled Date',
                    sort: {
                        sortProperty: 'EncounterStudent.EncounterDate',
                    },
                }),
                new EntityListColumn({
                    accessorFunction: function (billingFailure: IBillingFailure): string {
                        return billingFailure.EncounterStudent.Student.LastName + ', ' + billingFailure.EncounterStudent.Student.FirstName;

                    },
                    name: 'Student',
                    sort: {
                        sortProperty: 'EncounterStudent.Student.LastName',
                    },
                }),
                new EntityListColumn({
                    accessorFunction: function (billingFailure: IBillingFailure): string {
                        return billingFailure.EncounterStudent.Student.SchoolDistrict?.Name ?? 'N/A';
                    },
                    name: 'District',
                    sort: {
                        disableSort: true,
                    },
                }),
                new EntityListColumn({
                    columnClass: 'resolve-issue-cell',
                    component: BillingFailureResolveDynamicCellComponent,
                    excludeFromExport: true,
                    fireOnColumnSelected: false,
                    name: 'Resolve Issue',
                    sort: {
                        disableSort: true,
                    },
                }),
            ],
            rowClass: (entity: IBillingFailure) => (entity.IssueResolved ? 'archived' : null),
        };
        super(listConfig);
    }
}
