import { ProviderService } from '@admin/providers/provider.service';
import { SchoolDistrictService } from '@admin/school-districts/services/schooldistrict.service';
import { Component, OnInit } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { entityListModuleConfig } from '@common/shared.module';
import { ClaimTypes } from '@model/ClaimTypes';
import { IProvider } from '@model/interfaces/provider';
import { ISchoolDistrict } from '@model/interfaces/school-district';
import { ClaimValues, ClaimsService } from '@mt-ng2/auth-module';
import { ExtraSearchParams, IEntitySearchParams, SearchParams } from '@mt-ng2/common-classes';
import { IColumnSortedEvent, IItemSelectedEvent, SortDirection } from '@mt-ng2/entity-list-module';
import { ISearchFilterCheckboxValueChangedEvent } from '@mt-ng2/search-filter-checkbox-control';
import { ISelectionChangedEvent, ITypeAheadAPI, VirtualTypeAheadGetItemsFunction } from '@mt-ng2/type-ahead-control';
import { Observable } from 'rxjs';
import { debounceTime, map } from 'rxjs/operators';
import { ProvidersEntityListConfig } from './providers.entity-list-config';

@Component({
    selector: 'app-providers',
    styles: [
        `
            .checkbox-div {
                margin-left: -2em;
            }
        `,
    ],
    templateUrl: './providers.component.html',
})
export class ProvidersComponent implements OnInit {
    searchControl = new UntypedFormControl();

    providers: IProvider[] = [];
    currentPage = 1;
    total: number;
    canAddRole = false;
    itemsPerPage = entityListModuleConfig.itemsPerPage;
    providerEntityListConfig = new ProvidersEntityListConfig();
    order = this.providerEntityListConfig.getDefaultSortProperty();
    orderDirection: string = this.providerEntityListConfig.getDefaultSortDirection();
    includeArchived = false;
    canAddProvider = false;
    schoolDistrictIdFilter = 0;
    escId: number;
    escName: string;
    getSchoolDistricts: VirtualTypeAheadGetItemsFunction = this.getSchoolDistrictsFunction.bind(this);
    query = '';
    virtualTypeAheadControl: ITypeAheadAPI;
    selectedDistrictName = 'None';

    constructor(
        private providerService: ProviderService,
        private schoolDistrictService: SchoolDistrictService,
        private claimService: ClaimsService,
        private router: Router,
        private activatedRoute: ActivatedRoute,
    ) {}

    ngOnInit(): void {
        if (this.activatedRoute.snapshot.queryParamMap.has('escId')) {
            this.escId = +this.activatedRoute.snapshot.queryParamMap.get('escId');
            this.escName = this.activatedRoute.snapshot.queryParamMap.get('escName');
        }
        this.searchControl.valueChanges.pipe(debounceTime(300)).subscribe(() => {this.currentPage = 1; this.getProviders()});
        this.canAddProvider = this.claimService.hasClaim(ClaimTypes.ProviderMaintenance, [ClaimValues.FullAccess]);
        this.getProviders();
    }

    private getSchoolDistrictsFunction(searchText: string): Observable<ISchoolDistrict[]> {
        return this.schoolDistrictService
            .search({
                query: searchText,
                extraParams: [
                    new ExtraSearchParams({
                        name: 'includeArchived',
                        value: '0',
                    }),
                ]
            })
            .pipe(
                debounceTime(300),
                map((resp) => resp.body),
            );
    }

    virtualTypeAheadControlReady(controlApi: ITypeAheadAPI): void {
        this.virtualTypeAheadControl = controlApi;
    }

    handleDistrictSelection(event: ISelectionChangedEvent): void {
        if (event.selection) {
            this.schoolDistrictIdFilter = (<ISchoolDistrict>event.selection).Id;
            this.selectedDistrictName = (<ISchoolDistrict>event.selection).Name;
        } else {
            this.schoolDistrictIdFilter = 0;
            this.selectedDistrictName = 'None';
        }
        this.providerService.setSelectedSchoolDistrictName(this.selectedDistrictName);
        this.getProviders();
    }

    getProviders(hasSavedFilter?: boolean): void {
        const search = this.searchControl.value;

        const extraParams = [
            new ExtraSearchParams({
                name: 'archivedstatus',
                valueArray: this.includeArchived ? [1, 0] : [0],
            }),
            new ExtraSearchParams({
                name: 'schoolDistrictId',
                value: this.schoolDistrictIdFilter.toString(),
            }),
        ];

        if (this.escId) {
            extraParams.push(
                new ExtraSearchParams({
                    name: 'escId',
                    value: this.escId.toString(),
                }),
            );
        }

        let curSearchEntity: IEntitySearchParams;
        if (hasSavedFilter) {
            curSearchEntity = this.providerService.savedSearchEntity;
            this.schoolDistrictIdFilter = parseInt(curSearchEntity.extraParams[1].value, 10);
        } else {
            // store filter selection
            curSearchEntity = {
                extraParams: extraParams,
                order: this.order,
                orderDirection: this.orderDirection,
                query: search && search.length > 0 ? search : '',
                skip: (this.currentPage - 1) * entityListModuleConfig.itemsPerPage,
                take: entityListModuleConfig.itemsPerPage,
            };
            this.providerService.setSearchEntity(curSearchEntity);
        }

        const searchParams = new SearchParams(curSearchEntity);

        this.providerService.get(searchParams).subscribe((response) => {
            this.providers = response.body;
            this.total = +response.headers.get('X-List-Count');
        });
    }

    clearSearch(): void {
        this.searchControl.setValue('');
    }

    noProviders(): boolean {
        return !this.providers || this.providers.length === 0;
    }

    pagingNeeded(): boolean {
        return this.total > this.itemsPerPage;
    }

    providerSelected(event: IItemSelectedEvent): void {
        void this.router.navigate(['/providers', event.entity.Id]);
    }

    searchFilterChanged(event: ISearchFilterCheckboxValueChangedEvent): void {
        this.includeArchived = event.value;
        this.getProviders();
    }

    columnSorted(event: IColumnSortedEvent): void {
        this.order = event.column.sort.sortProperty;
        this.orderDirection = event.column.sort.direction === SortDirection.Desc ? 'desc' : 'asc';
        this.getProviders();
    }

    goBackToEsc(): void {
        void this.router.navigate(['admin', 'escs', this.escId]);
    }

    loadSavedFilters(): void {
        this.getProviders(true);
        this.query = this.providerService.savedSearchEntity.query;
        this.selectedDistrictName = this.providerService.savedSchoolDistrictName;
    }
}
