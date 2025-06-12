import { UserService } from '@admin/users/services/user.service';
import { Component } from '@angular/core';
import { ServiceCodeService } from '@common/services/service-code.service';
import { MtSearchFilterItem } from '@mt-ng2/search-filter-select-control';

@Component({
    selector: 'app-district-admin-completed-activity-report',
    template: `<app-completed-activity-report
        *ngIf="serviceCodes"
        [serviceCodes]="serviceCodes"
        [districtId]="districtId"
    ></app-completed-activity-report>`,
})
export class DistrictAdminCompletedActivityReportComponent {
    serviceCodes: MtSearchFilterItem[];
    districtId: number;

    constructor(private serviceCodeService: ServiceCodeService, private userService: UserService) {}

    ngOnInit(): void {
        this.districtId = this.userService.getAdminDistrictId();

        this.serviceCodeService.getAll().subscribe((serviceCodes) => {
            this.serviceCodes = serviceCodes.map((p) => new MtSearchFilterItem(p, true));
        });
    }
}
