import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { ExtraSearchParams, IEntitySearchParams, SearchParams } from '@mt-ng2/common-classes';
import { EntityListExportConfig, IColumnSortedEvent, IItemSelectedEvent, SortDirection } from '@mt-ng2/entity-list-module';

import { UntypedFormControl } from '@angular/forms';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { entityListModuleConfig } from '@common/shared.module';
import { IDistrictSummaryDto } from '@model/interfaces/custom/district-summary-dto.dto';
import { DynamicField, DynamicFieldType, DynamicFieldTypes, IDynamicFieldType } from '@mt-ng2/dynamic-form';
import { ActivitySummaryService } from '@school-district-admin/reports/services/activity-summary.service';
import { SchoolDistrictAdminUserService } from '@school-district-admin/users/services/school-district-admin-user.service';

import { HttpResponse } from '@angular/common/http';
import { UserTypesEnum } from '@model/enums/user-types.enum';
import { IDistrictSummaryResponseDTO, IDistrictSummaryTotalsResponseDTO } from '@model/interfaces/custom/district-summary-response-dto.dto';
import { IUserDetailCustomOptions } from '@model/interfaces/custom/user-detail-custom-options';
import { AuthService } from '@mt-ng2/auth-module';
import { BackButtonService } from '@mt-ng2/back-button-module';
import { BackButtonRouterLinks } from '@mt-ng2/back-button-module/lib/libraries/router-links.library';
import { CompletedActivitySummaryEntityListConfig, OpenActivitySummaryEntityListConfig } from '@school-district-admin/reports/activity-summary.entity-list-config';
import moment from 'moment';
import { Observable, Subscription, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import { IStudent } from '@model/interfaces/student';
import { IActivitySummaryDistrict } from '@model/interfaces/activity-summary-district';
import { IActivitySummaryServiceArea } from '@model/interfaces/activity-summary-service-area';
import { ISearchFilterDaterangeValue } from '@mt-ng2/search-filter-daterange-control';

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
    selector: 'app-activity-summary',
    templateUrl: './activity-summary.component.html',
})
export class ActivitySummaryComponent {
    summaries: IActivitySummaryServiceArea[] = [];
    completedSummaries: IDistrictSummaryDto[] = [];
    openPendingReferrals: number;
    openReturnedEncounters: number;
    openEncountersReadyForFinalESign: number;
    openScheduledEncounters: number;
    pendingEvaluations: number;
    missingAddresses: number;
    studentList: IStudent[] = [];
    totalsLoaded = false;

    currentPage = 1;
    itemsPerPage = entityListModuleConfig.itemsPerPage;
    total: number;
    openEntityListConfig = new OpenActivitySummaryEntityListConfig('Service Area', this.activitySummaryService);
    completedEntityListConfig = new CompletedActivitySummaryEntityListConfig('Service Area');
    order = 'Id';
    orderDirection: string = this.openEntityListConfig.getDefaultSortDirection();

    districtId: number;
    serviceAreaId: number;
    activitySummaryServiceAreaId: number;
    completed = false;

    today = new Date();
    dateSelected = new Date();
    startDate: Date;
    endDate: Date;
    date = new UntypedFormControl(moment());

    subscriptions: Subscription = new Subscription();
    isAdmin = false;

    links: BackButtonRouterLinks[] = [{url: '/admin/summary-report'}];

    activitySummaryDistrict: IActivitySummaryDistrict;

    constructor(
        private activitySummaryService: ActivitySummaryService,
        private userService: SchoolDistrictAdminUserService,
        private router: Router,
        private route: ActivatedRoute,
        private authService: AuthService,
        private backButtonService: BackButtonService,
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
        this.openEntityListConfig.export = new EntityListExportConfig({
            exportName: `Activity Summary`,
            getDataForExport: this.getSummariesForExport.bind(this),
        });
        this.completedEntityListConfig.export = new EntityListExportConfig({
            exportName: `Completed Activity Summary`,
            getDataForExport: this.getCompletedSummariesForExport.bind(this),
        });
        if (this.isAdmin) {
            this.backButtonService.routerLinks.next(this.links);
            this.activitySummaryService.getActivitySummaryDistrictById(+this.route.snapshot.paramMap.get('activitySummaryDistrictId')).subscribe((answer) => {
                this.activitySummaryDistrict = answer;
                this.totalsLoaded = true;
                this.getSummaries();
            });
        } else {
            this.activitySummaryService.getActivitySummaryDistrictByDistrictId(this.districtId).subscribe((answer) => {
                this.activitySummaryDistrict = answer;
                this.totalsLoaded = true;
                this.getSummaries();
            });
        }
    }

