import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { entityListModuleConfig } from '@common/shared.module';
import { IEncounterStudent } from '@model/interfaces/encounter-student';
import { ExtraSearchParams, IEntitySearchParams, SearchParams } from '@mt-ng2/common-classes';
import {
    IItemSelectedEvent} from '@mt-ng2/entity-list-module';
import { NotificationsService } from '@mt-ng2/notifications-module';
import { ISearchbarControlAPI } from '@mt-ng2/searchbar-control';
import { EncounterService } from '@provider/encounters/services/encounter.service';
import { ProviderPortalAuthService } from '../../../provider-portal-auth.service';
import { ReturnEncountersEntityListConfig } from './return-encounters.entity-list-config';
import { ISearchFilterDaterangeValue } from '@mt-ng2/search-filter-daterange-control';

@Component({
    selector: 'app-return-encounters',
    templateUrl: './return-encounters.component.html',
})
export class ReturnEncountersComponent implements OnInit {
    encounters: IEncounterStudent[] = [];
    currentPage = 1;
    query = '';
    total: number;
    entityListConfig = new ReturnEncountersEntityListConfig();
    order = this.entityListConfig.getDefaultSortProperty();
    orderDirection: string = this.entityListConfig.getDefaultSortDirection();
    startDate: Date;
    endDate: Date;
    searchControlApi: ISearchbarControlAPI;

    constructor(
        private encounterService: EncounterService,
        private router: Router,
        private notificationsService: NotificationsService,
        private providerIdService: ProviderPortalAuthService,
        private route: ActivatedRoute,
    ) {
    }

    ngOnInit(): void {
        this.getEncounters();
    }

    getEncounters(): void {
        const search = this.query;
        const _extraSearchParams: ExtraSearchParams[] = [];
        _extraSearchParams.push(
            new ExtraSearchParams({
                name: 'providerId',
                value: this.providerIdService.getProviderId().toString(),
            }),
            new ExtraSearchParams({
                name: 'returnedOnly',
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
        const searchEntity: IEntitySearchParams = {
            extraParams: _extraSearchParams,
            order: this.order,
            orderDirection: this.orderDirection,
            query: search && search.length > 0 ? search : '',
            skip: (this.currentPage - 1) * entityListModuleConfig.itemsPerPage,
            take: entityListModuleConfig.itemsPerPage,
        };
        const searchparams = new SearchParams(searchEntity);
        this.encounterService.getReturnEncounters(searchparams).subscribe((answer) => {
            this.encounters = answer.body;
            this.total = +answer.headers.get('X-List-Count');
        });
    }

    search(query: string): void {
        this.query = query;
        this.getEncounters();
    }

    encounterSelected(event: IItemSelectedEvent): void {
        const entity = event.entity as IEncounterStudent;
        if (entity.EncounterNumber.startsWith("E")) {
            void this.router.navigate([`/provider/encounters/evaluation/${entity.EncounterId}`]);
        } else {
            void this.router.navigate(['/provider/return-encounters', (entity).EncounterId], { queryParams: { encounterStudentId: (entity).Id }});
        }
    }

    searchControlReady(searchControlApi: ISearchbarControlAPI): void {
        this.searchControlApi = searchControlApi;
        this.searchControlApi.getSearchInputElement().nativeElement.placeholder = 'Search...';
    }

    dateSelectionChanged(range: ISearchFilterDaterangeValue): void {
        this.startDate = range.startDate;
        this.endDate = range.endDate;
        this.getEncounters();
    }
}
