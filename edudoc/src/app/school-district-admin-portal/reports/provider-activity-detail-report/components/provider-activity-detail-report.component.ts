import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { ExtraSearchParams, IEntitySearchParams, SearchParams } from '@mt-ng2/common-classes';

import { HttpResponse } from '@angular/common/http';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { ServiceTypeService } from '@common/services/service-type.service';
import { StudentService } from '@common/services/student.service';
import { UserTypesEnum } from '@model/enums/user-types.enum';
import { IDistrictSummaryDto } from '@model/interfaces/custom/district-summary-dto.dto';
import { IDistrictSummaryResponseDTO, IDistrictSummaryTotalsResponseDTO } from '@model/interfaces/custom/district-summary-response-dto.dto';
import { IUserDetailCustomOptions } from '@model/interfaces/custom/user-detail-custom-options';
import { AuthService } from '@mt-ng2/auth-module';
import { BackButtonService } from '@mt-ng2/back-button-module';
import { BackButtonRouterLinks } from '@mt-ng2/back-button-module/lib/libraries/router-links.library';
import { IMetaItem } from '@mt-ng2/base-service';
import { ActivitySummaryService } from '@school-district-admin/reports/services/activity-summary.service';
import { SchoolDistrictAdminUserService } from '@school-district-admin/users/services/school-district-admin-user.service';
import { Observable, Subscription } from 'rxjs';

export const emptySelectOption: IMetaItem = {
    Id: 0,
    Name: '<< All >>',
};

export const MY_FORMATS = {
    display: {
        dateA11yLabel: 'LL',
        dateInput: 'MM/YYYY',
        monthYearA11yLabel: 'MMMM YYYY',
        monthYearLabel: 'MMM YYYY',
    },
    parse: {
        dateInput: 'MM/YYYY',
    },
  };

@Component({
    providers: [
        {
            deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
            provide: DateAdapter,
            useClass: MomentDateAdapter,
        },

        {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
    ],
    selector: 'app-provider-activity-detail-report',
    templateUrl: './provider-activity-detail-report.component.html',
})
export class ProviderActivityDetailReportComponent {
    summaries: IDistrictSummaryDto[];
    openPendingReferrals: number;
    openReturnedEncounters: number;
    openEncountersReadyForFinalESign: number;
    openScheduledEncounters: number;
    pendingEvaluations: number;
    totalsLoaded = false;

    providerId: number;
    districtId: number;
    providerName: string;
    completed = false;
    serviceTypes: IMetaItem[];
    students: IMetaItem[];

    links: BackButtonRouterLinks[] = [
        {url: '/school-district-admin/service-area-activity-summary',},
        {url: '/school-district-admin/activity-summary',},
    ];

    adminLinks: BackButtonRouterLinks[] = [
        {url: '/admin/summary-report/activity-summary/service-area-activity-summary',},
        {url: '/admin/summary-report/activity-summary',},
    ];

    subscriptions: Subscription = new Subscription();
    isAdmin = false;

    constructor(
        private activitySummaryService: ActivitySummaryService,
        private studentService: StudentService,
        private serviceTypeService: ServiceTypeService,
        private userService: SchoolDistrictAdminUserService,
        private backButtonService: BackButtonService,
        private router: Router,
        private route: ActivatedRoute,
        private authService: AuthService,
    ) {}

    ngOnInit(): void {
        this.subscriptions.add(
            this.authService.currentUser.subscribe((user) => {
                const customOption = user.CustomOptions as IUserDetailCustomOptions;
                this.isAdmin = customOption.UserTypeId === UserTypesEnum.Admin;
                this.activitySummaryService.isAdmin = this.isAdmin;
            }),
        );
        this.activitySummaryService.getDistrictId().subscribe((id) => {
            if (id > 0) {
                this.districtId = id;
            } else {
                this.districtId = this.userService.getAdminDistrictId();
            }
        });
        this.backButtonService.routerLinks.next(this.links);
        const id = +this.route.snapshot.paramMap.get('providerId');
        if (id) {
            this.providerId = id;
            this.serviceTypeService.getAll().subscribe((serviceTypes) => {
                this.serviceTypes = [...serviceTypes].map(
                    (serviceType) =>
                        ({
                            Id: serviceType.Id,
                            Name: serviceType.Name,
                        }));
                this.serviceTypes.push({ ...emptySelectOption });
                this.getSummaries(true);
                this.getStudents();
            });
        } else {
            if (this.isAdmin) {
                void this.router.navigate(['/admin/summary-report/activity-summary']); // if no id found, go back to list
            } else {
                void this.router.navigate(['/school-district-admin/activity-summary']); // if no id found, go back to list
            }
        }
    }

    private buildSearch(): IEntitySearchParams {
        const _extraSearchParams = [
            new ExtraSearchParams({
                name: 'districtId',
                value: this.districtId.toString(),
            }),
            new ExtraSearchParams({
                name: 'providerId',
                value: this.providerId.toString(),
            }),
            new ExtraSearchParams({
                name: 'EndDate',
                value: new Date().toISOString(),
            }),
            new ExtraSearchParams({
                name: 'isAdmin',
                value: this.isAdmin ? '1' : '0',
            }),
        ];

        const searchEntity: IEntitySearchParams = {
            extraParams: _extraSearchParams,
            query: '',
            take: 9999,
        };

        return searchEntity;
    }

    getSummariesCall(): Observable<HttpResponse<IDistrictSummaryResponseDTO>> {
        const searchparams = new SearchParams(this.buildSearch());

        return this.activitySummaryService.getActivitySummaries(searchparams);
    }

    getTotalsCall(): Observable<HttpResponse<IDistrictSummaryTotalsResponseDTO>> {
        const searchparams = new SearchParams(this.buildSearch());

        return this.activitySummaryService.getActivitySummariesTotals(searchparams);
    }

    getSummaries(initial = false): void {
        this.getSummariesCall().subscribe((answer) => {
            this.summaries = answer.body.Summaries;
            this.providerName = answer.body.Summaries[0]?.Name;

            if (!this.totalsLoaded && initial) {
                this.getTotalsCall().subscribe((answer) => {
                    this.assignTotals(answer.body);
                });
            }
        });
    }

    getStudents(): void {
        const _extraSearchParams: ExtraSearchParams[] = [];

        _extraSearchParams.push(
            new ExtraSearchParams({
                name: 'districtId',
                value: this.districtId.toString(),
            }),
            new ExtraSearchParams({
                name: 'providerId',
                value: this.providerId.toString(),
            }),
        );

        const searchEntity: IEntitySearchParams = {
            extraParams: _extraSearchParams,
            order: 'LastName',
            query: '',
        };

        const searchparams = new SearchParams(searchEntity);
        this.studentService.getStudents(searchparams).subscribe((answer) => {
            this.students = answer.body.map(
                (student) =>
                    ({
                        Id: student.Id,
                        Name: `${student.Student.LastName}, ${student.Student.FirstName}`,
                    }));
            this.students.push({ ...emptySelectOption });
        });
    }

    assignTotals(summary: IDistrictSummaryTotalsResponseDTO): void {
        this.openEncountersReadyForFinalESign = summary.TotalEncountersReadyForFinalESign;
        this.openPendingReferrals = summary.TotalPendingReferrals;
        this.openReturnedEncounters = summary.TotalReturnedEncounters;
        this.openScheduledEncounters = summary.TotalScheduledEncounters;
        this.pendingEvaluations = summary.TotalPendingEvaluations;

        this.totalsLoaded = true;
    }
}
