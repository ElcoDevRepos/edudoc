import { IEntity } from './base';

import { IBillingFailure } from './billing-failure';

export interface IBillingFailureReason extends IEntity {
    Name: string;

    // reverse nav
    BillingFailures?: IBillingFailure[];
}
