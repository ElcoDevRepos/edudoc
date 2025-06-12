import { HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { entityListModuleConfig } from '@common/shared.module';
import { IEncounter } from '@model/interfaces/encounter';
import { ExtraSearchParams, IEntitySearchParams, SearchParams } from '@mt-ng2/common-classes';
import {
    EntityListExportConfig,
    IColumnSortedEvent,
    ISelectionChangedEvent as IEntityListSelectionChangedEvent,
    SortDirection,
} from '@mt-ng2/entity-list-module';
import { ISearchFilterDaterangeValue } from '@mt-ng2/search-filter-daterange-control';
import { SchoolDistrictAdminUserService } from '@school-district-admin/users/services/school-district-admin-user.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { DistrictProgressReportService } from '../services/district-admin-progress-report.service';
import { DistrictAdminEncounterByTherapistService } from './district-admin-encounter-by-therapist.service';
import { EncounterByTherapistEntityListConfig } from './district-admin-encounters-list-by-therapist.entity-list-config';
import { ProviderService } from '@admin/providers/provider.service';
import { ISelectOptions } from '@model/interfaces/custom/select-options';
import { MtSearchFilterItem } from '@mt-ng2/search-filter-select-control';
import { ISelectionChangedEvent } from '@mt-ng2/type-ahead-control';
import { ProviderTitleService } from '@admin/provider-titles/services/provider-title.service';

@Component({
    selector: 'app-district-admin-encounters-list-by-therapist',
    templateUrl: './district-admin-encounters-list-by-therapist.component.html',
})
export class DistrictAdminEncountersByTherapistComponent implements OnInit {
    encounter: IEncounter[];
    currentPage = 1;
    query = '';
    total: number;
    entityListConfig = new EncounterByTherapistEntityListConfig();
    order = this.entityListConfig.getDefaultSortProperty();
    orderDirection: string = this.entityListConfig.getDefaultSortDirection();

    districtId: number;
    selectedEntities = [];

    returnedOnly = false;
    pendingEvaluationOnly = false;

    dateRange: ISearchFilterDaterangeValue;

    providers: ISelectOptions[];

    selectedProviderId: number;

    providerTitles: MtSearchFilterItem[] = [];

    constructor(
        private userService: SchoolDistrictAdminUserService,
        private districtAdminEncounterByTherapistService: DistrictAdminEncounterByTherapistService,
        private districtProgressReportService: DistrictProgressReportService,
        private providerService: ProviderService,
        private providerTitleService: ProviderTitleService,
    ) {}

    ngOnInit(): void {
        this.districtId = this.userService.getAdminDistrictId();
        this.entityListConfig.export = new EntityListExportConfig({
            exportName: `Encounters Report By Therapist`,
            getDataForExport: this.getEncountersForExport.bind(this),
        });
        this.dateRange = {
            startDate: this.districtProgressReportService.getCurrentSchoolYearStart(),
            endDate: null,
        };
        this.providerService.getSelectOptionsByDistrictId(this.districtId).subscribe((options) => {
            this.providers = options;
        });

        this.providerTitleService.getSelectOptions().subscribe((options) => {
            this.providerTitles = options.map((o) => new MtSearchFilterItem(o, false));
        });
    }

    getEncountersCall(options = { forExport: false }): Observable<HttpResponse<IEncounter[]>> {
        const providerTitleIds = this.providerTitles.filter((t) => t.Selected).map((t) => t.Item.Id);
        const search = this.query;
        const _extraSearchParams: ExtraSearchParams[] = [];
        _extraSearchParams.push(
            new ExtraSearchParams({
                name: 'returnedOnly',
                value: this.returnedOnly ? '1' : '0',
            }),
            new ExtraSearchParams({
                name: 'pendingEvaluationOnly',
                value: this.pendingEvaluationOnly ? '1' : '0',
            }),
            new ExtraSearchParams({
                name: 'minDate',
                value: this.dateRange?.startDate?.toISOString() ?? '',
            }),
            new ExtraSearchParams({
                name: 'maxDate',
                value: this.dateRange?.endDate?.toISOString() ?? '',
            }),
            new ExtraSearchParams({ name: 'providerTitleIds', valueArray: providerTitleIds }),
        );
        if (this.selectedProviderId) {
            _extraSearchParams.push(
                new ExtraSearchParams({
                    name: 'providerId',
                    value: this.selectedProviderId.toString(),
                }),
            );
        }

        const searchEntity: IEntitySearchParams = {
            extraParams: _extraSearchParams,
            order: this.order,
            orderDirection: this.orderDirection,
            query: search && search.length > 0 ? search : '',
            skip: !options.forExport ? (this.currentPage - 1) * entityListModuleConfig.itemsPerPage : null,
            take: !options.forExport ? entityListModuleConfig.itemsPerPage : null,
        };
        const searchparams = new SearchParams(searchEntity);
        return this.districtAdminEncounterByTherapistService.getEncounters(this.districtId, searchparams);
    }

    getEncounters(): void {
        this.getEncountersCall().subscribe((answer) => {
            this.encounter = answer.body;
            this.total = +answer.headers.get('X-List-Count');
        });
    }

    getEncountersForExport(): Observable<IEncounter[]> {
        return this.getEncountersCall({ forExport: true }).pipe(map((answer) => answer.body));
    }

    getFilterPendingEval() {
        this.pendingEvaluationOnly = !this.pendingEvaluationOnly;
    }

    getFilterReturnedEnc() {
        this.returnedOnly = !this.returnedOnly;
    }

    getFilterStudentSearchbar(event: string) {
        this.query = event;
    }

    applyClicked(applyEvent: Event) {
        if (applyEvent) {
            this.filterSelectionChanged();
        }
    }

    filterSelectionChanged(): void {
        this.currentPage = 1;
        this.getEncounters();
    }

    columnSorted(event: IColumnSortedEvent): void {
        this.order = event.column.sort.sortProperty;
        this.orderDirection = event.column.sort.direction === SortDirection.Desc ? 'desc' : 'asc';
        this.getEncounters();
    }

    encounterChanged(event: IEntityListSelectionChangedEvent): void {
        this.selectedEntities = event.selectedEntities;
    }

    providerSelected(event: ISelectionChangedEvent): void {
        this.selectedProviderId = (<ISelectOptions>event?.selection)?.Id;
    }
}
