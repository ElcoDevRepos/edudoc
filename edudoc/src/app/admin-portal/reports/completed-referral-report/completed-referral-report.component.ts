import { ProviderService } from '@admin/providers/provider.service';
import { SchoolDistrictService } from '@admin/school-districts/services/schooldistrict.service';
import { Component, OnInit } from '@angular/core';
import { entityListModuleConfig } from '@common/entity-list-module-config';
import { ServiceCodeService } from '@common/services/service-code.service';
import { ICompletedReferralReportDto } from '@model/interfaces/custom/completed-referral-report.dto';
import { ExtraSearchParams, IEntitySearchParams, SearchParams } from '@mt-ng2/common-classes';
import { MtSearchFilterItem } from '@mt-ng2/search-filter-select-control';
import { ProviderStudentReferralsService } from '@provider/case-load/services/provider-student-referrals.service';
import { Observable, debounceTime, forkJoin, map } from 'rxjs';
import { ReportService } from '../reports.service';
import { CompletedReferralReportEntityListConfig } from './completed-referral-report.entity-list-config';
import { ISelectionChangedEvent, VirtualTypeAheadGetItemsFunction } from '@mt-ng2/type-ahead-control';
import { IProvider } from '@model/interfaces/provider';
import { ISchoolDistrict } from '@model/interfaces/school-district';
import { IColumnSortedEvent, SortDirection } from '@mt-ng2/entity-list-module';

@Component({
    selector: 'app-completed-referral-report',
    templateUrl: './completed-referral-report.component.html',
})
export class CompletedReferralReportComponent implements OnInit {
    completedReferrals: ICompletedReferralReportDto[];
    currentPage = 1;
    query = '';
    total = 0;
    entityListConfig = new CompletedReferralReportEntityListConfig();
    order = this.entityListConfig.getDefaultSortProperty();
    orderDirection: string = this.entityListConfig.getDefaultSortDirection();
    reportIds: number[];

    schoolDistrictIdFilter = 0;
    providerIdFilter = 0;

    getSchoolDistricts: VirtualTypeAheadGetItemsFunction = this.getSchoolDistrictsFunction.bind(this);
    getProviders: VirtualTypeAheadGetItemsFunction = this.getProvidersFunction.bind(this);

    districtSearchFilterItems: MtSearchFilterItem[] = [];
    serviceAreaSearchFilterItems: MtSearchFilterItem[] = [];
    schoolYearSearchFilterItems: MtSearchFilterItem[] = [];
    studentSearchFilterItems: MtSearchFilterItem[] = [];
    providerSearchFilterItems: MtSearchFilterItem[] = [];
    fiscalYearSearchFilterItems: MtSearchFilterItem[] = [];

    constructor(
        private reportService: ReportService, private serviceAreaService: ServiceCodeService,
        private schoolDistrictService: SchoolDistrictService,
        private providerStudentReferralsService: ProviderStudentReferralsService,
        private providerService: ProviderService,
    ) {}

    ngOnInit(): void {
        forkJoin(
            this.serviceAreaService.getSearchFilterItems(),
        ).subscribe((result) => {
            const [serviceAreas] = result;
            this.serviceAreaSearchFilterItems = serviceAreas;
        });
        for (let i = 1; i <= 12; i++) {
            this.schoolYearSearchFilterItems.push(new MtSearchFilterItem(({Id: i, Name: i.toString()}), false));
        }

        const START_YEAR = 2012;
        const CURRENT_YEAR = new Date().getFullYear();
        const FISCAL_YEAR_COUNT = CURRENT_YEAR - START_YEAR;

        for (let i = 0; i <= FISCAL_YEAR_COUNT; i++) {
            const startDate = new Date(START_YEAR + i, 6, 1).toLocaleDateString(undefined, { month: '2-digit', day: '2-digit', year: 'numeric' });
            const endDate = new Date(START_YEAR + i + 1, 5, 30).toLocaleDateString(undefined, { month: '2-digit', day: '2-digit', year: 'numeric' });

            this.fiscalYearSearchFilterItems.push(new MtSearchFilterItem({
                Id: i + 1,  // Ensuring Id starts at 1
                Name: `${startDate} - ${endDate}`
            }, false));
        }
    }

