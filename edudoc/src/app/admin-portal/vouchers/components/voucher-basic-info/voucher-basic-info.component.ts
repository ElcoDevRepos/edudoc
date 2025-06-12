import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { AbstractControl, UntypedFormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { markAllFormFieldsAsTouched } from '@mt-ng2/common-functions';
import { NotificationsService } from '@mt-ng2/notifications-module';

import { VoucherService } from '../../voucher.service';

import { VoucherTypeService } from '@admin/managed-list-items/managed-item-services/voucher-type.service';
import { SchoolDistrictService } from '@admin/school-districts/services/schooldistrict.service';
import { VoucherDynamicConfig } from '@admin/vouchers/voucher.dynamic-config';
import { ServiceCodeService } from '@common/services/service-code.service';
import { VoucherTypes } from '@model/enums/voucher-types.enum';
import { IClaimsEncounter } from '@model/interfaces/claims-encounter';
import { ISchoolDistrict } from '@model/interfaces/school-district';
import { IServiceCode } from '@model/interfaces/service-code';
import { IVoucher } from '@model/interfaces/voucher';
import { IVoucherType } from '@model/interfaces/voucher-type';
import { DynamicField, DynamicLabel } from '@mt-ng2/dynamic-form';

@Component({
    selector: 'app-voucher-basic-info',
    templateUrl: './voucher-basic-info.component.html',
})
export class VoucherBasicInfoComponent implements OnInit {
    @Input() voucher: IVoucher;
    @Input() canEdit: boolean;
    @Input() claimVoucher: IClaimsEncounter;

    isEditing = false;
    isHovered: boolean;
    viewOnly: DynamicLabel[] = [];
    formObject: DynamicField[] = [];
    formFactory: VoucherDynamicConfig<IVoucher>;
    form: UntypedFormGroup;
    doubleClickIsDisabled = false;

    serviceCodes: IServiceCode[];
    schoolDistricts: ISchoolDistrict[];
    voucherTypes: IVoucherType[] = [];

    get isNewVoucher(): boolean {
        return this.voucher && this.voucher.Id ? false : true;
    }

    constructor(
        private voucherService: VoucherService,
        private serviceCodeService: ServiceCodeService,
        private voucherTypeService: VoucherTypeService,
        private notificationsService: NotificationsService,
        private router: Router,
        private schoolDistrictService: SchoolDistrictService,
        private cdr: ChangeDetectorRef,
    ) {}

    ngOnInit(): void {
        forkJoin(
            this.serviceCodeService.getItems(),
            this.schoolDistrictService.getAll(),
            this.voucherTypeService.getItems()
        ).subscribe((answers) => {
            const [serviceCodes, schoolDistricts, voucherTypes] = answers;
            this.serviceCodes = serviceCodes.filter(sc => sc.IsBillable);
            this.schoolDistricts = schoolDistricts.filter((sds) => !sds.Archived);
            this.voucherTypes = voucherTypes;
            this.setConfig();
        });
    }

    setConfig(): void {
        this.formFactory = new VoucherDynamicConfig<IVoucher>(this.voucher, this.serviceCodes, this.schoolDistricts, this.voucherTypes);
        const config = this.isNewVoucher ? this.formFactory.getForCreate() : this.formFactory.getForUpdate();
        this.viewOnly = config?.viewOnly?.map((x) => new DynamicLabel(x));
        this.formObject = config?.formObject?.map((x) => new DynamicField(x));

        if (this.isNewVoucher) {
            this.isEditing = true;
        }
    }

    formCreated(formGroup: UntypedFormGroup): void {
        const voucherGroup = formGroup.controls.Voucher as UntypedFormGroup;

        formGroup.get('Voucher.VoucherTypeId').valueChanges.subscribe((value) => {
            if (value === 1) {
                this.enableControl(voucherGroup.controls.ServiceCode, true);
                voucherGroup.controls.ServiceCode.setValue(this.voucher.ServiceCode);
                this.cdr.detectChanges();
            }
        });

        formGroup.get('Voucher.VoucherTypeId').valueChanges.subscribe((value) => {
            if (value > 1) {
                this.disableControl(voucherGroup.controls.ServiceCode, true);
                voucherGroup.controls.ServiceCode.setValue(null);
                this.cdr.detectChanges();
            }
        });
    }

    private enableControl(control: AbstractControl, required: boolean): void {
        if (control) {
            control.enable();
            control.mtSetRequired(required);
        }
    }

    private disableControl(control: AbstractControl, clearValue: boolean): void {
        if (control) {
            control.disable();
            control.mtSetRequired(false);
            control.markAsUntouched();
            if (clearValue) {
                control.setValue(null);
            }
        }
    }

    edit(): void {
        if (this.canEdit) {
            this.isEditing = true;
        }
    }

    cancelClick(): void {
        if (this.isNewVoucher) {
            void this.router.navigate(['/vouchers']);
        } else {
            this.isEditing = false;
        }
    }

    formSubmitted(form: UntypedFormGroup): void {
        if (form.valid) {
            this.formFactory.assignFormValues(this.voucher, form.value.Voucher as IVoucher);
            this.voucher.ServiceCode = this.voucher.VoucherTypeId == VoucherTypes.ServiceCode ? this.serviceCodes.find(sc => sc.Id === parseInt(this.voucher.ServiceCode))?.Name : this.voucherTypes.find(vt => vt.Id === this.voucher.VoucherTypeId)?.Name ?? "Unknown";
            this.saveVoucher();
        } else {
            markAllFormFieldsAsTouched(form);
            this.notificationsService.error('Save failed.  Please check the form and try again.');
        }
    }

    private saveVoucher(): void {
        if (this.isNewVoucher) {
            this.voucherService
                .create(this.voucher)                .subscribe((answer) => {
                    this.voucher.Id = answer;
                    this.success(true);
                });
        } else {
            this.voucherService
                .update(this.voucher)                .subscribe(() => {
                    this.success();
                });
        }
    }

    private success(newVoucherSave?: boolean): void {
        if (newVoucherSave) {
            if (this.voucher.Id) {
                void this.router.navigate([`/vouchers/${this.voucher.Id}`]);
            } else {
                void this.router.navigate([`/vouchers`]);
            }
        } else {
            this.setConfig();
            this.isEditing = false;
        }
        this.voucherService.emitChange(this.voucher);
        this.notificationsService.success('Voucher saved successfully.');
    }
}
