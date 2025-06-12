import { IEntity } from './base';

import { IMessage } from './message';
import { IUser } from './user';

export interface IReadMessage extends IEntity {
    MessageId: number;
    ReadById: number;
    DateRead: Date;

    // foreign keys
    Message?: IMessage;
    ReadBy?: IUser;
}
