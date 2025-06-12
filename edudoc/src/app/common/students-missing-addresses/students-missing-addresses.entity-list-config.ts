import { DatePipe } from '@angular/common';
import { IStudentDto } from '@model/interfaces/custom/student.dto';
import { EntityListColumn, EntityListConfig, IEntityListConfig } from '@mt-ng2/entity-list-module';

export class StudentMissingAddressesEntityListConfig extends EntityListConfig {
    constructor() {
        const listConfig: IEntityListConfig = {
            columns: [
                new EntityListColumn({
                    accessors: ['Student', 'LastName'],
                    name: 'Last Name',
                }),
                new EntityListColumn({
                    accessors: ['Student', 'FirstName'],
                    name: 'First Name',
                }),
                new EntityListColumn({
                    accessorFunction: function (response: IStudentDto): string {
                        return new DatePipe('en-US').transform(response.Student.DateOfBirth, 'MMM d, y');
                    },
                    name: 'Date Of Birth',
                    sort: {
                        disableSort: true,
                    },
                }),
                new EntityListColumn({
                    accessors: ['Student', 'StudentCode'],
                        name: 'Student Code',
                }),
                new EntityListColumn({
                    accessors: ['Student', 'School', 'Name'],
                    name: 'School',
                }),
                new EntityListColumn({
                    accessorFunction: function (response: IStudentDto): string {
                        return response.SignedEncounterCount ? `${response.SignedEncounterCount}` : '0';
                    },
                    name: 'Signed Encounters',
                    sort: {
                        disableSort: true,
                    },
                }),
            ],
        };
        super(listConfig);
    }
}
