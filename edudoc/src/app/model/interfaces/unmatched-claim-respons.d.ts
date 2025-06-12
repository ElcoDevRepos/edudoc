import { IEntity } from './base';

import { IBillingResponseFile } from './billing-response-file';
import { IEdiErrorCode } from './edi-error-code';
import { ISchoolDistrict } from './school-district';
import { IUnmatchedClaimDistrict } from './unmatched-claim-district';

export interface IUnmatchedClaimRespons extends IEntity {
    ProcedureIdentifier: string;
    ClaimAmount: string;
    PaidAmount?: string;
    ServiceDate: Date;
    PatientFirstName?: string;
    PatientLastName?: string;
    PatientId: string;
    EdiErrorCodeId?: number;
    DistrictId?: number;
    UnmatchedDistrictId?: number;
    ResponseFileId: number;
    ClaimId?: string;
    VoucherDate?: Date;
    ReferenceNumber?: string;
    AdjustmentReasonCode?: string;
    AdjustmentAmount?: string;

    // foreign keys
    ResponseFile?: IBillingResponseFile;
    EdiErrorCode?: IEdiErrorCode;
    District?: ISchoolDistrict;
    UnmatchedDistrict?: IUnmatchedClaimDistrict;
}
