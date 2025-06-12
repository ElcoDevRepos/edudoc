import { IReadyForSchedulingDTO } from '@model/interfaces/custom/ready-for-scheduling.dto';
import { EntityListColumn, EntityListConfig, IEntityListConfig } from '@mt-ng2/entity-list-module';
import moment from 'moment';


export class ReadyForSchedulingActivitySummaryListConfig extends EntityListConfig {
    constructor() {
        const listConfig: IEntityListConfig = {
            columns: [
                new EntityListColumn({
                    accessorFunction: (sts: IReadyForSchedulingDTO) => {
                        if (!sts.Name) {
                            return 'Individual';
                        }
                        return sts.Name;
                    },
                    name: 'Session Name',
                    sort: {
                        sortProperty: 'Name',
                    },
                }),
                new EntityListColumn({
                    accessorFunction: (sts: IReadyForSchedulingDTO) => {
                        if (!sts.Students) {
                            return '';
                        }
                        return sts.Students.join('; ');
                    },
                    name: 'Student',
                    sort: {
                        disableSort: true,
                    },
                }),
                new EntityListColumn({
                    accessorFunction: (sts: IReadyForSchedulingDTO) => {
                        return sts.StartTime.toString();
                    },
                    name: 'Date',
                    pipes: ['date'],
                    sort: {
                        sortProperty: 'StartTime',
                    },
                }),
                new EntityListColumn({
                    accessorFunction: function (sts: IReadyForSchedulingDTO): string {
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
                    accessorFunction: (sts: IReadyForSchedulingDTO) => {
                        switch (new Date(sts.StartTime).getDay()) {
                            case 1:
                                return 'Monday';
                            case 2:
                                return 'Tuesday';
                            case 3:
                                return 'Wednesday';
                            case 4:
                                return 'Thursday';
                            case 5:
                                return 'Friday';
                            default:
                                return '';
                        }
                    },
                    name: 'Weekday',
                    sort: {
                        disableSort: true,
                        sortProperty: 'Id',
                    },
                }),
            ],
        };

        super(listConfig);
    }
}
