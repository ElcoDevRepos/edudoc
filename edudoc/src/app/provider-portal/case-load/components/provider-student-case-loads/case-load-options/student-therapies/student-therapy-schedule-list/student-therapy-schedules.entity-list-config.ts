import { DeleteEntityCellComponent } from '@common/delete-entity-cell-component/delete-entity-cell.component';
import { EntityListColumn, EntityListConfig, IEntityListConfig } from '@mt-ng2/entity-list-module';
import { IStudentTherapiesDto } from '@provider/case-load/services/student-therapy-schedule.service';
import moment from 'moment';

export class StudentTherapySchedulesEntityListConfig extends EntityListConfig {
    constructor() {
        const listConfig: IEntityListConfig = {
            columns: [
                new EntityListColumn({
                    accessorFunction: (sts: IStudentTherapiesDto) => {
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
                    accessorFunction: (sts: IStudentTherapiesDto) => {
                        return sts.StartTime.toString();
                    },
                    name: 'Date',
                    pipes: ['date'],
                    sort: {
                        sortProperty: 'StartTime',
                    },
                }),
                new EntityListColumn({
                    accessorFunction: (sts: IStudentTherapiesDto) => {
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
                    name: 'Day',
                    sort: {
                        disableSort: true,
                        sortProperty: 'Id',
                    },
                }),
                new EntityListColumn({
                    accessorFunction: function (sts: IStudentTherapiesDto): string {
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
                    accessorFunction: (sts: IStudentTherapiesDto) => {
                        if (!sts.Students) {
                            return '';
                        } else if (sts.Students.length > 1) {
                            sts.Students.forEach((student, index) => {
                                sts.Students[index] = `<p>${student}</p>`;
                            })
                        }

                        return sts.Students.join('');
                    },
                    bindToInnerHtml: true,
                    name: 'Student(s)',
                    sort: {
                        disableSort: true,
                    },
                }),
                new EntityListColumn({
                    accessorFunction: (sts: IStudentTherapiesDto) => {
                        if (!sts.Location) {
                            return '';
                        }
                        return sts.Location.join(',');
                    },
                    name: 'Location',
                    sort: { disableSort: true },
                }),
                new EntityListColumn({
                    component: DeleteEntityCellComponent,
                    excludeFromExport: true,
                    name: 'Archive',
                    sort: { disableSort: true },
                    style: { width: 50 },
                }),
            ],
            rowClass: (entity: IStudentTherapiesDto) => (entity.TherapySchedules.some((x) => x.Archived) ? 'archived' : null),
        };

        super(listConfig);
    }
}
