import { ProviderTrainingsService } from '@admin/provider-trainings/services/provider-trainings.service';
import { ChangeDetectorRef, Component, OnDestroy } from '@angular/core';
import { IProviderTraining } from '@model/interfaces/provider-training';
import { IEntity } from '@mt-ng2/base-service';
import { IEntityListComponentMembers, IEntityListDynamicCellComponent } from '@mt-ng2/entity-list-module';
import { NotificationsService } from '@mt-ng2/notifications-module';

@Component({
    styles: [],
    templateUrl: './training-reminder-cell.component.html',
})
export class ProviderTrainingReminderDynamicCellComponent implements IEntityListDynamicCellComponent, OnDestroy {
    entityListComponentMembers: IEntityListComponentMembers;
    set entity(value: IEntity) {
        this.providerTraining = value as IProviderTraining;
    }

    providerTraining: IProviderTraining;

    get completed(): boolean {
        return this.providerTraining.DateCompleted != null;
    }

    constructor(
        private notificationsService: NotificationsService,
        private providerTrainingService: ProviderTrainingsService,
        private cdr: ChangeDetectorRef,
    ) {
    }

     

    sendReminder(event: Event): void {
        event.stopPropagation();
        this.providerTrainingService.remindProvider(this.providerTraining.Id).subscribe(() => {
            this.notificationsService.success('Reminder sent successfully.');
        });
    }

    ngOnDestroy(): void {
        this.cdr.detach();
    }
}
