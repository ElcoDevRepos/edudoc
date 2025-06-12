import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { BaseService } from '@mt-ng2/base-service';

import { IMessageDocument } from '@model/interfaces/message-document';
import { BehaviorSubject, Observable } from 'rxjs';

export const emptyMessageDocument: IMessageDocument = {
    Archived: false,
    CreatedById: 0,
    DateCreated: new Date(),
    Description: null,
    DueDate: null,
    EscId: null,
    ForDistrictAdmins: false,
    FileName: '',
    FilePath: '',
    Id: 0,
    Mandatory: false,
    MessageFilterTypeId: 0,
    ProviderId: null,
    ProviderTitleId: null,
    SchoolDistrictId: null,
    ServiceCodeId: null,
    TrainingTypeId: null,
    ValidTill: null,
};

@Injectable({ providedIn: 'root' })
export class MessageDocumentService extends BaseService<IMessageDocument> {
    messageDocument: BehaviorSubject<IMessageDocument> = new BehaviorSubject<IMessageDocument>(this.getEmptyMessageDocument());

    setMessageDocument(value: IMessageDocument): void {
        this.messageDocument.next(value);
    }
    getMessageDocument(): Observable<IMessageDocument> {
        return this.messageDocument.asObservable();
    }

    constructor(public http: HttpClient) {
        super('/messagedocuments', http);
    }

    upload(messageDocumentId: number, formData: FormData): Observable<number> {
        return this.http.put<number>(`/messagedocuments/${messageDocumentId}/upload`, formData);
    }

    download(messageDocument: IMessageDocument): Observable<Blob> {
        return this.http.get(`/messagedocuments/${messageDocument.Id}/download`, { responseType: 'blob' as const });
    }

    getEmptyMessageDocument(): IMessageDocument {
        return { ...emptyMessageDocument };
    }
}
