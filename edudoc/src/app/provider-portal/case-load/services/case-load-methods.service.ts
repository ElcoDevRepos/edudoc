import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { ICaseLoadMethod } from '@model/interfaces/case-load-method';
import { IMethod } from '@model/interfaces/method';
import { BaseService } from '@mt-ng2/base-service';
import { sortByProperty } from '@mt-ng2/common-functions';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

export const emptyCaseLoadMethod: ICaseLoadMethod = {
    Archived: false,
    CaseLoadId: 0,
    CreatedById: 0,
    Id: 0,
    MethodId: 0,
};

@Injectable({ providedIn: 'root' })
export class CaseLoadMethodsService extends BaseService<ICaseLoadMethod> {
    constructor(public http: HttpClient) {
        super('/case-load-methods', http);
    }

    getEmptyCaseLoadMethod(): ICaseLoadMethod {
        return { ...emptyCaseLoadMethod };
    }

    saveCaseLoadMethods(caseLoadId: number, caseLoadMethods: ICaseLoadMethod[]): Observable<number> {
        return this.http.post<number>(`/case-load-methods/${caseLoadId}`, caseLoadMethods);
    }

    getMethodOptions(): Observable<IMethod[]> {
        return this.http.get<IMethod[]>('/options/methods').pipe(
            tap((answer) => {
                sortByProperty(answer, 'Name');
            }),
        );
    }
}
