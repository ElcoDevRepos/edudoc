import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { IContact } from '@model/interfaces/contact';
import { ISelectOptions } from '@model/interfaces/custom/select-options';
import { IEsc } from '@model/interfaces/esc';
import { BaseService } from '@mt-ng2/base-service';
import { SearchParams } from '@mt-ng2/common-classes';
import { IAddress, IAddressContainer } from '@mt-ng2/dynamic-form';
import { catchError } from 'rxjs/operators';

export const emptyEsc: IEsc = {
    Archived: false,
    Code: null,
    CreatedById: 0,
    Id: 0,
    Name: null,
    Notes: null,
};

@Injectable({ providedIn: 'root' })
export class EscService extends BaseService<IEsc> {
    constructor(public http: HttpClient) {
        super('/escs', http);
    }

    getEmptyEsc(): IEsc {
        return { ...emptyEsc };
    }

    getSelectOptions(): Observable<ISelectOptions[]> {
        return this.http.get<ISelectOptions[]>(`/escs/select-options`).pipe(catchError((err, caught) => this.handleError(err as Response, caught)));
    }

    getProviderSelectOptions(providerId: number): Observable<ISelectOptions[]> {
        return this.http.get<ISelectOptions[]>(`/escs/select-options/${providerId}`).pipe(catchError((err, caught) => this.handleError(err as Response, caught)));
    }

    // BEGIN IHasAddresses section
    getAddresses(escId: number, searchparameters: SearchParams): Observable<HttpResponse<IAddressContainer[]>> {
        const params = this.getHttpParams(searchparameters);
        return this.http
            .get<IAddressContainer[]>(`/escs/${escId}/addresses/_search`, { observe: 'response', params: params })
            .pipe(catchError((err, caught) => this.handleError(err as Response, caught)));
    }

    saveAddress(escId: number, address: IAddress): Observable<number> {
        if (!address.Id) {
            address.Id = 0;
            return this.http.post<number>(`/escs/${escId}/address`, address);
        } else {
            return this.http.put<number>(`/escs/${escId}/address`, address);
        }
    }

    deleteAddress(escId: number): Observable<void> {
        return this.http.delete<void>(`/escs/${escId}/address`, {
            responseType: 'text' as 'json',
        });
    }

    getContacts(escId: number): Observable<IContact[]> {
        return this.http.get<IContact[]>(`/escs/contacts/${escId}`);
    }
}
