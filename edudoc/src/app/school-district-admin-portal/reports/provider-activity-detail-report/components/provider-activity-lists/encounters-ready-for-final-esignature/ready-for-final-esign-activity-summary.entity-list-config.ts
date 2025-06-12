import { IReadyForFinalESignDTO } from '@model/interfaces/custom/ready-for-final-esign.dto';
import { EntityListColumn, EntityListConfig, IEntityListConfig } from '@mt-ng2/entity-list-module';
import moment from 'moment';


export class ReadyForFinalEsignActivitySummaryListConfig extends EntityListConfig {
    constructor() {
        const listConfig: IEntityListConfig = {
            columns: [
                new EntityListColumn({
                    accessorFunction: function (summary: IReadyForFinalESignDTO): string {
                        return summary.EncounterNumber.toString();
                    },
                    name: 'Encounter Number',
                    sort: {
                        sortProperty: 'EncounterNumber',
                    },
                }),
                new EntityListColumn({
                    accessorFunction: (sts: IReadyForFinalESignDTO) => {
                        if (!sts.Name) {
                            return 'Individual';
                        }
                        return sts.Name;
                    },
                    name: 'Session Name',
                    sort: {
                        sortProperty: 'SessionName',
                    },
                }),
                new EntityListColumn({
                    accessorFunction: (sts: IReadyForFinalESignDTO) => {
                        if (!sts.Student) {
                            return '';
                        }
                        return sts.Student;
                    },
                    name: 'Student',
                    sort: {
                        sortProperty: 'Student',
                    },
                }),
                new EntityListColumn({
                    accessorFunction: (sts: IReadyForFinalESignDTO) => {
                        return sts.StartTime.toString();
                    },
                    name: 'Date',
                    pipes: ['date'],
                    sort: {
                        sortProperty: 'StartTime',
                    },
                }),
                new EntityListColumn({
                    accessorFunction: function (sts: IReadyForFinalESignDTO): string {
                        const start = moment(new Date(sts.StartTime)).format('hh:mmA');
                        const end = moment(new Date(sts.EndTime)).format('hh:mmA');
                        return `${start} - ${end}`;
                    },
                    name: 'Time',
                    sort: {
                        disableSort: true,
                    },
                }),
                new EntityListColumn({
                    accessorFunction: (sts: IReadyForFinalESignDTO) => {
                        if (!sts.ServiceType) {
                            return '';
                        }
                        return sts.ServiceType;
                    },
                    name: 'Service Type',
                    sort: {
                        sortProperty: 'ServiceType',
                    },
                }),
            ],
        };

        super(listConfig);
    }
}
