import { Component, Input, OnInit } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { debounceTime, map } from 'rxjs/operators';

import { markAllFormFieldsAsTouched } from '@mt-ng2/common-functions';
import { NotificationsService } from '@mt-ng2/notifications-module';

import { MergeStudentsService } from '../merge-students.service';

import { DatePipe } from '@angular/common';
import { StudentService } from '@common/services/student.service';
import { ParentalConsentTypesEnum } from '@model/enums/parental-consent-types.enum';
import { IMergeDTO } from '@model/interfaces/custom/merge.dto';
import { ISelectOptions } from '@model/interfaces/custom/select-options';
import { IStudentSelectOptions } from '@model/interfaces/custom/student-select-options';
import { ISchool } from '@model/interfaces/school';
import { IStudent } from '@model/interfaces/student';
import { IStudentParentalConsent } from '@model/interfaces/student-parental-consent';
import { ExtraSearchParams } from '@mt-ng2/common-classes';
import { DynamicField, DynamicLabel } from '@mt-ng2/dynamic-form';
import { ISelectionChangedEvent, ITypeAheadAPI } from '@mt-ng2/type-ahead-control/lib/libraries/type-ahead.library';
import { SchoolService } from '@school-district-admin/school-districts/services/school.service';
import { SchoolDistrictAdminUserService } from '@school-district-admin/users/services/school-district-admin-user.service';
import { forkJoin, Observable } from 'rxjs';
import { MergeStudentsDynamicConfig } from '../merge-students.dynamic-config';

@Component({
    selector: 'app-merge-students-basic-info',
    templateUrl: './merge-students-basic-info.component.html',
})
export class MergeStudentsBasicInfoComponent implements OnInit {
    private _student: IStudent;
    @Input('student')
    set student(student: IStudent) {
        this._student = student;
        this.mergeDTO.Student = student;
    }
    get student(): IStudent {
        return this._student;
    }
    @Input() isMerging: boolean;
    districtId: number;
    isHovered: boolean;
    viewOnly: DynamicLabel[] = [];
    formObject: DynamicField[] = [];
    formFactory: MergeStudentsDynamicConfig<IStudent>;
    doubleClickIsDisabled = false;
    effectiveDate: string;
    mergeDTO: IMergeDTO = {
        StudentIds: [],
        Roster: null,
        Student: null,
        ParentalConsentEffectiveDate: null,
        ParentalConsentTypeId: null,
        MergingIntoStudentId: null,
        StudentMergeInto: null,
    };

    studentOptions: ISelectOptions[];
    typeAheadControl: ITypeAheadAPI;

    schools: ISchool[];
    studentToMerge: IStudent;

    latestConsent?: IStudentParentalConsent;
    latestConsentToMerge?: IStudentParentalConsent;

    constructor(
        private mergeStudentsService: MergeStudentsService,
        private studentsService: StudentService,
        private userService: SchoolDistrictAdminUserService,
        private notificationsService: NotificationsService,
        private schoolService: SchoolService,
    ) {}

    ngOnInit(): void {
        forkJoin([this.schoolService.getDistrictSchools(this.userService.getAdminDistrictId()), this.getStudentsFunction()]).subscribe(
            ([schools, studentOptions]) => {
                this.schools = schools;
                this.studentOptions = studentOptions;
                this.setConfig();
            },
        );
        this.effectiveDate = new DatePipe('en-US').transform(new Date(Date.now()), 'MMM d, y');
    }

    setConfig(): void {
        this.formFactory = new MergeStudentsDynamicConfig<IStudent>(this.student, null, this.schools);
        const config = this.formFactory.getForUpdate();
        this.viewOnly = config?.viewOnly?.map((x) => new DynamicLabel(x));
        this.formObject = config?.formObject?.map((x) => new DynamicField(x));

        if (this.student.StudentParentalConsents?.length) {
            this.latestConsent = this.student.StudentParentalConsents.reduce((latest, c) =>
                c.ParentalConsentEffectiveDate > latest.ParentalConsentEffectiveDate ? c : latest,
            );
        }
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
        this.studentsService.update(this.student).subscribe(() => {
            this.notificationsService.success('Student updated successfully.');
            this.studentsService.emitChange(this.student);
            this.setConfig();
        });
    }

