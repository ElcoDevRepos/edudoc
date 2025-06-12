import { Component, Input, OnInit } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { finalize } from 'rxjs/operators';

import { markAllFormFieldsAsTouched } from '@mt-ng2/common-functions';
import { NotificationsService } from '@mt-ng2/notifications-module';

import { DatePipe } from '@angular/common';
import { IMergeCaseUploadDTO } from '@model/interfaces/custom/merge-case-upload.dto';
import { IProviderCaseUpload } from '@model/interfaces/provider-case-upload';
import { ISchool } from '@model/interfaces/school';
import { IStudentParentalConsentType } from '@model/interfaces/student-parental-consent-type';
import { DynamicField, DynamicLabel } from '@mt-ng2/dynamic-form';
import { SchoolService } from '@school-district-admin/school-districts/services/school.service';
import {
    IStudentWithMergeStatus,
    StudentMergeStatuses,
} from '@school-district-admin/students/school-district-roster-issues/school-district-roster-issues-basic-info/school-district-roster-issues-basic-info.component';
import { StudentParentalConsentTypeService } from '@school-district-admin/students/studentparentalconsenttype.service';
import { forkJoin } from 'rxjs';
import { IMergedStudentResultCaseUpload } from '../provider-case-upload-issues-merge/provider-case-upload-issues-merge.component';
import { ProviderCaseUploadIssuesDynamicConfig } from '../provider-case-upload-issues.dynamic-config';
import { ProviderCaseUploadIssuesService } from '../provider-case-upload-issues.service';
import { ProviderService } from '@admin/providers/provider.service';
import { ISelectOptions } from '@model/interfaces/custom/select-options';
import { UserService } from '@admin/users/services/user.service';

@Component({
    selector: 'app-provider-case-upload-issues-basic-info',
    templateUrl: './provider-case-upload-issues-basic-info.component.html',
})
export class ProviderCaseUploadIssuesBasicInfoComponent implements OnInit {
    private _providerCaseUpload: IProviderCaseUpload;
    @Input('providerCaseUpload')
    set providerCaseUpload(pcu: IProviderCaseUpload) {
        this._providerCaseUpload = pcu;
        this.mergeDTO.CaseUpload = pcu;
    }
    get providerCaseUpload(): IProviderCaseUpload {
        return this._providerCaseUpload;
    }
    @Input() isMerging: boolean;
    isHovered: boolean;
    viewOnly: DynamicLabel[] = [];
    formObject: DynamicField[] = [];
    formFactory: ProviderCaseUploadIssuesDynamicConfig<IProviderCaseUpload>;
    doubleClickIsDisabled = false;
    effectiveDate: string;
    mergeDTO: IMergeCaseUploadDTO = {
        StudentIds: [],
        CaseUpload: null,
        Student: null,
        ParentalConsentEffectiveDate: null,
        ParentalConsentTypeId: null,
    };

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

    schools: ISchool[];
    providers: ISelectOptions[];
    consentTypes: IStudentParentalConsentType[];

    constructor(
        private providerCaseUploadIssuesService: ProviderCaseUploadIssuesService,
        private studentParentalConsentTypeService: StudentParentalConsentTypeService,
        private notificationsService: NotificationsService,
        private schoolService: SchoolService,
        private providerService: ProviderService,
        private router: Router,
        private userService: UserService,
    ) {}

    ngOnInit(): void {
        forkJoin([
            this.schoolService.getDistrictSchools(this.providerCaseUpload.DistrictId),
            this.studentParentalConsentTypeService.getAll(),
            this.providerService.getSelectOptionsByDistrictId(this.userService.getAdminDistrictId()),
        ]).subscribe(([schools, consentTypes, providers]) => {
            this.schools = schools;
            this.consentTypes = consentTypes;
            this.providers = providers;
            this.setConfig();
        });
        this.effectiveDate = new DatePipe('en-US').transform(new Date(Date.now()), 'MMM d, y');
    }

    setConfig(): void {
        this.formFactory = new ProviderCaseUploadIssuesDynamicConfig<IProviderCaseUpload>(
            this.providerCaseUpload,
            null,
            this.schools,
            this.consentTypes,
            this.providers,
        );
        const config = this.formFactory.getForUpdate();
        this.viewOnly = config?.viewOnly?.map((x) => new DynamicLabel(x));
        this.formObject = config?.formObject?.map((x) => new DynamicField(x));
    }

    formSubmitted(form: UntypedFormGroup): void {
        if (form.valid) {
            this.formFactory.assignFormValues(this.providerCaseUpload, form.value.ProviderCaseUpload as IProviderCaseUpload);
            const selectedSchoolBuilding: string|undefined = this.schools.find((s) => s.Id === form.get('ProviderCaseUpload.School').value)?.Name;
            this.providerCaseUpload.School = selectedSchoolBuilding;
            this.saveProviderCaseUpload();
        } else {
            markAllFormFieldsAsTouched(form);
            this.notificationsService.error('Save failed.  Please check the form and try again.');
        }
    }

    private saveProviderCaseUpload(): void {
        this.providerCaseUploadIssuesService.update(this.providerCaseUpload).subscribe((roster) => {
            this.providerCaseUpload = roster;
            this.success();
        });
    }

    private success(): void {
        this.providerCaseUploadIssuesService.emitChange(this.providerCaseUpload);
        if (!this.providerCaseUpload.HasDuplicates) {
            void this.router.navigate(['/school-district-admin/students/case-upload-issues']);
        } else {
            this.isMerging = true;
        }
        this.notificationsService.success('Provider Case Upload saved successfully.');
    }

    processStudent({
        data: mergedStudentResult,
        mergeStatus: status,
    }: {
        data: IMergedStudentResultCaseUpload;
        mergeStatus: StudentMergeStatuses;
    }): void {
        if (status === StudentMergeStatuses.KEPT) {
            this.keep(mergedStudentResult);
        }
        if (status === StudentMergeStatuses.MERGED) {
            this.mergeStudent(mergedStudentResult);
        }
        this.studentsToMerge = this.studentsToMerge.filter((student) => student.mergeStatus === StudentMergeStatuses.UNTOUCHED);
    }

    keep(student: IMergedStudentResultCaseUpload): void {
        this.studentsToMerge.find((s) => student.StudentId === s.student.Id).mergeStatus = StudentMergeStatuses.KEPT;
    }

    mergeStudent(student: IMergedStudentResultCaseUpload): void {
        // Add student id to DTO
        this.mergeDTO.StudentIds.push(student.StudentId);

        // Mark student as merged in queue
        this.studentsToMerge.find((s) => student.StudentId === s.student.Id).mergeStatus = StudentMergeStatuses.MERGED;
    }

    completeMerge(): void {
        this.providerCaseUploadIssuesService.mergeRoster(this.mergeDTO).subscribe(() => {
            this.notificationsService.success('Merge complete');
            void this.router.navigate(['/students/case-upload-issues']);
        });
    }

    get allStudentsAreProcessed(): boolean {
        return !this.studentsToMerge.some((s) => s.mergeStatus === StudentMergeStatuses.UNTOUCHED);
    }
}
