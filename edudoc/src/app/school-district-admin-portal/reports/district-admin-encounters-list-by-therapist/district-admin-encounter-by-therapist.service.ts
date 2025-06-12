import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IEncounter } from '@model/interfaces/encounter';
import { BaseService } from '@mt-ng2/base-service';
import { SearchParams } from '@mt-ng2/common-classes';
import { Observable } from 'rxjs';

@Injectable({providedIn: 'root'})
export class DistrictAdminEncounterByTherapistService extends BaseService<IEncounter> {
    constructor(public http: HttpClient) {
        super('/district-admin-encounters-by-therapist', http);
    }

    getEncounters(districtId: number, csp: SearchParams): Observable<HttpResponse<IEncounter[]>> {
        return this.http.get<IEncounter[]>(`/district-admin-encounters-by-therapist/get-encounters/${districtId}`,
            { observe: 'response', params: this.getHttpParams(csp) });
    }
}
