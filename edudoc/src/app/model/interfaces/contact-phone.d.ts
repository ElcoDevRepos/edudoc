import { IPhoneType } from './base';

import { IContact } from './contact';

export interface IContactPhone {
    ContactId: number;
    Phone: string;
    Extension: string;
    PhoneTypeId: number;
    IsPrimary: boolean;

    // foreign keys
    Contact?: IContact;
    PhoneType?: IPhoneType;
}
