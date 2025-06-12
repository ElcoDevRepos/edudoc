import { Component, Input, OnInit } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { finalize } from 'rxjs/operators';

import { markAllFormFieldsAsTouched } from '@mt-ng2/common-functions';
import { NotificationsService } from '@mt-ng2/notifications-module';

import { HttpErrorResponse } from '@angular/common/http';
import { ISchool } from '@model/interfaces/school';
import { DynamicField, DynamicLabel } from '@mt-ng2/dynamic-form';
import { IModalOptions } from '@mt-ng2/modal-module';
import { SchoolDynamicConfig } from '../../school.dynamic-config';
import { SchoolService } from '../../services/school.service';

@Component({
    selector: 'app-school-basic-info',
    templateUrl: './school-basic-info.component.html',
})
export class SchoolBasicInfoComponent implements OnInit {
    private _schools: ISchool[] = [];
    @Input('schools')
    set schools(val) {
        this._schools = val;
    }
    get schools(): ISchool[] {
        return this._schools.filter((school) => !school.Archived).sort((a, b) => a.Name.localeCompare(b.Name));
    }
    @Input() canEdit: boolean;
    @Input() schoolDistrictId: number;
    showAllSchoolBuildings = false;

    // Archive confirmation
    archiveConfirm: IModalOptions = {
        cancelButtonText: 'Delete',
        confirmButtonText: 'Yes, I am sure!',
        denyButtonText: '',
        icon: 'warning',
        showCancelButton: true,
        showConfirmButton: true,
        showDenyButton: false,
        text: `Are you sure you want to archive this record?`,
        title: 'Archive School',
    };

    selectedSchool: ISchool;

    isEditing: boolean;
    isHovered: boolean;
    viewOnly: DynamicLabel[] = [];
    formObject: DynamicField[] = [];
    formFactory: SchoolDynamicConfig<ISchool>;
    doubleClickIsDisabled = false;

    constructor(private schoolService: SchoolService, private notificationsService: NotificationsService) {}

    ngOnInit(): void {
        this.isEditing = false;
    }

    setConfig(): void {
        const controls = ['Name'];
        this.formFactory = new SchoolDynamicConfig<ISchool>(this.selectedSchool, null, null, controls);
        const config = !this.selectedSchool ? this.formFactory.getForCreate() : this.formFactory.getForUpdate();
        this.viewOnly = config?.viewOnly?.map((x) => new DynamicLabel(x));
        this.formObject = config?.formObject?.map((x) => new DynamicField(x));

        if (!this.selectedSchool) {
            // new school
            this.isEditing = true;
            this.selectedSchool = this.schoolService.getEmptySchool();
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
            this.formFactory.assignFormValues(this.selectedSchool, form.value.School as ISchool);
            if (!this.selectedSchool.Id || this.selectedSchool.Id === 0) {
                // handle new school save
                this.schoolService.createSchoolUnderDistrict(this.selectedSchool, this.schoolDistrictId).subscribe(
                    (answer) => {
                        this.schools = this.schools.concat([answer]);
                        this.isEditing = false;
                        this.success();
                        this.schoolService.emitChange(this.selectedSchool);
                    },
                    ({ error }: HttpErrorResponse) => {
                        const errorMessage = error.ExceptionMessage;
                        if (typeof errorMessage === 'string') {
                            this.notificationsService.error(errorMessage);
                        } else {
                            this.notificationsService.error('Duplicate school names cannot be added.');
                        }
                    },
                );
            } else {
                // handle existing school save
                this.updateSchool(this.selectedSchool);
            }
        } else {
            markAllFormFieldsAsTouched(form);
            this.error();
        }
    }

    updateSchool(school: ISchool): void {
        // remove SchoolDistrictsSchool property from school to allow for update
        delete school.SchoolDistrictsSchools;
        this.schoolService.updateSchool(school, this.schoolDistrictId).subscribe(
            () => {
                this.isEditing = false;
                this.success();
                this.schoolService.emitChange(school);
            },
            ({ error }: HttpErrorResponse) => {
                const errorMessage = error.ExceptionMessage;
                if (typeof errorMessage === 'string') {
                    this.notificationsService.error(errorMessage);
                } else {
                    this.notificationsService.error('Save failed.');
                }
            },
        );
    }

    error(): void {
        this.notificationsService.error('Save failed.  Please check the form and try again.');
    }

    success(): void {
        this.notificationsService.success('School saved successfully.');
    }

    addSchool(): void {
        this.selectedSchool = null;
        this.setConfig();
        this.isEditing = true;
    }

    editSchool(school: ISchool): void {
        this.selectedSchool = school;
        this.setConfig();
        this.isEditing = true;
    }

    archiveSchool(school: ISchool): void {
        school.Archived = !school.Archived;
        this.updateSchool(school);
    }

    toggleAllSchoolBuildings(): void {
        if (this.schools && this.schools.length > 10) {
            this.showAllSchoolBuildings = !this.showAllSchoolBuildings;
        }
    }
}
