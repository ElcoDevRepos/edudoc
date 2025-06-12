import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IProviderEmploymentType } from '@model/interfaces/provider-employment-type';
import { StaticMetaItemService } from '@mt-ng2/base-service';

@Injectable({ providedIn: 'root' })
export class ProviderEmploymentTypeService extends StaticMetaItemService<IProviderEmploymentType> {
    constructor(public http: HttpClient) {
        super('ProviderEmploymentTypeService', 'Employment Type', 'ProviderEmploymentTypeId', '/providerEmploymentTypes', http);
    }
}
