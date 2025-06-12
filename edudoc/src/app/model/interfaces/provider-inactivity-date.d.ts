import { IEntity } from './base';

import { IProvider } from './provider';
import { IProviderDoNotBillReason } from './provider-do-not-bill-reason';

export interface IProviderInactivityDate extends IEntity {
    ProviderId: number;
    ProviderInactivityStartDate: Date;
    ProviderInactivityEndDate?: Date;
    ProviderDoNotBillReasonId: number;
    Archived: boolean;

    // foreign keys
    Provider?: IProvider;
    ProviderDoNotBillReason?: IProviderDoNotBillReason;
}
