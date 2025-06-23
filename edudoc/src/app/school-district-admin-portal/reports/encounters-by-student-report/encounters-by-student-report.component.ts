import { Component, OnInit } from '@angular/core';
import { ServiceCodeService } from '@common/services/service-code.service';
import { ServiceTypeService } from '@common/services/service-type.service';
import { ProviderService } from '@admin/providers/provider.service';
import { MtSearchFilterItem } from '@mt-ng2/search-filter-select-control';
import { forkJoin, map } from 'rxjs';
import { UserService } from '@admin/users/services/user.service';
import { ExtraSearchParams } from '@mt-ng2/common-classes';

@Component({
    selector: 'district-admin-encounters-by-student-report',
    templateUrl: './encounters-by-student-report.component.html',
})
export class DistrictAdminEncounterByStudentReport implements OnInit {
    serviceCodes: MtSearchFilterItem[] = [];
    serviceTypes: MtSearchFilterItem[] = [];
    providers: MtSearchFilterItem[] = [];

    constructor(
        private serviceCodeService: ServiceCodeService,
        private serviceTypeService: ServiceTypeService,
        private providerService: ProviderService,
        private userService: UserService
    ) {}

    ngOnInit(): void {
        forkJoin([
            this.serviceCodeService.getAll(),
            this.serviceTypeService.getAll(),
            this.providerService.getSelectOptionsByDistrictId(this.userService.getAdminDistrictId(), { query: null, extraParams: [new ExtraSearchParams({
                    name: 'archivedstatus',
                    valueArray: [1, 0],
                })] })
        ]).subscribe(([serviceCodes, serviceTypes, providers])  => {
            this.serviceCodes = serviceCodes.map(sc => new MtSearchFilterItem(sc, false));
            this.serviceTypes = serviceTypes.map(st => new MtSearchFilterItem(st, true));
            this.providers = providers.map(p  => new MtSearchFilterItem(p, true));
        });
    }
}
