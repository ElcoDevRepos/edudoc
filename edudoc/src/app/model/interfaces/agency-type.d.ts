import { IEntity } from './base';

import { IProviderEscAssignment } from './provider-esc-assignment';

export interface IAgencyType extends IEntity {
    Name: string;

    // reverse nav
    ProviderEscAssignments?: IProviderEscAssignment[];
}
