import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IClaimAuditRequestDto } from '@model/interfaces/custom/claim-audit-request.dto';
import { IEncounterResponseDto } from '@model/interfaces/custom/encounter-response.dto';
import { IEncounter } from '@model/interfaces/encounter';
import { BaseService } from '@mt-ng2/base-service';
import { SearchParams } from '@mt-ng2/common-classes';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class EncounterService extends BaseService<IEncounter> {
    constructor(public http: HttpClient) {
        super('/encounters', http, ['EncounterDate']);
    }

    getEncounters(csp: SearchParams): Observable<HttpResponse<IEncounterResponseDto[]>> {
        return this.http.get<IEncounterResponseDto[]>(`/encounters/get-encounters`, { observe: 'response', params: this.getHttpParams(csp) });
    }

    updateStatus(request: IClaimAuditRequestDto): Observable<void> {
        return this.http.put<void>('/encounters/update-status', request);
    }

}
