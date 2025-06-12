import { DatePipe } from '@angular/common';
import { MessageFilterTypeEnums } from '@model/enums/message-filter-types.enum';
import { IMessage } from '@model/interfaces/message';
import { EntityListColumn, EntityListConfig, EntityListDeleteColumn, IEntityListConfig } from '@mt-ng2/entity-list-module';

export class MessagesEntityListConfig extends EntityListConfig {
    constructor() {
        const listConfig: IEntityListConfig = {
            columns: [

                new EntityListColumn({
                    accessorFunction: function (response: IMessage): string {
                        return response.ForDistrictAdmins ?
                                            `<div>${ response.Description}</div>
                                            <div><i>(District Admins)</i></div>` : response.Description;
                    },
                    bindToInnerHtml: true,
                    name: 'Description',
                    sort: {
                        disableSort: true,
                    },
                }),
                new EntityListColumn({
                    accessorFunction: function (response: IMessage): string {
                        return response.MessageFilterType.Name;
                    },
                    name: 'Type',
                    sort: { disableSort: true },
                }),
                new EntityListColumn({
                    accessorFunction: function (response: IMessage): string {
                        return response.MessageFilterTypeId === MessageFilterTypeEnums.Provider ? `${response.Provider.ProviderUser.LastName}, ${response.Provider.ProviderUser.FirstName}` :
                        response.MessageFilterTypeId === MessageFilterTypeEnums.SchoolDistrict ? `${response.SchoolDistrict.Name}` :
                        response.MessageFilterTypeId === MessageFilterTypeEnums.ProviderTitle ? `${response.ProviderTitle.Name}` :
                        'n/a';
                    },
                    name: 'Selection',
                    sort: { disableSort: true },
                }),
                new EntityListColumn({
                    accessorFunction: function (response: IMessage): string {
                        return new DatePipe('en-US').transform(response.ValidTill, 'MMM d, y', 'UTC');
                    },
                    name: 'Valid Until',
                    pipes: ['date'],
                    sort: { disableSort: true },
                }),
            ],
            delete: new EntityListDeleteColumn({
                columnHtml: (entity: IMessage) =>
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
            rowClass: (entity: IMessage) => (entity.Archived ? 'archived' : null),
        };
        super(listConfig);
    }
}
