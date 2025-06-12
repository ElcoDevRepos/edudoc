import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize } from 'rxjs/operators';

import { markAllFormFieldsAsTouched } from '@mt-ng2/common-functions';
import { NotificationsService } from '@mt-ng2/notifications-module';

import { SchoolDistrictRosterIssuesDynamicConfig } from '../school-district-roster-issues.dynamic-config';
import { SchoolDistrictRosterIssuesService } from '../school-district-roster-issues.service';

import { DatePipe } from '@angular/common';
import { IMergeDTO } from '@model/interfaces/custom/merge.dto';
import { ISchool } from '@model/interfaces/school';
import { ISchoolDistrictRoster } from '@model/interfaces/school-district-roster';
import { IStudent } from '@model/interfaces/student';
import { IStudentParentalConsentType } from '@model/interfaces/student-parental-consent-type';
import { DynamicField, DynamicLabel } from '@mt-ng2/dynamic-form';
import { SchoolService } from '@school-district-admin/school-districts/services/school.service';
import { StudentParentalConsentTypeService } from '@school-district-admin/students/studentparentalconsenttype.service';
import { forkJoin } from 'rxjs';
import { IMergedStudentResult } from '../school-district-roster-issues-merge/school-district-roster-issues-merge.component';
import { IModalOptions } from '@mt-ng2/modal-module';
import { ParentalConsentTypesEnum } from '@model/enums/parental-consent-types.enum';

export enum StudentMergeStatuses {
    UNTOUCHED,
    MERGED,
    KEPT,
}
export interface IStudentWithMergeStatus {
    student: IStudent;
    mergeStatus: StudentMergeStatuses;
}
@Component({
    selector: 'app-school-district-roster-issues-basic-info',
    templateUrl: './school-district-roster-issues-basic-info.component.html',
})
export class SchoolDistrictRosterIssuesBasicInfoComponent implements OnInit {
    private _schoolDistrictRoster: ISchoolDistrictRoster;
    @Input('schoolDistrictRoster')
    set schoolDistrictRoster(sdr: ISchoolDistrictRoster) {
        this._schoolDistrictRoster = sdr;
        this.mergeDTO.Roster = sdr;
    }
    get schoolDistrictRoster(): ISchoolDistrictRoster {
        return this._schoolDistrictRoster;
    }
    @Input() isMerging: boolean;
    isHovered: boolean;
    viewOnly: DynamicLabel[] = [];
    formObject: DynamicField[] = [];
    formFactory: SchoolDistrictRosterIssuesDynamicConfig<ISchoolDistrictRoster>;
    doubleClickIsDisabled = false;
    effectiveDate: string;
    mergeDTO: IMergeDTO = {
        StudentIds: [],
        Roster: null,
        Student: null,
        ParentalConsentEffectiveDate: new Date(),
        ParentalConsentTypeId: ParentalConsentTypesEnum.PendingConsent,
    };
    nextRosterIssueId: number;
    order = 'FirstName';
    orderDirection: 'Asc';

    private _studentsToMerge: IStudentWithMergeStatus[] = [];
    get studentsToMerge(): IStudentWithMergeStatus[] {
        return this._studentsToMerge;
    }
    set studentsToMerge(students: IStudentWithMergeStatus[]) {
        this._studentsToMerge = students;
    }

    get unprocessedStudents(): IStudentWithMergeStatus[] {
        return this._studentsToMerge.filter((s) => s.mergeStatus === StudentMergeStatuses.UNTOUCHED);
    }

    @Input() currentStudent: IStudentWithMergeStatus;
    @Output() currentStudentChange = new EventEmitter<IStudentWithMergeStatus>();
    get currentIndex(): number {
        return this._studentsToMerge.indexOf(this.currentStudent);
    }

    schools: ISchool[];
    consentTypes: IStudentParentalConsentType[];

    // Modal Parameters
    showModal = false;
    modalOptions: IModalOptions = {
        customClass: {
            title: 'text-center',
        },
        showCancelButton: true,
        showCloseButton: false,
        showConfirmButton: true,
        width: '50%',
    };

    constructor(
        private schoolDistrictRosterIssuesService: SchoolDistrictRosterIssuesService,
        private studentParentalConsentTypeService: StudentParentalConsentTypeService,
        private notificationsService: NotificationsService,
        private schoolService: SchoolService,
        private router: Router,
        private route: ActivatedRoute,
    ) {}

    ngOnInit(): void {
        const queryParams = this.route.snapshot.queryParams;
        if (queryParams) {
            this.order = queryParams.order;
            this.orderDirection = queryParams.orderDirection;
        }
        forkJoin([
            this.schoolService.getDistrictSchools(this.schoolDistrictRoster.SchoolDistrictId),
            this.studentParentalConsentTypeService.getAll(),
            this.schoolDistrictRosterIssuesService.getNextRosterIssueId(this.schoolDistrictRoster.Id, this.order, this.orderDirection),
        ]).subscribe(([schools, consentTypes, nextRosterIssueId]) => {
            this.schools = schools;
            this.consentTypes = consentTypes;
            this.nextRosterIssueId = nextRosterIssueId;
            if (this.schoolDistrictRoster.HasDuplicates) {
                this.getDuplicateStudentByRosterId(this.schoolDistrictRoster.Id);
            }
            this.setConfig();
        });
        this.effectiveDate = new DatePipe('en-US').transform(new Date(Date.now()), 'MMM d, y');
    }

