import { AnnualEntryService } from '@admin/annual-entries/services/annual-entry.service';
import { Component } from '@angular/core';
import { IAnnualEntry } from '@model/interfaces/annual-entry';
import { IEntity, IEntityListComponentMembers, IEntityListDynamicCellComponent } from '@mt-ng2/entity-list-module';
import { IModalOptions } from '@mt-ng2/modal-module';
import { NotificationsService } from '@mt-ng2/notifications-module';

@Component({
    styles: [],
    templateUrl: './annual-entry-cell.component.html',
})

export class AnnualEntryArchiveDynamicCellComponent implements IEntityListDynamicCellComponent {
    entityListComponentMembers: IEntityListComponentMembers;
    set entity(value: IEntity) {
        this.annualEntry = value as IAnnualEntry;
    }
    annualEntry: IAnnualEntry;

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

    constructor(
        private annaulEntryService: AnnualEntryService,
        private notificationsService: NotificationsService,
    ) {}

    buttonClicked(): void {
        if (this.annualEntry.Id) {
            this.annaulEntryService.removeAnnualEntry(this.annualEntry.Id).subscribe(() => {
                this.annaulEntryService.emitAnnualEntryArchived();
                this.notificationsService.success('Annual Entry successfully removed.');
            });
        } 
    }

    toggleModal(event: Event): void {
        event.stopPropagation();
        this.showModal = !this.showModal;
    }
}
