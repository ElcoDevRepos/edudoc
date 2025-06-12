import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { IServiceCode } from '@model/interfaces/service-code';
import { StaticMetaItemService } from '@mt-ng2/base-service';
import { map, Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class ServiceCodeService extends StaticMetaItemService<IServiceCode> {
    constructor(public http: HttpClient) {
        super('ServiceCodeService', 'Service Code', 'ServiceCodeIds', '/options/serviceCodes', http);
    }

    getBillableServiceCodes(): Observable<IServiceCode[]> {
        return this.getItems().pipe(map(codes => codes.filter(c => c.IsBillable)));
    }
}
