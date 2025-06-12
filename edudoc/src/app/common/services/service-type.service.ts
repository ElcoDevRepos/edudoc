import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { IServiceType } from '@model/interfaces/service-type';
import { StaticMetaItemService } from '@mt-ng2/base-service';

@Injectable({
    providedIn: 'root',
})
export class ServiceTypeService extends StaticMetaItemService<IServiceType> {
    constructor(public http: HttpClient) {
        super('ServiceTypeService', 'Service Type', 'ServiceTypeIds', '/options/serviceTypes', http);
    }
}
