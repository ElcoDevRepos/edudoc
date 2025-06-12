import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IAgency } from '@model/interfaces/agency';
import { MetaItemService } from '@mt-ng2/base-service';

@Injectable({ providedIn: 'root' })
export class ProviderAgencyService extends MetaItemService<IAgency> {
    constructor(public http: HttpClient) {
        super('ProviderAgencyService', 'Provider Agency', 'ProviderAgencyIds', '/providerAgencies', http);
    }
}
