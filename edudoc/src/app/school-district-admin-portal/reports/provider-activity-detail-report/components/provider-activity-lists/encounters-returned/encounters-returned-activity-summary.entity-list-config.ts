import { DateTimeConverterService } from '@common/services/date-time-converter.service';
import { IEncountersReturnedDTO } from '@model/interfaces/custom/encounters-returned.dto';
import { EntityListColumn, EntityListConfig, IEntityListConfig } from '@mt-ng2/entity-list-module';
import moment from 'moment';

export class EncountersReturnedActivitySummaryListConfig extends EntityListConfig {
    constructor(private dateTimeConverter: DateTimeConverterService) {
        super({
            columns: [
                new EntityListColumn({
                    accessorFunction: function (summary: IEncountersReturnedDTO): string {
                        return summary.EncounterNumber;
                    },
                    name: 'Encounter Number',
                    sort: {
                        sortProperty: 'EncounterNumber',
                    },
                }),
                new EntityListColumn({
                    accessorFunction: (sts: IEncountersReturnedDTO) => {
                        if (!sts.SessionName) {
                            return 'Individual';
                        }
                        return sts.SessionName;
                    },
                    name: 'Session Name',
                    sort: {
                        sortProperty: 'SessionName',
                    },
                }),
                new EntityListColumn({
                    accessorFunction: (sts: IEncountersReturnedDTO) => {
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
                    accessorFunction: (sts: IEncountersReturnedDTO) => {
                        return sts.StartTime.toString();
                    },
                    name: 'Date',
                    pipes: ['date'],
                    sort: {
                        sortProperty: 'StartTime',
                    },
                }),
                new EntityListColumn({
                    accessorFunction: function (sts: IEncountersReturnedDTO): string {
                        const start = moment(dateTimeConverter.convertUtcToLocal(sts.StartTime)).format('hh:mmA');
                        const end = moment(dateTimeConverter.convertUtcToLocal(sts.EndTime)).format('hh:mmA');
                        return `${start} - ${end}`;
                    },
                    name: 'Time',
                    sort: {
                        disableSort: true,
                    },
                }),
                new EntityListColumn({
                    accessorFunction: (sts: IEncountersReturnedDTO) => {
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
        });
    }
}
