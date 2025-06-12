import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ICptCode } from '@model/interfaces/cpt-code';
import { ISelectOptions } from '@model/interfaces/custom/select-options';
import { BaseService } from '@mt-ng2/base-service';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

export const emptyCptCode: ICptCode = {
    Archived: false,
    BillAmount: 0,
    Code: null,
    CreatedById: 0,
    Description: null,
    Id: 0,
    LpnDefault: false,
    RnDefault: false,
};

@Injectable({ providedIn: 'root' })
export class CptCodeService extends BaseService<ICptCode> {
    _page = 1;
    _includeArchived = false;
    _query = '';

    setPage(value: number): void {
        this._page = value;
    }
    getPage(): number {
        return this._page;
    }

    setIncludeArchived(value: boolean): void {
        this._includeArchived = value;
    }
    getIncludeArchived(): boolean {
        return this._includeArchived;
    }

    setQuery(value: string): void {
        this._query = value;
    }
    getQuery(): string {
        return this._query;
    }

    constructor(public http: HttpClient) {
        super('/cpt-codes', http);
    }

    getEmptyCptCode(): ICptCode {
        return { ...emptyCptCode };
    }

    getSelectOptions(): Observable<ISelectOptions[]> {
        return this.http.get<ISelectOptions[]>(`/cpt-codes/select-options`).pipe(catchError((err, caught) => this.handleError(err as Response, caught)));
    }
}
