import { DatePipe } from '@angular/common';
import { DeleteEntityCellComponent } from '@common/delete-entity-cell-component/delete-entity-cell.component';
import { EncounterServiceTypes } from '@model/enums/encounter-service-types.enum';
import { IEncounter } from '@model/interfaces/encounter';
import {
    EntityListColumn, EntityListConfig, IEntityListConfig
} from '@mt-ng2/entity-list-module';
import { IEncounterStudent } from '../../../../model/interfaces/encounter-student';

// TODO: Currently hardcoding Timezone, will need to figure out / test if the function is timezone aware.
export class EncounterEntityListConfig extends EntityListConfig {
    constructor(isPendingTherapies?: boolean) {
        const listConfig: IEntityListConfig = {
            columns: [
                new EntityListColumn({
                    accessorFunction: function (encounter: IEncounter): string {
                        if (encounter.ServiceType) {
                            return encounter.ServiceType.Name;
                        }
                        return '';
                    },
                    excludeFromView: isPendingTherapies,
                    name: 'Service Type',
                    sort: {
                        sortProperty: 'ServiceType.Name',
                    },
                }),
                new EntityListColumn({
                    accessorFunction: function (encounter: IEncounter): string {
                        const students = encounter.EncounterStudents.filter((encounterStudent: IEncounterStudent) => !encounterStudent.Archived).map(
                            (encounterStudent: IEncounterStudent) => encounterStudent.Student.LastName + ', ' + encounterStudent.Student.FirstName,
                        );

                        let distinct = [];

                        for (const student of students) {
                            distinct = distinct.concat(student);
                        }

                        distinct = distinct.filter((value, index, self) => {
                            return self.indexOf(value) === index;
                        });

                        return distinct.sort().join('; ').length > 0 ? distinct.join('; ') : 'No students';
                    },
                    name: 'Student(s)',
                    sort: {
                        disableSort: true,
                    },
                }),
                new EntityListColumn({
                    accessorFunction: function (encounter: IEncounter): string {
                        const locations = encounter.EncounterStudents.filter((encounterStudent: IEncounterStudent) => !encounterStudent.Archived).filter((value, index, self) => {
                            return self.findIndex((encounterStudent: IEncounterStudent) => encounterStudent.EncounterLocationId === value.EncounterLocationId) === index;
                          }).map(
                            (encounterStudent: IEncounterStudent) => encounterStudent.EncounterLocation.Name,
                        );
                        if (locations.length) {
                            return locations.join('; ');
                        } else {
                            return 'No location(s)';
                        }
                    },
                    name: 'Location(s)',
                    sort: {
                        disableSort: true,
                    },
                }),
                new EntityListColumn({
                    accessorFunction: function (encounter: IEncounter): string {
                        const dates = encounter.EncounterStudents.filter((encounterStudent: IEncounterStudent) => !encounterStudent.Archived)
                            .sort(function (a, b): number {
                                return new Date(a.EncounterDate).getTime() - new Date(b.EncounterDate).getTime();
                            })
                            .map((encounterStudent: IEncounterStudent) =>
                                new DatePipe('en-US').transform(encounterStudent.EncounterDate, 'MMM d, y', 'UTC'),
                            );
                        if (dates.length > 1) {
                            return `${dates[0]} - ${dates.pop()}`;
                        } else if (dates.length) {
                            return dates[0];
                        }
                        return 'No dates chosen';
                    },
                    name: 'Encounter Dates',
                    sort: {
                        disableSort: true,
                    },
                }),
                new EntityListColumn({
                    accessorFunction: function (encounter: IEncounter): string {
                        if (encounter.IsGroup) {
                            return 'Group';
                        }
                        return 'Individual';
                    },
                    name: 'Group Status',
                    sort: {
                        sortProperty: 'IsGroup',
                    },
                }),
                new EntityListColumn({
                    accessorFunction: function (encounter: IEncounter): string {
                        if (encounter.EncounterStudents.some((es) => es.ESignedById === null)) {
                            return 'Pending Signature';
                        }
                        return 'Signed';
                    },
                    name: 'E-Signature',
                    sort: { disableSort: true },
                }),
                new EntityListColumn({
                    component: DeleteEntityCellComponent,
                    name: 'Delete',
                    sort: { disableSort: true },
                    style: { width: 50 },
                }),
            ],
            rowClass: (entity: IEncounter) => (entity.Archived ? 'archived' : null),
        };
        super(listConfig);
    }
}
