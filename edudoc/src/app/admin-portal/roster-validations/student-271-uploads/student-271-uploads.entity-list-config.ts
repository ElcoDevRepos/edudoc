import { IRosterValidationStudent } from '@model/interfaces/roster-validation-student';
import { EntityListColumn, EntityListConfig, IEntityListConfig } from '@mt-ng2/entity-list-module';

export class RosterValidationStudentsEntityListConfig extends EntityListConfig {
    constructor() {
        const listConfig: IEntityListConfig = {
            columns: [
                new EntityListColumn({
                    accessors: ['FirstName'],
                    name: 'First Name',
                }),
                new EntityListColumn({
                    accessors: ['LastName'],
                    name: 'Last Name',
                }),
                new EntityListColumn({
                    accessors: ['Student', 'DateOfBirth'],
                    name: 'Date of Birth',
                    pipes: ['date'],
                }),
                new EntityListColumn({
                    accessors: ['Student', 'MedicaidNo'],
                    name: 'Medicaid No.',
                }),
                new EntityListColumn({
                    accessorFunction: function (response: IRosterValidationStudent): string {
                        return response.IsSuccessfullyProcessed ? 'Yes' : 'No';
                    },
                    name: 'Successfully Processed',
                    sort: {
                        disableSort: true,
                    },
                }),
            ],
        };
        super(listConfig);
    }
}
