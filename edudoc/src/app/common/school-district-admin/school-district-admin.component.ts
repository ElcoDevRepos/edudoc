import { SchoolDistrictService } from '@admin/school-districts/services/schooldistrict.service';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { SchoolDistrictAdminService } from '@common/services/school-district-admin.service';
import { IAdminSchoolDistrict } from '@model/interfaces/admin-school-district';
import { ISchoolDistrict } from '@model/interfaces/school-district';
import { IUser } from '@model/interfaces/user';
import { markAllFormFieldsAsTouched } from '@mt-ng2/common-functions';
import { DynamicField, DynamicLabel } from '@mt-ng2/dynamic-form';
import { IModalOptions } from '@mt-ng2/modal-module';
import { NotificationsService } from '@mt-ng2/notifications-module';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';
import { AdminSchoolDistrictDynamicConfig } from './school-district-admin.dynamic-config';

export enum SchoolDistrictAdminComponentModeEnums {
    ADMIN = 1,
    SCHOOL_DISTRICT,
}

@Component({
    selector: 'app-school-district-hpc-admin-component',
    styles: [':host ::ng-deep .max-of-total{display: none;}'],
    templateUrl: './school-district-admin.component.html',
})
export class SchoolDistrictAdminComponent implements OnInit {
    private _adminOrSchoolDistrict: SchoolDistrictAdminComponentModeEnums;
    @Input('adminOrSchoolDistrict')
    set adminOrSchoolDistrict(val) {
        this._adminOrSchoolDistrict = val;
        if (val === SchoolDistrictAdminComponentModeEnums.SCHOOL_DISTRICT) {
            this.title = 'HPC ADMIN';
        } else if (val === SchoolDistrictAdminComponentModeEnums.ADMIN) {
            this.title = 'SCHOOL DISTRICTS';
        }
    }
    get adminOrSchoolDistrict(): SchoolDistrictAdminComponentModeEnums {
        return this._adminOrSchoolDistrict;
    }
    @Input('adminSchoolDistricts') adminSchoolDistricts: IAdminSchoolDistrict[];
    @Input('entity') entity: ISchoolDistrict | IUser;
    @Input('service') service: SchoolDistrictService;
    @Output() onSave: EventEmitter<void> = new EventEmitter();

    filteredEntities: ISchoolDistrict[] | IUser[];
    title = '';
    adding = false;
    newAdminSchoolDistrict: IAdminSchoolDistrict;
    schoolDistrictAdminComponentModeEnums = SchoolDistrictAdminComponentModeEnums;
    // Form
    viewOnly: DynamicLabel[] = [];
    formObject: DynamicField[] = [];
    formFactory: AdminSchoolDistrictDynamicConfig<IAdminSchoolDistrict>;
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
        text: `Are you sure you want to archive this HPC Admin/School District association?`,
        title: 'Archive HPC Admin/School District Association',
    };

    constructor(
        private adminSchoolDistrictService: SchoolDistrictAdminService,
        private notificationsService: NotificationsService,
        private router: Router,
    ) {}

    ngOnInit(): void {
        this.setConfig();
    }

    setConfig(): void {
        const controls = this._adminOrSchoolDistrict === SchoolDistrictAdminComponentModeEnums.SCHOOL_DISTRICT ? ['AdminId'] : ['SchoolDistrictId'];
        this.getFilteredEntities().subscribe((sds) => {
            this.filteredEntities = sds;
            this.formFactory = new AdminSchoolDistrictDynamicConfig<IAdminSchoolDistrict>(
                this.adminSchoolDistrictService.getEmptyAdminSchoolDistrict(),
                // TODO: This can't be right
                this.filteredEntities as ISchoolDistrict[],
                this.filteredEntities as IUser[],
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
            this.newAdminSchoolDistrict = this.adminSchoolDistrictService.getEmptyAdminSchoolDistrict();
            this.formFactory.assignFormValues(this.newAdminSchoolDistrict, form.value.AdminSchoolDistrict as IAdminSchoolDistrict);
            this.assignEntityId();
            this.adminSchoolDistrictService
                .create(this.newAdminSchoolDistrict)
                .subscribe(() => {
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
        if (this._adminOrSchoolDistrict === SchoolDistrictAdminComponentModeEnums.SCHOOL_DISTRICT) {
            this.newAdminSchoolDistrict.SchoolDistrictId = this.entity.Id;
        } else if (this._adminOrSchoolDistrict === SchoolDistrictAdminComponentModeEnums.ADMIN) {
            this.newAdminSchoolDistrict.AdminId = this.entity.Id;
        }
    }

    archiveAdminSchoolDistrict(asd: IAdminSchoolDistrict): void {
        asd.Archived = !asd.Archived;
        this.adminSchoolDistrictService
            .update(asd)            .subscribe(() => {
                this.success();
                this.setConfig();
                this.onSave.emit();
            });
    }

    cancelClick(): void {
        this.adding = false;
    }

    getFilteredEntities(): Observable<ISchoolDistrict[] | IUser[]> {
        return this.service.getAll().pipe(
            map((arr: []) =>
                arr.filter((item: { Id: number }) => {
                    if (this.adminOrSchoolDistrict === SchoolDistrictAdminComponentModeEnums.ADMIN) {
                        return !this.adminSchoolDistricts.some((x) => x.SchoolDistrictId === item.Id);
                    }
                    return !this.adminSchoolDistricts.some((x) => x.AdminId === item.Id);
                }),
            ),
        );
    }

    error(): void {
        this.notificationsService.error('Save failed.  Please check the form and try again.');
    }

    success(): void {
        this.notificationsService.success('School saved successfully.');
    }

    navigate(esd: IAdminSchoolDistrict): void {
        const route =
            this._adminOrSchoolDistrict === SchoolDistrictAdminComponentModeEnums.SCHOOL_DISTRICT
                ? `admins/${esd.AdminId}`
                : `school-districts/${esd.SchoolDistrictId}`;
        void this.router.navigate([route]);
    }
}
