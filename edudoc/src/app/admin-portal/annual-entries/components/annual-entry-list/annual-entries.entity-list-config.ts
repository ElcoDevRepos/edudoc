import { CurrencyPipe } from '@angular/common';
import { AnnualEntryStatusEnums } from '@model/enums/annual-entry-status.enum';
import { IAnnualEntry } from '@model/interfaces/annual-entry';
import { EntityListColumn, EntityListConfig, IEntityListConfig } from '@mt-ng2/entity-list-module';
import { AnnualEntryArchiveDynamicCellComponent } from './annual-entry-cell/annual-entry-cell.component';

export class AnnualEntriesEntityListConfig extends EntityListConfig {
    constructor() {
        const listConfig: IEntityListConfig = {
            columns: [
                new EntityListColumn({
                    name: 'Year',
                }),
                new EntityListColumn({
                    accessorFunction: function (annualEntry: IAnnualEntry): string {
                        return annualEntry.StatusId === AnnualEntryStatusEnums.Paid ? 'Paid' : 'Pending';
                    },
                    name: 'Status',
                    sort: {
                        disableSort: true,
                    },
                }),
                new EntityListColumn({
                    accessorFunction: function (annualEntry: IAnnualEntry): string {
                        return new CurrencyPipe('en-US').transform(Number(annualEntry.AllowableCosts));
                    },
                    name: 'Allowable Costs',
                    sort: {
                        disableSort: true,
                    },
                }),
                new EntityListColumn({
                    accessorFunction: function (annualEntry: IAnnualEntry): string {
                        return new CurrencyPipe('en-US').transform(Number(annualEntry.InterimPayments));
                    },
                    name: 'Interim Payments',
                    sort: {
                        disableSort: true,
                    },
                }),
                new EntityListColumn({
                    accessorFunction: function (annualEntry: IAnnualEntry): string {
                        return new CurrencyPipe('en-US').transform(Number(annualEntry.SettlementAmount));
                    },
                    name: 'Settlement Amount',
                    sort: {
                        disableSort: true,
                    },
                }),
                new EntityListColumn({
                    accessorFunction: function (annualEntry: IAnnualEntry): string {
                        return annualEntry.Mer ? `${annualEntry.Mer}%` : '';
                    },
                    name: '%MER',
                    sort: {
                        disableSort: true,
                    },
                }),
                new EntityListColumn({
                    accessorFunction: function (annualEntry: IAnnualEntry): string {
                        return annualEntry.Rmts ? `${annualEntry.Rmts}%` : '';
                    },
                    name: '%RMTS',
                    sort: {
                        disableSort: true,
                    },
                }),
                new EntityListColumn({
                    accessorFunction: function (annualEntry: IAnnualEntry): string {
                        return annualEntry.SchoolDistrict.Name;
                    },
                    name: 'School District',
                    sort: {
                        disableSort: true,
                    },
                }),
                new EntityListColumn({
                    columnClass: 'referral-cell',
                    component: AnnualEntryArchiveDynamicCellComponent,
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
