import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IProviderLicens } from '@model/interfaces/provider-licens';
import { BaseService } from '@mt-ng2/base-service';
import { Observable } from 'rxjs';

const emptyLicense: IProviderLicens = {
    AsOfDate: null,
    CreatedById: 0,
    ExpirationDate: null,
    Id: 0,
    License: null,
    ProviderId: null,
};

@Injectable({ providedIn: 'root' })
export class ProviderLicenseService extends BaseService<IProviderLicens> {
    constructor(public http: HttpClient) {
        super('/providerLicenses', http);
    }

    getEmptyLicense(): IProviderLicens {
        return { ...emptyLicense };
    }

    getProviderLicenses(providerId: number): Observable<IProviderLicens[]> {
        return this.http.get<IProviderLicens[]>(`/providerLicenses/provider/${providerId}`);
    }
}
