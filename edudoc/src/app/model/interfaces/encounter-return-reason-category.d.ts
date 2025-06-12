import { IEntity } from './base';

import { IEncounterReasonForReturn } from './encounter-reason-for-return';

export interface IEncounterReturnReasonCategory extends IEntity {
    Name: string;

    // reverse nav
    EncounterReasonForReturns?: IEncounterReasonForReturn[];
}
