import { CptCodeService } from '@admin/cpt-codes/services/cpt-code.service';
import { EncounterService } from '@admin/encounters/services/encounter.service';
import { ProviderService } from '@admin/providers/provider.service';
import { SchoolDistrictService } from '@admin/school-districts/services/schooldistrict.service';
import { Component, OnInit } from '@angular/core';
import { entityListModuleConfig } from '@common/entity-list-module-config';
import { DateTimeConverterService } from '@common/services/date-time-converter.service';
import { EncounterResponseDtoService } from '@common/services/encounter-response-dto.service';
import { ServiceCodeService } from '@common/services/service-code.service';
import { EncounterStatuses } from '@model/enums/encounter-status.enum';
import { UserTypesEnum } from '@model/enums/user-types.enum';
import { ICptCodeWithMinutesDto, IEncounterResponseDto } from '@model/interfaces/custom/encounter-response.dto';
import { ISelectOptions } from '@model/interfaces/custom/select-options';
import { IGoal } from '@model/interfaces/goal';
import { IMethod } from '@model/interfaces/method';
import { ISchoolDistrict } from '@model/interfaces/school-district';
import { AuthService } from '@mt-ng2/auth-module';
import { ExtraSearchParams, IEntitySearchParams, SearchParams } from '@mt-ng2/common-classes';
import { MtSearchFilterItem } from '@mt-ng2/search-filter-select-control';
import { ISearchbarControlAPI } from '@mt-ng2/searchbar-control';
import { ISelectionChangedEvent, VirtualTypeAheadGetItemsFunction } from '@mt-ng2/type-ahead-control';
import { forkJoin, Observable } from 'rxjs';
import { debounceTime, map } from 'rxjs/operators';
import { EncounterAupAuditEntityListConfig } from './encounter-aup-audit.entity-list-config';
import { DatePipe } from '@angular/common';
import { IProvider } from '@model/interfaces/provider';
import { ISearchFilterDaterangeValue } from '@mt-ng2/search-filter-daterange-control';
import { IEncounterStudentStatusesLogDto } from '@model/interfaces/custom/encounter-student-statuses-log.dto';
import { IModalOptions } from '@mt-ng2/modal-module';
import { SchoolDistrictAdminService } from '@common/services/school-district-admin.service';
import { SchoolDistrictAdminUserService } from '@school-district-admin/users/services/school-district-admin-user.service';

@Component({
    selector: 'app-encounter-aup-audit',
    styleUrls: ['./encounter-aup-audit.component.less'],
    templateUrl: './encounter-aup-audit.component.html',
})
export class EncounterAupAuditComponent implements OnInit {
    encounters: IEncounterResponseDto[];
    currentPage = 1;
    query = '';
    encounterQuery = '';
    claimNumberQuery = '';
    total: number;
    entityListConfig = new EncounterAupAuditEntityListConfig();
    order = this.entityListConfig.getDefaultSortProperty();
    orderDirection: string = this.entityListConfig.getDefaultSortDirection();
    encounterStudentIdForModal: number;
    schoolDistricts: ISelectOptions[];
    schoolDistrictIdFilter = 0;
    providerIdFilter = 0;

    startDate: Date;
    endDate: Date;
    getSchoolDistricts: VirtualTypeAheadGetItemsFunction = this.getSchoolDistrictsFunction.bind(this);
    getProviders: VirtualTypeAheadGetItemsFunction = this.getProvidersFunction.bind(this);
    providers: MtSearchFilterItem[] = [];
    cptCodes: MtSearchFilterItem[] = [];
    serviceCodes: MtSearchFilterItem[] = [];
    searchControlApi: ISearchbarControlAPI;
    encounterSearchControlApi: ISearchbarControlAPI;
    claimNumberSearchControlApi: ISearchbarControlAPI;
    encounterStatuses = EncounterStatuses;
    selectedEncounters: IEncounterResponseDto[] = [];
    isAdmin = false;

