import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { BaseService } from '@mt-ng2/base-service';

import { ILinkSelectorDTO } from '@model/interfaces/custom/link-selector.dto';
import { IMessage } from '@model/interfaces/message';
import { IProviderTraining } from '@model/interfaces/provider-training';
import { SearchParams } from '@mt-ng2/common-classes';
import { BehaviorSubject, Observable } from 'rxjs';
import { IMessageDto } from '../../../model/interfaces/custom/message.dto';

export const emptyMessage: IMessage = {
    Archived: false,
    Body: null,
    CreatedById: 0,
    DateCreated: null,
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

@Injectable({ providedIn: 'root' })
export class ProviderMessageService extends BaseService<IMessage> {
    Message: BehaviorSubject<IMessage> = new BehaviorSubject<IMessage>(this.getEmptyMessage());

    setMessage(value: IMessage): void {
        this.Message.next(value);
    }
    getMessage(): Observable<IMessage> {
        return this.Message.asObservable();
    }

    constructor(public http: HttpClient) {
        super('/provider-messages', http);
    }

    getEmptyMessage(): IMessage {
        return { ...emptyMessage };
    }

    getDocumentsAndLinks(csp: SearchParams): Observable<HttpResponse<ILinkSelectorDTO[]>> {
        return this.http.get<ILinkSelectorDTO[]>(`/provider-messages/links`, { observe: 'response', params: this.getHttpParams(csp) });
    }

    getProviderMessages(): Observable<IMessageDto[]> {
        return this.http.get<IMessageDto[]>(`/provider-messages/messages`);
    }

    markMessageAsRead(viewedMessageId: number): Observable<IMessageDto[]> {
        return this.http.get<IMessageDto[]>(`/provider-messages/mark-as-read/${viewedMessageId}`);
    }

    CompleteTraining(providerTraining: IProviderTraining): Observable<void> {
        return this.http.put<void>(`/provider-messages/training`, providerTraining);
    }
}
