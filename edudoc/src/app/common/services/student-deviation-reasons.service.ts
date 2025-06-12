import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { IStudentDeviationReason } from '@model/interfaces/student-deviation-reason';
import { MetaItemService } from '@mt-ng2/base-service';

@Injectable({
    providedIn: 'root',
})
export class StudentDeviationReasonsService extends MetaItemService<IStudentDeviationReason> {
    constructor(public http: HttpClient) {
        super('StudentDeviationReasonsService', 'Student Deviation Reason', 'StudentDeviationReasonIds', '/options/studentDeviationReasons', http);
    }
}
