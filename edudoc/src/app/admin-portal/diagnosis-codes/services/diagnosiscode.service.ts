import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { BaseService } from '@mt-ng2/base-service';

import { IDiagnosisCode } from '@model/interfaces/diagnosis-code';
import { SearchParams } from '@mt-ng2/common-classes';
import { Observable } from 'rxjs';

export const emptyDiagnosisCode: IDiagnosisCode = {
    Archived: false,
    Code: null,
    CreatedById: 0,
    Description: null,
    EffectiveDateFrom: null,
    EffectiveDateTo: null,
    Id: 0,
};

@Injectable({ providedIn: 'root' })
export class DiagnosisCodeService extends BaseService<IDiagnosisCode> {
    _page = 1;
    _includeArchived = false;
    _query = '';
    _serviceCodeIds: number[] = [];
    _serviceTypeIds: number[] = [];

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

    setServiceTypes(value: number[]): void {
        this._serviceTypeIds = value;
    }
    getServiceTypes(): number[] {
        return this._serviceTypeIds;
    }

    setServiceCodes(value: number[]): void {
        this._serviceCodeIds = value;
    }
    getServiceCodes(): number[] {
        return this._serviceCodeIds;
    }

    constructor(public http: HttpClient) {
        super('/diagnosiscodes', http);
    }

    getEmptyDiagnosisCode(): IDiagnosisCode {
        return { ...emptyDiagnosisCode };
    }

    search(csp: SearchParams): Observable<HttpResponse<IDiagnosisCode[]>> {
        return this.http.get<IDiagnosisCode[]>(`/diagnosiscodes/search`, { observe: 'response', params: this.getHttpParams(csp) });
    }

    formatTitleText(entity: IDiagnosisCode): void {
        this.setTitle(`Diagnosis Code: ${entity.Description} -- ${entity.Code}`);
    }

}
