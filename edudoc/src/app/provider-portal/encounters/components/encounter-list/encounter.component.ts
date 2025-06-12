import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { entityListModuleConfig } from '@common/shared.module';
import { IEncounter } from '@model/interfaces/encounter';
import { ExtraSearchParams, IEntitySearchParams, SearchParams } from '@mt-ng2/common-classes';
import { IColumnSortedEvent, IItemDeletedEvent, IItemSelectedEvent, SortDirection } from '@mt-ng2/entity-list-module';
import { NotificationsService } from '@mt-ng2/notifications-module';
import { MtSearchFilterItem } from '@mt-ng2/search-filter-select-control';
import { ISearchbarControlAPI } from '@mt-ng2/searchbar-control';
import { EncounterService } from '@provider/encounters/services/encounter.service';
import { Subscription } from 'rxjs';
import { ProviderPortalAuthService } from '../../../provider-portal-auth.service';
import { EncounterEntityListConfig } from './encounter.entity-list-config';
import { EvaluationEncounterEntityListConfig } from './evaluation-encounter.entity-list-config';
import { ISearchFilterDaterangeValue } from '@mt-ng2/search-filter-daterange-control';
import { ProviderStudentService } from '@provider/case-load/services/provider-student.service';

@Component({
    selector: 'app-encounters',
    templateUrl: './encounter.component.html',
    styleUrls: ['./encounter.component.less'],
})
export class EncountersComponent implements OnInit {
    encounter: IEncounter[];
    currentPage = 1;
    query = '';
    total: number;
    entityListConfig = null;
    order: string;
    orderDirection: string;

    startDate: Date;
    endDate: Date;

    pageTitle = '';

    showPendingFilters = true;
    pendingEvaluationOnly = false;
    pendingTreatmentTherapyOnly = false;
    returnedOnly = false;

    encounterLocations: MtSearchFilterItem[] = [];
    subscriptions: Subscription;
    searchControlApi: ISearchbarControlAPI;

    districts: MtSearchFilterItem[] = [];

    constructor(
        private encounterService: EncounterService,
        private router: Router,
        private notificationsService: NotificationsService,
        private providerIdService: ProviderPortalAuthService,
        private route: ActivatedRoute,
        private providerStudentService: ProviderStudentService,
    ) {
        this.subscriptions = new Subscription();
    }

    ngOnInit(): void {
        // Sets the returned only flag to true if navigating from Dashboard ToDo list
        this.returnedOnly = this.route.snapshot.params.fromToDo;
        this.subscriptions.add(
            this.route.url.subscribe((segments) => {
                this.pendingEvaluationOnly = segments.some((x) => x.path === 'encounters-pending-evaluation');
                this.pendingTreatmentTherapyOnly = segments.some((x) => x.path === 'encounters-pending-treatment-therapies');
                if (this.pendingTreatmentTherapyOnly) {
                    this.entityListConfig = new EncounterEntityListConfig();
                    this.order = this.entityListConfig.getDefaultSortProperty();
                    this.orderDirection = this.entityListConfig.getDefaultSortDirection();
                } else {
                    this.entityListConfig = new EvaluationEncounterEntityListConfig();
                    this.order = 'Id';
                    this.orderDirection = SortDirection.Asc;
                }
                this.query = '';
                this.returnedOnly = false;
                this.setLabel();
                this.setFilters();
                this.getEncounters();
                this.getDistricts();
            }),
        );
    }

    ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    setLabel(): void {
        this.pageTitle = this.pendingEvaluationOnly
            ? 'Pending Evaluations'
            : this.pendingTreatmentTherapyOnly
            ? 'Pending Treatment Therapy'
            : 'Revise Encounters';
    }

    setFilters(): void {
        this.showPendingFilters = this.pendingEvaluationOnly || this.pendingTreatmentTherapyOnly ? false : true;
    }

    getDistricts(): void {
        this.providerStudentService.getSchoolDistricts(this.providerIdService.getProviderId()).subscribe((options) => {
            this.districts = options.map((o) => new MtSearchFilterItem(o, false));
        });
    }

