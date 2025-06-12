import { DeleteEntityCellComponent } from '@common/delete-entity-cell-component/delete-entity-cell.component';
import { IProviderTraining } from '@model/interfaces/provider-training';
import { EntityListColumn, EntityListConfig, IEntityListConfig } from '@mt-ng2/entity-list-module';
import { ProviderTrainingReminderDynamicCellComponent } from './training-reminder-cell/training-reminder-cell.component';

export class ProviderTrainingsEntityListConfig extends EntityListConfig {
    constructor() {
        const listConfig: IEntityListConfig = {
            columns: [
                new EntityListColumn({
                    accessors: ['DueDate'],
                    name: 'Due Date',
                    pipes: ['date'],
                }),
                new EntityListColumn({
                    accessorFunction: function (response: IProviderTraining): string {
                        return response.DateCompleted != null ?
                        `${new Date(response.DateCompleted).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric'})}` :
                        'Incomplete';
                    },
                    name: 'Completed Date',
                    sort: { disableSort: true },
                }),
                new EntityListColumn({
                    accessorFunction: function (response: IProviderTraining): string {
                        return response.MessageDocument != null ?
                        'Document' :
                        'Link';
                    },
                    name: 'Training Type',
                    sort: { disableSort: true },
                }),
                new EntityListColumn({
                    accessorFunction: function (response: IProviderTraining): string {
                        return response.MessageDocument != null ?
                        response.MessageDocument.Description :
                        response.MessageLink.Description;
                    },
                    name: 'Description',
                    sort: { disableSort: true },
                }),
                new EntityListColumn({
                    accessorFunction: function (providerTraining: IProviderTraining): string {
                        return `${providerTraining.Provider.ProviderUser.LastName}, ${providerTraining.Provider.ProviderUser.FirstName}`;
                    },
                    name: 'Provider',
                    sort: {
                        sortProperty: 'Provider.ProviderUser.LastName',
                    },
                }),
                new EntityListColumn({
                    accessorFunction: function (response: IProviderTraining): string {
                        return response.MessageDocument != null ?
                        response.MessageDocument.MessageFilterType.Name :
                        response.MessageLink.MessageFilterType.Name;
                    },
                    name: 'Recipients',
                    sort: { disableSort: true },
                }),
                new EntityListColumn({
                    accessors: ['LastReminder'],
                    name: 'Last Reminder Date',
                    pipes: ['date'],
                }),
                new EntityListColumn({
                    columnClass: 'training-reminder-cell',
                    component: ProviderTrainingReminderDynamicCellComponent,
                    excludeFromExport: true,
                    fireOnColumnSelected: false,
                    name: 'Send Reminder',
                    sort: {
                        disableSort: true,
                    },
                }),
                new EntityListColumn({
                    component: DeleteEntityCellComponent,
                    excludeFromExport: true,
                    name: 'Remove',
                    sort: { disableSort: true },
                    style: { width: 50 },
                }),
            ],
        };
        super(listConfig);
    }
}
