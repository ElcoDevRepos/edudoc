import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { entityListModuleConfig } from '@common/shared.module';
import { ClaimTypes } from '@model/ClaimTypes';
import { ElectronicSignatures } from '@model/enums/electronic-signatures.enum';
import { ISelectOptions } from '@model/interfaces/custom/select-options';
import { IESignatureContent } from '@model/interfaces/e-signature-content';
import { IEncounterStudent } from '@model/interfaces/encounter-student';
import { ClaimsService, ClaimValues } from '@mt-ng2/auth-module';
import { ExtraSearchParams, IEntitySearchParams, SearchParams } from '@mt-ng2/common-classes';
import { DynamicField, DynamicFieldType, DynamicFieldTypes, IDynamicFieldType, SelectInputTypes } from '@mt-ng2/dynamic-form';
import { IColumnSortedEvent, IItemSelectedEvent, SortDirection } from '@mt-ng2/entity-list-module';
import { MtSearchFilterItem } from '@mt-ng2/search-filter-select-control';
import { ISearchbarControlAPI } from '@mt-ng2/searchbar-control';
import { ProviderStudentService } from '@provider/case-load/services/provider-student.service';
import { ElectronicSignatureModalService } from '@provider/common/electronic-signature-modal/electronic-signature-modal.service';
import { SupervisorApprovalModalService } from '@provider/common/supervisor-approval-modal/supervisor-approval-modal.service';
import { EncounterStudentService } from '@provider/encounters/services/encounter-student.service';
import { ProviderElectronicSignaturesService } from '@provider/encounters/services/provider-electronic-signature. service';
import { ProviderPortalAuthService } from '@provider/provider-portal-auth.service';
import { forkJoin, map, Observable, Subscription } from 'rxjs';
import { EncounterStudentEntityListConfig } from './encounter-student-list.entity-list-config';
import { ServiceTypeService } from '@common/services/service-type.service';
import { EncounterService } from '@provider/encounters/services/encounter.service';
import { ISearchFilterDaterangeValue } from '@mt-ng2/search-filter-daterange-control';
import { EncounterServiceTypes } from '@model/enums/encounter-service-types.enum';
import { IStudent } from '@model/interfaces/student';
import { INamedEntity } from '@mt-ng2/multiselect-control';
import { ISelectionChangedEvent } from '@mt-ng2/type-ahead-control';
import { NotificationsService } from '@mt-ng2/notifications-module';

@Component({
    selector: 'app-student-encounters',
    templateUrl: './encounter-student-list.component.html',
})
export class EncounterStudentsComponent implements OnInit, OnDestroy {
    encounterStudents: IEncounterStudent[];
    currentPage = 1;
    total: number;
    entityListConfig = new EncounterStudentEntityListConfig();
    order = this.entityListConfig.getDefaultSortProperty();
    orderDirection: string = this.entityListConfig.getDefaultSortDirection();

    canAddEncounter = false;
    selectedEntities = [];
    providerId: number;

    // Filters
    encounterLocations: MtSearchFilterItem[] = [];
    schoolDistrictFilterId = 0;
    studentFilterId = 0;
    districtOptions: ISelectOptions[] = [];
    encounterStartDate: Date;
    encounterEndDate: Date;

    showList = true;
    signature: IESignatureContent;
    subscriptions: Subscription;
    isSupervisor: boolean;
    returnedOnly = false;
    approvalsOnly = false;
    serviceTypes: MtSearchFilterItem[] = [];

    getStudents = this.getStudentsFunction.bind(this);

    constructor(
        private encounterStudentService: EncounterStudentService,
        private providerStudentService: ProviderStudentService,
        private supervisorApprovalModalService: SupervisorApprovalModalService,
        private claimsService: ClaimsService,
        private router: Router,
        private electronicSignatureModalService: ElectronicSignatureModalService,
        private electronicSignatureService: ProviderElectronicSignaturesService,
        private route: ActivatedRoute,
        private providerAuthService: ProviderPortalAuthService,
        private serviceTypeService: ServiceTypeService,
        private encounterService: EncounterService,
        private notificationService: NotificationsService
    ) {
        this.subscriptions = new Subscription();
    }

