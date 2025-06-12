import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin } from 'rxjs';

import { ServiceCodeService } from '@common/services/service-code.service';
import { IExpandableObject } from '@model/expandable-object';
import { VoucherDynamicControls } from '@model/form-controls/voucher.form-controls';
import { markAllFormFieldsAsTouched } from '@mt-ng2/common-functions';
import { NotificationsService } from '@mt-ng2/notifications-module';

@Component({
    selector: 'voucher',
    templateUrl: './voucher.component.html',
})
export class VoucherComponent implements OnInit {

    // abstract controls
    abstractVoucherControls: IExpandableObject;

    voucherForm: UntypedFormGroup;
    doubleClickIsDisabled = false;
    formCreated = false;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private fb: UntypedFormBuilder,
        private cdr: ChangeDetectorRef,
        private notificationsService: NotificationsService,
        private serviceCodeService: ServiceCodeService,
    ) {}

    ngOnInit(): void {
        forkJoin(
            this.serviceCodeService.getItems(),
        ).subscribe(() => {
            this.createForm();
        });
    }

    createForm(): void {
        this.getControls();
        this.voucherForm = this.assignFormGroups();
        this.formCreated = true;
        this.cdr.detectChanges();
    }

    getControls(): void {
        this.abstractVoucherControls = new VoucherDynamicControls(
            null,
            {
                formGroup: 'Voucher',
            },
        ).Form;
    }

    assignFormGroups(): UntypedFormGroup {
        return this.fb.group({
            Voucher: this.fb.group({}),
        });
    }

    formSubmitted(): void {
        if (this.voucherForm.valid) {
            // save logic here
            this.notificationsService.success('Form passed validation... but the Save logic has not yet been implemented');
        } else {
            markAllFormFieldsAsTouched(this.voucherForm);
            this.error();
        }
    }

    cancelClick(): void {
        void this.router.navigate(['../'], { relativeTo: this.route });
    }

    error(): void {
        this.notificationsService.error('Save failed.  Please check the form and try again.');
    }

    success(): void {
        this.notificationsService.success('Voucher saved successfully.');
    }

}
