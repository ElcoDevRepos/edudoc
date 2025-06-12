import { HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { forkJoin, Observable } from 'rxjs';

import { ClaimsService, ClaimValues } from '@mt-ng2/auth-module';
import { ExtraSearchParams, IEntitySearchParams, SearchParams } from '@mt-ng2/common-classes';
import { IColumnSortedEvent, IItemSelectedEvent, SortDirection } from '@mt-ng2/entity-list-module';
import { MtSearchFilterItem } from '@mt-ng2/search-filter-select-control';

import { entityListModuleConfig } from '@common/shared.module';
import { ClaimTypes } from '@model/ClaimTypes';
import { IClaimsEncounter } from '@model/interfaces/claims-encounter';
import { IIneligibleClaimsSummaryDTO } from '@model/interfaces/custom/ineligible-claims.dto';
import { EdiResponseErrorCodesService } from '../../../edi-response-error-codes-management/services/edi-response-error-codes.service';
import { IneligibleClaimsService } from '../../services/ineligible-claims.service';
import { ClaimsEncountersEntityListConfig } from './ineligible-claims.entity-list-config';
import { ISearchFilterDaterangeValue } from '@mt-ng2/search-filter-daterange-control';

@Component({
    selector: 'app-ineligible-claims',
    templateUrl: './ineligible-claims.component.html',
})
export class IneligibleClaimsComponent implements OnInit {
    claimsEncounters: IClaimsEncounter[];
    currentPage = 1;
    itemsPerPage = entityListModuleConfig.itemsPerPage;
    query = '';
    total: number;
    ediErrorCodes: MtSearchFilterItem[] = [];
    entityListConfig = new ClaimsEncountersEntityListConfig();
    order = this.entityListConfig.getDefaultSortProperty();
    orderDirection: string = this.entityListConfig.getDefaultSortDirection();

    canAddClaimsEncounter = false;

    claimsSummaryLoaded = false;
    claimsSummary: IIneligibleClaimsSummaryDTO;

    startDate: Date;
    endDate: Date;

    constructor(
        private ineligibleClaimsService: IneligibleClaimsService,
        private ediErrorCodeService: EdiResponseErrorCodesService,
        private claimsService: ClaimsService,
        private router: Router,
    ) {}

    ngOnInit(): void {
        this.canAddClaimsEncounter = this.claimsService.hasClaim(ClaimTypes.Encounters, [ClaimValues.FullAccess]);
        forkJoin([
            this.ineligibleClaimsService.getIneligibleClaimSummary(),
            this.ediErrorCodeService.getAll(),
        ]).subscribe(([summary, ediErrorCodes]) => {
            this.claimsSummary = summary;
            this.claimsSummaryLoaded = true;
            this.ediErrorCodes = ediErrorCodes.map((st) =>
                new MtSearchFilterItem({Id: st.Id,
                    Name: `${st.ErrorCode} - ${st.Name.length >= 25 ? st.Name.substring(0, 25).concat('...') : st.Name}`}, false))
                .sort((a, b) => { return a.Item.Name > b.Item.Name ? 1 : -1; });
            this.getClaimsEncounters();
        });
    }

    private getSelectedFilters(filterObj: MtSearchFilterItem[]): number[] {
        return filterObj.filter((item) => item.Selected).map((item) => item.Item.Id);
    }

    private buildSearch(): ExtraSearchParams[] {
        const selectedEdiErrorCodeIds: number[] = this.getSelectedFilters(this.ediErrorCodes);
        const _extraSearchParams: ExtraSearchParams[] = [];

        _extraSearchParams.push(
            new ExtraSearchParams({
                name: 'EdiErrorCodeIds',
                valueArray: selectedEdiErrorCodeIds,
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

    getClaimsEncountersCall(): Observable<HttpResponse<IClaimsEncounter[]>> {
        const search = this.query;
        const _extraSearchParams: ExtraSearchParams[] = this.buildSearch();

        const searchEntity: IEntitySearchParams = {
            extraParams: _extraSearchParams,
            order: this.order,
            orderDirection: this.orderDirection,
            query: search && search.length > 0 ? search : '',
            skip: (this.currentPage - 1) * this.itemsPerPage,
            take: this.itemsPerPage,
        };

        const searchparams = new SearchParams(searchEntity);
        return this.ineligibleClaimsService.get(searchparams);
    }

    getClaimsEncounters(): void {
        this.getClaimsEncountersCall().subscribe((answer) => {
            this.claimsEncounters = answer.body;
            this.total = +answer.headers.get('X-List-Count');
        });
    }

    search(query: string): void {
        this.currentPage = 1;
        this.query = query;
        this.getClaimsEncounters();
    }

    filterSelectionChanged(): void {
        this.currentPage = 1;
        this.getClaimsEncounters();
    }

    columnSorted(event: IColumnSortedEvent): void {
        this.order = event.column.sort.sortProperty;
        this.orderDirection = event.column.sort.direction === SortDirection.Desc ? 'desc' : 'asc';
        this.getClaimsEncounters();
    }

    claimsEncounterSelected(event: IItemSelectedEvent): void {
        void this.router.navigate(['/claimsEncounters', event.entity.Id]);
    }

    dateSelectionChanged(range: ISearchFilterDaterangeValue): void {
        this.startDate = range.startDate;
        this.endDate = range.endDate;
        this.getClaimsEncounters();
    }
}
