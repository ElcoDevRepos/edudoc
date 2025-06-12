import { EntityListColumn, EntityListConfig, IEntityListConfig } from '@mt-ng2/entity-list-module';
import { IStudentTherapiesByDayDto } from '@provider/case-load/services/student-therapy-schedule.service';
import moment from 'moment';


export class StudentTherapyScheduleByDayEntityListConfig extends EntityListConfig {
    constructor() {
        const listConfig: IEntityListConfig = {
            columns: [
                new EntityListColumn({
                    accessorFunction: (sts: IStudentTherapiesByDayDto) => {
                        switch (sts.Weekday) {
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
                new EntityListColumn({
                    accessorFunction: function (sts: IStudentTherapiesByDayDto): string {
                        return moment(new Date(sts.StartTime)).format('hh:mmA');
                    },
                    name: 'Start Time',
                    sort: {
                        disableSort: true,
                    },
                }),
                new EntityListColumn({
                    accessorFunction: function (sts: IStudentTherapiesByDayDto): string {
                        return moment(new Date(sts.EndTime)).format('hh:mmA');
                    },
                    name: 'End Time',
                    sort: {
                        disableSort: true,
                    },
                }),
                new EntityListColumn({
                    accessors: ['SessionName'],
                    name: 'Session Name',
                    sort: {
                        disableSort: true,
                    },
                }),
                new EntityListColumn({
                    accessorFunction: (sts: IStudentTherapiesByDayDto) => {
                        return sts.FirstName + ' ' + sts.LastName;
                    },
                    name: 'Student Name',
                    sort: {
                        disableSort: true,
                    },
                }),
                new EntityListColumn({
                    accessorFunction: (sts: IStudentTherapiesByDayDto) => {
                        return sts.StartTime.toString();
                    },
                    name: 'Start Date',
                    pipes: ['date'],
                    sort: {
                        disableSort: true,
                    },
                }),
                new EntityListColumn({
                    accessorFunction: (sts: IStudentTherapiesByDayDto) => {
                        return sts.EndTime.toString();
                    },
                    name: 'End Date',
                    pipes: ['date'],
                    sort: {
                        disableSort: true,
                    },
                }),
            ],
        };
        super(listConfig);
    }
}
