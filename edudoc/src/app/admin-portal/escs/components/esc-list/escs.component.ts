import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { ClaimsService, ClaimValues } from '@mt-ng2/auth-module';
import { ExtraSearchParams, IEntitySearchParams, SearchParams } from '@mt-ng2/common-classes';
import { IColumnSortedEvent, IItemDeletedEvent, IItemSelectedEvent, SortDirection } from '@mt-ng2/entity-list-module';

import { entityListModuleConfig } from '@common/shared.module';
import { ClaimTypes } from '@model/ClaimTypes';
import { IEsc } from '@model/interfaces/esc';
import { DynamicField, DynamicFieldType, DynamicFieldTypes, IDynamicFieldType } from '@mt-ng2/dynamic-form';
import { NotificationsService } from '@mt-ng2/notifications-module';
import { ISearchbarControlAPI } from '@mt-ng2/searchbar-control';
import { EscService } from '../../services/esc.service';
import { EscsEntityListConfig } from './escs.entity-list-config';

@Component({
    selector: 'app-escs',
    templateUrl: './escs.component.html',
})
export class EscsComponent implements OnInit {
    escs: IEsc[];
    currentPage = 1;
    query = '';
    total: number;
    entityListConfig = new EscsEntityListConfig();
    order = this.entityListConfig.getDefaultSortProperty();
    orderDirection: string = this.entityListConfig.getDefaultSortDirection();

    canAddEsc = false;
    includeArchived = false;
    searchControlApi: ISearchbarControlAPI;

    constructor(
        private escService: EscService,
        private claimsService: ClaimsService,
        private router: Router,
        private notificationsService: NotificationsService,
    ) {}

    ngOnInit(): void {
        this.canAddEsc = this.claimsService.hasClaim(ClaimTypes.ESCs, [ClaimValues.FullAccess]);
        this.getEscs();
    }

    getEscs(): void {
        const search = this.query;
        const _extraSearchParams: ExtraSearchParams[] = [];
        _extraSearchParams.push(
            new ExtraSearchParams({
                name: 'includeArchived',
                value: this.includeArchived ? '1' : '0',
            }),
        );
        const searchEntity: IEntitySearchParams = {
            extraParams: _extraSearchParams,
            order: this.order,
            orderDirection: this.orderDirection,
            query: search && search.length > 0 ? search : '',
            skip: (this.currentPage - 1) * entityListModuleConfig.itemsPerPage,
            take: entityListModuleConfig.itemsPerPage,
        };

        const searchparams = new SearchParams(searchEntity);
        this.escService.get(searchparams).subscribe((answer) => {
            this.escs = answer.body;
            this.total = +answer.headers.get('X-List-Count');
        });
    }

    search(query: string): void {
        this.query = query;
        this.getEscs();
    }

    columnSorted(event: IColumnSortedEvent): void {
        this.order = event.column.sort.sortProperty;
        this.orderDirection = event.column.sort.direction === SortDirection.Desc ? 'desc' : 'asc';
        this.getEscs();
    }

    escSelected(event: IItemSelectedEvent): void {
        void this.router.navigate(['/escs', event.entity.Id]);
    }

    archiveEsc(event: IItemDeletedEvent): void {
        const selectedEsc = event.entity as IEsc;
        selectedEsc.Archived = !selectedEsc.Archived;
        this.escService.update(selectedEsc).subscribe(() => {
            this.notificationsService.success(`ESC Successfully ${selectedEsc.Archived ? 'Archived' : 'Unarchived'}`);
            this.getEscs();
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
        this.searchControlApi.getSearchInputElement().nativeElement.placeholder = 'Begin typing...';
    }
}
