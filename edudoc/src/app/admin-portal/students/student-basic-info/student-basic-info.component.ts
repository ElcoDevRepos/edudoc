import { Component, Input, OnInit } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { finalize } from 'rxjs/operators';

import { markAllFormFieldsAsTouched } from '@mt-ng2/common-functions';
import { NotificationsService } from '@mt-ng2/notifications-module';

import { StudentDynamicConfig } from '../student.dynamic-config';

import { SchoolService } from '@admin/school-districts/schools/services/school.service';
import { SchoolDistrictService } from '@admin/school-districts/services/schooldistrict.service';
import { Router } from '@angular/router';
import { StudentService } from '@common/services/student.service';
import { ISelectOptions } from '@model/interfaces/custom/select-options';
import { ISchool } from '@model/interfaces/school';
import { IStudent } from '@model/interfaces/student';
import { DynamicField, DynamicLabel } from '@mt-ng2/dynamic-form';
import { ParentalConsentTypesEnum } from '@model/enums/parental-consent-types.enum';

@Component({
    selector: 'app-student-basic-info',
    templateUrl: './student-basic-info.component.html',
})
export class StudentBasicInfoComponent implements OnInit {
    @Input() student: IStudent;
    @Input() canEdit: boolean;

    isEditing = false;
    isHovered: boolean;
    viewOnly: DynamicLabel[] = [];
    formObject: DynamicField[] = [];
    formFactory: StudentDynamicConfig<IStudent>;
    doubleClickIsDisabled = false;

    consent: string;
    schools: ISchool[];
    schoolDistricts: ISelectOptions[];
    schoolDistrictName: string;

    get studentName(): string {
        return `${this.student.LastName}, ${this.student.FirstName}`;
    }

    constructor(
        private studentService: StudentService,
        private schoolService: SchoolService,
        private schoolDistrictService: SchoolDistrictService,
        private notificationsService: NotificationsService,
        private router: Router,
    ) {}

    ngOnInit(): void {
        if (this.student.Id === 0) {
            // new student
            this.schoolDistrictService.getSelectOptions().subscribe((schooldistricts) => {
                this.schoolDistricts = schooldistricts;
            });
        } else {
            const districtId = this.student.DistrictId ?? this.student.School.SchoolDistrictsSchools[0].SchoolDistrictId;
            // existing student
            if (districtId) {
                this.schoolService.getDistrictSchools(districtId).subscribe((answer) => {
                    this.schools = answer;
                    this.schoolDistrictName = this.student.SchoolDistrict?.Name ?? this.student.School?.SchoolDistrictsSchools[0]?.SchoolDistrict?.Name ?? '';
                    this.setConfig();
                });
            }
            const consents = this.student.StudentParentalConsents.sort((a, b) => {
                return new Date(a.ParentalConsentDateEntered) < new Date(b.ParentalConsentDateEntered) ? 1 : -1;
            });
            if (consents.length === 0) {
                this.consent = 'Not Updated Yet';
            } else {
                // This is the date we should use for when the latest consent is confirmed or denied.
                let date = new Date(consents[0].ParentalConsentEffectiveDate || consents[0].DateModified || consents[0].DateCreated);

                // When there are multiple records in a row of type pending consent, we want to grab the oldest one and show that date.
                if (consents[0].ParentalConsentTypeId === ParentalConsentTypesEnum.PendingConsent) {
                    let earliestPending = new Date(consents[0].ParentalConsentDateEntered);
                    for (const consent of consents) {
                        if (consent.ParentalConsentTypeId !== ParentalConsentTypesEnum.PendingConsent) {
                            break;
                        }
                        earliestPending = new Date(consent.ParentalConsentDateEntered);
                    }
                    date = earliestPending;
                }
                this.consent = `${consents[0].StudentParentalConsentType.Name} - ${date.toDateString()}`;
            }
            this.setConfig();
        }
    }

    setConfig(): void {
        this.formFactory = new StudentDynamicConfig<IStudent>(this.student, this.schools);
        const config = this.student.Id === 0 ? this.formFactory.getForCreate() : this.formFactory.getForUpdate();
        this.viewOnly = config?.viewOnly?.map((x) => new DynamicLabel(x));
        this.formObject = config?.formObject?.map((x) => new DynamicField(x));

        if (this.student.Id === 0) {
            // new student
            this.isEditing = true;
        }
    }

    edit(): void {
        if (this.canEdit) {
            this.isEditing = true;
        }
    }

    cancelClick(): void {
        if (this.student.Id === 0) {
            void this.router.navigate([`/admin/students`]);
        } else {
            this.isEditing = false;
        }
    }

    districtSelected(districtId: number): void {
        this.schoolService.getDistrictSchools(districtId).subscribe((schools) => {
            this.schools = schools;
            this.setConfig();
        });
    }

    formSubmitted(form: UntypedFormGroup): void {
        if (form.valid) {
            this.formFactory.assignFormValues(this.student, form.value.Student as IStudent);
            this.saveStudent();
        } else {
            markAllFormFieldsAsTouched(form);
            this.notificationsService.error('Save failed.  Please check the form and try again.');
        }
    }

    private saveStudent(): void {
        if (!this.student.Id || this.student.Id === 0) {
            // handle new student save
            this.studentService.create(this.student).subscribe((answer) => {
                void this.router.navigate([`/admin/students/${answer}`]);
                this.success();
            });
        } else {
            // handle existing student save
            this.student.School = null;
            this.studentService.update(this.student).subscribe(() => {
                this.isEditing = false;
                this.success();
                this.setConfig();
            });
        }
    }

    private success(): void {
        this.studentService.emitChange(this.student);
        this.notificationsService.success('Student saved successfully.');
    }
}
