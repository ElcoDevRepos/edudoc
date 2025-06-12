import { IEntity } from './base';

import { IMessage } from './message';
import { IMessageDocument } from './message-document';
import { IMessageLink } from './message-link';

export interface IMessageFilterType extends IEntity {
    Name: string;

    // reverse nav
    Messages?: IMessage[];
    MessageDocuments?: IMessageDocument[];
    MessageLinks?: IMessageLink[];
}
