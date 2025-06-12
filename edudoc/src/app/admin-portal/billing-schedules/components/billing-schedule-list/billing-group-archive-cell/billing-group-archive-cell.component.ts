import { BillingScheduleService } from '@admin/billing-schedules/services/billing-schedule.service';
import { Component } from '@angular/core';
import { IBillingSchedule } from '@model/interfaces/billing-schedule';
import { IEntity, IEntityListComponentMembers, IEntityListDynamicCellComponent } from '@mt-ng2/entity-list-module';
import { IModalOptions } from '@mt-ng2/modal-module';
import { NotificationsService } from '@mt-ng2/notifications-module';

@Component({
    styles: [],
    templateUrl: './billing-group-archive-cell.component.html',
})
export class BillingGroupArchiveDynamicCellComponent implements IEntityListDynamicCellComponent {
    entityListComponentMembers: IEntityListComponentMembers;
    entity: IBillingSchedule;

    // Modal Parameters
    showModal = false;
    modalOptions: IModalOptions = {
        customClass: {
            title: 'text-center',
        },
        showCancelButton: true,
        showCloseButton: false,
        showConfirmButton: true,
        width: '30%',
    };

    constructor(private billingScheduleService: BillingScheduleService, private notificationsService: NotificationsService) {}

    buttonClicked(): void {
        if (this.entity.Id) {
            this.billingScheduleService.removeBillingSchedule(this.entity.Id).subscribe(() => {
                this.billingScheduleService.emitBillingScheduleArchived();
                this.notificationsService.success('Billing schedule successfully removed.');
            });
        }
    }

    toggleModal(event: Event): void {
        event.stopPropagation();
        this.showModal = !this.showModal;
    }
}
