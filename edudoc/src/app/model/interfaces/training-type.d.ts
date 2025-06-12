import { IEntity } from './base';

import { IMessageDocument } from './message-document';
import { IMessageLink } from './message-link';

export interface ITrainingType extends IEntity {
    Name: string;

    // reverse nav
    MessageDocuments?: IMessageDocument[];
    MessageLinks?: IMessageLink[];
}
