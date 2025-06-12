import { IEntity } from './base';

import { IBillingFailure } from './billing-failure';
import { IBillingScheduleAdminNotification } from './billing-schedule-admin-notification';
import { IBillingScheduleDistrict } from './billing-schedule-district';
import { IBillingScheduleExcludedCptCode } from './billing-schedule-excluded-cpt-code';
import { IBillingScheduleExcludedProvider } from './billing-schedule-excluded-provider';
import { IBillingScheduleExcludedServiceCode } from './billing-schedule-excluded-service-code';
import { IHealthCareClaim } from './health-care-claim';
import { IJobsAudit } from './jobs-audit';
import { IUser } from './user';

export interface IBillingSchedule extends IEntity {
    Name: string;
    ScheduledDate: Date;
    IsReversal: boolean;
    IsSchedule: boolean;
    Notes?: string;
    InQueue: boolean;
    Archived: boolean;
    CreatedById: number;
    ModifiedById?: number;
    DateCreated?: Date;
    DateModified?: Date;

    // reverse nav
    BillingFailures?: IBillingFailure[];
    BillingScheduleAdminNotifications?: IBillingScheduleAdminNotification[];
    BillingScheduleDistricts?: IBillingScheduleDistrict[];
    BillingScheduleExcludedCptCodes?: IBillingScheduleExcludedCptCode[];
    BillingScheduleExcludedProviders?: IBillingScheduleExcludedProvider[];
    BillingScheduleExcludedServiceCodes?: IBillingScheduleExcludedServiceCode[];
    HealthCareClaims?: IHealthCareClaim[];
    JobsAudits?: IJobsAudit[];

    // foreign keys
    CreatedBy?: IUser;
    ModifiedBy?: IUser;
}
