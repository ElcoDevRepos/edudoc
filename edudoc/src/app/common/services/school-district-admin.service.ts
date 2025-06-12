import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IAdminSchoolDistrict } from '@model/interfaces/admin-school-district';
import { BaseService } from '@mt-ng2/base-service';

export const emptySchool: IAdminSchoolDistrict = {
    AdminId: 0,
    Archived: false,
    CreatedById: 0,
    Id: 0,
    SchoolDistrictId: 0,
};

@Injectable({
    providedIn: 'root',
})
export class SchoolDistrictAdminService extends BaseService<IAdminSchoolDistrict> {
    constructor(public http: HttpClient) {
        super('/admin-school-districts', http);
    }

    getEmptyAdminSchoolDistrict(): IAdminSchoolDistrict {
        return { ...emptySchool };
    }
}
