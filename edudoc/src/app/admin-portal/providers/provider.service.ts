import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, Subject } from 'rxjs';

import { ISelectOptions } from '@model/interfaces/custom/select-options';
import { IProvider } from '@model/interfaces/provider';
import { IProviderAcknowledgmentLog } from '@model/interfaces/provider-acknowledgment-log';
import { BaseService } from '@mt-ng2/base-service';
import { IEntitySearchParams, SearchParams } from '@mt-ng2/common-classes';
import { sortByProperty,  } from '@mt-ng2/common-functions';
import { catchError, tap } from 'rxjs/operators';
import { IProviderDTO } from './libraries/dtos/provider.dto';
import { IProviderAccessChangeRequest } from './libraries/dtos/revoke-access.dto';
import { ISchoolDistrictProviderCaseNote } from '@model/interfaces/school-district-provider-case-note';

export const emptyProvider: IProvider = {
    Archived: null,
    CreatedById: 0,
    Id: 0,
    Notes: null,
    Npi: null,
    Phone: null,
    ProviderEmploymentTypeId: 0,
    ProviderUserId: 0,
    TitleId: 0,
    VerifiedOrp: false,
};

@Injectable({ providedIn: 'root' })
export class ProviderService extends BaseService<IProvider> {
    providerUpdated: Observable<number>;
    private providerUpdatedSubject: Subject<number>;

    private _providers: IProvider[];

    // store filter values
    savedSearchEntity: IEntitySearchParams;
    savedSchoolDistrictName: string;

    constructor(public http: HttpClient) {
        super('/providers', http);
        this.providerUpdatedSubject = new Subject();
        this.providerUpdated = this.providerUpdatedSubject.asObservable();
    }

    getEmptyProvider(): IProvider {
        return { ...emptyProvider };
    }

    searchProviders(csp: SearchParams): Observable<HttpResponse<IProvider[]>> {
        return this.http.get<IProvider[]>(`/providers/searchProviders`, { observe: 'response', params: this.getHttpParams(csp) });
    }

    getAllForMessages(): Observable<IProvider[]> {
        if (!this._providers) {
            return this.http.get<IProvider[]>(`/providers/message-options`).pipe(
                tap((answer) => {
                    answer.sort((a,b) => `${a.ProviderUser.LastName} ${a.ProviderUser.FirstName}`.localeCompare(`${b.ProviderUser.LastName} ${b.ProviderUser.FirstName}`));
                    this._providers = answer;
                }),
            );
        } else {
            return of(this._providers);
        }
    }

    createProvider(payload: IProviderDTO): Observable<number> {
        return this.http.post<number>('/providers/create', payload);
    }

    updateProvider(payload: IProviderDTO): Observable<number> {
        return this.http.put<number>('/providers/update', payload).pipe(tap((id) => this.providerUpdatedSubject.next(id)));
    }

    changeProviderBlockedStatus(accessDTO: IProviderAccessChangeRequest, revokeAccess: boolean): Observable<number> {
        return this.http.put<number>(`/providers/changeBlocked/${revokeAccess ? 1 : 0}`, accessDTO);
    }

    getAcknowledgmentLogs(providerId: number): Observable<IProviderAcknowledgmentLog[]> {
        return this.http.get<IProviderAcknowledgmentLog[]>(`/providers/${providerId}/acknowledgments`);
    }

    getSelectOptions(): Observable<ISelectOptions[]> {
        return this.http.get<ISelectOptions[]>(`/providers/select-options`).pipe(catchError((err, caught) => this.handleError(err as Response, caught)));
    }

    selectOptionsSearch(csp: SearchParams): Observable<ISelectOptions[]> {
        return this.http.post<ISelectOptions[]>(`/providers/select-options/search`, { observe: 'response', params: this.getHttpParams(csp) }).pipe(catchError((err, caught) => this.handleError(err as Response, caught)));
    }

    getSelectOptionsByEscIds(escIds): Observable<ISelectOptions[]> {
        return this.http.post<ISelectOptions[]>(`/providers/select-options/by-escs`, escIds).pipe(catchError((err, caught) => this.handleError(err as Response, caught)));
    }

    getSelectOptionsByDistrictId(districtId: number, csp?: SearchParams): Observable<ISelectOptions[]> {
        return this.http.get<ISelectOptions[]>(`/providers/select-options/by-district/${districtId}`, csp ? { params: this.getHttpParams(csp) } : {}).pipe(catchError((err, caught) => this.handleError(err as Response, caught)));
    }

    setSearchEntity(search: IEntitySearchParams): void {
        this.savedSearchEntity = search;
    }

    setSelectedSchoolDistrictName(district: string): void {
        this.savedSchoolDistrictName = district;
    }

    getLastDocumentationDate(providerId: number): Observable<Date> {
        return this.http.get<Date>(`/providers/last-documentation-date/${providerId}`);
    }

    getProviderCaseNotesRequired(providerId: number): Observable<ISchoolDistrictProviderCaseNote[]> {
        return this.http.get<ISchoolDistrictProviderCaseNote[]>(`/providers/case-notes-required/${providerId}`);
    }
}
