import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { IStudentParentalConsentType } from '@model/interfaces/student-parental-consent-type';
import { StaticMetaItemService } from '@mt-ng2/base-service';

@Injectable({ providedIn: 'root' })
export class StudentParentalConsentTypeService extends StaticMetaItemService<IStudentParentalConsentType> {
    constructor(public http: HttpClient) {
        super('StudentParentalConsentTypeService', 'Type', 'TypeIds', '/studentparentalconsenttypes', http);
    }
}
