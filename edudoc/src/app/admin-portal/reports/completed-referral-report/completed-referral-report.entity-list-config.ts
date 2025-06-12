import { DatePipe } from '@angular/common';
import { ICompletedReferralReportDto } from '@model/interfaces/custom/completed-referral-report.dto';
import { EntityListColumn, EntityListConfig, IEntityListConfig } from '@mt-ng2/entity-list-module';

export class CompletedReferralReportEntityListConfig extends EntityListConfig {
    constructor() {
        super({
            columns: [
                new EntityListColumn({
                    accessorFunction: function (report: ICompletedReferralReportDto): string {
                        return `${report.StudentLastName}, ${report.StudentFirstName}`;
                    },
                    name: 'Student',
                    sort: {
                        sortProperty: 'StudentLastName',
                    },
                }),
                new EntityListColumn({
                    accessors: ['SchoolYear'],
                    name: 'Grade',
                    sort: {
                        disableSort: true,
                    },
                }),
                new EntityListColumn({
                    accessors: ['SchoolDistrict'],
                    name: 'School District',
                    sort: {
                        disableSort: true,
                    },
                }),
                new EntityListColumn({
                    accessorFunction: function (report: ICompletedReferralReportDto): string {
                        return `${report.ProviderLastName}, ${report.ProviderFirstName}`;
                    },
                    name: 'Provider',
                    sort: {
                        sortProperty: 'ProviderLastName',
                    },
                }),
                new EntityListColumn({
                    accessors: ['ServiceArea'],
                    name: 'Service Area',
                    sort: {
                        disableSort: true,
                    },
                }),
                new EntityListColumn({
                    accessorFunction: function (response: ICompletedReferralReportDto): string {
                        return new DatePipe('en-US').transform(response.ReferralCompletedDate, 'MMM d, y', 'UTC');
                    },
                    name: 'Referral Completed Date',
                    sort: {
                        sortProperty: 'ReferralCompletedDate',
                    },
                }),
                new EntityListColumn({
                    accessorFunction: function (response: ICompletedReferralReportDto): string {
                        return new DatePipe('en-US').transform(response.ReferralEffectiveDateFrom, 'MMM d, y', 'UTC');
                    },
                    name: 'Referral Effective Date From',
                    sort: {
                        sortProperty: 'ReferralEffectiveDateFrom',
                    },
                }),
                new EntityListColumn({
                    accessorFunction: function (response: ICompletedReferralReportDto): string {
                        return new DatePipe('en-US').transform(response.ReferralEffectiveDateTo, 'MMM d, y', 'UTC');
                    },
                    name: 'Referral Effective Date To',
                    sort: {
                        sortProperty: 'ReferralEffectiveDateTo',
                    },
                }),
            ],
        });
    }
}
