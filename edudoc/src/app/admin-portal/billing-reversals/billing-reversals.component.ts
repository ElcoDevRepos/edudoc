import { CptCodeService } from '@admin/cpt-codes/services/cpt-code.service';
import { ProviderService } from '@admin/providers/provider.service';
import { SchoolDistrictService } from '@admin/school-districts/services/schooldistrict.service';
import { Component, OnInit } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { DateTimeConverterService } from '@common/services/date-time-converter.service';
import { ServiceCodeService } from '@common/services/service-code.service';
import { entityListModuleConfig } from '@common/shared.module';
import { EncounterStatuses } from '@model/enums/encounter-status.enum';
import { IClaimAuditRequestDto } from '@model/interfaces/custom/claim-audit-request.dto';
import { ICptCodeWithMinutesDto, IEncounterResponseDto } from '@model/interfaces/custom/encounter-response.dto';
import { IEncounterStudentStatusesLogDto } from '@model/interfaces/custom/encounter-student-statuses-log.dto';
import { ISelectOptions } from '@model/interfaces/custom/select-options';
import { IEncounterReasonForReturn } from '@model/interfaces/encounter-reason-for-return';
import { IGoal } from '@model/interfaces/goal';
import { ISchoolDistrict } from '@model/interfaces/school-district';
import { IMetaItem } from '@mt-ng2/base-service';
import { ExtraSearchParams, IEntitySearchParams, SearchParams } from '@mt-ng2/common-classes';
import { DynamicField } from '@mt-ng2/dynamic-form';
import { IModalOptions } from '@mt-ng2/modal-module';
import { NotificationsService } from '@mt-ng2/notifications-module';
import { MtSearchFilterItem } from '@mt-ng2/search-filter-select-control';
import { ISearchbarControlAPI } from '@mt-ng2/searchbar-control';
import { ISelectionChangedEvent, VirtualTypeAheadGetItemsFunction } from '@mt-ng2/type-ahead-control';
import { forkJoin, Observable } from 'rxjs';
import { debounceTime, finalize, map } from 'rxjs/operators';
import { EncounterService } from '../encounters/services/encounter.service';
import { BillingReversalEntityListConfig } from './billing-reversals.entity-list-config';
import { DatePipe } from '@angular/common';
import { IProvider } from '@model/interfaces/provider';
import { ISearchFilterDaterangeValue } from '@mt-ng2/search-filter-daterange-control';

@Component({
    selector: 'app-billing-reversals',
    styles: [
        `
            p {
                white-space: pre-wrap;
            }
        `,
    ],
    templateUrl: './billing-reversals.component.html',
})
export class BillingReversalsComponent implements OnInit {
    encounters: IEncounterResponseDto[];
    currentPage = 1;
    query = '';
    total: number;
    entityListConfig = new BillingReversalEntityListConfig();
    order = this.entityListConfig.getDefaultSortProperty();
    orderDirection: string = this.entityListConfig.getDefaultSortDirection();
    encounterStatuses = EncounterStatuses;
    modalOptions: IModalOptions = {
        customClass: {
            title: 'text-center',
        },
        showCloseButton: true,
        showConfirmButton: false,
        width: '50%',
    };
    showEsignModal = false;
    showStatusesModal = false;
    showAbandonedNotesModal = false;
    encounterStudentIdForModal: number;
    encounterStudentStatusesForModal: IEncounterStudentStatusesLogDto[];
    doubleClickDisabled = false;
    schoolDistrictField: DynamicField;
    schoolDistricts: ISelectOptions[];
    schoolDistrictIdFilter = 0;
    providerIdFilter = 0;
    startDate: Date;
    endDate: Date = new Date();
    getSchoolDistricts: VirtualTypeAheadGetItemsFunction = this.getSchoolDistrictsFunction.bind(this);
    getProviders: VirtualTypeAheadGetItemsFunction = this.getProvidersFunction.bind(this);
    providers: MtSearchFilterItem[] = [];
    cptCodes: MtSearchFilterItem[] = [];
    serviceCodes: MtSearchFilterItem[] = [];

    // Modal parameters
    reasonForReturnControl: AbstractControl;
    reasonForAbandonmentControl: AbstractControl;
    myReasons: IEncounterReasonForReturn[];
    reasonForReturnCategories: IMetaItem[];
    selectedCategoryId: number;
    searchControlApi: ISearchbarControlAPI;

    reversalConfirm: IModalOptions = {
        cancelButtonText: 'Cancel',
        confirmButtonText: 'Yes, I am sure!',
        denyButtonText: '',
        icon: 'warning',
        showCancelButton: true,
        showConfirmButton: true,
        showDenyButton: false,
        text: `Are you sure you want to reverse this encounter?`,
        title: 'Reverse Encounter',
    };

    constructor(
        private encounterService: EncounterService,
        private schoolDistrictService: SchoolDistrictService,
        private providerService: ProviderService,
        private cptCodeService: CptCodeService,
        private serviceCodeService: ServiceCodeService,
        private dateTimeConverter: DateTimeConverterService,
        private notificationService: NotificationsService,
    ) {}

