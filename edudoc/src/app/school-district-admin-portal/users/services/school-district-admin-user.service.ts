import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IAddress } from '@model/interfaces/address';

import { IPhone } from '@model/interfaces/base';
import { IUpdateUserPicResult } from '@model/interfaces/custom/update-user-pic-result.dto';
import { IUserDetailCustomOptions } from '@model/interfaces/custom/user-detail-custom-options';
import { IUser } from '@model/interfaces/user';
import { AuthService } from '@mt-ng2/auth-module';
import { BaseService } from '@mt-ng2/base-service';

import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SchoolDistrictAdminUserService extends BaseService<IUser> {
    constructor(public http: HttpClient, private authService: AuthService) {
        super('/users', http);
    }

    getAdminDistrictId(): number {
        const customOptions = this.authService.currentUser.getValue().CustomOptions as IUserDetailCustomOptions;
        return customOptions.UserAssociationId;
    }

    saveAddress(userId: number, address: IAddress): Observable<number> {
        if (!address.Id) {
            address.Id = 0;
            return this.http.post<number>(`/users/${userId}/address`, address);
        } else {
            return this.http.put<number>(`/users/${userId}/address`, address);
        }
    }

    deleteAddress(userId: number): Observable<unknown> {
        return this.http.delete(`/users/${userId}/address`, {
            responseType: 'text' as 'json',
        });
    }

    savePhones(userId: number, phones: IPhone): Observable<number> {
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
}
