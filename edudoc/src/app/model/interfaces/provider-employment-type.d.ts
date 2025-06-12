import { IEntity } from './base';

import { IProvider } from './provider';

export interface IProviderEmploymentType extends IEntity {
    Name: string;

    // reverse nav
    Providers?: IProvider[];
}
