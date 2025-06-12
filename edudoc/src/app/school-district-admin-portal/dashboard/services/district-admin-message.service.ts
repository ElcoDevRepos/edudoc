import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { BaseService } from '@mt-ng2/base-service';

import { IMessage } from '@model/interfaces/message';
import { BehaviorSubject, Observable } from 'rxjs';
import { IMessageDto } from '../../../model/interfaces/custom/message.dto';
import { ILinkSelectorDTO } from '@model/interfaces/custom/link-selector.dto';

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
export class DistrictAdminMessageService extends BaseService<IMessage> {
    Message: BehaviorSubject<IMessage> = new BehaviorSubject<IMessage>(this.getEmptyMessage());

    setMessage(value: IMessage): void {
        this.Message.next(value);
    }
    getMessage(): Observable<IMessage> {
        return this.Message.asObservable();
    }

    constructor(public http: HttpClient) {
        super('/district-admin-messages', http);
    }

    getEmptyMessage(): IMessage {
        return { ...emptyMessage };
    }

    getDistrictAdminMessages(): Observable<IMessageDto[]> {
        return this.http.get<IMessageDto[]>(`/district-admin-messages/messages`);
    }

    markMessageAsRead(viewedMessageId: number): Observable<IMessageDto[]> {
        return this.http.get<IMessageDto[]>(`/district-admin-messages/mark-as-read/${viewedMessageId}`);
    }

    getDocumentsAndLinks(districtAdminId: number): Observable<ILinkSelectorDTO[]> {
        return this.http.get<ILinkSelectorDTO[]>(`/district-admin-messages/documents-and-links/${districtAdminId}`);
    }
}
