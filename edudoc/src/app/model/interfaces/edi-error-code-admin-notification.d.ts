import { IEntity } from './base';

import { IUser } from './user';

export interface IEdiErrorCodeAdminNotification extends IEntity {
    AdminId: number;
    Archived: boolean;

    // foreign keys
    User?: IUser;
}
