import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { APIService } from '@common/api-service';
import { SearchParams } from '@mt-ng2/common-classes';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuditsService extends APIService {
    constructor(public http: HttpClient) {
        super('/audits', http);
    }

    getAudit(csp: SearchParams): Observable<Blob> {
        return this.http.get(`/encounters/get-encounters`, { responseType: 'blob' as const, params: this.getHttpParams(csp) });
    }

}
