import { HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { MtSearchFilterItem } from '@mt-ng2/search-filter-select-control';
import { ClaimsService, ClaimValues } from '@mt-ng2/auth-module';
import { ExtraSearchParams, IEntitySearchParams, SearchParams } from '@mt-ng2/common-classes';
import { IColumnSortedEvent, IItemDeletedEvent, IItemSelectedEvent, SortDirection } from '@mt-ng2/entity-list-module';

import { entityListModuleConfig } from '@common/shared.module';
import { ClaimTypes } from '@model/ClaimTypes';
import { IGoal } from '@model/interfaces/goal';
import { DynamicField, DynamicFieldType, DynamicFieldTypes, IDynamicFieldType } from '@mt-ng2/dynamic-form';
import { NotificationsService } from '@mt-ng2/notifications-module';
import { ISearchbarControlAPI } from '@mt-ng2/searchbar-control';
import { GoalService } from '../../services/goal.service';
import { GoalsEntityListConfig } from './goals.entity-list-config';
import { ServiceCodeService } from '@common/services/service-code.service';

@Component({
    selector: 'app-goals',
    templateUrl: './goals.component.html',
})
export class GoalsComponent implements OnInit {
    goals: IGoal[];
    currentPage = 1;
    itemsPerPage = entityListModuleConfig.itemsPerPage;
    query = '';
    total: number;
    entityListConfig = new GoalsEntityListConfig();
    order = this.entityListConfig.getDefaultSortProperty();
    orderDirection: string = this.entityListConfig.getDefaultSortDirection();
    includeArchived = false;
    canAddGoal = false;
    searchControlApi: ISearchbarControlAPI;
    serviceCodes: MtSearchFilterItem[] = [];

    constructor(
        private goalService: GoalService,
        private claimsService: ClaimsService,
        private router: Router,
        private notificationsService: NotificationsService,
        private serviceCodeService: ServiceCodeService,
    ) {}

    ngOnInit(): void {
        this.currentPage = this.goalService.getPage();
        this.includeArchived = this.goalService.getIncludeArchived();
        this.query = this.goalService.getQuery();
        this.canAddGoal = this.claimsService.hasClaim(ClaimTypes.AppSettings, [ClaimValues.FullAccess]);
        this.serviceCodeService.getSearchFilterItems().subscribe((answer) => (this.serviceCodes = answer));
        this.getGoals();
    }

    getGoalsCall(): Observable<HttpResponse<IGoal[]>> {
        const search = this.query;
        const _extraSearchParams: ExtraSearchParams[] = [];
        const selectedServiceCodeIds: number[] = this.getSelectedFilters(this.serviceCodes);

        _extraSearchParams.push(
            new ExtraSearchParams({
                name: 'includeArchived',
                value: this.includeArchived ? '1' : '0',
            }),
        );
        _extraSearchParams.push(
            new ExtraSearchParams({
                name: 'ServiceCodeIds',
                valueArray: selectedServiceCodeIds,
            }),
        );
        const searchEntity: IEntitySearchParams = {
            extraParams: _extraSearchParams,
            order: this.order,
            orderDirection: this.orderDirection,
            query: search && search.length > 0 ? search : '',
            skip: (this.currentPage - 1) * this.itemsPerPage,
            take: this.itemsPerPage,
        };

        const searchparams = new SearchParams(searchEntity);
        return this.goalService.get(searchparams);
    }

    getGoals(): void {
        this.getGoalsCall().subscribe((answer) => {
            this.goals = answer.body;
            this.total = +answer.headers.get('X-List-Count');
            this.goalService.setPage(1);
            this.goalService.setIncludeArchived(this.includeArchived);
            this.goalService.setQuery(this.query);
        });
    }

    search(query: string): void {
        this.currentPage = 1;
        this.query = query;
        this.getGoals();
    }

    filterSelectionChanged(): void {
        this.currentPage = 1;
        this.getGoals();
    }

    private getSelectedFilters(filterObj: MtSearchFilterItem[]): number[] {
        return filterObj.filter((item) => item.Selected).map((item) => item.Item.Id);
    }

    columnSorted(event: IColumnSortedEvent): void {
        this.order = event.column.sort.sortProperty;
        this.orderDirection = event.column.sort.direction === SortDirection.Desc ? 'desc' : 'asc';
        this.getGoals();
    }

    goalSelected(event: IItemSelectedEvent): void {
        this.goalService.setPage(this.currentPage);
        void this.router.navigate(['/goals', event.entity.Id]);
    }

    archiveGoal(event: IItemDeletedEvent): void {
        const selectedGoal = event.entity as IGoal;
        selectedGoal.Archived = !selectedGoal.Archived;
        this.goalService.updateWithFks(selectedGoal).subscribe(() => {
            this.notificationsService.success(`Goal Successfully ${selectedGoal.Archived ? 'Archived' : 'Unarchived'}`);
            this.getGoals();
        });
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

    searchControlReady(searchControlApi: ISearchbarControlAPI): void {
        this.searchControlApi = searchControlApi;
        this.searchControlApi.getSearchInputElement().nativeElement.placeholder = this.query.length ? this.query : 'Begin typing...';
    }
}
