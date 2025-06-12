import { DatePipe } from '@angular/common';

import {
    EntityListColumn, EntityListConfig, IEntityListConfig
} from '@mt-ng2/entity-list-module';
import { IEncounterStudent } from '../../../../model/interfaces/encounter-student';
import * as moment from 'moment-timezone';
import { EncounterStatuses } from '@model/enums/encounter-status.enum';

export class ReturnEncountersEntityListConfig extends EntityListConfig {
    constructor() {
        const listConfig: IEntityListConfig = {
            columns: [
                new EntityListColumn({
                    accessorFunction: function (encounter: IEncounterStudent): string {
                        return new DatePipe('en-US').transform(encounter.EncounterDate, 'MMM d, y', 'UTC');
                    },
                    name: 'Date',
                    sort: {
                        sortProperty: 'EncounterDate',
                    },
                }),
                new EntityListColumn({
                    accessorFunction: function (encounter: IEncounterStudent): string {
                        const date = new Date(encounter.EncounterDate);
                        const startTime = moment.utc(`${date.toDateString()} ${encounter.EncounterStartTime}`).tz(moment.tz.guess()).format('hh:mmA');
                        const endTime = moment.utc(`${date.toDateString()} ${encounter.EncounterEndTime}`).tz(moment.tz.guess()).format('hh:mmA');
                        return `${startTime} - ${endTime}`;
                    },
                    name: 'Time',
                    sort: {
                        disableSort: true,
                    },
                }),
                new EntityListColumn({
                    accessorFunction: function (encounter: IEncounterStudent): string {
                        return `${encounter.Student.FirstName} ${encounter.Student.LastName}`;
                    },
                    name: 'Student',
                    sort: {
                        disableSort: true,
                    },
                }),
                new EntityListColumn({
                    accessorFunction: function (encounter: IEncounterStudent): string {
                        return encounter.ReasonForReturn?.split(/\r\n|\n/)?.join('<br />');
                    },
                    bindToInnerHtml: true,
                    name: 'Reason For Return',
                    sort: {
                        disableSort: true,
                    },
                }),
                new EntityListColumn({
                    accessorFunction: function (encounter: IEncounterStudent): string {
                        const statuses = encounter.EncounterStudentStatus
                            .filter(ess => ess.EncounterStatusId === EncounterStatuses.Returned_By_Supervisor || ess.EncounterStatusId === EncounterStatuses.Returned_By_Admin)
                            .sort((a, b) => {
                                return +new Date(b.DateCreated) - +new Date(a.DateCreated);
                            });
                        return `${statuses[0].CreatedBy.FirstName} ${statuses[0].CreatedBy.LastName}`;
                    },
                    name: 'Returned By',
                    sort: {
                        disableSort: true,
                    },
                }),
                new EntityListColumn({
                    accessorFunction: function (encounter: IEncounterStudent): string {
                        const statuses = encounter.EncounterStudentStatus
                            .filter(ess => ess.EncounterStatusId === EncounterStatuses.Returned_By_Supervisor || ess.EncounterStatusId === EncounterStatuses.Returned_By_Admin)
                            .sort((a, b) => {
                                return +new Date(b.DateCreated) - +new Date(a.DateCreated);
                            });
                            const time = moment.utc(`${new Date(statuses[0].DateCreated).toUTCString()}`).tz(moment.tz.guess()).format('hh:mmA');
                            return `${new DatePipe('en-US').transform(statuses[0].DateCreated, 'MMM d, y', 'UTC')} ${time}`;
                    },
                    name: 'Returned Date & Time',
                    sort: {
                        disableSort: true,
                    },
                }),
            ]
        };
        super(listConfig);
    }
}
