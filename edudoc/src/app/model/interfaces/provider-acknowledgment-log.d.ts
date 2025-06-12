import { IEntity } from './base';

import { IProvider } from './provider';

export interface IProviderAcknowledgmentLog extends IEntity {
    ProviderId: number;
    DateAcknowledged: Date;

    // foreign keys
    Provider?: IProvider;
}
