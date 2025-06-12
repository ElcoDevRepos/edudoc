import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { BaseService } from '@mt-ng2/base-service';

import { IMessageLink } from '@model/interfaces/message-link';
import { BehaviorSubject, Observable } from 'rxjs';

export const emptyMessageLink: IMessageLink = {
    Archived: false,
    CreatedById: 0,
    DateCreated: new Date(),
    Description: null,
    DueDate: null,
    EscId: null,
    ForDistrictAdmins: false,
    Id: 0,
    Mandatory: false,
    MessageFilterTypeId: 0,
    ProviderId: null,
    ProviderTitleId: null,
    SchoolDistrictId: null,
    ServiceCodeId: null,
    TrainingTypeId: null,
    Url: null,
    ValidTill: null,
};

@Injectable({ providedIn: 'root' })
export class MessageLinkService extends BaseService<IMessageLink> {
    messageLink: BehaviorSubject<IMessageLink> = new BehaviorSubject<IMessageLink>(this.getEmptyMessageLink());

    setMessageLink(value: IMessageLink): void {
        this.messageLink.next(value);
    }
    getMessageLink(): Observable<IMessageLink> {
        return this.messageLink.asObservable();
    }

    constructor(public http: HttpClient) {
        super('/messagelinks', http);
    }

    getEmptyMessageLink(): IMessageLink {
        return { ...emptyMessageLink };
    }
}