    setConfig(): void {
        this.formFactory = new SchoolDistrictRosterIssuesDynamicConfig<ISchoolDistrictRoster>(
            this.schoolDistrictRoster,
            null,
            this.schools,
            this.consentTypes,
        );
        const config = this.formFactory.getForUpdate();
        this.viewOnly = config?.viewOnly?.map((x) => new DynamicLabel(x));
        this.formObject = config?.formObject?.map((x) => new DynamicField(x));
    }

    formSubmitted(form: UntypedFormGroup): void {
        if (form.valid) {
            this.formFactory.assignFormValues(this.schoolDistrictRoster, form.value.SchoolDistrictRoster as ISchoolDistrictRoster);
            const selectedSchoolBuilding: string = this.schools.find((s) => s.Id === form.get('SchoolDistrictRoster.SchoolBuilding').value).Name;
            this.schoolDistrictRoster.SchoolBuilding = selectedSchoolBuilding;
            this.saveSchoolDistrictRoster();
        } else {
            markAllFormFieldsAsTouched(form);
            this.notificationsService.error('Save failed.  Please check the form and try again.');
        }
    }

    private saveSchoolDistrictRoster(): void {
        this.schoolDistrictRosterIssuesService.update(this.schoolDistrictRoster).subscribe((roster) => {
            this.schoolDistrictRoster = roster as ISchoolDistrictRoster;
            this.success();
        });
    }

    private success(): void {
        this.schoolDistrictRosterIssuesService.emitChange(this.schoolDistrictRoster);
        if (!this.schoolDistrictRoster.HasDuplicates) {
            void this.router.navigate(['/school-district-admin/students/issues']);
        } else {
            this.isMerging = true;
        }
        this.notificationsService.success('School District Roster saved successfully.');
    }

    getDuplicateStudentByRosterId(id: number): void {
        this.schoolDistrictRosterIssuesService.getDuplicatesByRosterId(id).subscribe((students) => {
            if (!students || !students.length) {
                this.notificationsService.error('Duplicate students not found.');
                void this.router.navigate(['/school-district-admin/students/issues']);
            } else {
                forkJoin([
                    this.schoolService.getDistrictSchools(this.schoolDistrictRoster.SchoolDistrictId),
                    this.studentParentalConsentTypeService.getAll(),
                ]).subscribe(([schools, consentTypes]) => {
                    this.schools = schools;
                    this.consentTypes = consentTypes;
                    this.studentsToMerge = students.map((s) => {
                        return { student: s, mergeStatus: StudentMergeStatuses.UNTOUCHED };
                    });
                    this.currentStudent = this.studentsToMerge[0];
                    this.setConfig();
                });
            }
        });
    }

    processStudent({ data: mergedStudentResult, mergeStatus: status }: { data: IMergedStudentResult; mergeStatus: StudentMergeStatuses }): void {
        if (status === StudentMergeStatuses.KEPT) {
            this.keep(mergedStudentResult);
        }
        if (status === StudentMergeStatuses.MERGED) {
            this.mergeStudent(mergedStudentResult);
        }
    }

    keep(student: IMergedStudentResult): void {
        this.mergeDTO.StudentIds = this.mergeDTO.StudentIds.filter((id) => id !== student.StudentId);

        this.currentStudent.mergeStatus = StudentMergeStatuses.KEPT;
        this.currentStudentChange.emit(this.currentStudent);
    }

    mergeStudent(student: IMergedStudentResult): void {
        // Add student id to DTO
        this.mergeDTO.StudentIds.push(student.StudentId);

        // Mark student as merged in queue
        this.currentStudent.mergeStatus = StudentMergeStatuses.MERGED;
        this.currentStudentChange.emit(this.currentStudent);
    }

    completeMerge(): void {
        this.schoolDistrictRosterIssuesService.mergeRoster(this.mergeDTO).subscribe(() => {
            this.notificationsService.success('Merge complete');
            void this.router.navigate(['/school-district-admin/students/issues']);
        });
    }

    goPrevConflict(): void {
        const nextIndex = (this.currentIndex - 1) % this.studentsToMerge.length;
        this.currentStudent = this.studentsToMerge[nextIndex];
    }

    goNextConflict(): void {
        const nextIndex = (this.currentIndex + 1) % this.studentsToMerge.length;
        this.currentStudent = this.studentsToMerge[nextIndex];
    }

    get allStudentsAreProcessed(): boolean {
        return !this.studentsToMerge.some((s) => s.mergeStatus === StudentMergeStatuses.UNTOUCHED);
    }

    toggleModal(): void {
        this.showModal = !this.showModal;
    }

    removeIssue(): void {
        this.schoolDistrictRosterIssuesService.delete(this.schoolDistrictRoster.Id).subscribe(() => {
            this.notificationsService.success('Roster Archived Successfully');
            void this.router.navigate(['school-district-admin/students/issues']);
        });
    }

    skipIssue(): void {
        if (this.nextRosterIssueId) {
            void this.router.navigateByUrl('school-district-admin/', { skipLocationChange: true }).then(
                () =>
                    void this.router.navigate(['school-district-admin/students/issues', this.nextRosterIssueId], {
                        queryParams: { order: this.order, orderDirection: this.orderDirection },
                    }),
            );
        } else {
            void this.router.navigate(['school-district-admin/students/issues']);
        }
    }
}
