import { DatePipe } from '@angular/common';
import { EntityListColumn, EntityListConfig, IEntityListConfig } from '@mt-ng2/entity-list-module';
import { ISchoolDistrictRosterEntity } from './overridden-documents.component';

export class RosterPreviewEntityListConfig extends EntityListConfig {
    constructor() {
        const listConfig: IEntityListConfig = {
            columns: [
                new EntityListColumn({
                    accessorFunction: (row: ISchoolDistrictRosterEntity) => row.Roster.LastName,
                    name: 'Last Name',
                    sort: { disableSort: true },
                }),
                new EntityListColumn({
                    accessorFunction: (row: ISchoolDistrictRosterEntity) => row.Roster.FirstName,
                    name: 'First Name',
                    sort: { disableSort: true },
                }),
                new EntityListColumn({
                    accessorFunction: (row: ISchoolDistrictRosterEntity) => row.Roster.MiddleName,
                    name: 'Middle Name',
                    sort: { disableSort: true },
                }),
                new EntityListColumn({
                    accessorFunction: (row: ISchoolDistrictRosterEntity) => row.Roster.StudentCode,
                    name: 'Student Code',
                    sort: { disableSort: true },
                }),
                new EntityListColumn({
                    accessorFunction: (row: ISchoolDistrictRosterEntity) => {
                        let date = row.Roster.DateOfBirth;
                        try {
                            date = new DatePipe('en-US').transform(row.Roster.DateOfBirth, 'MM/dd/yyyy');
                        } catch (e) {
                            // do nothing
                        }
                        return date;
                    },
                    name: 'Birth Date',
                    sort: { disableSort: true },
                }),
                new EntityListColumn({
                    accessorFunction: (row: ISchoolDistrictRosterEntity) => row.Roster.Address1,
                    name: 'Address 1',
                    sort: { disableSort: true },
                }),
                new EntityListColumn({
                    accessorFunction: (row: ISchoolDistrictRosterEntity) => row.Roster.Address2,
                    name: 'Address 2',
                    sort: { disableSort: true },
                }),
                new EntityListColumn({
                    accessorFunction: (row: ISchoolDistrictRosterEntity) => row.Roster.City,
                    name: 'City',
                    sort: { disableSort: true },
                }),
                new EntityListColumn({
                    accessorFunction: (row: ISchoolDistrictRosterEntity) => row.Roster.StateCode,
                    name: 'State',
                    sort: { disableSort: true },
                }),
                new EntityListColumn({
                    accessorFunction: (row: ISchoolDistrictRosterEntity) => row.Roster.Zip,
                    name: 'Zip',
                    sort: { disableSort: true },
                }),
                new EntityListColumn({
                    accessorFunction: (row: ISchoolDistrictRosterEntity) => row.Roster.Grade,
                    name: 'Grade',
                    sort: { disableSort: true },
                }),
                new EntityListColumn({
                    accessorFunction: (row: ISchoolDistrictRosterEntity) => row.Roster.SchoolBuilding,
                    name: 'School',
                    sort: { disableSort: true },
                }),
            ],
        };
        super(listConfig);
    }
}
