import { Component, OnInit } from '@angular/core';
import { ServiceCodeService } from '@common/services/service-code.service';
import { IServiceCode } from '@model/interfaces/service-code';

@Component({
    selector: 'app-admin-fiscal-revenue-report',
    templateUrl: './admin-fiscal-revenue-report.component.html',
})
export class AdminFiscalRevenueReportComponent implements OnInit {
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
