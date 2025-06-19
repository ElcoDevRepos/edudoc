import { IEntity } from './base';

import { IActivitySummaryProvider } from './activity-summary-provider';
import { IBillingScheduleExcludedProvider } from './billing-schedule-excluded-provider';
import { IEncounter } from './encounter';
import { IMessage } from './message';
import { IMessageDocument } from './message-document';
import { IMessageLink } from './message-link';
import { IMigrationProviderCaseNotesHistory } from './migration-provider-case-notes-history';
import { IPendingReferral } from './pending-referral';
import { IProviderAcknowledgmentLog } from './provider-acknowledgment-log';
import { IProviderCaseUpload } from './provider-case-upload';
import { IProviderEscAssignment } from './provider-esc-assignment';
import { IProviderInactivityDate } from './provider-inactivity-date';
import { IProviderLicens } from './provider-licens';
import { IProviderOdeCertification } from './provider-ode-certification';
import { IProviderStudent } from './provider-student';
import { IProviderStudentHistory } from './provider-student-history';
import { IProviderStudentSupervisor } from './provider-student-supervisor';
import { IProviderTraining } from './provider-training';
import { IRevokeAccess } from './revoke-access';
import { IStudentTherapy } from './student-therapy';
import { ISupervisorProviderStudentReferalSignOff } from './supervisor-provider-student-referal-sign-off';
import { ITherapyCaseNote } from './therapy-case-note';
import { ITherapyGroup } from './therapy-group';
import { IProviderDoNotBillReason } from './provider-do-not-bill-reason';
import { IProviderEmploymentType } from './provider-employment-type';
import { IProviderTitle } from './provider-title';
import { IUser } from './user';

export interface IProvider extends IEntity {
    Name: string;
    ProviderUserId: number;
    TitleId: number;
    VerifiedOrp: boolean;
    OrpApprovalRequestDate?: Date;
    OrpApprovalDate?: Date;
    OrpDenialDate?: Date;
    Npi?: string;
    Phone?: string;
    ProviderEmploymentTypeId: number;
    Notes?: string;
    DocumentationDate?: Date;
    CreatedById: number;
    ModifiedById?: number;
    DateCreated?: Date;
    DateModified?: Date;
    Archived: boolean;
    BlockedReason?: string;
    DoNotBillReasonId?: number;

    // reverse nav
    ActivitySummaryProviders?: IActivitySummaryProvider[];
    BillingScheduleExcludedProviders?: IBillingScheduleExcludedProvider[];
    Encounters?: IEncounter[];
    Messages?: IMessage[];
    MessageDocuments?: IMessageDocument[];
    MessageLinks?: IMessageLink[];
    MigrationProviderCaseNotesHistories?: IMigrationProviderCaseNotesHistory[];
    PendingReferrals?: IPendingReferral[];
    ProviderAcknowledgmentLogs?: IProviderAcknowledgmentLog[];
    ProviderCaseUploads?: IProviderCaseUpload[];
    ProviderEscAssignments?: IProviderEscAssignment[];
    ProviderInactivityDates?: IProviderInactivityDate[];
    ProviderLicens?: IProviderLicens[];
    ProviderOdeCertifications?: IProviderOdeCertification[];
    ProviderStudents?: IProviderStudent[];
    ProviderStudentHistories?: IProviderStudentHistory[];
    ProviderStudentSupervisors_AssistantId?: IProviderStudentSupervisor[];
    ProviderStudentSupervisors_SupervisorId?: IProviderStudentSupervisor[];
    ProviderTrainings?: IProviderTraining[];
    RevokeAccesses?: IRevokeAccess[];
    StudentTherapies?: IStudentTherapy[];
    SupervisorProviderStudentReferalSignOffs?: ISupervisorProviderStudentReferalSignOff[];
    TherapyCaseNotes?: ITherapyCaseNote[];
    TherapyGroups?: ITherapyGroup[];

    // foreign keys
    DoNotBillReason?: IProviderDoNotBillReason;
    ProviderEmploymentType?: IProviderEmploymentType;
    ProviderTitle?: IProviderTitle;
    CreatedBy?: IUser;
    ModifiedBy?: IUser;
    ProviderUser?: IUser;
}
