import { DatePipe } from '@angular/common';
import { DeleteEntityCellComponent } from '@common/delete-entity-cell-component/delete-entity-cell.component';
import { ISchoolDistrictRoster } from '@model/interfaces/school-district-roster';
import { IStudent } from '@model/interfaces/student';
import { EntityListColumn, EntityListConfig, IEntityListConfig } from '@mt-ng2/entity-list-module';
import { Observable } from 'rxjs';

export class SchoolDistrictRosterIssuesEntityListConfig extends EntityListConfig {
    constructor(getDataForExport: () => Observable<ISchoolDistrictRoster[]>) {
        const listConfig: IEntityListConfig = {
            columns: [
                new EntityListColumn({
                    accessors: ['LastName'],
                    name: 'Last Name',
                }),
                new EntityListColumn({
                    accessors: ['MiddleName'],
                    name: 'Middle Name',
                }),
                new EntityListColumn({
                    accessors: ['FirstName'],
                    name: 'First Name',
                }),
                new EntityListColumn({
                    accessors: ['StudentCode'],
                    name: 'Student Code',
                }),
                new EntityListColumn({
                    name: 'Grade',
                    sort: { disableSort: true },
                }),
                new EntityListColumn({
                    accessorFunction: function (roster: ISchoolDistrictRoster): string {
                        let date = roster.DateOfBirth;
                        try {
                            date = new Date(new DatePipe('en-US').transform(roster.DateOfBirth, 'yyyy-MM-ddThh:mm:ss', 'UTC')).toLocaleDateString();
                        } catch (e) {
                            // do nothing
                        }
                        return date;
                    },
                    name: 'Date Of Birth',
                    sort: { disableSort: true },
                }),
                new EntityListColumn({
                    accessorFunction: function (roster: ISchoolDistrictRoster): string {
                        return roster.Address2 ? `${roster.Address1}, ${roster.Address2}` : `${roster.Address1}`;
                    },
                    name: 'Address',
                    sort: { disableSort: true },
                }),
                new EntityListColumn({
                    accessors: ['City'],
                    name: 'City',
                    sort: { disableSort: true },
                }),
                new EntityListColumn({
                    accessors: ['StateCode'],
                    name: 'State',
                    sort: { disableSort: true },
                }),
                new EntityListColumn({
                    accessors: ['Zip'],
                    name: 'Zip',
                    sort: { disableSort: true },
                }),
                new EntityListColumn({
                    accessors: ['SchoolBuilding'],
                    name: 'School Building',
                }),
                new EntityListColumn({
                    accessorFunction: (roster: ISchoolDistrictRoster) => (roster.HasDuplicates ? 'Yes' : ''),
                    name: 'Issue',
                    style: { width: 50 },
                    sort: { disableSort: true },
                }),
                new EntityListColumn({
                    component: DeleteEntityCellComponent,
                    name: 'Ignore',
                    sort: { disableSort: true },
                    style: { width: 50 },
                }),
            ],
            rowClass: (entity: ISchoolDistrictRoster) => (entity.Archived ? 'archived' : null),
            export: {
                exportName: 'roster_issues',
                getDataForExport: getDataForExport
            }
        };
        super(listConfig);
    }
}
