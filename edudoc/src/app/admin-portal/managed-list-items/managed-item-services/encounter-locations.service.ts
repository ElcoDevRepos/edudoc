import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IEncounterLocation } from '@model/interfaces/encounter-location';
import { MetaItemService } from '@mt-ng2/base-service';

@Injectable({
    providedIn: 'root',
})
export class EncounterLocationService extends MetaItemService<IEncounterLocation> {
    constructor(public http: HttpClient) {
        super('EncounterLocationService', 'Encounter Location', 'EncounterLocationIds', '/encounter-locations', http);
    }
}
