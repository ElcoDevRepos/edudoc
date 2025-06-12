import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { archiveConfirm, unarchiveConfirm } from '@common/mtConfirmOptions/mtConfirmOptions';
import { ICaseLoad } from '@model/interfaces/case-load';
import { IEncounterLocation } from '@model/interfaces/encounter-location';
import { IStudentTherapy } from '@model/interfaces/student-therapy';
import { ExtraSearchParams, IEntitySearchParams, SearchParams } from '@mt-ng2/common-classes';
import { DynamicField, DynamicFieldType, DynamicFieldTypes, IDynamicFieldType } from '@mt-ng2/dynamic-form';
import { SortDirection } from '@mt-ng2/entity-list-module';
import { NotificationsService } from '@mt-ng2/notifications-module';
import { StudentTherapyService } from '@provider/case-load/services/student-therapy.service';
import { EncounterLocationService } from '@provider/common/services/encounter-location.service';
import { finalize } from 'rxjs/operators';
import getListOfDays from './list-of-days-formatter.library';
import { ProviderStudentService } from '@provider/case-load/services/provider-student.service';

@Component({
    selector: 'app-student-therapy',
    templateUrl: './student-therapy.component.html',
})
export class StudentTherapiesComponent implements OnInit {
    @Input() caseLoad: ICaseLoad;
    @Input() canEdit: boolean;
    @Input() isAdding = false;
    @Input() studentId: number;
    @Input() providerId: number;

    studentTherapies: IStudentTherapy[] = [];
    encounterLocations: IEncounterLocation[];
    adding = false;
    query = '';
    total: number;
    doubleClickIsDisabled = false;
    includeArchived = false;
    isHovered: boolean;
    isCardOpen = false;

    managedSchedule: ICaseLoad;
     
    studentTherapyForArchival: IStudentTherapy;

    archiveConfirm = archiveConfirm;
    unarchiveConfirm = unarchiveConfirm;
    weekdayFormattingFunction = getListOfDays;

    constructor(
        private studentTherapyService: StudentTherapyService,
        private encounterLocationService: EncounterLocationService,
        private notificationService: NotificationsService,
        private router: Router,
        private studentService: ProviderStudentService
    ) {}

    ngOnInit(): void {
        this.encounterLocationService.getItems().subscribe((encounterLocations) => {
            this.encounterLocations = encounterLocations;
            this.refreshStudentTherapies();
        });

        this.studentService.managedScheduleArchiveUpdated$.subscribe((caseLoad) => { 
            this.managedSchedule = caseLoad; 

            if(this.managedSchedule.Archived === true) {
                this.managedSchedule.StudentTherapies.forEach(st => {
                    this.archiveStudentTherapy(st);
                });
            }
        });
    }

    getStudentTherapies(): void {
        const search = this.query;
        const _extraSearchParams: ExtraSearchParams[] = this.buildSearch();

        const searchEntity: IEntitySearchParams = {
            extraParams: _extraSearchParams,
            order: 'Id',
            orderDirection: SortDirection.Desc,
            query: search && search.length > 0 ? search : '',
            take: 9999,
        };

        const searchparams = new SearchParams(searchEntity);
        this.studentTherapyService.get(searchparams).subscribe((answer) => {
            this.studentTherapies = answer.body;
            this.studentTherapies = this.studentTherapies.filter((st) => st.ProviderId && st.ProviderId === this.providerId);
            this.total = +answer.headers.get('X-List-Count');
        });
    }

    private buildSearch(): ExtraSearchParams[] {
        const _extraSearchParams: ExtraSearchParams[] = [];

        _extraSearchParams.push(
            new ExtraSearchParams({
                name: 'CaseLoadId',
                value: this.caseLoad.Id.toString(),
            }),
        );

        _extraSearchParams.push(
            new ExtraSearchParams({
                name: 'includeArchived',
                value: this.includeArchived ? '1' : '0',
            }),
        );

        return _extraSearchParams;
    }

    saveStudentTherapy(studentTherapy: IStudentTherapy): void {
        this.studentTherapyService
            .create(studentTherapy)            .subscribe(() => {
                this.success();
            });
    }

    private success(): void {
        this.getStudentTherapies();
        this.notificationService.success('Methods saved successfully.');
    }

    getArchivedField(): DynamicField {
        return new DynamicField({
            formGroup: null,
            label: 'Include Archived',
            name: 'includeArchived',
            type: new DynamicFieldType({
                fieldType: DynamicFieldTypes.Checkbox,
            }),
            value: this.includeArchived,
        });
    }

    archiveStudentTherapy(studentTherapy: IStudentTherapy): void {
        studentTherapy.Archived = !studentTherapy.Archived;
        this.studentTherapyService.update(studentTherapy).subscribe(() => {
            this.notificationService.success('Student Therapy Updated Successfully');
            this.getStudentTherapies();
        });
    }

    editStudentTherapy(studentTherapy: IStudentTherapy): void {
        this.studentTherapyForArchival = studentTherapy;
        this.adding = true;
    }

    toggleCardOpen(): void {
        this.isCardOpen = !this.isCardOpen;
    }

    refreshStudentTherapies(): void {
        this.getStudentTherapies();
    }

    goToSchedules(studentTherapy: IStudentTherapy): void {
        void this.router.navigate(['provider', 'case-load', 'schedules', 'list'], {
            queryParams: { studentTherapyId: studentTherapy.Id, studentId: this.studentId },
        });
    }

    getTherapyName(therapy: IStudentTherapy): string {
        return therapy.TherapyGroup ? therapy.TherapyGroup.Name : (therapy.SessionName ? therapy.SessionName : 'Individual');
    }
}