    ngOnInit(): void {
        forkJoin([this.cptCodeService.getSelectOptions(), this.serviceCodeService.getAll()]).subscribe(([cptCodes, serviceCodes]) => {
            this.cptCodes = cptCodes.map((cpt) => new MtSearchFilterItem(cpt, false));
            this.serviceCodes = serviceCodes.map((sc) => new MtSearchFilterItem(sc, false));
        });
    }

    toggleStatusModal(encounterStudentStatuses?: IEncounterStudentStatusesLogDto[]): void {
        this.encounterStudentStatusesForModal = encounterStudentStatuses;
        this.showStatusesModal = !this.showStatusesModal;
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

    getEncounters(): void {
        const search = this.query?.length > 0 ? this.query : '';
        const _extraSearchParams = this.buildSearch();

        const searchEntity: IEntitySearchParams = {
            extraParams: _extraSearchParams,
            order: this.order,
            orderDirection: this.orderDirection,
            query: search && search.length > 0 ? search : '',
            skip: (this.currentPage - 1) * entityListModuleConfig.itemsPerPage,
            take: entityListModuleConfig.itemsPerPage,
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

    private getSelectedFilters(filterObj: MtSearchFilterItem[]): number[] {
        return filterObj.filter((item) => item.Selected).map((item) => item.Item.Id);
    }

    private buildSearch(): ExtraSearchParams[] {
        const _extraSearchParams: ExtraSearchParams[] = [];
        const encounterStatusIds: number[] = [EncounterStatuses.Invoiced_and_Paid];
        const cptCodeIds: number[] = this.getSelectedFilters(this.cptCodes);
        const serviceCodeIds: number[] = this.getSelectedFilters(this.serviceCodes);

        _extraSearchParams.push(
            new ExtraSearchParams({
                name: 'districtId',
                value: this.schoolDistrictIdFilter !== null ? this.schoolDistrictIdFilter.toString() : '0',
            }),
        );

        _extraSearchParams.push(
            new ExtraSearchParams({
                name: 'providerId',
                value: this.providerIdFilter !== null ? this.providerIdFilter.toString() : '0',
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
                name: 'EncounterStatusIds',
                valueArray: encounterStatusIds,
            }),
        );

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

        return _extraSearchParams;
    }

    updateEncounterStatus(encounterStudentId: number): void {
        const request: IClaimAuditRequestDto = {
            EncounterStudentId: encounterStudentId,
            ReasonForAbandonment: null,
            ReasonForReturn: null,
            StatusId: EncounterStatuses.SCHEDULED_FOR_REVERSAL,
        };
        this.doubleClickDisabled = true;
        this.encounterService
            .updateStatus(request)
            .pipe(finalize(() => (this.doubleClickDisabled = false)))
            .subscribe(() => {
                this.success();
                this.getEncounters();
            });
    }

    convertItemsToCommaSeparatedList(items: IGoal[]): string {
        if (!items || !items.length) {
            return '';
        }
        return items.map((g) => g.Description).join(', ');
    }

    convertCptCodesToCommaSeparatedList(items: ICptCodeWithMinutesDto[]): string {
        if (!items || !items.length) {
            return '';
        }
        return items.length > 1
            ? items.map((c) => `${c.CptCode.Description}: ${c.Minutes} mins`).join(', \r\n')
            : items.map((c) => c.CptCode.Description).join('');
    }

    success(): void {
        this.notificationService.success('Claim status updated successfully.');
    }

    getFilterSchoolDistrictSearchbar(event: ISelectionChangedEvent): void {
        this.schoolDistrictIdFilter = event.selection !== null ? (<ISchoolDistrict>event.selection).Id : this.schoolDistrictIdFilter;
    }

    getFilterProviderSearchbar(event: ISelectionChangedEvent): void {
        this.providerIdFilter = event.selection !== null ? (<IProvider>event.selection).Id : this.providerIdFilter;
    }

    getFilterSearchbar(event: string): void {
        this.query = event;
    }

    getFilterDateRange(range: ISearchFilterDaterangeValue): void {
        this.startDate = range ? range.startDate : this.startDate;
        this.endDate = range ? range.endDate : this.endDate;
    }

    applyClicked(applyEvent: ISelectionChangedEvent): void {
        if (applyEvent) {
            this.filterSelectionChanged();
        }
    }

    filterSelectionChanged(): void {
        this.currentPage = 1;
        this.getEncounters();
    }

    encounterStatusLogSelected(encounterStudent: IEncounterResponseDto): void {
        this.toggleStatusModal(encounterStudent.EncounterStudentStatuses);
    }

    getAbbrigedComments(comments: string): string {
        return comments && comments.length > 50 ? comments.substr(0, 50) + `...` : comments;
    }

    searchControlReady(searchControlApi: ISearchbarControlAPI): void {
        this.searchControlApi = searchControlApi;
        this.searchControlApi.getSearchInputElement().nativeElement.placeholder = 'Begin typing...';
    }

    getSessionMinutes(request: IEncounterResponseDto): number {
        let sumTime = 0;
        const millisecondsToMinutes = 60000;

        const startTime = new Date(`01/01/2011 ${request.StartTime}`).getTime();
        const endTime = new Date(`01/01/2011 ${request.EndTime}`).getTime();
        sumTime += endTime - startTime;

        return Math.trunc(sumTime / millisecondsToMinutes);
    }
}
