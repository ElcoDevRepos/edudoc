import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { BaseService } from '@mt-ng2/base-service';
import { Observable } from 'rxjs';
import { ISchoolDistrictsAccountAssistant } from '../../../../model/interfaces/school-districts-account-assistant';

export const emptySchoolDistrictsAccountAssistant: ISchoolDistrictsAccountAssistant = {
    AccountAssistantId: 0,
    Id: 0,
    SchoolDistrictId: 0,
};

@Injectable({
    providedIn: 'root',
})
export class SchoolDistrictsAccountAssistantService extends BaseService<ISchoolDistrictsAccountAssistant> {
    constructor(public http: HttpClient) {
        super('/school-districts-account-assistants', http);
    }

    getEmptySchoolDistrictsAccountAssistant(): ISchoolDistrictsAccountAssistant {
        return { ...emptySchoolDistrictsAccountAssistant };
    }

    updateSchoolDistrictAccountAssistants(schoolDistrictId: number, accountAssistantIds: number[]): Observable<number> {
        return this.http.post<number>(`/school-districts-account-assistants/update/${schoolDistrictId}`, accountAssistantIds);
    }
}
