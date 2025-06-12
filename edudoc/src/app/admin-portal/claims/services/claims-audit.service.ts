import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IClaimAuditRequestDto } from '@model/interfaces/custom/claim-audit-request.dto';
import { IClaimAuditResponseDto } from '@model/interfaces/custom/claim-audit-response.dto';
import { IEncounter } from '@model/interfaces/encounter';
import { BaseService } from '@mt-ng2/base-service';
import { SearchParams } from '@mt-ng2/common-classes';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ClaimsAuditService extends BaseService<IEncounter> {
    constructor(public http: HttpClient) {
        super('/audit-claims', http);
    }

    getClaimsForAudit(csp: SearchParams): Observable<HttpResponse<IClaimAuditResponseDto[]>> {
        return this.http.get<IClaimAuditResponseDto[]>(`/audit-claims/get-claims`, { observe: 'response', params: this.getHttpParams(csp) });
    }

    updateStatus(request: IClaimAuditRequestDto): Observable<void> {
        return this.http.put<void>('/audit-claims/update-status', request);
    }
}
