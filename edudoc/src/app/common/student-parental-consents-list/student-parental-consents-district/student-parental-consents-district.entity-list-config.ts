import { IStudentParentalConsentDistrictDTO } from '@model/interfaces/custom/student-parental-consent-district.dto';
import { EntityListColumn, EntityListConfig, IEntityListConfig } from '@mt-ng2/entity-list-module';

export class StudentParentalConsentsDistrictEntityListConfig extends EntityListConfig {
    constructor() {
        const listConfig: IEntityListConfig = {
            columns: [
                new EntityListColumn({
                    accessorFunction: function (response: IStudentParentalConsentDistrictDTO): string {
                        return response.DistrictName;
                    },
                    name: 'School District',
                    sort: {
                        sortProperty: 'DistrictName',
                    },
                }),
                new EntityListColumn({
                    accessorFunction: function (response: IStudentParentalConsentDistrictDTO): string {
                        return response.TotalEncounters.toString();
                    },
                    name: 'Total Encounters',
                    sort: {
                        disableSort: true,
                    },
                }),
            ],
        };
        super(listConfig);
    }
}
