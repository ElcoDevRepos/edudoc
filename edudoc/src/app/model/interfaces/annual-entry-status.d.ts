import { IEntity } from './base';

import { IAnnualEntry } from './annual-entry';

export interface IAnnualEntryStatus extends IEntity {
    Name: string;

    // reverse nav
    AnnualEntries?: IAnnualEntry[];
}
