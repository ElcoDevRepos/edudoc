import { IEntity } from './base';

import { IEncounter } from './encounter';

export interface INonMspService extends IEntity {
    Name: string;

    // reverse nav
    Encounters?: IEncounter[];
}
