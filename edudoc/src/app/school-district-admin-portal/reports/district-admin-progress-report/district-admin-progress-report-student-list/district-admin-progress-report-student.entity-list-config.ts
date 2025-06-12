import { IDistrictProgressReportDto } from '@model/interfaces/custom/district-progress-report.dto';
import { EntityListColumn, EntityListConfig } from '@mt-ng2/entity-list-module';

export class DistrictAdminProgressReportStudentEntityListConfig extends EntityListConfig {
    constructor() {
        super({
            columns: [
                new EntityListColumn({
                    accessorFunction: function (provider: IDistrictProgressReportDto): string {
                        return `${provider.LastName}, ${provider.FirstName}`;
                    },
                    name: 'Provider',
                    sort: {
                        sortProperty: 'LastName',
                    },
                }),
            ],
        });
    }
}
