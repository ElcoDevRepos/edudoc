import { ProviderService } from '@admin/providers/provider.service';
import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { DateTimeConverterService } from '@common/services/date-time-converter.service';
import { ServiceCodeService } from '@common/services/service-code.service';
import { entityListModuleConfig } from '@common/shared.module';
import { ICptCodeWithMinutesDto, IEncounterResponseDto } from '@model/interfaces/custom/encounter-response.dto';
import { ISelectOptions } from '@model/interfaces/custom/select-options';
import { IGoal } from '@model/interfaces/goal';
import { IMethod } from '@model/interfaces/method';
import { IProvider } from '@model/interfaces/provider';
import { ExtraSearchParams, IEntitySearchParams, SearchParams } from '@mt-ng2/common-classes';
import { EntityListExportService } from '@mt-ng2/entity-list-module';
import { NotificationsService } from '@mt-ng2/notifications-module';
import { ISearchFilterDaterangeValue } from '@mt-ng2/search-filter-daterange-control';
import { MtSearchFilterItem } from '@mt-ng2/search-filter-select-control';
import { ISelectionChangedEvent, ITypeAheadAPI, VirtualTypeAheadGetItemsFunction } from '@mt-ng2/type-ahead-control';
import { SchoolDistrictAdminUserService } from '@school-district-admin/users/services/school-district-admin-user.service';
import { forkJoin, Observable } from 'rxjs';
import { debounceTime, map } from 'rxjs/operators';
import { EncounterEntityListConfig } from './district-admin-encounters-list-by-student.entity-list-config';
import { EncounterExportEntityListConfig } from './district-admin-encounters-list-by-student.export.entity-list-config';
import { DistrictAdminEncounterService } from './services/district-admin-encounter.service';
import { EncounterResponseDtoService } from '@common/services/encounter-response-dto.service';

@Component({
    selector: 'app-district-admin-encounters-list-by-student',
    styles: [
        `
            p {
                white-space: pre-wrap;
            }
        `,
    ],
    templateUrl: './district-admin-encounters-list-by-student.component.html',
})
export class DistrictAdminEncountersByStudentComponent implements OnInit {
    encounters: IEncounterResponseDto[];
    currentPage = 1;
    query = '';
    total: number;
    entityListConfig = new EncounterEntityListConfig(() => this.onExportClick());
    exportConfig = new EncounterExportEntityListConfig(this.encounterResponseDtoService);
    order = this.entityListConfig.getDefaultSortProperty();
    orderDirection: string = this.entityListConfig.getDefaultSortDirection();
    doubleClickDisabled = false;
    startDate: Date = new Date();
    endDate: Date;
    providers: MtSearchFilterItem[] = [];
    cptCodes: MtSearchFilterItem[] = [];
    serviceCodes: MtSearchFilterItem[] = [];
    districtId: number;
    totalMinutes = 0;

    providerIdFilter = 0;

    getStudents: VirtualTypeAheadGetItemsFunction = this.getStudentsFunction.bind(this);
    getProviders: VirtualTypeAheadGetItemsFunction = this.getProvidersFunction.bind(this);
    typeAheadControl: ITypeAheadAPI;
    studentOptions: ISelectOptions[];
    studentSelectedId: number;

    constructor(
        private encounterService: DistrictAdminEncounterService,
        private userService: SchoolDistrictAdminUserService,
        private serviceCodeService: ServiceCodeService,
        private dateTimeConverter: DateTimeConverterService,
        private notificationsService: NotificationsService,
        private providerService: ProviderService,
        private exportService: EntityListExportService,
        private encounterResponseDtoService: EncounterResponseDtoService
    ) {}

    ngOnInit(): void {
        this.districtId = this.userService.getAdminDistrictId();
        forkJoin([this.encounterService.getCptCodeSelectOptions(), this.serviceCodeService.getAll(), this.getStudentsFunction()]).subscribe(
            ([cptCodes, serviceCodes, studentOptions]) => {
                this.cptCodes = cptCodes.map((cpt) => new MtSearchFilterItem(cpt, false));
                this.serviceCodes = serviceCodes.map((sc) => new MtSearchFilterItem(sc, false));
                this.studentOptions = studentOptions;
            },
        );
    }

    onExportClick(): void {
        if (this.studentSelectedId) {
            this.getEncountersCall({ skip: undefined, take: undefined }).subscribe((answer) => {
                this.exportService.export(answer.items, this.exportConfig);
            });
        } else {
            this.notificationsService.error('A student must be selected first!');
        }
    }