    private getStudentsFunction(): Observable<ISelectOptions[]> {
        return this.mergeStudentsService
            .getStudentOptions({
                extraParams: [
                    new ExtraSearchParams({
                        name: 'studentId',
                        value: this.student.Id.toString(),
                    }),
                ],
                query: '',
            })
            .pipe(
                debounceTime(300),
                map((resp) => resp.body),
            );
    }

    studentSelected(event: ISelectionChangedEvent): void {
        const selectedStudent = <IStudentSelectOptions>event.selection;
        if (selectedStudent) {
            this.studentToMerge = null;
            setTimeout(() => {
                this.studentsService.getById(selectedStudent.Id).subscribe((student) => {
                    this.studentToMerge = student;
                    this.typeAheadControl.setValue(null);
                    if (this.studentToMerge.StudentParentalConsents?.length) {
                        this.latestConsentToMerge = this.studentToMerge.StudentParentalConsents.reduce((latest, c) =>
                            c.ParentalConsentEffectiveDate > latest.ParentalConsentEffectiveDate ? c : latest,
                        );
                    }
                });
            });
        }
    }

    typeAheadControlReady(controlApi: ITypeAheadAPI): void {
        this.typeAheadControl = controlApi;
        setTimeout(() => {
            this.typeAheadControl.focus();
        }, 999);
    }

    mergeStudent(): void {
        // Initialize mergeDTO with studentToMerge and necessary IDs
        this.mergeDTO.Student = this.studentToMerge;
        this.mergeDTO.StudentIds.push(this.studentToMerge.Id);
        this.mergeDTO.Student.Address = this.studentToMerge.Address;
        this.mergeDTO.MergingIntoStudentId = this.student.Id;
        this.mergeDTO.StudentMergeInto = this.student;

        let chosenConsent: IStudentParentalConsent | undefined;

        // If one is undefined/null, choose the other.
        if (!this.latestConsent || !this.latestConsentToMerge) {
            chosenConsent = this.latestConsent ?? this.latestConsentToMerge;
        } else if (
            // If they're not the same type...
            this.latestConsent.ParentalConsentTypeId !== this.latestConsentToMerge.ParentalConsentTypeId &&
            // And one of them is pending consent...
            (this.latestConsent.ParentalConsentTypeId === ParentalConsentTypesEnum.PendingConsent ||
                this.latestConsentToMerge.ParentalConsentTypeId === ParentalConsentTypesEnum.PendingConsent)
        ) {
            // Pick the one that isn't pending consent.
            chosenConsent =
                this.latestConsent.ParentalConsentTypeId === ParentalConsentTypesEnum.PendingConsent ? this.latestConsentToMerge : this.latestConsent;
        } else {
            //Otherwise, they're either both pending consent or they're both confirmed/denied consent, so we just take the latest one.
            chosenConsent =
                this.latestConsent.ParentalConsentEffectiveDate > this.latestConsentToMerge.ParentalConsentEffectiveDate
                    ? this.latestConsent
                    : this.latestConsentToMerge;
        }

        if (chosenConsent) {
            this.mergeDTO.ParentalConsentTypeId = chosenConsent.ParentalConsentTypeId;
            this.mergeDTO.ParentalConsentEffectiveDate = chosenConsent.ParentalConsentEffectiveDate;
        }

        // Call mergeStudentsService to merge students
        this.mergeStudentsService.mergeStudent(this.mergeDTO).subscribe(() => {
            // Reset studentToMerge
            this.studentToMerge = null;
            // Notify success
            this.notificationsService.success('Student merged successfully.');
            // Refresh student options
            this.getStudentsFunction().subscribe((studentOptions) => {
                this.studentOptions = studentOptions;
            });
        });
    }
}
