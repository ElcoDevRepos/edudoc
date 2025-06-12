import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IProvider } from '@model/interfaces/provider';
import { IUser } from '@model/interfaces/user';
import { IUserPhone } from '@model/interfaces/user-phone';
import { BaseService } from '@mt-ng2/base-service';
import { IAddress } from '@mt-ng2/dynamic-form';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ProviderUserService extends BaseService<IUser> {
    constructor(public http: HttpClient) {
        super('/users', http);
    }

    saveAddress(userId: number, address: IAddress): Observable<number> {
        if (!address.Id) {
            address.Id = 0;
            return this.http.post<number>(`/users/${userId}/address`, address);
        } else {
            return this.http.put<number>(`/users/${userId}/address`, address);
        }
    }

    deleteAddress(userId: number): Observable<object> {
        return this.http.delete(`/users/${userId}/address`, {
            responseType: 'text' as 'json',
        });
    }

    savePhones(userId: number, phones: IUserPhone[]): Observable<number> {
        return this.http.put<number>(`/users/${userId}/phones`, phones);
    }

    savePhoto(userId: number, photo: File): Observable<object> {
        const formData: FormData = new FormData();
        formData.append('file', photo, photo.name);

        return this.http.post(`/users/${userId}/pic`, formData);
    }

    deletePhoto(userId: number): Observable<object> {
        return this.http.delete(`/users/${userId}/pic`);
    }

    getProviderById(providerId: number): Observable<IProvider> {
        return this.http.get<IProvider>(`/provider-profile/${providerId}`);
    }

    providerApprovalRequest(providerId: number): Observable<number> {
        return this.http.put<number>(`/provider-profile/request-medicaid-approval`, providerId);
    }

    updateProviderBasicInfo(provider: IProvider): Observable<object> {
        return this.http.put<object>('/provider-profile/update-basic-info', provider);
    }
}
