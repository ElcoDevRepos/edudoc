import { DatePipe } from '@angular/common';
import { EncounterServiceTypes } from '@model/enums/encounter-service-types.enum';
import { IEncounterStudent } from '@model/interfaces/encounter-student';
import { EntityListColumn, EntityListConfig } from '@mt-ng2/entity-list-module';
import * as moment from 'moment-timezone';
import { ReviseEncounterAbandonComponent } from './revise-encounter-abandon.component';

export class EncounterStudentEntityListConfig extends EntityListConfig {
    constructor(returnedOnly?: boolean) {
        super({
            columns: [
                new EntityListColumn({
                    accessorFunction: function (encounterStudent: IEncounterStudent): string {
                        return encounterStudent.Student.LastName + ', ' + encounterStudent.Student.FirstName;
                    },
                    name: 'Student',
                    sort: {
                        sortProperty: 'Student.LastName',
                    },
                }),
                new EntityListColumn({
                    accessors: ['Student', 'DateOfBirth'],
                    name: 'Date of Birth',
                    pipes: ['date'],
                }),
                new EntityListColumn({
                    accessors: ['EncounterDate'],
                    name: 'Encounter Date',
                    pipes: ['date'],
                }),
                new EntityListColumn({
                    accessorFunction: function (encounterStudent: IEncounterStudent): string {
                        if (encounterStudent.Encounter.ServiceType) {
                            return encounterStudent.Encounter.ServiceType.Name;
                        }
                        return '';
                    },
                    excludeFromView: returnedOnly,
                    name: 'Service Type',
                    sort: {
                        sortProperty: 'Encounter.ServiceType.Name',
                    },
                }),
                new EntityListColumn({
                    accessorFunction: function (encounterStudent: IEncounterStudent): string {
                        const date = new Date(encounterStudent.EncounterDate);
                        return moment.utc(`${date.toDateString()} ${encounterStudent.EncounterStartTime}`).tz(moment.tz.guess()).format('hh:mmA');
                    },
                    name: 'Encounter Start Time',
                    sort: {
                        sortProperty: 'EncounterStartTime',
                    },
                }),
                new EntityListColumn({
                    accessorFunction: function (encounterStudent: IEncounterStudent): string {
                        const date = new Date(encounterStudent.EncounterDate);
                        return moment.utc(`${date.toDateString()} ${encounterStudent.EncounterEndTime}`).tz(moment.tz.guess()).format('hh:mmA');
                    },
                    name: 'Encounter End Time',
                    sort: {
                        sortProperty: 'EncounterEndTime',
                    },
                }),
                new EntityListColumn({
                    accessorFunction: function (encounterStudent: IEncounterStudent): string {
                        return encounterStudent.Encounter.IsGroup ? `${encounterStudent.EncounterNumber}` : '';
                    },
                    linkFunction: function (encounterStudent: IEncounterStudent): void {
                        if (encounterStudent.Encounter.IsGroup) {
                            window.location.assign(`#/provider/encounters/${encounterStudent.Encounter.Id}`);
                        }
                    },
                    name: 'Group Link',
                    sort: {
                        disableSort: true,
                    },
                }),
                new EntityListColumn({
                    accessorFunction: function (encounterStudent: IEncounterStudent): string {
                        return encounterStudent.EncounterLocation.Name;
                    },
                    name: 'Location',
                    sort: {
                        sortProperty: 'EncounterLocation.Name',
                    },
                }),
                new EntityListColumn({
                    accessorFunction: function (encounterStudent: IEncounterStudent): string {
                        return encounterStudent.EncounterStatus.HpcAdminOnly ? 'E-Signed' : encounterStudent.EncounterStatus.Name;
                    },
                    name: 'Status',
                    sort: {
                        sortProperty: 'EncounterStatus.Name',
                    },
                }),
                new EntityListColumn({
                    accessorFunction: function (encounterStudent: IEncounterStudent): string {
                        if (encounterStudent.DateModified && encounterStudent.SupervisorESignedBy && encounterStudent.SupervisorESignatureText ) {
                            return (
                                encounterStudent.SupervisorESignedBy.LastName +
                                ', ' +
                                encounterStudent.SupervisorESignedBy.FirstName +
                                ' on ' +
                                new DatePipe('en-US').transform(encounterStudent.DateModified, 'MMM d, y', 'UTC')
                            );
                        } else if (encounterStudent.DateModified && encounterStudent.ESignedBy && encounterStudent.ESignatureText) {
                            return (
                                encounterStudent.ESignedBy.LastName +
                                ', ' +
                                encounterStudent.ESignedBy.FirstName +
                                ' on ' +
                                new DatePipe('en-US').transform(encounterStudent.DateModified, 'MMM d, y', 'UTC')
                            );
                        } else {
                            return '';
                        }
                    },
                    name: 'Date Saved',
                    sort: {
                        sortProperty: 'DateModified',
                    },
                }),
                new EntityListColumn({
                    accessorFunction: function (encounterStudent: IEncounterStudent): string {
                        if (
                            encounterStudent.Encounter.ServiceTypeId === EncounterServiceTypes.Evaluation_Assessment &&
                            encounterStudent.Encounter.EvaluationType
                        ) {
                            return encounterStudent.Encounter.EvaluationType.Name;
                        }
                        return '';
                    },
                    excludeFromView: returnedOnly,
                    name: 'Evaluation Type',
                    sort: {
                        disableSort: true,
                    },
                }),
                new EntityListColumn({
                    component: ReviseEncounterAbandonComponent,
                    name: 'Abandon',
                    sort: { disableSort: true },
                }),
            ],
        });
    }
}
