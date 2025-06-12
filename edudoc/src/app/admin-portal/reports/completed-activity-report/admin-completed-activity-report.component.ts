import { Component, OnInit } from '@angular/core';
import { ServiceCodeService } from '@common/services/service-code.service';
import { MtSearchFilterItem } from '@mt-ng2/search-filter-select-control';

@Component({
    selector: 'app-admin-completed-activity-report',
    templateUrl: './admin-completed-activity-report.component.html',
})
export class AdminCompletedActivityReportComponent implements OnInit {
    serviceCodes: MtSearchFilterItem[] = [];

    constructor(
        private serviceCodeService: ServiceCodeService,
    ) {}

    ngOnInit(): void {
        this.serviceCodeService.getAll().subscribe((serviceCodes)  => {
            this.serviceCodes = [...serviceCodes].map((p) => new MtSearchFilterItem(p, true));
        });
    }
}
