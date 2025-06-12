import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { ExtraSearchParams, IEntitySearchParams, SearchParams } from '@mt-ng2/common-classes';
import { EntityListExportConfig, IColumnSortedEvent, IItemSelectedEvent, SortDirection } from '@mt-ng2/entity-list-module';

import { UntypedFormControl } from '@angular/forms';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { entityListModuleConfig } from '@common/shared.module';
import { IDistrictSummaryDto } from '@model/interfaces/custom/district-summary-dto.dto';
import { DynamicField, DynamicFieldType, DynamicFieldTypes } from '@mt-ng2/dynamic-form';
import { ActivitySummaryService } from '@school-district-admin/reports/services/activity-summary.service';
import { SchoolDistrictAdminUserService } from '@school-district-admin/users/services/school-district-admin-user.service';

import { HttpResponse } from '@angular/common/http';
import { UserTypesEnum } from '@model/enums/user-types.enum';
import { IActivitySummaryProvider } from '@model/interfaces/activity-summary-provider';
import { IActivitySummaryProviderResponseDTO } from '@model/interfaces/custom/activity-summary-provider-response.dto';
import { IDistrictSummaryResponseDTO, IDistrictSummaryTotalsResponseDTO } from '@model/interfaces/custom/district-summary-response-dto.dto';
import { IUserDetailCustomOptions } from '@model/interfaces/custom/user-detail-custom-options';
import { AuthService } from '@mt-ng2/auth-module';
import { BackButtonService } from '@mt-ng2/back-button-module';
import { BackButtonRouterLinks } from '@mt-ng2/back-button-module/lib/libraries/router-links.library';
import { ISearchFilterDaterangeValue } from '@mt-ng2/search-filter-daterange-control';
import {
    ActivitySummaryByProvidersEntityListConfig,
    CompletedActivitySummaryByProviderEntityListConfig
} from '@school-district-admin/reports/activity-summary.entity-list-config';
import moment from 'moment';
import { Observable, Subscription, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';

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

        { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
    ],
    selector: 'app-service-area-activity-summary',
    templateUrl: './service-area-activity-summary.component.html',
})
export class ServiceAreaActivitySummaryComponent {
    summaries: IActivitySummaryProvider[];
    completedSummaries: IDistrictSummaryDto[] = [];
    openPendingReferrals: number;
    openReturnedEncounters: number;
    openEncountersReadyForFinalESign: number;
    openScheduledEncounters: number;
    pendingEvaluations: number;
    totalsLoaded = false;

    currentPage = 1;
    itemsPerPage = entityListModuleConfig.itemsPerPage;
    total: number;
    totalCompleted: number;
    openEntityListConfig = new ActivitySummaryByProvidersEntityListConfig('Provider Name', this.activitySummaryService);
    completedEntityListConfig = new CompletedActivitySummaryByProviderEntityListConfig('Provider Name');
    order = 'Id';
    orderDirection: string = this.openEntityListConfig.getDefaultSortDirection();

    districtId: number;
    serviceAreaId: number;
    activitySummaryServiceAreaId: number;
    serviceArea: string;
    completed = false;

    today = new Date();
    dateSelected = new Date();
    startDate: Date;
    endDate: Date;
    date = new UntypedFormControl(moment());

    subscriptions: Subscription = new Subscription();
    isAdmin = false;

    links: BackButtonRouterLinks[] = [{ url: '/school-district-admin/activity-summary' }];