    buildSearch(): SearchParams {
        const search = this.query;
        const _extraSearchParams: ExtraSearchParams[] = [];
        _extraSearchParams.push(
            new ExtraSearchParams({
                name: 'providerId',
                value: this.providerIdService.getProviderId().toString(),
            }),
            new ExtraSearchParams({
                name: 'locationids',
                valueArray: this.encounterLocations.filter((item) => item.Selected).map((item) => item.Item.Id),
            }),
            new ExtraSearchParams({
                name: 'returnedOnly',
                value: this.returnedOnly ? '1' : '0',
            }),
            new ExtraSearchParams({
                name: 'pendingEvaluationOnly',
                value: this.pendingEvaluationOnly ? '1' : '0',
            }),
            new ExtraSearchParams({
                name: 'pendingTreatmentTherapyOnly',
                value: this.pendingTreatmentTherapyOnly ? '1' : '0',
            }),
            new ExtraSearchParams({
                name: 'hideEmptyEncounters',
                value: '1',
            }),
        );
        if (this.startDate) {
            _extraSearchParams.push(
                new ExtraSearchParams({
                    name: 'startDate',
                    value: this.startDate.toISOString(),
                }),
            );
        }

        if (this.endDate) {
            _extraSearchParams.push(
                new ExtraSearchParams({
                    name: 'endDate',
                    value: this.endDate.toISOString(),
                }),
            );
        }
        const selectedDistricts = this.districts.filter((d) => d.Selected);
        if (selectedDistricts.length > 0) {
            _extraSearchParams.push(
                new ExtraSearchParams({
                    name: 'districtIds',
                    valueArray: selectedDistricts.map((d) => d.Item.Id),
                }),
            );
        }
        const searchEntity: IEntitySearchParams = {
            extraParams: _extraSearchParams,
            order: this.order,
            orderDirection: this.orderDirection,
            query: search && search.length > 0 ? search : '',
            skip: (this.currentPage - 1) * entityListModuleConfig.itemsPerPage,
            take: entityListModuleConfig.itemsPerPage,
        };
        return new SearchParams(searchEntity);
    }

    getEncounters(): void {
        const searchParams = this.buildSearch();
        this.encounterService.get(searchParams).subscribe((answer) => {
            this.encounter = answer.body;
            this.total = +answer.headers.get('X-List-Count');
        });
    }

    search(query: string): void {
        this.query = query;
        this.getEncounters();
    }

    columnSorted(event: IColumnSortedEvent): void {
        this.order = event.column.sort.sortProperty;
        this.orderDirection = event.column.sort.direction === SortDirection.Desc ? 'desc' : 'asc';
        this.getEncounters();
    }

    encounterSelected(event: IItemSelectedEvent): void {
        if (this.pendingTreatmentTherapyOnly) {
            void this.router.navigate(['/provider/encounters/treatment-therapy', event.entity.Id]);
        } else if (this.pendingEvaluationOnly) {
            void this.router.navigate(['/provider/encounters/evaluation', event.entity.Id]);
        } else {
            void this.router.navigate(['/provider/encounters', event.entity.Id]);
        }
    }

    archiveEncounter(event: IItemDeletedEvent): void {
        const selectedEncounter = event.entity as IEncounter;
        selectedEncounter.Archived = !selectedEncounter.Archived;
        this.encounterService.update(selectedEncounter).subscribe(() => {
            this.notificationsService.success(`Encounter Successfully ${selectedEncounter.Archived ? 'Archived' : 'Unarchived'}`);
            this.getEncounters();
        });
    }

    archiveAll(): void {
        const shouldDelete = window.confirm(`Are you sure you want to delete ${this.total} pending encounters?`);
        if (!shouldDelete) {
            return;
        }

        const searchParams = this.buildSearch();
        this.encounterService.archiveAll(searchParams).subscribe(() => {
            this.notificationsService.success(`Encounters Successfully Archived`);
            this.getEncounters();
        });
    }

    searchControlReady(searchControlApi: ISearchbarControlAPI): void {
        this.searchControlApi = searchControlApi;
        this.searchControlApi.getSearchInputElement().nativeElement.placeholder = 'Begin typing student name...';
    }

    dateSelectionChanged(range: ISearchFilterDaterangeValue): void {
        this.startDate = range.startDate;
        this.endDate = range.endDate;
        this.getEncounters();
    }

    districtsChanged(): void {
        this.getEncounters();
    }
}
