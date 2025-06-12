import { HttpClient, HttpResponse } from '@angular/common/http';
import { ExtraSearchParams, SearchParams } from '@mt-ng2/common-classes';
import { IAddressContainer } from '@mt-ng2/dynamic-form';
import { SharedEntitiesService } from '@mt-ng2/shared-entities-module';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ContactStatusEnums } from '../../enums/contact-status.enums';
import { IContact } from '../../interfaces/contact';
export const emptyContact: IContact = {
    Archived: false,
    Email: null,
    FirstName: '',
    Id: 0,
    LastName: '',
    RoleId: null,
    StatusId: 1,
    Title: '',
};

export class ContactService extends SharedEntitiesService<IContact> {
    constructor(public baseEntityUrl: string, public http: HttpClient) {
        super(baseEntityUrl, '/contacts', http);
    }

    getEntities(parentId: number, searchparameters: SearchParams): Observable<HttpResponse<IContact[]>> {
        // Default to active statuses if other parameters are not provided
        if (
            !searchparameters.extraParams ||
            searchparameters.extraParams === undefined ||
            (searchparameters.extraParams && !searchparameters.extraParams.length)
        ) {
            const _extraSearchParams: ExtraSearchParams[] = [{ name: 'statusIds', valueArray: [ContactStatusEnums.ACTIVE] }];
            searchparameters.extraParams = _extraSearchParams;
        }
        return super.getEntities(parentId, searchparameters);
    }

    savePhones(baseEntityId: number, contactId: number, phoneCollection: any): Observable<void> {
        return this.http
            .put<void>(`${this.baseEntityUrl}/${baseEntityId}/contacts/${contactId}/phones`, phoneCollection, { responseType: 'text' as 'json' })
            .pipe(catchError((err) => this.handleError(err as Response)));
    }

    saveAddress(baseEntityId: number, contactId: number, address: IAddressContainer): Observable<void> {
        if (address.AddressId > 0) {
            return this.http.put<void>(`${this.baseEntityUrl}/${baseEntityId}/contacts/${contactId}/address`, address);
        } else {
            return this.http.post<void>(`${this.baseEntityUrl}/${baseEntityId}/contacts/${contactId}/address`, address);
        }
    }

    deleteAddress(baseEntityId: number, contactId: number, address: IAddressContainer): Observable<void> {
        return this.http.delete<void>(`${this.baseEntityUrl}/${baseEntityId}/contacts/${contactId}/address/${address.AddressId}`);
    }
}
