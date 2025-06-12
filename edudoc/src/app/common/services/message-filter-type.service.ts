import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { IMessageFilterType } from '@model/interfaces/message-filter-type';
import { StaticMetaItemService } from '@mt-ng2/base-service';

@Injectable({ providedIn: 'root' })
export class MessageFilterTypeService extends StaticMetaItemService<IMessageFilterType> {
    // private _filterType: BehaviorSubject<MessageFilterTypeEnums> = new BehaviorSubject<MessageFilterTypeEnums>(MessageFilterTypeEnums.All);

    constructor(public http: HttpClient) {
        super('MessageFilterTypeService', 'Service Type', 'ServiceTypeIds', '/options/messagefiltertypes', http);
    }

    // setFilterType(value: MessageFilterTypeEnums): void {
    //     this._filterType.next(value);
    //   }
    //   getFilterType(): Observable<MessageFilterTypeEnums> {
    //     return this._filterType.asObservable();
    //   }
}
