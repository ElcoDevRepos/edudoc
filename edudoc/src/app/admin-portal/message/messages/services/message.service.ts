import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { BaseService } from '@mt-ng2/base-service';

import { IMessageDto } from '@model/interfaces/custom/message.dto';
import { IMessage } from '@model/interfaces/message';
import { SearchParams } from '@mt-ng2/common-classes';
import { MtSearchFilterItem } from '@mt-ng2/search-filter-select-control';
import { BehaviorSubject, Observable } from 'rxjs';

export const emptyMessage: IMessage = {
    Archived: false,
    Body: null,
    CreatedById: 0,
    DateCreated: new Date(),
    Description: null,
    EscId: null,
    ForDistrictAdmins: false,
    Id: 0,
    MessageFilterTypeId: 0,
    ProviderId: null,
    ProviderTitleId: null,
    SchoolDistrictId: null,
    ServiceCodeId: null,
    ValidTill: null,
};

export const emptySelectOption: MtSearchFilterItem = new MtSearchFilterItem({
    Id: null,
    Name: `None`,
}, true);

@Injectable({ providedIn: 'root' })
export class MessageService extends BaseService<IMessage> {
    Message: BehaviorSubject<IMessage> = new BehaviorSubject<IMessage>(this.getEmptyMessage());

    setMessage(value: IMessage): void {
        this.Message.next(value);
    }
    getMessage(): Observable<IMessage> {
        return this.Message.asObservable();
    }

    constructor(public http: HttpClient) {
        super('/messages', http);
    }

    getEmptyMessage(): IMessage {
        return { ...emptyMessage };
    }

    getEmptySelectOption(): MtSearchFilterItem {
        return { ...emptySelectOption };
    }

    searchLinks(csp: SearchParams): Observable<HttpResponse<IMessage[]>> {
        return this.http.get<IMessage[]>(`/messages/links/search`, { observe: 'response', params: this.getHttpParams(csp) });
    }

    getLoginMessages(): Observable<IMessageDto[]> {
        return this.http.get<IMessageDto[]>(`/messages/login`);
    }

    updateOrder(messages: IMessage[]): Observable<void> {
        return this.http.put<void>(`/messages/reorder`, messages);
    }

    deleteMessages(messageId: number): Observable<void> {
        return this.http.delete<void>(`/messages/${messageId}`);
    }
}
