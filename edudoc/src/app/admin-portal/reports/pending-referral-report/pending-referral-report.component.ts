import { ProviderTitleService } from '@admin/provider-titles/services/provider-title.service';
import { ProviderService } from '@admin/providers/provider.service';
import { SchoolDistrictService } from '@admin/school-districts/services/schooldistrict.service';
import { Component, OnInit } from '@angular/core';
import { entityListModuleConfig } from '@common/entity-list-module-config';
import { IProvider } from '@model/interfaces/provider';
import { ISchoolDistrict } from '@model/interfaces/school-district';
import { ExtraSearchParams, IEntitySearchParams, SearchParams } from '@mt-ng2/common-classes';
import { MtSearchFilterItem } from '@mt-ng2/search-filter-select-control';
import { ISelectionChangedEvent, VirtualTypeAheadGetItemsFunction } from '@mt-ng2/type-ahead-control';
import { Observable, debounceTime, forkJoin, map } from 'rxjs';
import { PendingReferralReportEntityListConfig } from './pending-referral-report.entity-list-config';
import { IPendingReferral } from '@model/interfaces/pending-referral';
import { PendingReferralService } from '../pending-referrals.service';
import { IPendingReferralReportJobRun } from '@model/interfaces/pending-referral-report-job-run';
import { NotificationsService } from '@mt-ng2/notifications-module';
import { EntityListExportConfig } from '@mt-ng2/entity-list-module';
import { HttpResponse } from '@angular/common/http';

@Component({
    selector: 'app-pending-referral-report',
    templateUrl: './pending-referral-report.component.html',
})
export class PendingReferralReportComponent implements OnInit {
    pendingReferrals: IPendingReferral[];
    currentPage = 1;
    query = '';
    total: number;
    entityListConfig = new PendingReferralReportEntityListConfig();
    order = this.entityListConfig.getDefaultSortProperty();
    orderDirection: string = this.entityListConfig.getDefaultSortDirection();

    schoolDistrictIdFilter = 0;
    providerIdFilter = 0;

    getSchoolDistricts: VirtualTypeAheadGetItemsFunction = this.getSchoolDistrictsFunction.bind(this);
    getProviders: VirtualTypeAheadGetItemsFunction = this.getProvidersFunction.bind(this);

    districtSearchFilterItems: MtSearchFilterItem[] = [];
    providerTitleSearchFilterItems: MtSearchFilterItem[] = [];
    providerSearchFilterItems: MtSearchFilterItem[] = [];
    studentSearchFilterItems: MtSearchFilterItem[] = [];

    lastJobRun: IPendingReferralReportJobRun;

    constructor(
        private providerTitleService: ProviderTitleService,
        private schoolDistrictService: SchoolDistrictService,
        private providerService: ProviderService,
        private pendingReferralService: PendingReferralService,
        private notificationsService: NotificationsService,
    ) {}

    ngOnInit(): void {
        forkJoin([
            this.providerTitleService.getSelectOptions(),
            this.pendingReferralService.getLastJobRun(),
        ]).subscribe((result) => {
            const [providerTitles, lastJobRun] = result;
            this.providerTitleSearchFilterItems = providerTitles.map((pt) => new MtSearchFilterItem(pt, false));
            this.lastJobRun = lastJobRun;
        });

        this.entityListConfig.export = new EntityListExportConfig({
            exportName: 'Pending Referrals',
            getDataForExport: this.getDataForExport.bind(this)
        });
    }

    private getDataForExport(): Observable<IPendingReferral[]> {
        return this.getPendingReferralsCall({ forExport: true })
            .pipe(
                map((res) => res.body)
            );
    }

    getPendingReferralsCall(options = { forExport: false }): Observable<HttpResponse<IPendingReferral[]>> {
        const search = this.query?.length > 0 ? this.query : '';
        const _extraSearchParams = this.buildSearch();

        const searchEntity: IEntitySearchParams = {
            extraParams: _extraSearchParams,
            order: this.order,
            orderDirection: this.orderDirection,
            query: search && search.length > 0 ? search : '',
            skip: options.forExport
                    ? undefined
                    : (this.currentPage - 1) * entityListModuleConfig.itemsPerPage,
            take: options.forExport
                    ? undefined
                    : entityListModuleConfig.itemsPerPage,
        };

        const searchparams = new SearchParams(searchEntity);
        return this.pendingReferralService.get(searchparams);
    }

    getPendingReferrals(): void {
        this.getPendingReferralsCall().subscribe((res) => {
            this.pendingReferrals = res.body;
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
        const providerTitleIds: number[] = this.getSelectedFilters(this.providerTitleSearchFilterItems);
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
                name: 'ProviderTitleIds',
                valueArray: providerTitleIds,
            }),
        );

        _extraSearchParams.push(
            new ExtraSearchParams({
                name: 'lastJobRunId',
                value: this.lastJobRun ? this.lastJobRun?.Id.toString() : '0',
            }),
        )

        return _extraSearchParams;
    }

    private getSelectedFilters(filterObj: MtSearchFilterItem[]): number[] {
        return filterObj.filter((item) => item.Selected).map((item) => item.Item.Id);
    }

    getFilterSchoolDistrictSearchbar(event: ISelectionChangedEvent): void {
        this.schoolDistrictIdFilter = (<ISchoolDistrict>event.selection)?.Id ?? 0;
    }

    getFilterProviderSearchbar(event: ISelectionChangedEvent) {
        this.providerIdFilter = (<IProvider>event.selection)?.Id ?? 0;
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

}
