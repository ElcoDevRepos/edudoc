import { HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';

import { ExtraSearchParams, IEntitySearchParams, SearchParams } from '@mt-ng2/common-classes';
import { EntityListExportConfig, IColumnSortedEvent, IItemDeletedEvent, SortDirection } from '@mt-ng2/entity-list-module';

import { entityListModuleConfig } from '@common/shared.module';
import { IProviderTraining } from '@model/interfaces/provider-training';
import { DynamicField, DynamicFieldType, DynamicFieldTypes, IDynamicFieldType } from '@mt-ng2/dynamic-form';
import { IModalOptions } from '@mt-ng2/modal-module';
import { NotificationsService } from '@mt-ng2/notifications-module';
import { ISearchbarControlAPI } from '@mt-ng2/searchbar-control';
import { map } from 'rxjs/operators';
import { ProviderTrainingsService } from '../services/provider-trainings.service';
import { ProviderTrainingsEntityListConfig } from './provider-trainings.entity-list-config';
import { ISearchFilterDaterangeValue } from '@mt-ng2/search-filter-daterange-control';

@Component({
    selector: 'app-provider-trainings',
    templateUrl: './provider-trainings.component.html',
})
export class ProviderTrainingsComponent implements OnInit {
    providerTrainings: IProviderTraining[];
    currentPage = 1;
    itemsPerPage = entityListModuleConfig.itemsPerPage;
    query = '';
    total: number;
    entityListConfig = new ProviderTrainingsEntityListConfig();
    order = this.entityListConfig.getDefaultSortProperty();
    orderDirection: string = this.entityListConfig.getDefaultSortDirection();
    subscriptions: Subscription = new Subscription();

    searchControlApi: ISearchbarControlAPI;

    completed = false;
    startDate: Date;
    endDate: Date = new Date();

    // Archive confirmation
    remindAllConfirm: IModalOptions = {
        cancelButtonText: 'Cancel',
        confirmButtonText: 'Yes, I am sure!',
        denyButtonText: '',
        icon: 'warning',
        showCancelButton: true,
        showConfirmButton: true,
        showDenyButton: false,
        text: `Are you sure you want to send out reminders for all pending trainings?`,
        title: 'Remind All Providers Of Pending Trainings',
    };

    // searchControlApi: ISearchbarControlAPI;

    constructor(
        private providerTrainingsService: ProviderTrainingsService,
        private notificationsService: NotificationsService,
        private router: Router,
    ) {}

    ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    ngOnInit(): void {
        this.entityListConfig.export = new EntityListExportConfig({
            exportName: `Activity Summary`,
            getDataForExport: this.getProviderTrainingsForExport.bind(this),
        });
        this.getProviderTrainings();
    }

    getProviderTrainingsCall(options = { forExport: false }): Observable<HttpResponse<IProviderTraining[]>> {
        const search = this.query;
        const _extraSearchParams = this.buildSearch();

        const searchEntity: IEntitySearchParams = {
            extraParams: _extraSearchParams,
            order: this.order,
            orderDirection: this.orderDirection,
            query: search && search.length > 0 ? search : '',
            skip: options.forExport ? undefined : (this.currentPage - 1) * this.itemsPerPage,
            take: options.forExport ? undefined : this.itemsPerPage,
        };

        const searchparams = new SearchParams(searchEntity);
        return this.providerTrainingsService.get(searchparams);
    }

    private buildSearch(): ExtraSearchParams[] {
        const _extraSearchParams: ExtraSearchParams[] = [];

        _extraSearchParams.push(
            new ExtraSearchParams({
                name: 'completedOnly',
                value: this.completed ? '1' : '0',
            }),
        );

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

        return _extraSearchParams;
    }

    getCompletedField(): DynamicField {
        return new DynamicField({
            formGroup: null,
            label: 'Completed',
            name: 'completedOnly',
            type: new DynamicFieldType({
                fieldType: DynamicFieldTypes.Checkbox,
            }),
            value: this.completed,
        });
    }

    getProviderTrainings(): void {
        this.getProviderTrainingsCall().subscribe((answer) => {
            this.providerTrainings = answer.body;
            this.total = +answer.headers.get('X-List-Count');
        });
    }

    getProviderTrainingsForExport(): Observable<IProviderTraining[]> {
        return this.getProviderTrainingsCall().pipe(map((answer) => answer.body));
    }

    search(query: string): void {
        this.currentPage = 1;
        this.query = query;
        this.getProviderTrainings();
    }

    filterSelectionChanged(): void {
        this.currentPage = 1;
        this.getProviderTrainings();
    }

    columnSorted(event: IColumnSortedEvent): void {
        this.order = event.column.sort.sortProperty;
        this.orderDirection = event.column.sort.direction === SortDirection.Desc ? 'desc' : 'asc';
        this.getProviderTrainings();
    }

    dateSelectionChanged(range: ISearchFilterDaterangeValue): void {
        this.startDate = range.startDate;
        this.endDate = range.endDate;
        this.getProviderTrainings();
    }

    billingResolved(): void {
        this.getProviderTrainings();
    }

    sendAllReminders(): void {
        this.providerTrainingsService.remindAll().subscribe(() => {
            this.notificationsService.success('Reminders sent successfully.');
        });
    }

    searchControlReady(searchControlApi: ISearchbarControlAPI): void {
        this.searchControlApi = searchControlApi;
        this.searchControlApi.getSearchInputElement().nativeElement.placeholder = 'Begin typing...';
    }

    removeProviderTraining(event: IItemDeletedEvent): void {
        const entity = event.entity as IProviderTraining;
        entity.Archived = true;
        this.providerTrainingsService.update(entity).subscribe(() => {
            this.notificationsService.success('Provider training successfully removed.');
            this.getProviderTrainings();
        });
    }
}
