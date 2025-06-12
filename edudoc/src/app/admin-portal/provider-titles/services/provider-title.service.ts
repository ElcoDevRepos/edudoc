import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { ISelectOptions } from '@model/interfaces/custom/select-options';
import { IProviderTitle } from '@model/interfaces/provider-title';
import { BaseService } from '@mt-ng2/base-service';
import { sortByProperty } from '@mt-ng2/common-functions';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

export const emptyProviderTitle: IProviderTitle = {
    Archived: false,
    Code: null,
    CreatedById: 0,
    Id: 0,
    Name: null,
    ProviderTitles: [],
    ServiceCodeId: 0,
    SupervisorTitleId: null,
};

@Injectable({ providedIn: 'root' })
export class ProviderTitleService extends BaseService<IProviderTitle> {
    private _providertitles: IProviderTitle[];

    constructor(public http: HttpClient) {
        super('/providertitles', http);
    }

    getEmptyProviderTitle(): IProviderTitle {
        return { ...emptyProviderTitle };
    }

    getAllForMessages(): Observable<IProviderTitle[]> {
        if (!this._providertitles) {
            return this.http.get<IProviderTitle[]>(`/providertitles/message-options`).pipe(
                tap((answer) => {
                    sortByProperty(answer, 'Name');
                    this._providertitles = answer;
                }),
            );
        } else {
            return of(this._providertitles);
        }
    }

    getSelectOptions(): Observable<ISelectOptions[]> {
        return this.http.get<ISelectOptions[]>(`/providertitles/select-options`).pipe(catchError((err, caught) => this.handleError(err as Response, caught)));
    }

    getSelectOptionsByServiceCodeIds(serviceCodeIds): Observable<ISelectOptions[]> {
        return this.http.post<ISelectOptions[]>(`/providertitles/select-options`, serviceCodeIds).pipe(catchError((err, caught) => this.handleError(err as Response, caught)));
    }
}
