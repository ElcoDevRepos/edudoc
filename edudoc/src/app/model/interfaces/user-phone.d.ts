import { IPhoneType } from './base';

import { IUser } from './user';

export interface IUserPhone {
    UserId: number;
    Phone: string;
    Extension: string;
    PhoneTypeId: number;
    IsPrimary: boolean;

    // foreign keys
    PhoneType?: IPhoneType;
    User?: IUser;
}
