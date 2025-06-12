import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { IDocumentType } from '@model/interfaces/document-type';
import { MetaItemService } from '@mt-ng2/base-service';

@Injectable({
    providedIn: 'root',
})
export class DocumentTypeService extends MetaItemService<IDocumentType> {
    constructor(public http: HttpClient) {
        super('DocumentTypeService', 'Type', 'TypeIds', '/documentTypes', http);
    }
}
