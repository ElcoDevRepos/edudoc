import { Component, OnInit } from '@angular/core';
import { ServiceCodeService } from '@common/services/service-code.service';
import { ServiceTypeService } from '@common/services/service-type.service';
import { MtSearchFilterItem } from '@mt-ng2/search-filter-select-control';
import { forkJoin } from 'rxjs';

@Component({
    selector: 'district-admin-encounters-by-student-report',
    templateUrl: './encounters-by-student-report.component.html',
})
export class DistrictAdminEncounterByStudentReport implements OnInit {
    serviceCodes: MtSearchFilterItem[] = [];
    serviceTypes: MtSearchFilterItem[] = [];

    constructor(
        private serviceCodeService: ServiceCodeService,
        private serviceTypeService: ServiceTypeService,
    ) {}

    ngOnInit(): void {
        forkJoin([
            this.serviceCodeService.getAll(),
            this.serviceTypeService.getAll(),
        ]).subscribe(([serviceCodes, serviceTypes])  => {
            this.serviceCodes = serviceCodes.map(sc => new MtSearchFilterItem(sc, false));
            this.serviceTypes = serviceTypes.map((p) => new MtSearchFilterItem(p, true));
        });
    }
}
