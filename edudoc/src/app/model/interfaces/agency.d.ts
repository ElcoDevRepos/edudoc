import { IEntity } from './base';

import { IProviderEscAssignment } from './provider-esc-assignment';

export interface IAgency extends IEntity {
    Name: string;

    // reverse nav
    ProviderEscAssignments?: IProviderEscAssignment[];
}
