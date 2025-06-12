import { IEntity } from './base';

import { IClaimsStudent } from './claims-student';
import { IEdiErrorCode } from './edi-error-code';
import { IEncounterStudent } from './encounter-student';
import { IEncounterStudentCptCode } from './encounter-student-cpt-code';
import { IHealthCareClaim } from './health-care-claim';

export interface IClaimsEncounter extends IEntity {
    ClaimAmount: string;
    ProcedureIdentifier: string;
    BillingUnits: string;
    ServiceDate: Date;
    PhysicianFirstName?: string;
    PhysicianLastName?: string;
    PhysicianId?: string;
    ReferringProviderFirstName?: string;
    ReferringProviderLastName?: string;
    ReasonForServiceCode: string;
    ReferringProviderId: string;
    IsTelehealth: boolean;
    Rebilled: boolean;
    Response: boolean;
    EdiErrorCodeId?: number;
    ClaimId?: string;
    ClaimsStudentId?: number;
    EncounterStudentId: number;
    AggregateId?: number;
    EncounterStudentCptCodeId: number;
    PaidAmount?: string;
    VoucherDate?: Date;
    ReferenceNumber?: string;
    AdjustmentReasonCode?: string;
    AdjustmentAmount?: string;
    ControlNumberPrefix?: string;
    ReversedClaimId?: number;

    // foreign keys
    ClaimsStudent?: IClaimsStudent;
    EdiErrorCode?: IEdiErrorCode;
    EncounterStudent?: IEncounterStudent;
    AggregateCptCode?: IEncounterStudentCptCode;
    EncounterStudentCptCode?: IEncounterStudentCptCode;
    ReversedClaim?: IHealthCareClaim;
}
