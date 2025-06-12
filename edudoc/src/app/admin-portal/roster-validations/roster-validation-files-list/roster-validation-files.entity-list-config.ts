import { EntityListColumn, EntityListConfig, EntityListDeleteColumn, IEntityListConfig } from '@mt-ng2/entity-list-module';
import { ResponseUploadCellDynamicCellComponent } from './response-upload-cell/response-upload-cell.component';

export class RosterValidationFilesEntityListConfig extends EntityListConfig {
    constructor() {
        const listConfig: IEntityListConfig = {
            columns: [
                new EntityListColumn({
                    accessors: ['DateCreated'],
                    name: 'Date Created',
                    pipes: ['date'],
                }),
                new EntityListColumn({
                    name: 'Name',
                }),
                new EntityListColumn({
                    accessors: ['Id'],
                    name: 'Control Number'
                }),
                new EntityListColumn({
                    columnClass: 'response-upload-cell',
                    component: ResponseUploadCellDynamicCellComponent,
                    excludeFromExport: true,
                    fireOnColumnSelected: false,
                    name: 'Response',
                    sort: {
                        disableSort: true,
                    },
                }),
            ],
            // Did this to give a visual cue to the user that they can click to download.
            delete: new EntityListDeleteColumn({
                columnHtml: '<i class="fa fa-2x fa-fw fa-download"></i>',
                confirm: false,
                headerText: 'Download',
            }),
        };
        super(listConfig);
    }
}