    getPendingReferrals(): void {
        const search = this.query?.length > 0 ? this.query : '';
        const _extraSearchParams = this.buildSearch();

        const searchEntity: IEntitySearchParams = {
            extraParams: _extraSearchParams,
            order: this.order,
            orderDirection: this.orderDirection,
            query: search && search.length > 0 ? search : '',
            skip: (this.currentPage - 1) * entityListModuleConfig.itemsPerPage,
            take: entityListModuleConfig.itemsPerPage,
        };

        const searchparams = new SearchParams(searchEntity);
        this.reportService.getCompletedReferralReport(searchparams).subscribe((res) => {
            this.completedReferrals = res.body.Item1;
            this.reportIds = res.body.Item2;
            this.total = +res.headers.get('X-List-Count');
        });
    }

    private getSchoolDistrictsFunction(searchText: string): Observable<ISchoolDistrict[]> {
        return this.schoolDistrictService
            .search({
                query: searchText,
            })
            .pipe(
                debounceTime(300),
                map((resp) => resp.body),
            );
    }

    private getProvidersFunction(searchText: string): Observable<IProvider[]> {
        return this.providerService
            .searchProviders({
                query: searchText,
            })
            .pipe(
                debounceTime(300),
                map((resp) => resp.body)
            );
    }

    private buildSearch(): ExtraSearchParams[] {
        const serviceAreaIds: number[] = this.getSelectedFilters(this.serviceAreaSearchFilterItems);
        const schoolYearIds: number[] = this.getSelectedFilters(this.schoolYearSearchFilterItems);
        const fiscalYearIds: number[] = this.getSelectedFilters(this.fiscalYearSearchFilterItems);
        const _extraSearchParams: ExtraSearchParams[] = [];

        _extraSearchParams.push(
            new ExtraSearchParams({
                name: 'districtId',
                value: this.schoolDistrictIdFilter !== null ? this.schoolDistrictIdFilter.toString() : '0',
            }),
        );

        _extraSearchParams.push(
            new ExtraSearchParams({
                name: 'providerId',
                value: this.providerIdFilter !== null ? this.providerIdFilter.toString()  : '0',
            }),
        );

        _extraSearchParams.push(
            new ExtraSearchParams({
                name: 'ServiceAreaIds',
                valueArray: serviceAreaIds,
            }),
        );

        _extraSearchParams.push(
            new ExtraSearchParams({
                name: 'SchoolYearIds',
                valueArray: schoolYearIds,
            }),
        );

        _extraSearchParams.push(
            new ExtraSearchParams({
                name: 'FiscalYearIds',
                valueArray: fiscalYearIds,
            }),
        );

        return _extraSearchParams;
    }

    private getSelectedFilters(filterObj: MtSearchFilterItem[]): number[] {
        return filterObj.filter((item) => item.Selected).map((item) => item.Item.Id);
    }

    getFilterSchoolDistrictSearchbar(event: ISelectionChangedEvent): void {
        this.schoolDistrictIdFilter = event.selection !== null ? (<ISchoolDistrict>event.selection).Id : this.schoolDistrictIdFilter;
    }

    getFilterProviderSearchbar(event: ISelectionChangedEvent) {
        this.providerIdFilter = event.selection !== null ? (<IProvider>event.selection).Id : this.providerIdFilter;
    }

    getFilterSearchbar(event: string) {
        this.query = event;
    }

    applyClicked(applyEvent: Event) {
        if(applyEvent) {
            this.filterSelectionChanged();
        }
    }

    filterSelectionChanged(): void {
        this.currentPage = 1;
        this.getPendingReferrals();
    }

    printAllReferrals(): void {
        this.providerStudentReferralsService.viewAllReferrals(this.reportIds).subscribe((resultBlob: Blob) => {
            const fileContents = new Blob([resultBlob], {
                type: 'application/pdf',
            });
            const fileURL = URL.createObjectURL(fileContents);
            window.open(fileURL, '_blank');
        });
    }

    onColumnSorted(event: IColumnSortedEvent): void {
        this.order = event.column.sort.sortProperty;
        this.orderDirection = event.column.sort.direction === SortDirection.Desc ? 'desc' : 'asc';
        this.currentPage = 1;
        this.getPendingReferrals();
    }
}
