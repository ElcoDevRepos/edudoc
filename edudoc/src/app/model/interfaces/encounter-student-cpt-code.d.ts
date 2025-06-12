import { IEntity } from './base';

import { IClaimsEncounter } from './claims-encounter';
import { ICptCode } from './cpt-code';
import { IEncounterStudent } from './encounter-student';
import { IUser } from './user';

export interface IEncounterStudentCptCode extends IEntity {
    EncounterStudentId: number;
    CptCodeId: number;
    Minutes?: number;
    Archived: boolean;
    CreatedById: number;
    ModifiedById?: number;
    DateCreated?: Date;
    DateModified?: Date;

    // reverse nav
    ClaimsEncounters_AggregateId?: IClaimsEncounter[];
    ClaimsEncounters_EncounterStudentCptCodeId?: IClaimsEncounter[];

    // foreign keys
    CptCode?: ICptCode;
    EncounterStudent?: IEncounterStudent;
    CreatedBy?: IUser;
    ModifiedBy?: IUser;
}
