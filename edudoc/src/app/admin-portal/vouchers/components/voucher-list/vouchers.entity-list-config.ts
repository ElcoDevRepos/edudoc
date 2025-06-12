import { CurrencyPipe, DatePipe } from '@angular/common';
import { IClaimVoucherDTO } from '@model/interfaces/custom/claim-voucher.dto';
import { EntityListColumn, EntityListConfig, IEntityListConfig, SortDirection } from '@mt-ng2/entity-list-module';
import { VoucherArchiveDynamicCellComponent } from './voucher-archive-cell/voucher-archive-cell.component';

export class VouchersEntityListConfig extends EntityListConfig {
    constructor() {
        const listConfig: IEntityListConfig = {
            columns: [
                new EntityListColumn({
                    accessorFunction: function (voucher: IClaimVoucherDTO): string {
                        return new Date(new DatePipe('en-Us').transform(voucher.VoucherDate, 'yyyy-MM-ddThh:mm:ss', 'UTC')).toLocaleDateString();
                    },
                    name: 'Voucher Date',
                    sort: {
                        sortProperty: 'VoucherDate',
                    }
                }),
                new EntityListColumn({
                    accessorFunction: function (voucher: IClaimVoucherDTO): string {
                        return new CurrencyPipe('en-US').transform(Number(voucher.VoucherAmount));
                    },
                    name: 'Voucher Amount',
                    sort: { disableSort: true },
                }),
                new EntityListColumn({
                    accessorFunction: function (voucher: IClaimVoucherDTO): string {
                        return voucher.ServiceCode ?? voucher.VoucherType.Name;
                    },
                    name: 'Service Area',
                    sort: { disableSort: true },
                }),
                new EntityListColumn({
                    accessorFunction: function (voucher: IClaimVoucherDTO): string {
                        return new CurrencyPipe('en-US').transform(Number(voucher.PaidAmount));
                    },
                    name: 'Paid Amount',
                    sort: { disableSort: true },
                }),
                new EntityListColumn({
                    accessors: ['SchoolYear'],
                    name: 'School Year',
                    sort: { disableSort: true },
                }),
                new EntityListColumn({
                    accessors: ['SchoolDistrict'],
                    name: 'School District',
                    sort: {
                        disableSort: true,
                    },
                }),
                new EntityListColumn({
                    accessorFunction: function (voucher: IClaimVoucherDTO): string {
                        return voucher.Unmatched ? 'Yes' : 'No';
                    },
                    name: 'Unmatched',
                    sort: {
                        disableSort: true,
                    },
                }),
                new EntityListColumn({
                    columnClass: 'referral-cell',
                    component: VoucherArchiveDynamicCellComponent,
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
