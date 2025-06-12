import { DatePipe } from '@angular/common';
import { EntityListColumn, EntityListConfig, IEntityListConfig } from '@mt-ng2/entity-list-module';
import { IProviderCaseUploadEntity } from './provider-case-upload-documents.component';

export class CaseUploadPreviewEntityListConfig extends EntityListConfig {
    constructor() {
        const listConfig: IEntityListConfig = {
            columns: [
                new EntityListColumn({
                    accessorFunction: (row: IProviderCaseUploadEntity) => {
                        return `${row.CaseUpload.ProviderName}`;
                    },
                    name: 'Provider Name',
                    sort: { disableSort: true },
                }),
                new EntityListColumn({
                    accessorFunction: (row: IProviderCaseUploadEntity) => {
                        return `${row.CaseUpload.ProviderTitle}`;
                    },
                    name: 'Title',
                    sort: { disableSort: true },
                }),
                new EntityListColumn({
                    accessorFunction: (row: IProviderCaseUploadEntity) => row.CaseUpload.FirstName,
                    name: 'Student Fname',
                    sort: { disableSort: true },
                }),
                new EntityListColumn({
                    accessorFunction: (row: IProviderCaseUploadEntity) => row.CaseUpload.MiddleName,
                    name: 'Student Mname',
                    sort: { disableSort: true },
                }),
                new EntityListColumn({
                    accessorFunction: (row: IProviderCaseUploadEntity) => row.CaseUpload.LastName,
                    name: 'Student Lname',
                    sort: { disableSort: true },
                }),
                new EntityListColumn({
                    accessorFunction: (row: IProviderCaseUploadEntity) => {
                        let date = row.CaseUpload.DateOfBirth;
                        try {
                            date = new DatePipe('en-US').transform(row.CaseUpload.DateOfBirth, 'MM/dd/yyyy');
                        } catch (e) {
                            // do nothing
                        }
                        return date;
                    },
                    name: 'Student DOB',
                    sort: { disableSort: true },
                }),
                new EntityListColumn({
                    accessorFunction: (row: IProviderCaseUploadEntity) => row.CaseUpload.School,
                    name: 'School',
                    sort: { disableSort: true },
                }),
                new EntityListColumn({
                    accessorFunction: (row: IProviderCaseUploadEntity) => row.CaseUpload.Grade,
                    name: 'Grade',
                    sort: { disableSort: true },
                }),
                
            ],
        };
        super(listConfig);
    }
}
