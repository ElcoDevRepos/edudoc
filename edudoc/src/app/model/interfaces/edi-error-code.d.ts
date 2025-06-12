import { IEntity } from './base';

import { IClaimsEncounter } from './claims-encounter';
import { IUnmatchedClaimRespons } from './unmatched-claim-respons';
import { IEdiFileType } from './edi-file-type';
import { IUser } from './user';

export interface IEdiErrorCode extends IEntity {
    ErrorCode: string;
    Name: string;
    EdiFileTypeId: number;
    Archived: boolean;
    CreatedById: number;
    ModifiedById?: number;
    DateCreated?: Date;
    DateModified?: Date;

    // reverse nav
    ClaimsEncounters?: IClaimsEncounter[];
    UnmatchedClaimRespons?: IUnmatchedClaimRespons[];

    // foreign keys
    EdiFileType?: IEdiFileType;
    CreatedBy?: IUser;
    ModifiedBy?: IUser;
}
