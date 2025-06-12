import { IEntity } from './base';

import { IServiceUnitRule } from './service-unit-rule';
import { IUser } from './user';

export interface IServiceUnitTimeSegment extends IEntity {
    UnitDefinition: number;
    StartMinutes: number;
    EndMinutes?: number;
    IsCrossover: boolean;
    ServiceUnitRuleId?: number;
    CreatedById?: number;
    ModifiedById?: number;
    DateCreated?: Date;
    DateModified?: Date;
    Archived: boolean;

    // foreign keys
    ServiceUnitRule?: IServiceUnitRule;
    CreatedBy?: IUser;
    ModifiedBy?: IUser;
}
