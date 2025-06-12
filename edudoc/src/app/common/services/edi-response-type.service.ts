import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { IEdiFileType } from '@model/interfaces/edi-file-type';
import { StaticMetaItemService } from '@mt-ng2/base-service';

@Injectable({
    providedIn: 'root',
})
export class EdiResponseTypeService extends StaticMetaItemService<IEdiFileType> {
    constructor(public http: HttpClient) {
        super('EdiResponseTypeService', 'Response Type', 'EdiResponseTypeIds', '/options/ediResponseTypes', http);
    }
}
