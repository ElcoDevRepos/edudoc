import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { BaseService } from '@mt-ng2/base-service';

import { IDiagnosisCodeAssociation } from '@model/interfaces/diagnosis-code-association';
import { SearchParams } from '@mt-ng2/common-classes';
import { Observable } from 'rxjs';

export const emptyDiagnosisCodeAssociation: IDiagnosisCodeAssociation = {
    Archived: false,
    CreatedById: 0,
    DiagnosisCodeId: 0,
    Id: 0,
    ServiceCodeId: 0,
    ServiceTypeId: 0,
};

@Injectable({ providedIn: 'root' })
export class DiagnosisCodeAssociationService extends BaseService<IDiagnosisCodeAssociation> {
    constructor(public http: HttpClient) {
        super('/diagnosis-code-associations', http);
    }

    getEmptyDiagnosisCodeAssociation(): IDiagnosisCodeAssociation {
        return { ...emptyDiagnosisCodeAssociation };
    }

    search(csp: SearchParams): Observable<HttpResponse<IDiagnosisCodeAssociation[]>> {
        return this.http.get<IDiagnosisCodeAssociation[]>(`/diagnosis-code-associations/search`, { observe: 'response', params: this.getHttpParams(csp) });
    }

    saveAssociations(diagnosisCodeId: number, associations: IDiagnosisCodeAssociation[]): Observable<number> {
        return this.http.post<number>(`/diagnosis-code-associations/${diagnosisCodeId}`, associations);
    }
}
