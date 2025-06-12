import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ContactService } from '@model/shared-entities/contacts/contact.service';
import { ICloseButtonParams } from '@mt-ng2/shared-entities-module/lib/models/close-button-params';

@Injectable({ providedIn: 'root' })
export class SchoolDistrictContactService extends ContactService {
    constructor(public http: HttpClient) {
        super('/school-districts', http);
    }

    getCloseButtonRoute(route: ActivatedRoute): ICloseButtonParams {
        return { commands: ['../../'], extras: { relativeTo: route } };
    }
}
