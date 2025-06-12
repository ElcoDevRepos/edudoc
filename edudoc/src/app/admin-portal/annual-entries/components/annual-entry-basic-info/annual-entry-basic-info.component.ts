import { Component, Input, OnInit } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { markAllFormFieldsAsTouched } from '@mt-ng2/common-functions';
import { NotificationsService } from '@mt-ng2/notifications-module';

import { AnnualEntryDynamicConfig } from '@admin/annual-entries/annual-entries.dynamic-config';
import { AnnualEntryStatusService } from '@admin/annual-entries/services/annual-entry-status.service';
import { AnnualEntryService } from '@admin/annual-entries/services/annual-entry.service';
import { SchoolDistrictService } from '@admin/school-districts/services/schooldistrict.service';
import { IAnnualEntry } from '@model/interfaces/annual-entry';
import { IAnnualEntryStatus } from '@model/interfaces/annual-entry-status';
import { ISchoolDistrict } from '@model/interfaces/school-district';
import { DynamicField, DynamicLabel } from '@mt-ng2/dynamic-form';

@Component({
    selector: 'app-annual-entry-basic-info',
    templateUrl: './annual-entry-basic-info.component.html',
})
export class AnnualEntryBasicInfoComponent implements OnInit {
    @Input() annualEntry: IAnnualEntry;
    @Input() canEdit: boolean;

    isEditing = false;
    isHovered: boolean;
    viewOnly: DynamicLabel[] = [];
    formObject: DynamicField[] = [];
    formFactory: AnnualEntryDynamicConfig<IAnnualEntry>;
    doubleClickIsDisabled = false;

    statuses: IAnnualEntryStatus[];
    districts: ISchoolDistrict[];

    get isNewAnnualEntry(): boolean {
        return this.annualEntry && this.annualEntry.Id ? false : true;
    }

    constructor(
        private annualEntryService: AnnualEntryService,
        private annualEntryStatusService: AnnualEntryStatusService,
        private notificationsService: NotificationsService,
        private router: Router,
        private schoolDistrictService: SchoolDistrictService,
    ) {}

    ngOnInit(): void {
        forkJoin(this.annualEntryStatusService.getItems(), this.schoolDistrictService.getAll()).subscribe((answers) => {
            const [statuses, districts] = answers;
            this.statuses = statuses;
            this.districts = districts.filter((sds) => !sds.Archived);
            this.setConfig();
        });
    }

    setConfig(): void {
        this.formFactory = new AnnualEntryDynamicConfig<IAnnualEntry>(this.annualEntry, this.statuses, this.districts);
        const config = this.isNewAnnualEntry ? this.formFactory.getForCreate() : this.formFactory.getForUpdate();
        this.viewOnly = config?.viewOnly?.map((x) => new DynamicLabel(x));
        this.formObject = config?.formObject?.map((x) => new DynamicField(x));

        if (this.isNewAnnualEntry) {
            this.isEditing = true;
        }
    }

    edit(): void {
        if (this.canEdit) {
            this.isEditing = true;
        }
    }

    cancelClick(): void {
        if (this.isNewAnnualEntry) {
            void this.router.navigate(['/annual-entries']);
        } else {
            this.isEditing = false;
        }
    }

    formSubmitted(form: UntypedFormGroup): void {
        if (form.valid) {
            this.formFactory.assignFormValues(this.annualEntry, form.value.AnnualEntry as IAnnualEntry);
            this.saveAnnualEntry();
        } else {
            markAllFormFieldsAsTouched(form);
            this.notificationsService.error('Save failed.  Please check the form and try again.');
        }
    }

    private saveAnnualEntry(): void {
        if (this.isNewAnnualEntry) {
            this.annualEntryService
                .create(this.annualEntry)
                .subscribe((answer) => {
                    this.annualEntry.Id = answer;
                    this.success(true);
                });
        } else {
            this.annualEntryService
                .update(this.annualEntry)
                .subscribe(() => {
                    this.success();
                });
        }
    }

    private success(newAnnualEntrySave?: boolean): void {
        if (newAnnualEntrySave) {
            void this.router.navigate([`/annual-entries/${this.annualEntry.Id}`]);
        } else {
            this.setConfig();
            this.isEditing = false;
        }
        this.annualEntryService.emitChange(this.annualEntry);
        this.notificationsService.success('AnnualEntry saved successfully.');
    }
}
