import { DatePipe } from '@angular/common';
import { EncounterServiceTypes } from '@model/enums/encounter-service-types.enum';
import { IEncounter } from '@model/interfaces/encounter';
import { IEncounterStudent } from '@model/interfaces/encounter-student';
import { EntityListColumn, EntityListConfig, IEntityListConfig } from '@mt-ng2/entity-list-module';

export class EncounterByTherapistEntityListConfig extends EntityListConfig {
    constructor() {
        const listConfig: IEntityListConfig = {
            columns: [
                new EntityListColumn({
                    accessorFunction: function (encounter: IEncounter): string {
                        return encounter.Provider?.ProviderTitle?.Name;
                    },
                    name: 'Provider Title',
                    sort: {
                        sortProperty: 'Provider.ProviderTitle.Name',
                    },
                }),
                new EntityListColumn({
                    accessorFunction: function (encounter: IEncounter): string {
                        if (encounter.ServiceTypeId === EncounterServiceTypes.Evaluation_Assessment && encounter.EvaluationType) {
                            return encounter.EvaluationType.Name;
                        }
                        return '';
                    },
                    name: 'Evaluation Type',
                    sort: {
                        disableSort: true,
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
                        }
                        return 'No location(s)';
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
                        if (encounter.Provider) {
                            return encounter.Provider.ProviderUser.FirstName + ' ' + encounter.Provider.ProviderUser.LastName;
                        }
                        return '';
                    },
                    name: 'Provider Name',
                    sort: {
                        sortProperty: 'Provider.ProviderUser.FirstName',
                    },
                }),
            ],
        };
        super(listConfig);
    }
}
