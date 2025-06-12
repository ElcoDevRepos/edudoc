import { IEntity } from './base';


export interface IClearedAuthToken extends IEntity {
    IdentifierKey: number[];
    Salt: number[];
    AuthUserId: number;
    AuthClientId: number;
    IssuedUtc: Date;
    ExpiresUtc: Date;
    Token: string;
    ClearedDate: Date;
}
