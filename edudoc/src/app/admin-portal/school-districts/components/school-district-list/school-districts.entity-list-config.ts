import { DeleteEntityCellComponent } from '@common/delete-entity-cell-component/delete-entity-cell.component';
import { ISchoolDistrict } from '@model/interfaces/school-district';
import { EntityListColumn, EntityListConfig, IEntityListConfig } from '@mt-ng2/entity-list-module';
import { SchoolDistrictActiveStatusDynamicCellComponent } from './school-district-active-status-cell/school-district-active-status-cell.component';
import { SchoolDistrictDownloadMerDynamicCellComponent } from './school-district-download-mer-cell/school-district-download-mer-cell.component';

export class SchoolDistrictsEntityListConfig extends EntityListConfig {
    constructor() {
        const listConfig: IEntityListConfig = {
            columns: [
                new EntityListColumn({
                    accessors: ['Id'],
                    name: 'Id',
                }),
                new EntityListColumn({
                    accessors: ['Name'],
                    name: 'District Name',
                }),
                new EntityListColumn({
                    accessors: ['Code'],
                    name: 'HPC District Code',
                }),
                new EntityListColumn({
                    accessors: ['RevalidationDate'],
                    name: 'Re-validation Date',
                    pipes: ['date'],
                }),
                new EntityListColumn({
                    accessorFunction: function (district: ISchoolDistrict): string {
                        return district.AccountManager ? `${district.AccountManager.LastName}, ${district.AccountManager.FirstName}` : '';
                    },
                    name: 'HPC Account Manager',
                    sort: {
                        sortProperty: 'AccountManager.Lastname',
                    },
                }),
                new EntityListColumn({
                    accessorFunction: function (district: ISchoolDistrict): string {
                        return district.AccountAssistant ? `${district.AccountAssistant.LastName}, ${district.AccountAssistant.FirstName}` : '';
                    },
                    name: 'HPC Account Assistant',
                    sort: {
                        sortProperty: 'AccountAssistant.Lastname',
                    },
                }),
                new EntityListColumn({
                    accessorFunction: function (district: ISchoolDistrict): string {
                        return district.EscSchoolDistricts ? `${district.EscSchoolDistricts.map((esc) => { return esc.Esc.Name; }).join(',')}` : '';
                    },
                    name: 'ESC Association',
                    sort: {
                        disableSort: true,
                    },
                }),
                new EntityListColumn({
                    accessorFunction: function (district: ISchoolDistrict): string {
                        return district.Treasurer ? `${district.Treasurer.LastName}, ${district.Treasurer.FirstName}` : '';
                    },
                    name: 'Treasurer',
                    sort: {
                        sortProperty: 'Treasurer.Lastname',
                    },
                }),
                new EntityListColumn({
                    accessorFunction: function (district: ISchoolDistrict): string {
                        return district.SpecialEducationDirector ? `${district.SpecialEducationDirector.LastName}, ${district.SpecialEducationDirector.FirstName}` : '';
                    },
                    name: 'Special Education Director',
                    sort: {
                        sortProperty: 'SpecialEducationDirector.Lastname',
                    },
                }),
                new EntityListColumn({
                    accessorFunction: function (district: ISchoolDistrict): string {
                        return district.SchoolDistrictRosterDocuments.length ?
                            `${district.SchoolDistrictRosterDocuments[district.SchoolDistrictRosterDocuments.length - 1].DateUpload.toString()}` : '';
                    },
                    name: 'Date of Last Roster Upload',
                    pipes: ['date'],
                    sort: {
                        disableSort: true,
                    },
                }),
                new EntityListColumn({
                    accessors: ['NotesRequiredDate'],
                    name: 'Requires Notes',
                    pipes: ['date'],
                }),
                new EntityListColumn({
                    accessors: ['ProgressReportsSent'],
                    name: 'Progress Reports Sent',
                    pipes: ['date'],
                }),
                new EntityListColumn({
                    columnClass: 'referral-cell',
                    component: SchoolDistrictActiveStatusDynamicCellComponent,
                    excludeFromExport: true,
                    fireOnColumnSelected: false,
                    name: 'Active Status',
                    sort: {
                        disableSort: true,
                    },
                }),
                new EntityListColumn({
                    columnClass: 'referral-cell',
                    component: SchoolDistrictDownloadMerDynamicCellComponent,
                    excludeFromExport: true,
                    fireOnColumnSelected: false,
                    name: 'MER Uploads',
                    sort: {
                        disableSort: true,
                    },
                }),
                new EntityListColumn({
                    component: DeleteEntityCellComponent,
                    name: 'Archive',
                    sort: { disableSort: true },
                    style: { width: 50 },
                }),
            ],
            rowClass: (entity: ISchoolDistrict) => (entity.Archived ? 'archived' : null),
        };
        super(listConfig);
    }
}
