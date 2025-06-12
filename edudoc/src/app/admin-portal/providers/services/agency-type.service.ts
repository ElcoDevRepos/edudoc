import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IAgencyType } from '@model/interfaces/agency-type';
import { StaticMetaItemService } from '@mt-ng2/base-service';

@Injectable({ providedIn: 'root' })
export class AgencyTypeService extends StaticMetaItemService<IAgencyType> {
    constructor(public http: HttpClient) {
        super('AgencyType', 'AgencyType', 'AgencyTypeIds', '/agencyTypes', http);
    }
}
