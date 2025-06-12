import { IEntity } from './base';

import { IBillingScheduleExcludedCptCode } from './billing-schedule-excluded-cpt-code';
import { ICaseLoadCptCode } from './case-load-cpt-code';
import { ICptCodeAssocation } from './cpt-code-assocation';
import { IEncounterStudentCptCode } from './encounter-student-cpt-code';
import { IServiceUnitRule } from './service-unit-rule';
import { IUser } from './user';

export interface ICptCode extends IEntity {
    Code: string;
    Description: string;
    BillAmount: number;
    ServiceUnitRuleId?: number;
    RnDefault: boolean;
    LpnDefault: boolean;
    Notes?: string;
    Archived: boolean;
    CreatedById: number;
    ModifiedById?: number;
    DateCreated?: Date;
    DateModified?: Date;

    // reverse nav
    BillingScheduleExcludedCptCodes?: IBillingScheduleExcludedCptCode[];
    CaseLoadCptCodes?: ICaseLoadCptCode[];
    CptCodeAssocations?: ICptCodeAssocation[];
    EncounterStudentCptCodes?: IEncounterStudentCptCode[];
    ServiceUnitRules?: IServiceUnitRule[];

    // foreign keys
    ServiceUnitRule?: IServiceUnitRule;
    CreatedBy?: IUser;
    ModifiedBy?: IUser;
}
