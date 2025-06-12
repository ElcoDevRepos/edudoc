import { IEntity } from './base';


export interface IProviderInactivityReason extends IEntity {
    Name: string;
    Code?: string;
}
