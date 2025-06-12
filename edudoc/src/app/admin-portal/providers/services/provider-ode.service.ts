import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IProviderOdeCertification } from '@model/interfaces/provider-ode-certification';
import { BaseService } from '@mt-ng2/base-service';
import { Observable } from 'rxjs';

const emptyLicense: IProviderOdeCertification = {
    AsOfDate: null,
    CertificationNumber: '',
    CreatedById: 0,
    ExpirationDate: null,
    Id: 0,
    ProviderId: null,
};

@Injectable({ providedIn: 'root' })
export class ProviderOdeService extends BaseService<IProviderOdeCertification> {
    constructor(public http: HttpClient) {
        super('/providerOdes', http);
    }

    getEmptyOde(): IProviderOdeCertification {
        return { ...emptyLicense };
    }

    getProviderOdes(providerId: number): Observable<IProviderOdeCertification[]> {
        return this.http.get<IProviderOdeCertification[]>(`/providerOdes/provider/${providerId}`);
    }
}
