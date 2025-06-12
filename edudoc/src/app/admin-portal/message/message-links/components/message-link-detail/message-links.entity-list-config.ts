import { DatePipe } from '@angular/common';
import { MessageFilterTypeEnums } from '@model/enums/message-filter-types.enum';
import { IMessageLink } from '@model/interfaces/message-link';
import { EntityListColumn, EntityListConfig, EntityListDeleteColumn, IEntityListConfig } from '@mt-ng2/entity-list-module';

export class MessageLinksEntityListConfig extends EntityListConfig {
    constructor() {
        const listConfig: IEntityListConfig = {
            columns: [
                new EntityListColumn({
                    name: 'Description',
                    sort: {
                        disableSort: true,
                    },
                }),
                new EntityListColumn({
                    accessorFunction: function (response: IMessageLink): string {
                        return response.MessageFilterType.Name;
                    },
                    name: 'Type',
                    sort: { disableSort: true },
                }),
                new EntityListColumn({
                    accessorFunction: function (response: IMessageLink): string {
                        return response.MessageFilterTypeId === MessageFilterTypeEnums.Provider ? `${response.Provider.ProviderUser.LastName}, ${response.Provider.ProviderUser.FirstName}` :
                        response.MessageFilterTypeId === MessageFilterTypeEnums.SchoolDistrict ? `${response.SchoolDistrict.Name}` :
                        response.MessageFilterTypeId === MessageFilterTypeEnums.ProviderTitle ? `${response.ProviderTitle.Name}` :
                        'n/a';
                    },
                    name: 'Selection',
                    sort: { disableSort: true },
                }),
                new EntityListColumn({
                    accessorFunction: function (response: IMessageLink): string {
                        return new DatePipe('en-US').transform(response.ValidTill, 'MMM d, y', 'UTC');
                    },
                    name: 'Valid Until',
                    pipes: ['date'],
                    sort: { disableSort: true },
                }),
                new EntityListColumn({
                    accessorFunction: function (response: IMessageLink): string {
                        return response.Mandatory ? 'Yes' : 'No';
                    },
                    name: 'Mandatory',
                    sort: { disableSort: true },
                }),
                new EntityListColumn({
                    accessorFunction: function (response: IMessageLink): string {
                        return new DatePipe('en-US').transform(response.DueDate, 'MMM d, y', 'UTC');
                    },
                    name: 'Due Date',
                    pipes: ['date'],
                    sort: { disableSort: true },
                }),
            ],
            delete: new EntityListDeleteColumn({
                columnHtml: (entity: IMessageLink) =>
                    entity.Archived
                        ? '<div><i class="fa fa-2x fa-trash" aria-hidden="true"></i><i class="fa  fa-undo overlay-fa" data-fa-transform="shrink-8 down-1"></i></div>'
                        : '<div><i class="fa fa-2x fa-trash" aria-hidden="true"></i><i class="fa  fa-undo overlay-fa-invisible" data-fa-transform="shrink-8 down-1"></i></div>',
                confirm: {
                    confirmButtonText: 'Yes, I am sure!',
                    text: 'Are you sure you want to modify this record?',
                    title: 'Modify',
                },
                headerText: '',
            }),
            rowClass: (entity: IMessageLink) => (entity.Archived ? 'archived' : null),
        };
        super(listConfig);
    }
}
