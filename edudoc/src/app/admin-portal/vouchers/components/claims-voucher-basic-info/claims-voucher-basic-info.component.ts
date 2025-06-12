import { Component, Input, OnInit } from '@angular/core';
import { UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { finalize } from 'rxjs/operators';

import { markAllFormFieldsAsTouched } from '@mt-ng2/common-functions';
import { NotificationsService } from '@mt-ng2/notifications-module';

import { SchoolDistrictService } from '@admin/school-districts/services/schooldistrict.service';
import { VoucherService } from '@admin/vouchers/voucher.service';
import { ServiceCodeService } from '@common/services/service-code.service';
import { IClaimsEncounter } from '@model/interfaces/claims-encounter';
import { IClaimVoucherUpdateDTO } from '@model/interfaces/custom/claim-voucher-update.dto';
import { IMetaItem, MetaItem } from '@mt-ng2/base-service';
import { DynamicField, DynamicFieldType, DynamicFieldTypes, DynamicLabel, SelectInputTypes } from '@mt-ng2/dynamic-form';
import { forkJoin } from 'rxjs';
import { ClaimsVoucherDynamicConfig } from './claims-voucher.dynamic-config';

@Component({
    selector: 'app-claims-voucher-basic-info',
    templateUrl: './claims-voucher-basic-info.component.html',
})
export class ClaimsVoucherBasicInfoComponent implements OnInit {
    @Input() claimsEncounter: IClaimsEncounter;
    @Input() canEdit: boolean;

    isEditing = false;
    isHovered: boolean;
    viewOnly: DynamicLabel[] = [];
    formObject: DynamicField[] = [];
    formFactory: ClaimsVoucherDynamicConfig<IClaimsEncounter>;
    doubleClickIsDisabled = false;

    schoolYearField: DynamicField;
    selectedSchoolYear: string;
    serviceCodeField: DynamicField;
    selectedServiceCode: number;
    schoolDistrictField: DynamicField;
    selectedSchoolDistrict: number;

    serviceCodes: IMetaItem[] = [];
    schoolDistricts: IMetaItem[] = [];

    get isNewClaimsEncounter(): boolean {
        return this.claimsEncounter && this.claimsEncounter.Id ? false : true;
    }

    get schoolDistrictName(): string {
        return this.claimsEncounter.ClaimsStudent.ClaimsDistrict.SchoolDistrict.Name;
    }

    constructor(
        private voucherService: VoucherService,
        private notificationsService: NotificationsService,
        private router: Router,
        private serviceCodeService: ServiceCodeService,
        private schoolDistrictService: SchoolDistrictService,
    ) {}

    ngOnInit(): void {
        forkJoin([this.serviceCodeService.getAll(), this.schoolDistrictService.getAll()]).subscribe(([serviceCodes, schoolDistricts]) => {
            this.serviceCodes = serviceCodes;
            this.schoolDistricts = schoolDistricts.filter((sds) => !sds.Archived).map((sd) => ({ Id: sd.Id, Name: sd.Name }));
            this.setSchoolYearField();
            this.setServiceCodeField();
            this.setSchoolDistrictField();
            this.setConfig();
        });
    }

    setConfig(): void {
        this.formFactory = new ClaimsVoucherDynamicConfig<IClaimsEncounter>(this.claimsEncounter);
        const config = this.isNewClaimsEncounter ? this.formFactory.getForCreate() : this.formFactory.getForUpdate();
        this.viewOnly = config?.viewOnly?.map((x) => new DynamicLabel(x));
        this.formObject = config?.formObject?.map((x) => new DynamicField(x));

        if (this.isNewClaimsEncounter) {
            this.isEditing = true;
        }
    }

    edit(): void {
        if (this.canEdit) {
            this.isEditing = true;
        }
    }

    cancelClick(): void {
        this.isEditing = false;
    }

    formSubmitted(form: UntypedFormGroup): void {
        if (form.valid) {
            this.formFactory.assignFormValues(this.claimsEncounter, form.value.ClaimsEncounter as IClaimsEncounter);
            this.saveClaimsEncounter();
        } else {
            markAllFormFieldsAsTouched(form);
            this.notificationsService.error('Save failed.  Please check the form and try again.');
        }
    }

    private saveClaimsEncounter(): void {
        if (!this.isNewClaimsEncounter) {
            const update: IClaimVoucherUpdateDTO = {
                Id: this.claimsEncounter.Id,
                PaidAmount: this.claimsEncounter.PaidAmount,
                SchoolDistrictId: this.selectedSchoolDistrict ?? this.claimsEncounter.ClaimsStudent.ClaimsDistrict.SchoolDistrictId,
                SchoolYear: this.selectedSchoolYear ?? (this.schoolYearField.value as string),
                ServiceCodeId: this.selectedServiceCode ?? this.claimsEncounter.EncounterStudent.Encounter.Provider.ProviderTitle.ServiceCodeId,
                VoucherAmount: this.claimsEncounter.ClaimAmount,
            };
            this.voucherService.updateClaimVoucher(update).subscribe((success) => {
                this.claimsEncounter = {
                    ...this.claimsEncounter,
                    ServiceDate: success.ServiceDate,
                };
                const providerTitle = this.claimsEncounter.EncounterStudent.Encounter.Provider.ProviderTitle;
                const serviceCodeId = success.EncounterStudent.Encounter.Provider.ProviderTitle.ServiceCodeId;
                providerTitle.ServiceCodeId = serviceCodeId;
                providerTitle.ServiceCode.Name = this.serviceCodes.find((sc) => sc.Id === serviceCodeId).Name;

                const schoolDistrict = this.claimsEncounter.ClaimsStudent.ClaimsDistrict;
                const districtId = success.ClaimsStudent.ClaimsDistrict.SchoolDistrictId;
                schoolDistrict.SchoolDistrictId = districtId;
                schoolDistrict.SchoolDistrict.Name = success.ClaimsStudent.ClaimsDistrict.SchoolDistrict.Name;

                this.setServiceCodeField();
                this.setSchoolDistrictField();

                this.selectedServiceCode = null;
                this.selectedSchoolDistrict = null;

                this.success();
            });
        }
    }

    private success(newClaimsEncounterSave?: boolean): void {
        if (newClaimsEncounterSave) {
            void this.router.navigate([`/vouchers/claim/${this.claimsEncounter.Id}`]);
        } else {
            this.setConfig();
            this.isEditing = false;
        }
        this.notificationsService.success('Claim voucher successfully updated.');
    }

    setSchoolYearField(): void {
        const year = new Date(this.claimsEncounter.ServiceDate).getFullYear();
        this.schoolYearField = new DynamicField({
            formGroup: null,
            label: 'School Year',
            name: 'SchoolYear',
            options: null,
            type: new DynamicFieldType({
                fieldType: DynamicFieldTypes.Input,
                inputType: null,
                scale: null,
            }),
            // eslint-disable-next-line @typescript-eslint/unbound-method
            validation: [Validators.required, Validators.maxLength(4)],
            validators: { required: true, maxlength: 4 },
            value: this.claimsEncounter && this.claimsEncounter.ServiceDate ? year : '',
        });
    }

    schoolYearChanged(evt: string): void {
        this.selectedSchoolYear = evt;
    }

    setServiceCodeField(): void {
        this.serviceCodeField = new DynamicField({
            formGroup: null,
            label: 'Service Area',
            name: 'ServiceCode',
            options: this.serviceCodes,
            type: new DynamicFieldType({
                fieldType: DynamicFieldTypes.Select,
                inputType: SelectInputTypes.Dropdown,
            }),
            // eslint-disable-next-line @typescript-eslint/unbound-method
            validation: [Validators.required],
            validators: { required: true },
            value: this.claimsEncounter && this.claimsEncounter.EncounterStudent.Encounter.Provider.ProviderTitle.ServiceCodeId,
        });
    }

    serviceCodeChanged(evt: number): void {
        this.selectedServiceCode = evt;
    }

    setSchoolDistrictField(): void {
        this.schoolDistrictField = new DynamicField({
            formGroup: null,
            label: 'School District',
            name: 'SchoolDistrict',
            options: this.schoolDistricts,
            type: new DynamicFieldType({
                fieldType: DynamicFieldTypes.Select,
                inputType: SelectInputTypes.Dropdown,
            }),
            // eslint-disable-next-line @typescript-eslint/unbound-method
            validation: [Validators.required],
            validators: { required: true },
            value: this.claimsEncounter && this.claimsEncounter.ClaimsStudent.ClaimsDistrict.SchoolDistrictId,
        });
    }

    schoolDistrictChanged(evt: number): void {
        this.selectedSchoolDistrict = evt;
    }
}
