import { IEntity } from './base';

import { IProvider } from './provider';
import { IProviderDoNotBillReason } from './provider-do-not-bill-reason';

export interface IRevokeAccess extends IEntity {
    ProviderId: number;
    Date: Date;
    RevocationReasonId?: number;
    OtherReason?: string;
    AccessGranted?: boolean;

    // foreign keys
    Provider?: IProvider;
    ProviderDoNotBillReason?: IProviderDoNotBillReason;
}