    private getStudentsFunction(): Observable<ISelectOptions[]> {
        return this.encounterService
            .getStudentOptions({
                extraParams: [
                    new ExtraSearchParams({
                        name: 'districtId',
                        value: this.districtId.toString(),
                    }),
                ],
                query: '',
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

    typeAheadControlReady(controlApi: ITypeAheadAPI): void {
        this.typeAheadControl = controlApi;
        setTimeout(() => {
            this.typeAheadControl.focus();
        }, 999);
    }

    getEncountersCall(skipAndTake: {
        skip?: number;
        take?: number;
    }): Observable<{ items: IEncounterResponseDto[]; total: number; totalMinutes: number }> {
        const search = this.query != null ? this.query : '';
        const _extraSearchParams = this.buildSearch();

        const searchEntity: IEntitySearchParams = {
            extraParams: _extraSearchParams,
            order: this.order,
            orderDirection: this.orderDirection,
            query: search && search.length > 0 ? search : '',
            skip: skipAndTake.skip,
            take: skipAndTake.take,
        };

        const searchparams = new SearchParams(searchEntity);
        return forkJoin([this.encounterService.getEncounters(searchparams), this.encounterService.getEncounterTotalMinutes(searchparams)]).pipe(
            map(([encounters, minutes]) => ({
                items: encounters.body.map((response) => {
                    response.StartDateTime = this.dateTimeConverter.convertUtcToLocal(
                        this.dateTimeConverter.appendTimeSpanToDate(response.EncounterDate, response.StartTime),
                    );
                    response.EndDateTime = this.dateTimeConverter.convertUtcToLocal(
                        this.dateTimeConverter.appendTimeSpanToDate(response.EncounterDate, response.EndTime),
                    );
                    response.EncounterDate = new Date(new DatePipe('en-Us').transform(response.EncounterDate, 'yyyy-MM-ddThh:mm:ss', 'UTC'));
                    return response;
                }),
                total: +encounters.headers.get('X-List-Count'),
                totalMinutes: minutes.body,
            })),
        );
    }

    getEncounters(): void {
        if (this.studentSelectedId) {
            this.getEncountersCall({
                skip: (this.currentPage - 1) * entityListModuleConfig.itemsPerPage,
                take: entityListModuleConfig.itemsPerPage,
            }).subscribe((answer) => {
                this.encounters = answer.items;
                this.total = answer.total;
                this.totalMinutes = answer.totalMinutes;
            });
        } else {
            this.notificationsService.error('A student must be selected first!');
        }
    }

    private getSelectedFilters(filterObj: MtSearchFilterItem[]): number[] {
        return filterObj.filter((item) => item.Selected).map((item) => item.Item.Id);
    }

    private buildSearch(): ExtraSearchParams[] {
        const _extraSearchParams: ExtraSearchParams[] = [];
        const cptCodeIds: number[] = this.getSelectedFilters(this.cptCodes);
        const serviceCodeIds: number[] = this.getSelectedFilters(this.serviceCodes);

        _extraSearchParams.push(
            new ExtraSearchParams({
                name: 'districtId',
                value: this.districtId.toString(),
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
                name: 'StudentId',
                value: this.studentSelectedId !== null ? this.studentSelectedId.toString() : '0',
            }),
        );

        return _extraSearchParams;
    }

    convertGoalsToCommaSeparatedList(items: IGoal[]): string {
        return this.encounterResponseDtoService.convertGoalsToCommaSeparatedList(items);
    }

    convertCptCodesToCommaSeparatedList(items: ICptCodeWithMinutesDto[]): string {
        return this.encounterResponseDtoService.convertCptCodesToCommaSeparatedList(items);
    }

    convertMethodsToCommaSeparatedList(items: IMethod[]): string {
        return this.encounterResponseDtoService.convertMethodsToCommaSeparatedList(items);
    }

    getFilterProviderSearchbar(event: ISelectionChangedEvent) {
        this.providerIdFilter = event.selection !== null ? (<IProvider>event.selection).Id : this.providerIdFilter;
    }

    getFilterStudentSearchbar(event: ISelectionChangedEvent) {
        const selectedStudent = event.selection;
        if (selectedStudent) {
            this.currentPage = 1;
            this.studentSelectedId = selectedStudent.Id;
        }
    }

    getFilterDateRange(range: ISearchFilterDaterangeValue) {
        this.startDate = range ? range.startDate : this.startDate;
        this.endDate = range ? range.endDate : this.endDate;
    }

    applyClicked(applyEvent: Event) {
        if (applyEvent) {
            this.filterSelectionChanged();
            this.typeAheadControl.clearValue();
        }
    }

    filterSelectionChanged(): void {
        this.currentPage = 1;
        this.getEncounters();
    }

    getAbbrigedComments(comments: string): string {
        return comments && comments.length > 50 ? comments.substr(0, 50) + `...` : comments;
    }

    getStatus(response: IEncounterResponseDto): string {
        return response.HPCAdminStatusOnly ? 'E-Signed' : response.CurrentStatus;
    }
}