    private buildSearch(options = { forExport: false }): IEntitySearchParams {
        const _extraSearchParams = [
            new ExtraSearchParams({
                name: 'month',
                value: (this.dateSelected.getMonth() + 1).toString(),
            }),
            new ExtraSearchParams({
                name: 'year',
                value: this.dateSelected.getFullYear().toString(),
            }),
            new ExtraSearchParams({
                name: 'districtId',
                value: this.districtId.toString(),
            }),
            new ExtraSearchParams({
                name: 'isAdmin',
                value: this.isAdmin ? '1' : '0',
            }),
        ];

        const searchEntity: IEntitySearchParams = {
            extraParams: _extraSearchParams,
            order: this.order,
            orderDirection: this.orderDirection,
            query: '',
            skip: options.forExport ? undefined : (this.currentPage - 1) * this.itemsPerPage,
            take: options.forExport ? undefined : this.itemsPerPage,
        };

        return searchEntity;
    }

    getSummariesCall(options = { forExport: false }): Observable<HttpResponse<IActivitySummaryServiceArea[]>> {
        const searchparams = new SearchParams(this.buildSearch(options));

        // get summaries for the given summary district id
        searchparams.extraParams?.push(new ExtraSearchParams({
            name: 'ActivitySummaryDistrictId',
            value: this.activitySummaryDistrict.Id.toString()
        }));

        return this.activitySummaryService.getActivitySummaryServiceAreas(searchparams);
    }

    getCompletedSummariesCall(options = { forExport: false }): Observable<HttpResponse<IDistrictSummaryResponseDTO>> {
        const searchparams = new SearchParams(this.buildSearch(options));

        // get summaries for the given summary district id
        searchparams.extraParams?.push(new ExtraSearchParams({
            name: 'ActivitySummaryDistrictId',
            value: this.activitySummaryDistrict.Id ? this.activitySummaryDistrict.Id.toString() : '0'
        }));

        searchparams.extraParams?.push(new ExtraSearchParams({
            name: 'isCompleted',
            value: '1'
        }));

        return this.activitySummaryService.getCompletedActivitySummaryServiceAreas(searchparams);
    }

    getSummaries(): void {
        forkJoin([this.getSummariesCall(), this.getCompletedSummariesCall()]).subscribe((answer) => {
            const [summaries, completedSummaries] = answer;
            this.summaries = summaries.body;
            this.total = this.summaries.length;
            this.completedSummaries = completedSummaries.body.Summaries;
        })
    }

    getSummariesForExport(): Observable<IActivitySummaryServiceArea[]> {
        return this.getSummariesCall().pipe(map((answer) => answer.body));
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
        const item = event.entity as IActivitySummaryServiceArea | IDistrictSummaryDto;
        if (!this.completed) { // item selected is IActivitySummaryServiceArea only when Completed Only is unchecked
            this.activitySummaryService.setActivitySummaryServiceArea(item as IActivitySummaryServiceArea);
        } else {
            const activitySummaryServiceArea = this.summaries.find(s => s.ServiceAreaId === event.entity.Id);
            this.activitySummaryService.setActivitySummaryServiceArea(activitySummaryServiceArea);
        }
        if (this.isAdmin) {
            void this.router.navigate(['/admin/summary-report/activity-summary/service-area-activity-summary']);
        } else {
            void this.router.navigate(['/school-district-admin/service-area-activity-summary']);
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
        this.missingAddresses = summary.TotalMissingAddresses;
        this.studentList = summary.StudentMissingAddresses;
        this.totalsLoaded = true;
    }
}
