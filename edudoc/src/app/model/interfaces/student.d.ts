import { IEntity } from './base';

import { ICaseLoad } from './case-load';
import { IClaimsStudent } from './claims-student';
import { IEncounterStudent } from './encounter-student';
import { IIepService } from './iep-service';
import { IMergedStudent } from './merged-student';
import { IMigrationProviderCaseNotesHistory } from './migration-provider-case-notes-history';
import { IPendingReferral } from './pending-referral';
import { IProgressReport } from './progress-report';
import { IProviderCaseUpload } from './provider-case-upload';
import { IProviderStudent } from './provider-student';
import { IProviderStudentHistory } from './provider-student-history';
import { IProviderStudentSupervisor } from './provider-student-supervisor';
import { IRosterValidationStudent } from './roster-validation-student';
import { ISchoolDistrictRoster } from './school-district-roster';
import { IStudentDisabilityCode } from './student-disability-code';
import { IStudentDistrictWithdrawal } from './student-district-withdrawal';
import { IStudentParentalConsent } from './student-parental-consent';
import { ISupervisorProviderStudentReferalSignOff } from './supervisor-provider-student-referal-sign-off';
import { IAddress } from './address';
import { IEsc } from './esc';
import { ISchool } from './school';
import { ISchoolDistrict } from './school-district';
import { IUser } from './user';

export interface IStudent extends IEntity {
    FirstName: string;
    MiddleName?: string;
    LastName: string;
    StudentCode?: string;
    MedicaidNo?: string;
    Grade: string;
    DateOfBirth: Date;
    Notes?: string;
    AddressId?: number;
    SchoolId: number;
    DistrictId?: number;
    EnrollmentDate?: Date;
    EscId?: number;
    CreatedById: number;
    ModifiedById?: number;
    DateCreated?: Date;
    DateModified?: Date;
    Archived: boolean;

    // reverse nav
    CaseLoads?: ICaseLoad[];
    ClaimsStudents?: IClaimsStudent[];
    EncounterStudents?: IEncounterStudent[];
    IepServices?: IIepService[];
    MergedStudents?: IMergedStudent[];
    MigrationProviderCaseNotesHistories?: IMigrationProviderCaseNotesHistory[];
    PendingReferrals?: IPendingReferral[];
    ProgressReports?: IProgressReport[];
    ProviderCaseUploads?: IProviderCaseUpload[];
    ProviderStudents?: IProviderStudent[];
    ProviderStudentHistories?: IProviderStudentHistory[];
    ProviderStudentSupervisors?: IProviderStudentSupervisor[];
    RosterValidationStudents?: IRosterValidationStudent[];
    SchoolDistrictRosters?: ISchoolDistrictRoster[];
    StudentDisabilityCodes?: IStudentDisabilityCode[];
    StudentDistrictWithdrawals?: IStudentDistrictWithdrawal[];
    StudentParentalConsents?: IStudentParentalConsent[];
    SupervisorProviderStudentReferalSignOffs?: ISupervisorProviderStudentReferalSignOff[];

    // foreign keys
    Address?: IAddress;
    Esc?: IEsc;
    School?: ISchool;
    SchoolDistrict?: ISchoolDistrict;
    CreatedBy?: IUser;
    ModifiedBy?: IUser;
}
