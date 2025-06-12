import { IEntity } from './base';

import { IActivitySummaryServiceArea } from './activity-summary-service-area';
import { IBillingScheduleExcludedServiceCode } from './billing-schedule-excluded-service-code';
import { ICaseLoad } from './case-load';
import { ICptCodeAssocation } from './cpt-code-assocation';
import { IDiagnosisCodeAssociation } from './diagnosis-code-association';
import { IGoal } from './goal';
import { IMessage } from './message';
import { IMessageDocument } from './message-document';
import { IMessageLink } from './message-link';
import { IProviderTitle } from './provider-title';
import { ISupervisorProviderStudentReferalSignOff } from './supervisor-provider-student-referal-sign-off';

export interface IServiceCode extends IEntity {
    Name: string;
    Code: string;
    Area?: string;
    IsBillable: boolean;
    NeedsReferral: boolean;
    CanHaveMultipleProgressReportsPerStudent: boolean;
    CanCosignProgressReports: boolean;

    // reverse nav
    ActivitySummaryServiceAreas?: IActivitySummaryServiceArea[];
    BillingScheduleExcludedServiceCodes?: IBillingScheduleExcludedServiceCode[];
    CaseLoads?: ICaseLoad[];
    CptCodeAssocations?: ICptCodeAssocation[];
    DiagnosisCodeAssociations?: IDiagnosisCodeAssociation[];
    Goals?: IGoal[];
    Messages?: IMessage[];
    MessageDocuments?: IMessageDocument[];
    MessageLinks?: IMessageLink[];
    ProviderTitles?: IProviderTitle[];
    SupervisorProviderStudentReferalSignOffs?: ISupervisorProviderStudentReferalSignOff[];
}
