import { DatePipe } from '@angular/common';
import { IProviderCaseLoadDTO } from '@model/interfaces/custom/provider-student.dto';
import { EntityListColumn, EntityListConfig, IEntityListConfig } from '@mt-ng2/entity-list-module';

export class ProviderStudentsEntityListConfig extends EntityListConfig {
    constructor() {
        super({
            columns: [
                new EntityListColumn({
                    accessors: ['LastName'],
                    name: 'Last Name',
                    sort: {
                        sortProperty: 'LastName',
                    },
                }),
                new EntityListColumn({
                    accessors: ['FirstName'],
                    name: 'First Name',
                    sort: {
                        sortProperty: 'FirstName',
                    },
                }),
                new EntityListColumn({
                    accessorFunction: function (response: IProviderCaseLoadDTO): string {
                        return new DatePipe('en-US').transform(response.DateOfBirth, 'MMM d, y', 'UTC');
                    },
                    name: 'DOB',
                    sort: {
                        sortProperty: 'DateOfBirth',
                    },
                }),
                new EntityListColumn({
                    accessors: ['StudentCode'],
                    name: 'Student Code',
                    sort: {
                        sortProperty: 'StudentCode',
                    },
                }),
            ],
        });
    }
}
