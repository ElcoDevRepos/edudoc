import { IEntity } from './base';

import { IAuthClient } from './auth-client';

export interface IAuthApplicationType extends IEntity {
    Name: string;

    // reverse nav
    AuthClients?: IAuthClient[];
}
