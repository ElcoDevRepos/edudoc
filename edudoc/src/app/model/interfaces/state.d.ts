import { IAddress } from './address';

export interface IState {
    StateCode: string;
    Name: string;

    // reverse nav
    Addresses?: IAddress[];
}
