import { Component, OnInit } from '@angular/core';

import { IBillingSchedule } from '@model/interfaces/billing-schedule';
import { BillingScheduleService } from '../../services/billing-schedule.service';

@Component({
    templateUrl: './billing-schedule-add.component.html',
})
export class BillingScheduleAddComponent implements OnInit {
    billingSchedule: IBillingSchedule;
    canEdit = true; // route guard ensures this component wouldn't be loaded if user didn't have permission already

    constructor(private billingscheduleService: BillingScheduleService) {}

    ngOnInit(): void {
        this.billingSchedule = this.billingscheduleService.getEmptyBillingSchedule();
    }
}
