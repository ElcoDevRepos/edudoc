import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IProviderEscAssignment } from '@model/interfaces/provider-esc-assignment';
import { IProviderEscSchoolDistrict } from '@model/interfaces/provider-esc-school-district';
import { BaseService } from '@mt-ng2/base-service';

const emptyProviderEsc: IProviderEscAssignment = {
    AgencyId: null,
    AgencyTypeId: null,
    Archived: false,
    EndDate: null,
    Id: 0,
    ProviderEscSchoolDistricts: null,
    ProviderId: null,
    StartDate: null,
};

const emptyProviderEscSchoolDistrict: IProviderEscSchoolDistrict = {
    Id: 0,
    ProviderEscAssignmentId: 0,
    SchoolDistrictId: 0,
};

@Injectable({ providedIn: 'root' })
export class ProviderSchoolDistrictService extends BaseService<IProviderEscAssignment> {
    constructor(public http: HttpClient) {
        super('/providerSchoolDistricts', http);
    }

    public getEmptyProviderEscSchoolDistrict(): IProviderEscSchoolDistrict {
        return { ...emptyProviderEscSchoolDistrict };
    }

    public getEmptyProviderEsc(): IProviderEscAssignment {
        return { ...emptyProviderEsc };
    }
}