    showStatusesModal = false;
    encounterStudentStatusesForModal: IEncounterStudentStatusesLogDto[];

    itemsPerPage = entityListModuleConfig.itemsPerPage;

    statuses: MtSearchFilterItem[] = [
        new MtSearchFilterItem({
            Id: EncounterStatuses.Invoiced_and_Paid,
            Name: 'Invoiced And Paid',
        }, false),
        new MtSearchFilterItem({
            Id: EncounterStatuses.PAID_AND_REVERSED,
            Name: 'Paid And Reversed',
        }, false),
    ];

    modalOptions: IModalOptions = {
        customClass: {
            title: 'text-center',
        },
        showCloseButton: true,
        showConfirmButton: false,
        width: '50%',
    };

    constructor(
        private encounterService: EncounterService,
        private schoolDistrictService: SchoolDistrictService,
        private providerService: ProviderService,
        private cptCodeService: CptCodeService,
        private serviceCodeService: ServiceCodeService,
        private dateTimeConverter: DateTimeConverterService,
        private authService: AuthService,
        private encounterResponseDtoService: EncounterResponseDtoService,
        private schoolDistrictAdminUserService: SchoolDistrictAdminUserService
    ) {}

    ngOnInit(): void {
        this.isAdmin = this.authService.currentUser.getValue().CustomOptions.UserTypeId === UserTypesEnum.Admin;
        if(!this.isAdmin) {
            this.schoolDistrictIdFilter = this.schoolDistrictAdminUserService.getAdminDistrictId();
        }
        forkJoin([this.cptCodeService.getSelectOptions(), this.serviceCodeService.getAll()]).subscribe(([cptCodes, serviceCodes]) => {
            this.cptCodes = cptCodes.map((cpt) => new MtSearchFilterItem(cpt, false));
            this.serviceCodes = serviceCodes.map((sc) => new MtSearchFilterItem(sc, false));
        });
    }

    getEncounters(): void {
        const search = this.query?.length > 0 ? this.query : '';
        const _extraSearchParams = this.buildSearch();

        const searchEntity: IEntitySearchParams = {
            extraParams: _extraSearchParams,
            order: this.order,
            orderDirection: this.orderDirection,
            query: search && search.length > 0 ? search : '',
            skip: (this.currentPage - 1) * this.itemsPerPage,
            take: this.itemsPerPage,
        };

        const searchparams = new SearchParams(searchEntity);
        this.encounterService.getEncounters(searchparams).subscribe((answer) => {
            this.encounters = answer.body.map((response) => {
                response.StartDateTime = this.dateTimeConverter.convertUtcToLocal(
                    this.dateTimeConverter.appendTimeSpanToDate(response.EncounterDate, response.StartTime),
                );
                response.EndDateTime = this.dateTimeConverter.convertUtcToLocal(
                    this.dateTimeConverter.appendTimeSpanToDate(response.EncounterDate, response.EndTime),
                );
                response.EncounterDate = new Date(new DatePipe('en-Us').transform(response.EncounterDate, 'yyyy-MM-ddThh:mm:ss', 'UTC'));
                return response;
            });
            this.total = +answer.headers.get('X-List-Count');
        });
    }

