import { IEntity } from './base';

import { IContact } from './contact';

export interface IContactStatus extends IEntity {
    Name: string;
    Sort: number;

    // reverse nav
    Contacts?: IContact[];
}
