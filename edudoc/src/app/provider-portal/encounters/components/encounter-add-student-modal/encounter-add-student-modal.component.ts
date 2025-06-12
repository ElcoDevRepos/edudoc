import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from "@angular/core";
import { Router } from "@angular/router";
import { entityListModuleConfig } from "@common/entity-list-module-config";
import { EncounterServiceTypes } from "@model/enums/encounter-service-types.enum";
import { ISelectOptions } from "@model/interfaces/custom/select-options";
import { IEncounter } from "@model/interfaces/encounter";
import { IStudent } from "@model/interfaces/student";
import { ExtraSearchParams, IEntitySearchParams, SearchParams } from "@mt-ng2/common-classes";
import { DynamicField, DynamicFieldType, DynamicFieldTypes, IDynamicFieldType, SelectInputTypes } from "@mt-ng2/dynamic-form";
import { IColumnSortedEvent, IItemSelectedEvent, SortDirection } from "@mt-ng2/entity-list-module";
import { IModalOptions } from "@mt-ng2/modal-module";
import { NotificationsService } from "@mt-ng2/notifications-module";
import { ISearchbarControlAPI } from "@mt-ng2/searchbar-control";
import { ProviderStudentsEntityListConfig } from "@provider/case-load/components/provider-students-list/provider-students.entity-list-config";
import { CaseLoadService } from "@provider/case-load/services/case-load.service";
import { ProviderStudentService } from "@provider/case-load/services/provider-student.service";
import { ProviderPortalAuthService } from "@provider/provider-portal-auth.service";
import { forkJoin } from "rxjs";

@Component({
    selector: 'app-encounter-add-student-modal',
    templateUrl: './encounter-add-student-modal.component.html',
})
export class EncounterAddStudentModalComponent implements OnInit {
    @Input() encounter: IEncounter;
    @Input() serviceCodeId: number;
    @Output() closeAddStudentModal = new EventEmitter<boolean>();
    @Output() studentAdded = new EventEmitter<void>();

    schoolDistricts: ISelectOptions[] = [];
    schoolDistrictField: DynamicField;
    schoolDistrictIdFilter = 0;
    providerId: number;

    modalOptions: IModalOptions = {
        customClass: {
            title: 'text-center',
        },
        showCloseButton: false,
        showConfirmButton: false,
        width: '50%',
    };

    // Add New Student Params
    nonCaseLoadStudents: IStudent[] = [];
    newStudentEntityListConfig = new ProviderStudentsEntityListConfig();
    newStudentQuery = '';
    newStudentTotal: number;
    newStudentCurrentPage = 1;
    newStudentSchoolDistrictIdFilter = 0;
    newStudentOrder = this.newStudentEntityListConfig.getDefaultSortProperty();
    newStudentOrderDirection: string = this.newStudentEntityListConfig.getDefaultSortDirection();
    newStudentSearchControlApi: ISearchbarControlAPI;
    showAddCaseloadModal = false;
    
    constructor(
        private providerStudentService: ProviderStudentService,
        private providerAuthService: ProviderPortalAuthService,
        private caseLoadService: CaseLoadService,
        private router: Router,
        private notificationsService: NotificationsService
    ) {}
    
    ngOnInit(): void {
        this.providerId = this.providerAuthService.getProviderId();
        forkJoin([
            this.providerStudentService.getSchoolDistricts(this.providerId)
        ]).subscribe(([schoolDistricts]) => {
            this.schoolDistricts = schoolDistricts;
        });
    }

    newStudentSearch(query: string): void {
        this.newStudentQuery = query;
        this.getNonCaseLoadStudents();
    }

    newStudentSearchControlReady(searchControlApi: ISearchbarControlAPI): void {
        this.newStudentSearchControlApi = searchControlApi;
        this.newStudentSearchControlApi.getSearchInputElement().nativeElement.placeholder = 'Begin typing...';
    }

    newStudentColumnSorted(event: IColumnSortedEvent): void {
        this.newStudentOrder = event.column.sort.sortProperty;
        this.newStudentOrderDirection = event.column.sort.direction === SortDirection.Desc ? 'desc' : 'asc';
        this.getNonCaseLoadStudents();
    }

    newStudentSelected(event: IItemSelectedEvent): void {
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
        this.caseLoadService.addProviderStudent(event.entity.Id as number).subscribe(() => {
            this.studentAdded.emit();
            this.notificationsService.success('Student successfully added to your caseload!');
            // navigate to student detail page is student does not have iep plan
            if ((event.entity as IStudent).CaseLoads.filter((c) => !c.Archived && c.ServiceCodeId === this.serviceCodeId).length === 0) {
                void this.router.navigate(['provider/case-load/student', event.entity.Id], {
                    queryParams: { encounterId: this.encounter.Id, fromEncounter: true, encounterServiceTypeId: this.encounter.ServiceTypeId },
                });
            }
            this.closeModal();
        });
    }

    addNewStudent(): void {
        this.closeModal();
        void this.router.navigate(['provider/case-load/student', 'add'], {
            queryParams: {
                encounterId: this.encounter.Id,
                encounterServiceTypeId: this.encounter.ServiceTypeId,
                fromEncounter: true,
                nonBillable: this.encounter.ServiceTypeId === EncounterServiceTypes.Treatment_Therapy ? null : 1,
            },
        });
    }

    setSchoolDistrictField(): void {
        this.schoolDistrictField = new DynamicField({
            formGroup: null,
            label: 'Assigned School District(s)',
            name: 'schoolDistrict',
            options: this.schoolDistricts,
            type: new DynamicFieldType({
                fieldType: DynamicFieldTypes.Select,
                inputType: SelectInputTypes.Dropdown,
            } as IDynamicFieldType),
            value:
                this.schoolDistricts.length === 2
                    ? this.schoolDistricts[1].Id
                    : this.providerStudentService.getSelectedSchoolDistrict() ?? this.schoolDistrictIdFilter,
        });
    }

    getNonCaseLoadStudents(): void {
        if (this.newStudentQuery.length > 1) {
            const search = this.newStudentQuery;
            const _extraSearchParams: ExtraSearchParams[] = [];
            _extraSearchParams.push(
                new ExtraSearchParams({
                    name: 'districtId',
                    value: this.newStudentSchoolDistrictIdFilter.toString(),
                }),
                new ExtraSearchParams({
                    name: 'providerId',
                    value: this.providerId.toString(),
                }),
            );
            const searchEntity: IEntitySearchParams = {
                extraParams: _extraSearchParams,
                order: this.newStudentOrder,
                orderDirection: this.newStudentOrderDirection,
                query: search && search.length > 0 ? search : '',
                skip: (this.newStudentCurrentPage - 1) * entityListModuleConfig.itemsPerPage,
                take: entityListModuleConfig.itemsPerPage,
            };

            const searchparams = new SearchParams(searchEntity);
            this.providerStudentService.searchNonCaseloadStudents(searchparams).subscribe((answer) => {
                this.nonCaseLoadStudents = answer.body;
                this.newStudentTotal = +answer.headers.get('X-List-Count');
            });
        }
    }

    closeModal(): void {
        this.closeAddStudentModal.emit();
    }
}