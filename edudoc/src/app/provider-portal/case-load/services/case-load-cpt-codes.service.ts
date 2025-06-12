import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { BaseService } from '@mt-ng2/base-service';

import { ICaseLoadCptCode } from '@model/interfaces/case-load-cpt-code';
import { ICptCode } from '@model/interfaces/cpt-code';
import { sortByProperty } from '@mt-ng2/common-functions';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

export const emptyCaseLoadCptCode: ICaseLoadCptCode = {
    Archived: false,
    CaseLoadId: 0,
    CptCodeId: 0,
    CreatedById: 0,
    Default: false,
    Id: 0,
};

@Injectable({ providedIn: 'root' })
export class CaseLoadCptCodesService extends BaseService<ICaseLoadCptCode> {
    constructor(public http: HttpClient) {
        super('/case-load-cpt-codes', http);
    }

    getEmptyCaseLoadCptCode(): ICaseLoadCptCode {
        return { ...emptyCaseLoadCptCode };
    }

    saveCaseLoadCptCodes(caseLoadId: number, caseLoadCptCodes: ICaseLoadCptCode[]): Observable<number> {
        return this.http.post<number>(`/case-load-cpt-codes/${caseLoadId}`, caseLoadCptCodes);
    }

    getCptCodeOptions(): Observable<ICptCode[]> {
        return this.http.get<ICptCode[]>('/case-load-cpt-codes/cptCodeOptions').pipe(
            tap((answer) => {
                sortByProperty(answer, 'Code');
            }),
        );
    }
}
