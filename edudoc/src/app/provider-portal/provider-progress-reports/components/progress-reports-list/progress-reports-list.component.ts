import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IProgressReportDto } from '@model/interfaces/custom/progress-report.dto';
import { IProgressReport } from '@model/interfaces/progress-report';
import { ExtraSearchParams, IEntitySearchParams, SearchParams } from '@mt-ng2/common-classes';
import { ProviderPortalAuthService } from '@provider/provider-portal-auth.service';
import { ProgressReportService } from '@provider/provider-progress-reports/services/progress-report.service';
import { ProgressReportsEntityListConfig } from './progress-reports.entity-list-config';
import { DynamicField, DynamicFieldType, DynamicFieldTypes, LabelPositions, SelectInputTypes } from '@mt-ng2/dynamic-form';
import { MetaItem } from '@mt-ng2/base-service';
import { QuarterEnum } from '@model/enums/progress-report-quarters.enum';
import { ProviderStudentService } from '@provider/case-load/services/provider-student.service';
import { IProgressReportPermissionsData } from '@model/interfaces/custom/progress-report-permissions.dto';

enum PendingOrCompleted {
    Pending = 1,
    Completed = 2,
}

@Component({
    selector: 'app-progress-reports-list',
    templateUrl: './progress-reports-list.component.html',
    styleUrls: ['./progress-reports-list.component.less']
})
export class ProgressReportsListComponent implements OnInit {
    studentsWithProgressReport: IProgressReportDto[] = [];
    currentPage = 1;
    query = '';
    total: number;
    entityListConfig = new ProgressReportsEntityListConfig();
    order = this.entityListConfig.getDefaultSortProperty();
    orderDirection: string = this.entityListConfig.getDefaultSortDirection();

    providerId: number;

    fieldFlag = true;

    permissions: IProgressReportPermissionsData;

    pendingOrCompletedField = new DynamicField({
        formGroup: '',
        label: 'Pending Or Completed?',
        name: 'PendingOrCompleted',
        type: new DynamicFieldType({
            fieldType: DynamicFieldTypes.Select,
        }),
        value: PendingOrCompleted.Pending,
        options: [
            { Name: 'Pending', Id: PendingOrCompleted.Pending },
            { Name: 'Completed', Id: PendingOrCompleted.Completed },
        ],
    });

    studentField = new DynamicField({
        formGroup: '',
        label: 'Student',
        name: 'StudentId',
        type: new DynamicFieldType({
            fieldType: DynamicFieldTypes.Select,
            inputType: SelectInputTypes.TypeAhead,
        }),
        placeholder: 'Loading...',
        options: [],
        value: null,
        disabled: true,
    });

    pendingOrCompleted = PendingOrCompleted.Pending;
    studentId: number | undefined;

    QuarterEnum = QuarterEnum;
    PendingOrCompletedEnum = PendingOrCompleted;

    constructor(
        private progressReportService: ProgressReportService,
        private router: Router,
        private providerPortalAuthService: ProviderPortalAuthService,
        private providerStudentService: ProviderStudentService,
    ) {}

    ngOnInit(): void {
        this.providerId = this.providerPortalAuthService.getProviderId();
        this.getStudentOptions();
        this.progressReportService.getProgressReportPermissions().subscribe((permissions) => {
            this.permissions = permissions;
        });
        this.getProgressReports();
    }

    getStudentOptions(): void {
        const extraParams = [
            new ExtraSearchParams({
                name: 'fromCaseload',
                value: '1',
            }),
            new ExtraSearchParams({
                name: 'providerId',
                value: this.providerId.toString(),
            }),
            new ExtraSearchParams({
                name: 'alsoIncludeAssistantStudents',
                value: '1',
            }),
        ];
        const searchParams = new SearchParams({
            query: '',
            extraParams: extraParams,
        });
        this.providerStudentService.getStudentOptions(searchParams).subscribe((options) => {
            this.studentField = null;
            setTimeout(() => {
                this.studentField = new DynamicField({
                    formGroup: '',
                    label: 'Student',
                    name: 'StudentId',
                    type: new DynamicFieldType({
                        fieldType: DynamicFieldTypes.Select,
                        inputType: SelectInputTypes.TypeAhead,
                    }),
                    options: options.body,
                    placeholder: 'All Students',
                    value: null,
                });
            }, 0);
        });
    }

