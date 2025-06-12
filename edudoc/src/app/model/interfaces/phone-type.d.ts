import { IEntity } from './base';

import { IContactPhone } from './contact-phone';
import { IUserPhone } from './user-phone';

export interface IPhoneType extends IEntity {
    Name: string;

    // reverse nav
    ContactPhones?: IContactPhone[];
    UserPhones?: IUserPhone[];
}
