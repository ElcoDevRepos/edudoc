import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IUserRole } from '@model/interfaces/user-role';
import { SearchParams } from '@mt-ng2/common-classes';
import { Observable } from 'rxjs';

@Injectable()
export class AuthEntityService {
    constructor(public http: HttpClient) {}

    getAllRoles(): Observable<HttpResponse<IUserRole[]>> {
        const searchParams: SearchParams = {
            extraParams: null,
            query: '*',
            skip: 0,
            take: 9999,
        };
        const params = this.getHttpParams(searchParams);
        return this.http.get<IUserRole[]>('/userRoles/_search', { observe: 'response', params: params });
    }

    changeAccess(authUserId: number, hasAccess: boolean): Observable<void> {
        return this.http.put<void>(`/authUsers/${authUserId}/hasAccess/${hasAccess.toString()}`, {});
    }

    updatePortalAccess(authUserId: number, username: string): Observable<object | number[]> {
        return this.http.put<object | number[]>(`/authUsers/${authUserId}/portalAccess`, { Username: username });
    }

    savePassword(authUserId: number, password: string, oldPassword: string, confirmPassword: string): Observable<void> {
        return this.http.put<void>(`/authUsers/updatePassword`, {
            AuthUserId: authUserId,
            Confirmation: confirmPassword,
            OldPassword: oldPassword,
            Password: password,
        });
    }

    isProviderAcknowledgmentUpdated(userId: number): Observable<boolean> {
        return this.http.get<boolean>(`/providers/${userId}/acknowledgment-status`);
    }

    protected getHttpParams(searchparameters: SearchParams): HttpParams {
        let params = new HttpParams();
        if (searchparameters.query) {
            params = params.append('query', searchparameters.query);
        }
        if (searchparameters.skip) {
            params = params.append('skip', searchparameters.skip.toString());
        }
        if (searchparameters.take) {
            params = params.append('take', searchparameters.take.toString());
        }
        if (searchparameters.order) {
            params = params.append('order', searchparameters.order.toString());
        }
        if (searchparameters.orderDirection) {
            params = params.append('orderDirection', searchparameters.orderDirection.toString());
        }
        if (searchparameters.extraParams && searchparameters.extraParams.length > 0) {
            let extraparams = new HttpParams();
            searchparameters.extraParams.forEach((param) => {
                if (param.valueArray) {
                    if (param.valueArray.length > 0) {
                        extraparams = extraparams.append(param.name, param.valueArray.toString());
                    }
                } else {
                    if (param.value.length > 0) {
                        extraparams = extraparams.set(param.name, param.value);
                    }
                }
            });
            if (extraparams.keys().length > 0) {
                params = params.append('extraparams', extraparams.toString());
            }
        }
        return params;
    }
}
