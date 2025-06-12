import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { IEncounterStatus } from '@model/interfaces/encounter-status';
import { StaticMetaItemService } from '@mt-ng2/base-service';
import { map, Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class EncounterStatusService extends StaticMetaItemService<IEncounterStatus> {
    constructor(public http: HttpClient) {
        super('EncounterStatusService', 'Encounter Status', 'EncounterStatusIds', '/options/encounterStatuses', http);
    }

    getStatusesForReview(): Observable<IEncounterStatus[]> {
        return this.getItems().pipe(map((e) => e.filter((status) => status.ForReview) ?? []));
    }
}
