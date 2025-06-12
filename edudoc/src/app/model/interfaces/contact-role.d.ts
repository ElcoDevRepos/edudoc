import { IEntity } from './base';

import { IContact } from './contact';

export interface IContactRole extends IEntity {
    Name: string;
    Sort?: number;

    // reverse nav
    Contacts?: IContact[];
}