    ngOnInit(): void {
        // Sets the appropriate flags to true if navigating from Dashboard ToDo list
        this.returnedOnly = this.route.snapshot.params.fromToDoForReturned;
        this.approvalsOnly = this.route.snapshot.params.fromToDoForApprovals;
        this.canAddEncounter = this.claimsService.hasClaim(ClaimTypes.Encounters, [ClaimValues.FullAccess]);
        this.isSupervisor = this.providerAuthService.providerIsSupervisor();
        this.providerId = this.providerAuthService.getProviderId();

        // Handles page refresh when Supervisors reject/Sign Off Encounters
        this.subscriptions.add(
            this.supervisorApprovalModalService.rejected.subscribe(() => {
                this.getEncounterStudents();
            }),
        );

        this.subscriptions.add(
            this.electronicSignatureModalService.saved.subscribe(() => {
                this.getEncounterStudents();
            }),
        );

        this.subscriptions.add(
            this.encounterService.encounterAbandonedUpdated$.subscribe(() => {
                this.getEncounterStudents();
            }),
        );

        forkJoin([
            this.electronicSignatureService.getById(ElectronicSignatures.Encounter),
            this.providerStudentService.getSchoolDistricts(this.providerId),
            this.serviceTypeService.getAll(),
        ]).subscribe(([signature, districts, serviceTypes]) => {
            this.signature = signature;
            this.districtOptions = districts;
            this.getEncounterStudents();
            if (this.returnedOnly) {
                this.entityListConfig = new EncounterStudentEntityListConfig(this.returnedOnly);
            }
            this.serviceTypes = serviceTypes.map((st) => new MtSearchFilterItem(st, false));
        });
    }

    ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    redrawList(): void {
        this.showList = false;
        setTimeout(() => (this.showList = true), 0);
    }

    getEncounterStudents(): void {
        const _extraSearchParams = this.buildSearch();

        const searchEntity: IEntitySearchParams = {
            extraParams: _extraSearchParams,
            order: this.order,
            orderDirection: this.orderDirection,
            query: '',
            skip: (this.currentPage - 1) * entityListModuleConfig.itemsPerPage,
            take: entityListModuleConfig.itemsPerPage,
        };
        const searchparams = new SearchParams(searchEntity);
        this.encounterStudentService.get(searchparams).subscribe((answer) => {
            this.encounterStudents = answer.body;
            this.total = +answer.headers.get('X-List-Count');
        });
    }

    getStudentsFunction(query: string): Observable<INamedEntity[]> {
        const _extraSearchParams = this.buildSearch();

        const searchEntity: IEntitySearchParams = {
            extraParams: _extraSearchParams,
            order: 'LastName',
            orderDirection: 'asc',
            query: query,
            skip: (this.currentPage - 1) * entityListModuleConfig.itemsPerPage,
            take: entityListModuleConfig.itemsPerPage,
        };
        return this.providerStudentService
            .searchStudents(searchEntity)
            .pipe(map((result) => result.body.map((s) => ({ Name: `${s.LastName}, ${s.FirstName}`, Id: s.Id }))));
    }

    getSchoolDistrictField(): DynamicField {
        return new DynamicField({
            formGroup: null,
            label: 'Assigned School District(s)',
            name: 'schoolDistrict',
            options: this.districtOptions,
            type: new DynamicFieldType({
                fieldType: DynamicFieldTypes.Select,
                inputType: SelectInputTypes.Dropdown,
            }),
            value:
                this.districtOptions.length === 2
                    ? this.districtOptions[1].Id
                    : this.providerStudentService.getSelectedSchoolDistrict() ?? this.schoolDistrictFilterId,
        });
    }

    private getSelectedFilters(filterObj: MtSearchFilterItem[]): number[] {
        return filterObj.filter((item) => item.Selected).map((item) => item.Item.Id);
    }

