import { EscService } from '@admin/escs/services/esc.service';
import { SchoolDistrictService } from '@admin/school-districts/services/schooldistrict.service';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { IEsc } from '@model/interfaces/esc';
import { IEscSchoolDistrict } from '@model/interfaces/esc-school-district';
import { ISchoolDistrict } from '@model/interfaces/school-district';
import { markAllFormFieldsAsTouched } from '@mt-ng2/common-functions';
import { DynamicField, DynamicLabel } from '@mt-ng2/dynamic-form';
import { IModalOptions } from '@mt-ng2/modal-module';
import { NotificationsService } from '@mt-ng2/notifications-module';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { SchoolDistrictEscService } from '../services/school-district-esc.service';
import { EscSchoolDistrictDynamicConfig } from './esc-school-district.dynamic-config';

export enum SchoolDistrictEscComponentModeEnums {
    ESC = 1,
    SCHOOL_DISTRICT,
}

@Component({
    selector: 'app-school-district-esc-component',
    styles: [':host ::ng-deep .max-of-total{display: none;}'],
    templateUrl: './school-district-esc.component.html',
})
export class SchoolDistrictEscComponent implements OnInit {
    private _escOrSchoolDistrict: SchoolDistrictEscComponentModeEnums;
    @Input('escOrSchoolDistrict')
    set escOrSchoolDistrict(val) {
        this._escOrSchoolDistrict = val;
        if (val === SchoolDistrictEscComponentModeEnums.SCHOOL_DISTRICT) {
            this.title = 'EDUCATION SERVICE CENTER';
        } else if (val === SchoolDistrictEscComponentModeEnums.ESC) {
            this.title = 'SCHOOL DISTRICTS';
        }
    }
    get escOrSchoolDistrict(): SchoolDistrictEscComponentModeEnums {
        return this._escOrSchoolDistrict;
    }
    @Input('escSchoolDistricts') escSchoolDistricts: IEscSchoolDistrict[];
    @Input('entity') entity: ISchoolDistrict | IEsc;
    @Input('service') service: SchoolDistrictService | EscService;
    @Output() onSave: EventEmitter<void> = new EventEmitter();

    filteredEntities: ISchoolDistrict[] | IEsc[];
    title = '';
    adding = false;
    newEscSchoolDistrict: IEscSchoolDistrict;
    schoolDistrictEscComponentModeEnums = SchoolDistrictEscComponentModeEnums;
    // Form
    viewOnly: DynamicLabel[] = [];
    formObject: DynamicField[] = [];
    formFactory: EscSchoolDistrictDynamicConfig<IEscSchoolDistrict>;
    doubleClickIsDisabled = false;

    // Archive confirmation
    archiveConfirm: IModalOptions = {
        cancelButtonText: 'Delete',
        confirmButtonText: 'Yes, I am sure!',
        denyButtonText: '',
        icon: 'warning',
        showCancelButton: true,
        showConfirmButton: true,
        showDenyButton: false,
        text: `Are you sure you want to archive this ESC/School District association?`,
        title: 'Archive ESC/School District Association',
    };

    constructor(
        private escSchoolDistrictService: SchoolDistrictEscService,
        private notificationsService: NotificationsService,
        private router: Router,
    ) {}

    ngOnInit(): void {
        this.setConfig();
    }

    setConfig(): void {
        const controls = this._escOrSchoolDistrict === SchoolDistrictEscComponentModeEnums.SCHOOL_DISTRICT ? ['EscId'] : ['SchoolDistrictId'];
        this.getFilteredEntities().subscribe((sds) => {
            this.filteredEntities = sds;
            this.formFactory = new EscSchoolDistrictDynamicConfig<IEscSchoolDistrict>(
                this.escSchoolDistrictService.getEmptyEscSchoolDistrict(),
                // TODO: this can't be right
                this.filteredEntities as ISchoolDistrict[],
                this.filteredEntities as IEsc[],
                null,
                null,
                controls,
            );
            const config = this.formFactory.getForUpdate();
            this.viewOnly = config?.viewOnly?.map((x) => new DynamicLabel(x));
            this.formObject = config?.formObject?.map((x) => new DynamicField(x));
        });
    }

    goToAddMode(): void {
        this.adding = true;
        this.setConfig();
    }

    formSubmitted(form: UntypedFormGroup): void {
        if (form.valid) {
            this.newEscSchoolDistrict = this.escSchoolDistrictService.getEmptyEscSchoolDistrict();
            this.formFactory.assignFormValues(this.newEscSchoolDistrict, form.value.EscSchoolDistrict as IEscSchoolDistrict);
            this.assignEntityId();
            this.escSchoolDistrictService
                .create(this.newEscSchoolDistrict)                .subscribe(() => {
                    this.onSave.emit();
                    this.adding = false;
                    this.setConfig();
                    this.success();
                });
        } else {
            markAllFormFieldsAsTouched(form);
            this.error();
        }
    }

    assignEntityId(): void {
        if (this._escOrSchoolDistrict === SchoolDistrictEscComponentModeEnums.SCHOOL_DISTRICT) {
            this.newEscSchoolDistrict.SchoolDistrictId = this.entity.Id;
        } else if (this._escOrSchoolDistrict === SchoolDistrictEscComponentModeEnums.ESC) {
            this.newEscSchoolDistrict.EscId = this.entity.Id;
        }
    }

    archiveEscSchoolDistrict(esd: IEscSchoolDistrict): void {
        esd.Archived = !esd.Archived;
        this.escSchoolDistrictService
            .archiveSchoolDistrict(esd.EscId, esd.SchoolDistrictId)            .subscribe(() => {
                this.success();
                this.setConfig();
                this.onSave.emit();
            });
    }

    cancelClick(): void {
        this.adding = false;
    }

    getFilteredEntities(): Observable<ISchoolDistrict[] | IEsc[]> {
        return this.service.getAll().pipe(
            // TODO EK
            // map((arr: any[]) =>
            //     arr.filter((item: { Id: number }) => {
            //         if (this.escOrSchoolDistrict === SchoolDistrictEscComponentModeEnums.ESC) {
            //             return !this.escSchoolDistricts.some((x) => x.SchoolDistrictId === item.Id);
            //         }
            //         return !this.escSchoolDistricts.some((x) => x.EscId === item.Id);
            //     }),
            // ),
        );
    }

    error(): void {
        this.notificationsService.error('Save failed.  Please check the form and try again.');
    }

    success(): void {
        this.notificationsService.success('School saved successfully.');
    }

    navigate(esd: IEscSchoolDistrict): void {
        const route =
            this._escOrSchoolDistrict === SchoolDistrictEscComponentModeEnums.SCHOOL_DISTRICT
                ? `escs/${esd.EscId}`
                : `school-districts/${esd.SchoolDistrictId}`;
        void this.router.navigate([route]);
    }
}
