import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { ContactService } from '@model/shared-entities/contacts/contact.service';

@Injectable({ providedIn: 'root' })
export class SchoolDistrictContactService extends ContactService {
    constructor(public http: HttpClient) {
        super('/school-districts', http);
    }
}
