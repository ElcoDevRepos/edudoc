import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { IUser } from '@model/interfaces/user';
import { IAuditLogUserService, IAuditLogUser } from '@mt-ng2/audit-logging-module';

@Injectable()
export class AuditLogUserService implements IAuditLogUserService {
    constructor(public http: HttpClient) {}

    getUsers(): Observable<IAuditLogUser[]> {
        return this.http.get<IUser[]>('/api/v1/users').pipe(
            map((users: IUser[]) => {
                return users.map((user: IUser) => {
                    return {
                        AuthUserId: user.AuthUserId,
                        Id: user.Id,
                        Name: `${user.FirstName} ${user.LastName}`,
                    };
                });
            }),
        );
    }
}