    itemsPerPage = 100;
    getProgressReports(): void {
        const search = this.query;
        const _extraSearchParams: ExtraSearchParams[] = [];

        if (this.pendingOrCompleted) {
            _extraSearchParams.push(
                new ExtraSearchParams({
                    name: 'PendingOrCompleted',
                    value: this.pendingOrCompleted.toString(),
                }),
            );
        }
        if (this.studentId) {
            _extraSearchParams.push(
                new ExtraSearchParams({
                    name: 'StudentId',
                    valueArray: [this.studentId],
                }),
            );
        }

        const searchEntity: IEntitySearchParams = {
            extraParams: _extraSearchParams,
            order: this.order,
            orderDirection: this.orderDirection,
            query: search && search.length > 0 ? search : '',
            skip: (this.currentPage - 1) * this.itemsPerPage,
            take: this.itemsPerPage,
        };

        const searchparams = new SearchParams(searchEntity);
        this.progressReportService.getProgressReportsForList(searchparams).subscribe((answer) => {
            this.studentsWithProgressReport = answer.body;

            this.total = answer.count;
        });
    }

    search(query: string): void {
        this.currentPage = 1;
        this.query = query;
        this.getProgressReports();
    }

    progressReportSelectedById(studentId: number, prId: number): void {
        const report = this.studentsWithProgressReport.find(spr => spr.StudentId === studentId);
        void this.router.navigate([`/provider/progress-reports/old-reports/${prId}`], {
            queryParams: {
                supervisorId: report.SupervisorId
            }
        });
    }

    progressReportSelected(studentId: number, quarterId: number, supervisorId: number): void {
        void this.router.navigate([`/provider/progress-reports/${studentId}/${quarterId}`], {
            queryParams: {
                supervisorId: supervisorId,
            },
        });
    }

    getPreviousReportsDropdown(previousReports: IProgressReport[]): DynamicField {
        return new DynamicField({
            formGroup: '',
            label: '',
            name: '',
            labelPosition: { position: LabelPositions.Hidden, colsForLabel: null },
            options: previousReports.map(
                (pr) =>
                    new MetaItem(
                        pr.Id,
                        `${new Date(pr.StartDate).toLocaleDateString('en-US')} - ${new Date(pr.EndDate).toLocaleDateString('en-US')}`,
                    ),
            ),
            type: new DynamicFieldType({
                fieldType: DynamicFieldTypes.Select,
                inputType: SelectInputTypes.Dropdown,
            }),
            value: null,
        });
    }

    onPendingOrCompletedSelected(event: PendingOrCompleted): void {
        this.pendingOrCompleted = event;
        this.studentsWithProgressReport = [];
        this.getProgressReports();
    }
    onStudentSelected(event: number): void {
        this.studentId = event;
        this.getProgressReports();
    }

    clearSelection(): void {
        this.pendingOrCompleted = PendingOrCompleted.Pending;
        this.studentId = undefined;
        this.studentsWithProgressReport = [];
        this.fieldFlag = false;
        setTimeout(() => {
            this.fieldFlag = true;
            this.getProgressReports();
        }, 0);
    }

    getProgressReportsString(entity: IProgressReportDto, quarter: number): string {
        const progressReports = [
            entity.FirstQuarterProgressReports,
            entity.SecondQuarterProgressReports,
            entity.ThirdQuarterProgressReports,
            entity.FourthQuarterProgressReports,
        ][quarter - 1];

        if (progressReports.length === 0) {
            return `Add`;
        }

        const dateRange = [
            { start: entity.DateRanges.FirstQuarterStartDate, end: entity.DateRanges.FirstQuarterEndDate },
            { start: entity.DateRanges.SecondQuarterStartDate, end: entity.DateRanges.SecondQuarterEndDate },
            { start: entity.DateRanges.ThirdQuarterStartDate, end: entity.DateRanges.ThirdQuarterEndDate },
            { start: entity.DateRanges.FourthQuarterStartDate, end: entity.DateRanges.FourthQuarterEndDate },
        ][quarter - 1];

        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        return `${new Date(dateRange.start).mtDate.format('MM/DD/YYYY')} - ${new Date(dateRange.end).mtDate.format('MM/DD/YYYY')}`;
    }

    isProgressReportUnnecessary(entity: IProgressReportDto, quarter: number): boolean {
        return !entity.Quarters.includes(quarter);
    }

    isProgressReportCompleted(entity: IProgressReportDto, quarter: number): boolean {
        switch(quarter) {
            case QuarterEnum.First:
                return entity.FirstQuarterProgressReports.length > 0
            case QuarterEnum.Second:
                return entity.SecondQuarterProgressReports.length > 0
            case QuarterEnum.Third:
                return entity.ThirdQuarterProgressReports.length > 0
            case QuarterEnum.Fourth:
                return entity.FourthQuarterProgressReports.length > 0
            default:
                throw new Error("Invalid quarter passed")
        }
    }

    isProgressReportCompletedOrUnnecessary(entity: IProgressReportDto, quarter: number): boolean {
        return this.isProgressReportUnnecessary(entity, quarter) || this.isProgressReportCompleted(entity, quarter);
    }
}
