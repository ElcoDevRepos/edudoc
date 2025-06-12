import { DatePipe } from '@angular/common';
import { IStudentDto } from '@model/interfaces/custom/student.dto';
import { EntityListColumn, EntityListConfig, IEntityListConfig } from '@mt-ng2/entity-list-module';

export class StudentsNoMedicaidEntityListConfig extends EntityListConfig {
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
                    accessorFunction: function (response: IStudentDto): string {
                        return response.Student.Address ? `${response.Student.Address.Address1}` : 'Missing';
                    },
                    name: 'Address',
                    sort: {
                        disableSort: true,
                    },
                }),
                new EntityListColumn({
                accessors: ['Student', 'StudentCode'],
                    name: 'Student Code',
                }),
                new EntityListColumn({
                    accessorFunction: function (response: IStudentDto): string {
                        return response.Student.MedicaidNo ? `${response.Student.MedicaidNo}` : 'Missing';
                    },
                    name: 'Medicaid No.',
                    sort: {
                        disableSort: true,
                    },
                }),
                new EntityListColumn({
                    accessors: ['Student', 'Grade'],
                    name: 'Grade',
                }),
                new EntityListColumn({
                    accessors: ['Student', 'School', 'Name'],
                    name: 'School',
                }),
            ],
        };
        super(listConfig);
    }
}
