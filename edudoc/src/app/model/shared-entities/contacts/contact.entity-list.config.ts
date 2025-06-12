import { EntityListColumn, EntityListConfig, EntityListDeleteColumn, IEntityListConfig } from '@mt-ng2/entity-list-module';

import { ContactStatusEnums } from '../../enums/contact-status.enums';
import { IContact } from '../../interfaces/contact';

export class ContactListConfig extends EntityListConfig {
    constructor() {
        const listConfig: IEntityListConfig = {
            columns: [
                new EntityListColumn({
                    accessorFunction: function (contact: IContact): string {
                        return `${contact.FirstName} ${contact.LastName}`;
                    },
                    name: 'Name',
                    sort: {
                        sortProperty: 'LastName',
                    },
                }),
                new EntityListColumn({
                    name: 'Title',
                }),
                new EntityListColumn({
                    accessors: ['ContactRole', 'Name'],
                    name: 'Role',
                }),
                new EntityListColumn({
                    linkFunction: function (contact: IContact): void {
                        window.open(`mailto:${contact.Email}`);
                    },
                    name: 'Email',
                }),
                new EntityListColumn({
                    accessors: ['ContactPhones'],
                    name: 'Phone',
                    pipes: ['primary', 'phone'],
                }),
                new EntityListColumn({
                    accessors: [],
                    name: 'Address',
                    pipes: ['address'],
                    sort: {
                        disableSort: true,
                    },
                }),
                new EntityListColumn({
                    accessors: ['ContactStatus', 'Name'],
                    name: 'Status',
                }),
                // new EntityListColumn({
                //     component: DeleteEntityCellComponent,
                //     name: 'Archive',
                //     sort: { disableSort: true },
                //     style: { width: 50 },
                // }),
            ],
            delete: new EntityListDeleteColumn({
                columnHtml: (entity: IContact) =>
                    entity.StatusId === ContactStatusEnums.INACTIVE
                        ? '<div><i class="fa  fa-undo overlay-fa" data-fa-transform="shrink-8 down-1"></i></div>'
                        : '<div><i class="fa fa-2x fa-trash" aria-hidden="true"></i><i class="fa  fa-undo overlay-fa-invisible" data-fa-transform="shrink-8 down-1"></i></div>',
                confirm: {
                    confirmButtonText: 'Yes, I am sure!',
                    text: 'Are you sure you want to modify this record?',
                    title: 'Modify',
                },
                headerText: '',
            }),
            rowClass: (entity: IContact) => (entity.StatusId === ContactStatusEnums.INACTIVE ? 'archived' : null),
        };
        super(listConfig);
    }
}
