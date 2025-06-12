import { Component, OnInit } from '@angular/core';
import { ServiceTypeService } from '@common/services/service-type.service';
import { MtSearchFilterItem } from '@mt-ng2/search-filter-select-control';
import { ProviderStudentService } from '@provider/case-load/services/provider-student.service';
import { ProviderPortalAuthService } from '@provider/provider-portal-auth.service';
import { forkJoin } from 'rxjs';

@Component({
    selector: 'app-provider-reports',
    templateUrl: './provider-reports.component.html',
})
export class ProviderReportsComponent implements OnInit {
    schoolDistricts: MtSearchFilterItem[] = [];
    serviceTypes: MtSearchFilterItem[] = [];

    constructor(
        private schoolDistrictService: ProviderStudentService,
        private providerAuthService: ProviderPortalAuthService,
        private serviceTypeService: ServiceTypeService,
    ) {}

    ngOnInit(): void {
        forkJoin([
            this.schoolDistrictService.getSchoolDistricts(this.providerAuthService.getProviderId()),
            this.serviceTypeService.getAll(),
        ]).subscribe(([districts, serviceTypes])  => {
            this.schoolDistricts = districts.filter((district) => district.Id > 0).map((p) => new MtSearchFilterItem(p, false));
            this.serviceTypes = [...serviceTypes].map((p) => new MtSearchFilterItem(p, true));
        });
    }
}
