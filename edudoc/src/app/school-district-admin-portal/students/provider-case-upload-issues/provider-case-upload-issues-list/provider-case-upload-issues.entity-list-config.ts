import { DatePipe } from '@angular/common';
import { DeleteEntityCellComponent } from '@common/delete-entity-cell-component/delete-entity-cell.component';
import { IProviderCaseUpload } from '@model/interfaces/provider-case-upload';
import { EntityListColumn, EntityListConfig, IEntityListConfig } from '@mt-ng2/entity-list-module';
import { Observable } from 'rxjs';

export class ProviderCaseUploadsEntityListConfig extends EntityListConfig {
    constructor(getDataForExport: () => Observable<IProviderCaseUpload[]>) {
        const listConfig: IEntityListConfig = {
            columns: [
                new EntityListColumn({
                    accessors: ['FirstName'],
                    name: 'First Name',
                }),
                new EntityListColumn({
                    accessors: ['MiddleName'],
                    name: 'Middle Name',
                }),
                new EntityListColumn({
                    accessors: ['LastName'],
                    name: 'Last Name',
                }),
                new EntityListColumn({
                    accessorFunction: function (roster: IProviderCaseUpload): string {
                        let date = roster.DateOfBirth;
                        try {
                            date = new DatePipe('en-US').transform(roster.DateOfBirth, 'MM/dd/yyyy');
                        } catch (e) {
                            // do nothing
                        }
                        return date;
                    },
                    name: 'Date Of Birth',
                    sort: { disableSort: true },
                }),
                new EntityListColumn({
                    accessors: ['School'],
                    name: 'School Building',
                }),
                new EntityListColumn({
                    accessorFunction: (data: IProviderCaseUpload) => {
                        return data.Provider?.ProviderUser ?
                            `${data.Provider.ProviderUser.FirstName} ${data.Provider.ProviderUser.LastName}` : '';
                    },
                    name: 'Provider Name',
                    sort: {
                        sortProperty: 'Provider.ProviderUser.LastName,Provider.ProviderUser.FirstName'
                    }
                }),
                new EntityListColumn({
                    accessorFunction: (data: IProviderCaseUpload) => {
                        return data.Provider?.ProviderTitle ? `${data.Provider.ProviderTitle.Name}` : '';
                    },
                    name: 'Provider Title',
                    sort: {
                        sortProperty: 'Provider.ProviderTitle.Name'
                    }
                }),
                new EntityListColumn({
                    accessorFunction: (roster: IProviderCaseUpload) => (roster.HasDataIssues ? 'Yes' : ''),
                    name: 'Data Issue(s)',
                    sort: {
                        sortProperty: 'HasDataIssues'
                    },
                    style: { width: 50 },
                }),
                new EntityListColumn({
                    component: DeleteEntityCellComponent,
                    name: 'Ignore',
                    sort: { disableSort: true },
                    style: { width: 50 },
                }),
            ],
            rowClass: (entity: IProviderCaseUpload) => (entity.Archived ? 'archived' : null),
            export: {
                exportName: 'provider_case_upload_issues',
                getDataForExport: getDataForExport
            }
        };
        super(listConfig);
    }
}
