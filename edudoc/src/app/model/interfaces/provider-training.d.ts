import { IEntity } from './base';

import { IMessageDocument } from './message-document';
import { IMessageLink } from './message-link';
import { IProvider } from './provider';
import { IUser } from './user';

export interface IProviderTraining extends IEntity {
    DocumentId?: number;
    LinkId?: number;
    ProviderId: number;
    Archived: boolean;
    CreatedById: number;
    DateCreated?: Date;
    DueDate?: Date;
    DateCompleted?: Date;
    LastReminder?: Date;

    // foreign keys
    MessageDocument?: IMessageDocument;
    MessageLink?: IMessageLink;
    Provider?: IProvider;
    CreatedBy?: IUser;
}
