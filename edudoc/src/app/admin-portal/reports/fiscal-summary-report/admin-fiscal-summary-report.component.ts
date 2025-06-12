import { Component, OnInit } from '@angular/core';
import { ServiceCodeService } from '@common/services/service-code.service';
import { IServiceCode } from '@model/interfaces/service-code';

@Component({
    selector: 'app-admin-fiscal-summary-report',
    templateUrl: './admin-fiscal-summary-report.component.html',
})
export class AdminFiscalSummaryReportComponent implements OnInit {
    serviceCodes: IServiceCode[] = [];

    constructor(
        private serviceCodeService: ServiceCodeService,
    ) {}

    ngOnInit(): void {
        this.serviceCodeService.getAll().subscribe((serviceCodes)  => {
            this.serviceCodes = [...serviceCodes];
        });
    }
}
