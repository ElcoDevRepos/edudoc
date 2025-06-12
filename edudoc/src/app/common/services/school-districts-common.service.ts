import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { ISchoolDistrict } from '@model/interfaces/school-district';
import { StaticMetaItemService } from '@mt-ng2/base-service';

@Injectable({
    providedIn: 'root',
})
export class SchoolDistrictsService extends StaticMetaItemService<ISchoolDistrict> {
    constructor(public http: HttpClient) {
        super('SchoolDistrictsService', 'School District', 'SchoolDistrictIds', '/options/schoolDistricts', http);
    }
}
