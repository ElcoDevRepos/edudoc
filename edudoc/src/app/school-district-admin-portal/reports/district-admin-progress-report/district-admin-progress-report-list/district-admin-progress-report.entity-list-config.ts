import { IDistrictProgressReportDto } from '@model/interfaces/custom/district-progress-report.dto';
import { EntityListColumn, EntityListConfig } from '@mt-ng2/entity-list-module';
import { Observable } from 'rxjs';

export class DistrictAdminProgressReportEntityListConfig extends EntityListConfig {
    constructor(getDataForExport: () => Observable<IDistrictProgressReportDto[]>) {
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
                new EntityListColumn({
                    accessors: ['ServiceAreaName'],
                    name: 'Service Area',
                    sort: {
                        disableSort: true,
                    },
                }),
                new EntityListColumn({
                    accessors: ['TotalIEPStudents'],
                    name: 'Number of IEP Students with Encounters',
                    sort: {
                        disableSort: true,
                    },
                }),
                new EntityListColumn({
                    accessors: ['TotalEncounters'],
                    name: 'Number of Encounters',
                    sort: {
                        disableSort: true,
                    },
                }),
                new EntityListColumn({
                    accessors: ['TotalCompletedReports'],
                    name: 'Number of Completed 90 day Progress Reports',
                    sort: {
                        disableSort: true,
                    },
                }),
            ],
            export: {
                exportName: 'msp_progress_reports',
                getDataForExport: getDataForExport
            }
        });
    }
}
