import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

import { ICreateUserPayload } from '@model/interfaces/custom/create-user-payload';
import { IUpdateUserPicResult } from '@model/interfaces/custom/update-user-pic-result.dto';
import { IUserDetailCustomOptions } from '@model/interfaces/custom/user-detail-custom-options';
import { IProvider } from '@model/interfaces/provider';
import { IUser } from '@model/interfaces/user';
import { AuthService, ILoggedIn, ILoginResponse } from '@mt-ng2/auth-module';
import { BaseService } from '@mt-ng2/base-service';
import { IAddress } from '@mt-ng2/dynamic-form';
import { IPhoneCollection } from '@mt-ng2/entity-components-phones';
import { EnvironmentService } from '@mt-ng2/environment-module';
import { catchError, mergeMap, tap } from 'rxjs/operators';
import { UserTypesEnum } from '@model/enums/user-types.enum';
import { ISelectOptions } from '@model/interfaces/custom/select-options';

@Injectable({ providedIn: 'root' })
export class UserService extends BaseService<IUser> {
    private emptyUser: IUser = {
        Archived: false,
        AuthUserId: 0,
        Email: null,
        FirstName: null,
        Id: 0,
        LastName: null,
        Version: null,
    };

    constructor(public http: HttpClient, private environmentService: EnvironmentService, private authService: AuthService) {
        super('/users', http);
    }

    getAdminDistrictId(): number {
        const customOptions = this.authService.currentUser.getValue().CustomOptions as IUserDetailCustomOptions;
        return customOptions.UserAssociationId;
    }

    getEmptyUser(): IUser {
        return { ...this.emptyUser };
    }

    createUser(data: ICreateUserPayload): Observable<number> {
        return this.http.post<number>(`/users/create`, data);
    }

    saveAddress(userId: number, address: IAddress): Observable<number> {
        if (!address.Id) {
            address.Id = 0;
            return this.http.post<number>(`/users/${userId}/address`, address);
        } else {
            return this.http.put<number>(`/users/${userId}/address`, address);
        }
    }

    deleteAddress(userId: number): Observable<void> {
        return this.http.delete<void>(`/users/${userId}/address`, {
            responseType: 'text' as 'json',
        });
    }

    savePhones(userId: number, phones: IPhoneCollection): Observable<number> {
        return this.http.put<number>(`/users/${userId}/phones`, phones);
    }

    savePhoto(userId: number, photo: File): Observable<IUpdateUserPicResult> {
        const formData: FormData = new FormData();
        formData.append('file', photo, photo.name);

        return this.http.post<IUpdateUserPicResult>(`/users/${userId}/pic`, formData);
    }

    deletePhoto(userId: number): Observable<void> {
        return this.http.delete<void>(`/users/${userId}/pic`);
    }

    GetProvider(userId: number): Observable<IProvider> {
        return this.http.get<IProvider>(`/users/${userId}/provider`);
    }

    impersonate(userId: number): Observable<ILoginResponse> {
        const data = {
            AuthClientID: this.environmentService.config.authClientId,
            AuthClientSecret: this.environmentService.config.authSecretVariable,
            ImpersonateeUserId: userId,
            ImpersonatingUserId: this.authService.currentUser.getValue().Id,
        };
        return this.http.post<ILoginResponse>('/users/impersonate', data).pipe(
            tap((response) => {
                this.authService.saveToken(response, false);
            }),
        );
    }

    unImpersonate(): Observable<ILoginResponse> {
        return this.authService.getLoginTokenFromCookie().pipe(
            mergeMap((currentToken) => {
                const data = {
                    AuthClientID: this.environmentService.config.authClientId,
                    AuthClientSecret: this.environmentService.config.authSecretVariable,
                    AuthUserId: currentToken.authUserId,
                    TokenIdentifier: currentToken.refreshId,
                };
                return this.http
                    .post<ILoginResponse>('/users/unimpersonate', data)
                    .pipe(tap((response) => this.authService.saveToken(response, false)));
            }),
        );
    }

    getUsersByUserRoleId(roleId: number): Observable<IUser[]> {
        return this.http.get<IUser[]>(`/users/${roleId}/role`);
    }

    getDistrictsByUserId(userId: number): Observable<number[]> {
        return this.http.get<number[]>(`/users/${userId}/districts`);
    }

    getAllAdmins(): Observable<IUser[]> {
        return this.http.get<IUser[]>(`/users/all-admins`).pipe(catchError((err, caught) => this.handleError(err as Response, caught)));
    }

    showImpersonateButton(user: ILoggedIn): boolean {
        const customOption = user.CustomOptions as IUserDetailCustomOptions;
        return customOption.UserTypeId === UserTypesEnum.Admin;
    }

    updateDistrictAdminDistrict(userId: number, newDistrictId: number): Observable<void> {
        return this.http.put<void>(`/users/${userId}/update-district`, { newDistrictId });
    }

    updateDistrictAssignments(districtAssignments: { districtAdminId: number, districtId: number }[]): Observable<void> {
        return this.http.post<void>(`/users/update-district-assignments`, districtAssignments);
    }

}
