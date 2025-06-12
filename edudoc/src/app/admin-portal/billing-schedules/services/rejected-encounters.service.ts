import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IClaimsEncounter } from '@model/interfaces/claims-encounter';

import { BaseService } from '@mt-ng2/base-service';
import { SearchParams } from '@mt-ng2/common-classes';

import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class RejectedEncountersService extends BaseService<IClaimsEncounter> {
    constructor(public http: HttpClient) {
        super('/rejected-encounters', http);
    }

    getRejectedEncounters(csp: SearchParams): Observable<HttpResponse<IClaimsEncounter[]>> {
        return this.http.get<IClaimsEncounter[]>(`/rejected-encounters/get-claims`, { observe: 'response', params: this.getHttpParams(csp) });
    }

    generateRebillingFile(rebillingIds: number[]): Observable<void> {
        return this.http.post<void>(`/rejected-encounters/generate`, rebillingIds);
    }
}