    constructor(
        private activitySummaryService: ActivitySummaryService,
        private userService: SchoolDistrictAdminUserService,
        private router: Router,
        private backButtonService: BackButtonService,
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
            if(this.isAdmin) {
                this.backButtonService.routerLinks.next([{url: `/admin/summary-report/activity-summary/${this.districtId}`}])
            } else {
                this.backButtonService.routerLinks.next(this.links);
            }
        });
        this.activitySummaryService.getActivitySummaryServiceArea().subscribe((resp) => {
            if (resp && resp.Id > 0) {
                this.serviceAreaId = resp.ServiceAreaId;
                this.activitySummaryServiceAreaId = resp.Id;
                this.serviceArea = resp.ServiceCode.Name;
                this.openEntityListConfig.export = new EntityListExportConfig({
                    exportName: `Activity Summary`,
                    getDataForExport: this.getSummariesForExport.bind(this),
                });
                this.completedEntityListConfig.export = new EntityListExportConfig({
                    exportName: `Activity Summary`,
                    getDataForExport: this.getCompletedSummariesForExport.bind(this),
                });
                this.getSummaries(true);
            } else {
                if (this.isAdmin) {
                    void this.router.navigate(['/admin/summary-report/activity-summary']);
                } else {
                    void this.router.navigate(['/school-district-admin/activity-summary']);
                }
            }
        });
    }

    private buildSearch(options = { forExport: false }): IEntitySearchParams {
        const _extraSearchParams = [
            new ExtraSearchParams({
                name: 'districtId',
                value: this.districtId.toString(),
            }),
            new ExtraSearchParams({
                name: 'activitySummaryServiceAreaId',
                value: this.activitySummaryServiceAreaId.toString(),
            }),
            new ExtraSearchParams({
                name: 'serviceAreaId',
                value: this.serviceAreaId.toString(),
            }),
            new ExtraSearchParams({
                name: 'isAdmin',
                value: this.isAdmin ? '1' : '0',
            }),
        ];

        if (this.startDate) {
            _extraSearchParams.push(
                new ExtraSearchParams({
                    name: 'StartDate',
                    value: this.startDate.toISOString(),
                }),
            );
        }

        if (this.endDate) {
            _extraSearchParams.push(
                new ExtraSearchParams({
                    name: 'EndDate',
                    value: this.endDate.toISOString(),
                }),
            );
        }

        const searchEntity: IEntitySearchParams = {
            extraParams: _extraSearchParams,
            order: this.order,
            orderDirection: this.orderDirection,
            query: '',
            skip: !options.forExport ? (this.currentPage - 1) * entityListModuleConfig.itemsPerPage : null,
            take: !options.forExport ? entityListModuleConfig.itemsPerPage : null,
        };

        return searchEntity;
    }

    getSummariesCall(options = { forExport: false }): Observable<HttpResponse<IActivitySummaryProviderResponseDTO>> {
        const searchparams = new SearchParams(this.buildSearch(options));
        return this.activitySummaryService.getActivitySummaryProviders(searchparams);
    }

    getCompletedSummariesCall(options = { forExport: false }): Observable<HttpResponse<IDistrictSummaryResponseDTO>> {
        const searchparams = new SearchParams(this.buildSearch(options));
        searchparams.extraParams?.push(
            new ExtraSearchParams({
                name: 'isCompleted',
                value: '1',
            }),
        );
        return this.activitySummaryService.getCompletedActivitySummaryProviders(searchparams);
    }

    getTotalsCall(): Observable<HttpResponse<IDistrictSummaryTotalsResponseDTO>> {
        const searchparams = new SearchParams(this.buildSearch());

        return this.activitySummaryService.getActivitySummariesTotals(searchparams);
    }

    getSummaries(initial = false): void {
        if (!this.totalsLoaded && initial) {
            this.getTotalsCall().subscribe((answer) => {
                this.assignTotals(answer.body);
                this.totalsLoaded = true;
            });
        }
        forkJoin([this.getSummariesCall(), this.getCompletedSummariesCall()]).subscribe((answer) => {
            const [summariesAll, completedSummaries] = answer;
            this.summaries = summariesAll.body.Results;
            this.total = summariesAll.body.Total;

            this.completedSummaries = completedSummaries.body.Summaries;
            this.totalCompleted = completedSummaries.body.Total;
        });
    }

    getSummariesForExport(): Observable<IActivitySummaryProvider[]> {
        return this.getSummariesCall()
            .pipe(map((answer) => answer.body.Results));
    }

    getCompletedSummariesForExport(): Observable<IDistrictSummaryDto[]> {
        return this.getCompletedSummariesCall().pipe(map((answer) => answer.body.Summaries));
    }

    filterSelectionChanged(): void {
        this.currentPage = 1;
        this.getSummaries();
    }

    columnSorted(event: IColumnSortedEvent): void {
        this.order = event.column.sort.sortProperty;
        this.orderDirection = event.column.sort.direction === SortDirection.Desc ? 'desc' : 'asc';
        this.getSummaries();
    }

    summarySelected(event: IItemSelectedEvent): void {
        const item = event.entity as IActivitySummaryProvider | IDistrictSummaryDto;
        if (!this.completed) {
            // item selected is IActivitySummaryProvider only when Completed Only is unchecked
            this.activitySummaryService.setActivitySummaryProvider(item as IActivitySummaryProvider);
        } else {
            const activitySummaryProvider = this.summaries.find((s) => s.ProviderId === event.entity.ProviderId);
            this.activitySummaryService.setActivitySummaryProvider(activitySummaryProvider);
        }
        if (this.isAdmin) {
            void this.router.navigate(['/admin/summary-report/provider-activity-detail-report', event.entity.ProviderId]);
        } else {
            void this.router.navigate(['/school-district-admin/provider-activity-detail-report', event.entity.ProviderId]);
        }
    }

    getCompletedField(): DynamicField {
        return new DynamicField({
            formGroup: null,
            label: 'Completed Only',
            name: 'completed',
            type: new DynamicFieldType({
                fieldType: DynamicFieldTypes.Checkbox,
            }),
            value: this.completed,
        });
    }

    dateSelectionChanged(range: ISearchFilterDaterangeValue): void {
        this.startDate = range.startDate;
        this.endDate = range.endDate;
        this.date.setValue(this.dateSelected);
        this.getSummaries();
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
