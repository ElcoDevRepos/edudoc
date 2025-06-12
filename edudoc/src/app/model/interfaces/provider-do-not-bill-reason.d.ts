import { IEntity } from './base';

import { IProvider } from './provider';
import { IProviderInactivityDate } from './provider-inactivity-date';
import { IRevokeAccess } from './revoke-access';

export interface IProviderDoNotBillReason extends IEntity {
    Name: string;
    Sort: number;

    // reverse nav
    Providers?: IProvider[];
    ProviderInactivityDates?: IProviderInactivityDate[];
    RevokeAccesses?: IRevokeAccess[];
}
