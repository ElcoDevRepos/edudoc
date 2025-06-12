import { VoucherService } from '@admin/vouchers/voucher.service';
import { Component } from '@angular/core';
import { IClaimVoucherDTO } from '@model/interfaces/custom/claim-voucher.dto';
import { IEntity, IEntityListComponentMembers, IEntityListDynamicCellComponent } from '@mt-ng2/entity-list-module';
import { IModalOptions } from '@mt-ng2/modal-module';
import { NotificationsService } from '@mt-ng2/notifications-module';

@Component({
    styles: [],
    templateUrl: './voucher-archive-cell.component.html',
})

export class VoucherArchiveDynamicCellComponent implements IEntityListDynamicCellComponent {
    entityListComponentMembers: IEntityListComponentMembers;
    set entity(value: IEntity) {
        this.voucher = value as IClaimVoucherDTO;
    }
    voucher: IClaimVoucherDTO;

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
        private voucherService: VoucherService,
        private notificationsService: NotificationsService,
    ) {}

    buttonClicked(): void {
        if (this.voucher.VoucherId) {
            this.voucherService.removeVoucher(this.voucher.VoucherId).subscribe(() => {
                this.voucherService.emitVoucherArchived();
                this.notificationsService.success('Voucher successfully removed.');
            });
        } else {
            this.voucherService.removeClaimVoucher(this.voucher.ClaimEncounterId).subscribe(() => {
                this.voucherService.emitVoucherArchived();
                this.notificationsService.success('Voucher successfully removed.');
            });
        }
    }

    toggleModal(event: Event): void {
        event.stopPropagation();
        this.showModal = !this.showModal;
    }
}
