import { Component, Input, OnInit } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { finalize } from 'rxjs/operators';

import { markAllFormFieldsAsTouched } from '@mt-ng2/common-functions';
import { NotificationsService } from '@mt-ng2/notifications-module';

import { StudentService } from '@common/services/student.service';
import { ISchool } from '@model/interfaces/school';
import { IStudent } from '@model/interfaces/student';
import { DynamicField, DynamicLabel } from '@mt-ng2/dynamic-form';
import { SchoolService } from '@school-district-admin/school-districts/services/school.service';
import { SchoolDistrictAdminUserService } from '@school-district-admin/users/services/school-district-admin-user.service';
import { StudentDynamicConfig } from '../student.dynamic-config';

@Component({
    selector: 'app-student-basic-info',
    templateUrl: './student-basic-info.component.html',
})
export class StudentBasicInfoComponent implements OnInit {
    @Input() student: IStudent;
    @Input() canEdit: boolean;

    schoolOptions: ISchool[];

    isEditing: boolean;
    isHovered: boolean;
    viewOnly: DynamicLabel[] = [];
    formObject: DynamicField[] = [];
    formFactory: StudentDynamicConfig<IStudent>;
    doubleClickIsDisabled = false;

    get studentName(): string {
        return `${this.student.LastName}, ${this.student.FirstName}`;
    }

    constructor(
        private studentService: StudentService,
        private schoolService: SchoolService,
        private userService: SchoolDistrictAdminUserService,
        private notificationsService: NotificationsService,
        private router: Router,
        ) {}

    ngOnInit(): void {
        this.isEditing = false;
        this.schoolService.getDistrictSchools(this.userService.getAdminDistrictId()).subscribe((schools) => {
            this.schoolOptions = schools;
            this.setConfig();
        });
    }

    setConfig(): void {
        this.formFactory = new StudentDynamicConfig<IStudent>(this.student, this.schoolOptions);
        const config = this.formFactory.getForUpdate();
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
            void this.router.navigate([`/school-district-admin/students-list`]);
        } else {
            this.isEditing = false;
        }
    }

    formSubmitted(form: UntypedFormGroup): void {
        if (form.valid) {
            this.formFactory.assignFormValues(this.student, form.value.Student as IStudent);
            this.student.DistrictId = this.userService.getAdminDistrictId();
            if (!this.student.Id || this.student.Id === 0) {
                // handle new student save
                this.studentService
                    .create(this.student)                    .subscribe((answer) => {
                        void this.router.navigate([`/school-district-admin/students-list/${answer}`]);
                        this.success();
                        this.studentService.emitChange(this.student);
                    });
            } else {
                // handle existing student save
                this.student.School = null;
                this.studentService
                    .update(this.student)                    .subscribe(() => {
                        this.isEditing = false;
                        this.success();
                        this.studentService.emitChange(this.student);
                        this.setConfig();
                    });
            }
        } else {
            markAllFormFieldsAsTouched(form);
            this.error();
        }
    }

    error(): void {
        this.notificationsService.error('Save failed.  Please check the form and try again.');
    }

    success(): void {
        this.notificationsService.success('Student saved successfully.');
    }
}
