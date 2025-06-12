import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';

import { BillingScheduleService } from '../../services/billing-schedule.service';

@Component({
    selector: 'app-billing-schedule-header',
    templateUrl: './billing-schedule-header.component.html',
})
export class BillingScheduleHeaderComponent implements OnInit {
    id: number;
    header$: Observable<string>;
    readonly billingScheduleService = inject(BillingScheduleService);
    readonly route = inject(ActivatedRoute);

    constructor() {
        this.id = +(this.route.snapshot.paramMap.get('billingScheduleId') ?? 0);
    }

    ngOnInit(): void {
        this.billingScheduleService.setInitialTitle(this.id);
        this.header$ = this.billingScheduleService.title$;
    }
}
