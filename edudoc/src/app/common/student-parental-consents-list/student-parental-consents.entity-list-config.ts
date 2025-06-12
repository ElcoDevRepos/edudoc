import { DatePipe } from '@angular/common';
import { ParentalConsentTypesEnum } from '@model/enums/parental-consent-types.enum';
import { IStudentParentalConsentDTO } from '@model/interfaces/custom/student-parental-consent.dto';
import { EntityListColumn, EntityListConfig, IEntityListConfig } from '@mt-ng2/entity-list-module';

export class StudentParentalConsentsEntityListConfig extends EntityListConfig {
    constructor() {
        const listConfig: IEntityListConfig = {
            columns: [
                new EntityListColumn({
                    accessorFunction: function (response: IStudentParentalConsentDTO): string {
                        return response.LastName;
                    },
                    name: 'Last Name',
                    sort: {
                        sortProperty: 'LastName',
                    },
                }),
                new EntityListColumn({
                    accessorFunction: function (response: IStudentParentalConsentDTO): string {
                        return response.FirstName;
                    },
                    name: 'First Name',
                    sort: {
                        sortProperty: 'FirstName',
                    },
                }),
                new EntityListColumn({
                    accessorFunction: function (response: IStudentParentalConsentDTO): string {
                        return new DatePipe('en-US').transform(response.DateOfBirth, 'MMM d, y', 'UTC');
                    },
                    name: 'Birth Date',
                    sort: {
                        sortProperty: 'DateOfBirth',
                    },
                }),
                new EntityListColumn({
                    accessorFunction: function (response: IStudentParentalConsentDTO): string {
                        return response.StudentCode;
                    },
                    name: 'Student Code',
                    sort: {
                        sortProperty: 'StudentCode',
                    },
                }),
                new EntityListColumn({
                    accessorFunction: function (response: IStudentParentalConsentDTO): string {
                        return response.School ? response.School.Name : '';
                    },
                    name: 'School Building',
                    sort: {
                        sortProperty: 'SchoolBuilding',
                    },
                }),
                new EntityListColumn({
                    accessorFunction: function (response: IStudentParentalConsentDTO): string {
                        return response.Grade;
                    },
                    name: 'Grade',
                    sort: {
                        sortProperty: 'Grade',
                    },
                }),
                new EntityListColumn({
                    accessorFunction: function (response: IStudentParentalConsentDTO): string {
                        return response.Consent ? response.Consent.Name : '';
                    },
                    name: 'Consent Status',
                    sort: {
                        sortProperty: 'ConsentStatus',
                    },
                }),
                new EntityListColumn({
                    accessorFunction: function (response: IStudentParentalConsentDTO): string {
                        return response.TotalBillableClaims.toString();
                    },
                    name: 'Total Billable Encounters',
                    sort: {
                        sortProperty: 'LastName',
                    },
                }),
                new EntityListColumn({
                    accessorFunction: function (response: IStudentParentalConsentDTO): string {
                        return response?.Consent?.Id === ParentalConsentTypesEnum.ConfirmConsent
                                && response.EffectiveDate
                                    ? new DatePipe('en-US').transform(response.EffectiveDate , 'MMM d, y', 'UTC')
                                    : 'N/A';
                    },
                    name: 'Effective Date',
                    sort: {
                        sortProperty: 'EffectiveDate'
                    },
                }),
            ],
        };
        super(listConfig);
    }
}
