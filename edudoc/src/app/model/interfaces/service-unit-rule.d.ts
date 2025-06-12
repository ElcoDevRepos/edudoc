import { IEntity } from './base';

import { ICptCode } from './cpt-code';
import { IServiceUnitTimeSegment } from './service-unit-time-segment';
import { IUser } from './user';

export interface IServiceUnitRule extends IEntity {
    Name: string;
    Description: string;
    CptCodeId?: number;
    EffectiveDate?: Date;
    HasReplacement: boolean;
    CreatedById?: number;
    ModifiedById?: number;
    DateCreated?: Date;
    DateModified?: Date;
    Archived: boolean;

    // reverse nav
    CptCodes?: ICptCode[];
    ServiceUnitTimeSegments?: IServiceUnitTimeSegment[];

    // foreign keys
    CptCode?: ICptCode;
    CreatedBy?: IUser;
    ModifiedBy?: IUser;
}
