import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IAddress } from '@model/interfaces/address';
import { BaseService } from '@mt-ng2/base-service';

export const emptyAddress: IAddress = {
    Address1: null,
    Address2: null,
    City: null,
    CountryCode: null,
    County: null,
    Id: 0,
    Province: null,
    StateCode: 'OH',
    Zip: null,
};

@Injectable({
    providedIn: 'root',
})
export class AddressService extends BaseService<IAddress> {
    constructor(public http: HttpClient) {
        super('/addresses', http);
    }

    getEmptyAddress(): IAddress {
        return { ...emptyAddress };
    }
}