    private buildSearch(): ExtraSearchParams[] {
        const _extraSearchParams: ExtraSearchParams[] = [];
        const encounterLocationIds: number[] = this.getSelectedFilters(this.encounterLocations);
        const serviceTypeIds: number[] = this.getSelectedFilters(this.serviceTypes);

        _extraSearchParams.push(
            new ExtraSearchParams({
                name: 'returnedOnly',
                value: this.returnedOnly ? '1' : '0',
            }),
            new ExtraSearchParams({
                name: 'approvalsOnly',
                value: this.approvalsOnly ? '1' : '0',
            }),
            new ExtraSearchParams({
                name: 'locationids',
                valueArray: encounterLocationIds,
            }),
            new ExtraSearchParams({
                name: 'signedEncounters',
                value: '1',
            }),
            new ExtraSearchParams({
                name: 'serviceTypeIds',
                valueArray: serviceTypeIds,
            }),
        );

        if (this.schoolDistrictFilterId) {
            _extraSearchParams.push(
                new ExtraSearchParams({
                    name: 'districtId',
                    value: this.schoolDistrictFilterId ? this.schoolDistrictFilterId.toString() : '0',
                }),
            );
        }

        if (this.studentFilterId) {
            _extraSearchParams.push(
                new ExtraSearchParams({
                    name: 'studentId',
                    value: this.studentFilterId ? this.studentFilterId.toString() : '0',
                }),
            );
        }

        if (this.encounterStartDate) {
            _extraSearchParams.push(
                new ExtraSearchParams({
                    name: 'EncounterStartDate',
                    value: this.encounterStartDate.toISOString(),
                }),
            );
        }

        if (this.encounterEndDate) {
            _extraSearchParams.push(
                new ExtraSearchParams({
                    name: 'EncounterEndDate',
                    value: this.encounterEndDate.toISOString(),
                }),
            );
        }

        return _extraSearchParams;
    }

    getFilterSchoolDistrict(event: number) {
        if (event) {
            this.schoolDistrictFilterId = event;
        } else {
            event = this.districtOptions.length === 2 ? this.districtOptions[1].Id : this.schoolDistrictFilterId;
        }
    }

    getFilterDateRange(range: ISearchFilterDaterangeValue) {
        this.encounterStartDate = range ? range.startDate : this.encounterStartDate;
        this.encounterEndDate = range ? range.endDate : this.encounterEndDate;
    }

    applyClicked(applyEvent: Event) {
        if (applyEvent) {
            this.filterSelectionChanged();
        }
    }

    columnSorted(event: IColumnSortedEvent): void {
        this.order = event.column.sort.sortProperty;
        this.orderDirection = event.column.sort.direction === SortDirection.Desc ? 'desc' : 'asc';
        this.getEncounterStudents();
    }

    filterSelectionChanged(): void {
        this.currentPage = 1;
        this.getEncounterStudents();
    }

    encounterSelected(event: IItemSelectedEvent): void {
        const FORTY_EIGHT_HOURS_IN_MS = 48 * 60 * 60 * 1000;
        const currentDate = new Date();
        const esignedById = event.entity.ESignedById as number;
        const dateEsigned = event.entity.DateESigned ? new Date(event.entity.DateESigned as string) : undefined;
        if (esignedById && dateEsigned && (currentDate.getTime() - dateEsigned.getTime()) > FORTY_EIGHT_HOURS_IN_MS) {
            this.notificationService.info("This encounter has been signed more than 48 hours ago. Please contact HPC if changes need to be made.");
            return;
        }
        if ((<IEncounterStudent>event.entity).Encounter.ServiceTypeId === EncounterServiceTypes.Evaluation_Assessment) {
            void this.router.navigate(['/provider/encounters/evaluation', event.entity.EncounterId]);
        } else {
            void this.router.navigate(['/provider/encounters/treatment-therapy', event.entity.EncounterId]);
        }
    }

    studentSelected(event: ISelectionChangedEvent): void {
        this.studentFilterId = event.selection?.Id ?? 0;
        if (this.studentFilterId > 0) {
            this.order = 'EncounterDate';
            this.orderDirection = 'desc';
        } else {
            this.order = this.entityListConfig.getDefaultSortProperty();
            this.orderDirection = this.entityListConfig.getDefaultSortDirection();
        }
    }
}
