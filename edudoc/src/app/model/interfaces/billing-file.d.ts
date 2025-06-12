import { IEntity } from './base';

import { IHealthCareClaim } from './health-care-claim';
import { IUser } from './user';

export interface IBillingFile extends IEntity {
    Name: string;
    DateCreated: Date;
    FilePath: string;
    ClaimsCount?: number;
    PageNumber: number;
    CreatedById?: number;
    HealthCareClaimId: number;

    // foreign keys
    HealthCareClaim?: IHealthCareClaim;
    User?: IUser;
}
