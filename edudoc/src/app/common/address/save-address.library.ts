import { IAddress } from '@model/interfaces/address';

export function removeUnusedAddressParams(address: IAddress): IAddress {
    // if (address.Id && Object.prototype.hasOwnProperty.call(address.Id, 'AddressId')) {
    //     address.Id = address.Id.AddressId;
    // }
    // if (address.AddressId) {
    //     delete address.AddressId;
    // }
    return address;
}
