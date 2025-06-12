import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { IEncounterStudentMethod } from '@model/interfaces/encounter-student-method';
import { IMethod } from '@model/interfaces/method';
import { BaseService } from '@mt-ng2/base-service';
import { sortByProperty } from '@mt-ng2/common-functions';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';

export const emptyEncounterStudentMethod: IEncounterStudentMethod = {
    Archived: false,
    CreatedById: 0,
    EncounterStudentId: 0,
    Id: 0,
    MethodId: 0,
};

@Injectable({ providedIn: 'root' })
export class EncounterStudentMethodsService extends BaseService<IEncounterStudentMethod> {
    private _methods: IMethod[];

    constructor(public http: HttpClient) {
        super('/encounter-student-methods', http);
    }

    getEmptyEncounterStudentMethod(): IEncounterStudentMethod {
        return { ...emptyEncounterStudentMethod };
    }

    saveEncounterStudentMethods(encounterId: number, encounterStudentMethods: IEncounterStudentMethod[]): Observable<number> {
        return this.http.post<number>(`/encounter-student-methods/${encounterId}`, encounterStudentMethods);
    }

    getMethodOptions(): Observable<IMethod[]> {
        if (!this._methods) {
            return this.http.get<IMethod[]>('/options/methods').pipe(
                tap((answer) => {
                    sortByProperty(answer, 'Name');
                    this._methods = answer;
                }),
            );
        } else {
            return of(this._methods);
        }
    }
}
