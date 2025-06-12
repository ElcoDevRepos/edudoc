import { IEntity } from './base';

import { IPendingReferralReportJobRun } from './pending-referral-report-job-run';
import { IProvider } from './provider';
import { ISchoolDistrict } from './school-district';
import { IServiceType } from './service-type';
import { IStudent } from './student';

export interface IPendingReferral extends IEntity {
    StudentId: number;
    StudentFirstName: string;
    StudentLastName: string;
    DistrictId: number;
    DistrictCode: string;
    ProviderId: number;
    ProviderFirstName: string;
    ProviderLastName: string;
    ProviderTitle: string;
    ServiceTypeId: number;
    ServiceName: string;
    PendingReferralJobRunId: number;

    // foreign keys
    PendingReferralJobRun?: IPendingReferralReportJobRun;
    Provider?: IProvider;
    SchoolDistrict?: ISchoolDistrict;
    ServiceType?: IServiceType;
    Student?: IStudent;
}