    private buildSearch(): ExtraSearchParams[] {
        const _extraSearchParams: ExtraSearchParams[] = [];
        const cptCodeIds: number[] = this.getSelectedFilters(this.cptCodes);
        const serviceCodeIds: number[] = this.getSelectedFilters(this.serviceCodes);
        let statusIds = this.getSelectedFilters(this.statuses);
        if(statusIds.length === 0) {
            statusIds = this.statuses.map(s => s.Item.Id);
        }

        _extraSearchParams.push(
            new ExtraSearchParams({
                name: 'districtId',
                value: this.schoolDistrictIdFilter !== null ? this.schoolDistrictIdFilter.toString() : '0',
            }),
        );

        _extraSearchParams.push(
            new ExtraSearchParams({
                name: 'providerId',
                value: this.schoolDistrictIdFilter !== null ? this.providerIdFilter.toString() : '0',
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

        _extraSearchParams.push(
            new ExtraSearchParams({
                name: 'CptCodeIds',
                valueArray: cptCodeIds,
            }),
        );

        _extraSearchParams.push(
            new ExtraSearchParams({
                name: 'ServiceCodeIds',
                valueArray: serviceCodeIds,
            }),
        );

        _extraSearchParams.push(
            new ExtraSearchParams({
                name: 'EncounterQuery',
                value: this.encounterQuery,
            }),
        )

        _extraSearchParams.push(
            new ExtraSearchParams({
                name: 'EncounterStatusIds',
                valueArray: statusIds
            }),
        )

        _extraSearchParams.push(
            new ExtraSearchParams({
                name: 'claimId',
                value: this.claimNumberQuery
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

    getFilterEncounterNumbersSearchbar(event: string) {
        this.encounterQuery = event;
    }

    getFilterClaimNumbersSearchbar(event: string) {
        this.claimNumberQuery = event;
    }

    getFilterDateRange(range: ISearchFilterDaterangeValue) {
        this.startDate = range ? range.startDate : this.startDate;
        this.endDate = range ? range.endDate : this.endDate;
    }

    applyClicked(applyEvent: ISelectionChangedEvent) {
        if (applyEvent) {
            this.filterSelectionChanged();
        }
    }

    filterSelectionChanged(): void {
        this.currentPage = 1;
        this.getEncounters();
    }

    searchControlReady(searchControlApi: ISearchbarControlAPI): void {
        this.searchControlApi = searchControlApi;
        this.searchControlApi.getSearchInputElement().nativeElement.placeholder = 'Begin typing...';
    }

    encounterSearchControlReady(searchControlApi: ISearchbarControlAPI): void {
        this.encounterSearchControlApi = searchControlApi;
        this.encounterSearchControlApi.getSearchInputElement().nativeElement.placeholder = 'Enter encounter numbers...';
    }

    claimNumberSearchControlReady(searchControlApi: ISearchbarControlAPI): void {
        this.claimNumberSearchControlApi = searchControlApi;
        this.claimNumberSearchControlApi.getSearchInputElement().nativeElement.placeholder = 'Enter claim number...';
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
                map((resp) => resp.body),
            );
    }

    getSessionMinutes(request: IEncounterResponseDto): number {
        return this.encounterResponseDtoService.getSessionMinutes(request);
    }

    convertItemsToCommaSeparatedList(items: IGoal[]): string {
        return this.encounterResponseDtoService.convertGoalsToCommaSeparatedList(items);
    }

    convertCptCodesToCommaSeparatedList(items: ICptCodeWithMinutesDto[]): string {
        if (!items || !items.length) {
            return '';
        }
        return items.length > 1
            ? items.map((c) => `${c.CptCode.Description}: ${c.Minutes} mins`).join(', \r\n')
            : items.map((c) => c.CptCode.Description).join('');
    }

    convertMethodsToCommaSeparatedList(items: IMethod[]): string {
        return this.encounterResponseDtoService.convertMethodsToCommaSeparatedList(items);
    }

    toggleStatusModal(encounterStudentStatuses?: IEncounterStudentStatusesLogDto[]): void {
        this.encounterStudentStatusesForModal = encounterStudentStatuses;
        this.showStatusesModal = !this.showStatusesModal;
    }

    encounterSelected(encounter: IEncounterResponseDto): void {
        if (!this.selectedEncounters.find((e) => e.EncounterNumber === encounter.EncounterNumber)) {
            this.selectedEncounters.push(encounter);
        }
    }
    encounterStatusLogSelected(encounterStudent: IEncounterResponseDto): void {
        this.toggleStatusModal(encounterStudent.EncounterStudentStatuses);
    }

    updateItemsPerPage(event): void {
        this.itemsPerPage = +event;
    }
}
