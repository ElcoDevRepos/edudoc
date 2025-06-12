import { IProgressReportDto } from '@model/interfaces/custom/progress-report.dto';
import { EntityListColumn, EntityListConfig, IEntityListConfig } from '@mt-ng2/entity-list-module';

export class ProgressReportsEntityListConfig extends EntityListConfig {
    constructor() {
        const listConfig: IEntityListConfig = {
            columns: [
                new EntityListColumn({
                    accessorFunction: function (report: IProgressReportDto): string {
                        return `${report.LastName}, ${report.FirstName}`;
                    },
                    name: 'Student',
                    sort: {
                        sortProperty: 'LastName',
                    },
                }),
            ],
        }
        super(listConfig);
    }
}
