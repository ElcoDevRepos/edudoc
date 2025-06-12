import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UserTypesEnum } from '@model/enums/user-types.enum';
import { IUserRole } from '@model/interfaces/user-role';
import { IUserRoleClaim } from '@model/interfaces/user-role-claim';
import { BaseService } from '@mt-ng2/base-service';
import { ExtraSearchParams, SearchParams } from '@mt-ng2/common-classes';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class UserRoleService extends BaseService<IUserRole> {

    private emptyUserRole: IUserRole = {
        Archived: false,
        Description: null,
        Id: 0,
        IsEditable: true,
        Name: null,
        UserTypeId: 1,
    };

    constructor(public http: HttpClient) {
        super('/userRoles', http);
    }

    getEmptyUserRole(): IUserRole {
        return { ...this.emptyUserRole };
    }

    deleteRole(roleId: number): Observable<IUserRole> {
        return this.http.delete<IUserRole>(`/userRoles/delete/${roleId}`);
    }

    getRolesWithClaims(): Observable<IUserRole[]> {
        return this.http.get<IUserRole[]>('/userRoles/withClaims');
    }

    saveUserRole(role: IUserRole): Observable<IUserRole> {
        if (role.Id > 0) {
            return this.http.put<IUserRole>('/userRoles/update', role);
        } else {
            return this.http.post<IUserRole>('/userRoles/create', role);
        }
    }

    // convenience method that calls search with user type in params
    // returns an Observable with the response body containing the list of roles
    getRolesOfType(roleType: UserTypesEnum): Observable<HttpResponse<IUserRole[]>> {
        const searchParams: SearchParams = {
            extraParams: [
                new ExtraSearchParams({
                    name: 'typeids',
                    value: roleType.toString(),
                }),
            ],
            query: '*',
            skip: 0,
            take: 9999,
        };
        const params = this.getHttpParams(searchParams);
        return this.http.get<IUserRole[]>('/userRoles/_search', { observe: 'response', params: params });
    }

    updateClaims(roleId: number, claims: IUserRoleClaim[]): Observable<void> {
        return this.http.put<void>(`/userRoles/${roleId}/updateClaims`, claims);
    }

    updateUserRoles(): Observable<number> {
        return this.http.get<number>('/userRoles/update-all-roles');
    }
}
