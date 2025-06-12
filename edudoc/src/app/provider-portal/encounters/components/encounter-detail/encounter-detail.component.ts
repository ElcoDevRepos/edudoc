import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EvaluationTypeService } from '@common/services/evaluation-type.service';
import { ServiceTypeService } from '@common/services/service-type.service';
import { ClaimTypes } from '@model/ClaimTypes';
import { EncounterServiceTypes } from '@model/enums/encounter-service-types.enum';
import { IMetaItem } from '@model/interfaces/base';
import { IEncounter } from '@model/interfaces/encounter';
import { IEncounterStudent } from '@model/interfaces/encounter-student';
import { IEvaluationType } from '@model/interfaces/evaluation-type';
import { IServiceType } from '@model/interfaces/service-type';
import { ClaimValues, ClaimsService } from '@mt-ng2/auth-module';
import { MetaItem } from '@mt-ng2/base-service';
import { DynamicField, DynamicFieldType, DynamicFieldTypes, IDynamicFieldType, SelectInputTypes } from '@mt-ng2/dynamic-form';
import { IModalOptions } from '@mt-ng2/modal-module';
import { NotificationsService } from '@mt-ng2/notifications-module';
import { CaseLoadService } from '@provider/case-load/services/case-load.service';
import { ProviderPortalAuthService } from '@provider/provider-portal-auth.service';
import { Subject, Subscription, forkJoin } from 'rxjs';
import { EncounterService } from '../../services/encounter.service';

@Component({
    selector: 'app-encounter-detail',
    templateUrl: './encounter-detail.component.html',
})
export class EncounterDetailComponent implements OnInit, OnDestroy {
    encounter: IEncounter;
    encounterStudent: IEncounterStudent;
    editingComponent: Subject<string> = new Subject();
    canEdit = false;
    canAdd: boolean;
    encounterId: number;
    addStudentId: number;
    encounterStudentId: number;
    therapyScheduleId: number;
    addedFromSchedule: boolean;
    individualEncounterId: number;
    routerLink = '/provider/dashboard';
    caseLoadOnly: boolean;

    // Modal Parameters
    modalOptions: IModalOptions = {
        customClass: {
            title: 'text-center',
        },
        showCloseButton: true,
        showConfirmButton: false,
        width: '50%',
    };
    showModal = false;
    serviceTypes: IServiceType[];
    selectedServiceTypeId: number;
    requiresEvalType = false;
    evaluationTypes: IEvaluationType[];
    selectedEvaluationTypeId: number;

    providerId: number;
    reasonForServiceOptions: IMetaItem[];

    subscriptions = new Subscription;

    get createDisabled(): boolean {
        return typeof this.selectedServiceTypeId === 'undefined';
    }

    constructor(
        private encounterService: EncounterService,
        private notificationsService: NotificationsService,
        private claimsService: ClaimsService,
        private serviceTypeService: ServiceTypeService,
        private evaluationTypeService: EvaluationTypeService,
        private caseLoadService: CaseLoadService,
        private providerIdService: ProviderPortalAuthService,
        private route: ActivatedRoute,
        private router: Router,
    ) {}

    ngOnInit(): void {
        this.providerId = this.providerIdService.getProviderId();
        // TODO SD: Might be able to change the serviceTypes and EvaluationTypes to options controller cached in service for less API calls
        forkJoin([this.serviceTypeService.getAll(), this.evaluationTypeService.getAll(), this.caseLoadService.getReasonForServiceOptions(this.providerId)])
            .subscribe(([serviceTypes, evaluationTypes, reasonForServiceOptions]) => {
                this.serviceTypes = serviceTypes;
                // filter out option to select evals for pta and ota
                if (this.providerIdService.providerIsAssistant()) {
                    this.serviceTypes = this.serviceTypes.filter(st => st.Id !== EncounterServiceTypes.Evaluation_Assessment);
                }
                this.evaluationTypes = evaluationTypes;
                this.reasonForServiceOptions = reasonForServiceOptions.sort((a,b) => a.Description.localeCompare(b.Description)).map((item) => {
                    // truncate description string in case it's too long for dropdown
                    return new MetaItem(item.Id, `${item.Description.length > 150 ? item.Description.substring(0, 145) + '...' : item.Description} - ${item.Code}`);
                });
                this.canAdd = this.canEdit;
                this.encounterId = +this.route.snapshot.paramMap.get('encounterId');
                this.therapyScheduleId = +this.route.snapshot.paramMap.get('studentTherapyScheduleId');
                this.encounterStudentId = +this.route.snapshot.paramMap.get('encounterStudentId');
                this.addStudentId = +this.route.snapshot.queryParams.studentId;
                this.handleServiceTypeFromRoute();
                this.addedFromSchedule = this.therapyScheduleId > 0;
                this.caseLoadOnly = true;
                this.selectedServiceTypeId = this.therapyScheduleId > 0 ? EncounterServiceTypes.Treatment_Therapy : this.selectedServiceTypeId;
                this.getEncounter();
                this.editingComponent.next('');
            });
    }

    ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    getEncounter(): void {
        if (this.encounterId > 0) {
            this.routerLink = '/provider/encounters';
            this.getGroupEncounter();
        } else if (this.encounterStudentId) {
            this.routerLink = '/provider/revise-encounters';
            this.getIndividualEncounter();
        } else if ((!this.selectedServiceTypeId || this.requiresEvalType) && this.route.snapshot.data.serviceType !== EncounterServiceTypes.Other_Non_Billable) {
            this.toggleModal();
        } else if (this.addedFromSchedule) {
            this.routerLink = '/provider/case-load/schedules/list';
            this.encounterService.buildEncounterByScheduleId(this.therapyScheduleId).subscribe((encounterId) => {
                if (encounterId != null) {
                    this.encounterId = encounterId;
                    this.getGroupEncounter();
                } else {
                    this.error();
                }
            });
        } else {
            this.createEncounter();
        }
    }

    getGroupEncounter(): void {
        this.encounterService.getById(this.encounterId).subscribe((encounter) => {
            if (encounter) {
                if (encounter.EncounterDate) { this.encounterService.setEncounterLocalTime(encounter); }
                // TRACKING SD: Removing EncounterStudents from call
                // encounter.EncounterStudents.forEach((student) => {
                //     this.setEncounterLocalTime(student);
                // });
                this.encounter = encounter;
                //this.encounterService.setEncounterGroupStatus(encounter.IsGroup);
                this.canEdit = this.claimsService.hasClaim(ClaimTypes.Encounters, [ClaimValues.FullAccess]) && !encounter.EncounterStudents.some((es) => es.ClaimsEncounters.length);
            }
        });
    }

    getIndividualEncounter(): void {
        this.encounterService.getByEncounterStudentId(this.encounterStudentId).subscribe((result) => {
            const encounter = result && result.length ? result[0] : null;
            if (encounter) {
                if (encounter.EncounterDate) { this.encounterService.setEncounterLocalTime(encounter); }
                // TRACKING SD: Removing EncounterStudents from call
                // encounter.EncounterStudents.forEach((student) => {
                //     this.encounterService.setEncounterLocalTime(student);
                // });
                this.encounter = encounter;
                //this.encounterService.setEncounterGroupStatus(encounter.IsGroup);
                this.canEdit = this.claimsService.hasClaim(ClaimTypes.Encounters, [ClaimValues.FullAccess]) && !encounter.EncounterStudents.some((es) => es.ClaimsEncounters.length);
                // TRACKING SD: Removing EncounterStudents from call
                //this.encounterStudent = encounter.EncounterStudents.find((es) => es.Id === this.encounterStudentId);
            }
        });
    }

    getServiceTypeField(): DynamicField {
        return new DynamicField({
            formGroup: null,
            label: 'Service Type',
            name: 'serviceType',
            options: this.serviceTypes,
            type: new DynamicFieldType({
                fieldType: DynamicFieldTypes.Select,
                inputType: SelectInputTypes.Dropdown,
            }),
            validation: [],
            validators: {},
            value: null,
        });
    }

    handleServiceTypeFromRoute(): void {
        let serviceType = 0;
        switch (this.route.snapshot.params.encounterId) {
            case 'treatment-therapy':
                serviceType = EncounterServiceTypes.Treatment_Therapy;
                break;
            case 'evaluation':
                serviceType = EncounterServiceTypes.Evaluation_Assessment;
                break;
            case 'non-msp':
                serviceType = EncounterServiceTypes.Other_Non_Billable;
                break;
            default:
                break;
        }
        this.handleServiceTypeSelection(serviceType);
    }

    handleServiceTypeSelection(evt: number): void {
        this.selectedServiceTypeId = evt;
        this.requiresEvalType = this.selectedServiceTypeId === EncounterServiceTypes.Evaluation_Assessment;
    }

    getEvaluationTypeField(): DynamicField {
        return new DynamicField({
            formGroup: null,
            label: 'Evaluation Type',
            name: 'evaluationType',
            options: this.evaluationTypes,
            type: new DynamicFieldType({
                fieldType: DynamicFieldTypes.Select,
                inputType: SelectInputTypes.Dropdown,
            }),
            validation: [],
            validators: {},
            value: null,
        });
    }

    toggleModal(): void {
        this.showModal = !this.showModal;
    }

    createEncounter(): void {
        this.encounter = this.encounterService.getEmptyEncounter();
        this.encounter.ServiceTypeId = this.selectedServiceTypeId ? this.selectedServiceTypeId : this.route.snapshot.data.serviceType;
        this.encounter.EvaluationTypeId = this.selectedEvaluationTypeId;

        if(this.route.snapshot.data.serviceType === EncounterServiceTypes.Other_Non_Billable) {
            if (!this.encounter.Id || this.encounter.Id === 0) {
                this.encounter.ProviderId = this.providerId;
                this.encounterService
                    .create(this.encounter)
                    .subscribe((answer) => {
                        this.encounterService.emitChange(this.encounter);
                        switch(this.encounter.ServiceTypeId) {
                            case EncounterServiceTypes.Other_Non_Billable:
                                void this.router.navigate([`/provider/encounters/non-msp/${answer}`]);
                                break;
                            default:
                                break;
                        }
                    });
            }
        } else {
            if (this.showModal) {
                this.toggleModal();
            }
            if (!this.encounter.Id || this.encounter.Id === 0) {
                this.encounter.ProviderId = this.providerId;
                this.encounterService
                    .create(this.encounter)
                    .subscribe((answer) => {
                        this.encounterService.emitChange(this.encounter);
                        switch(this.encounter.ServiceTypeId) {
                            case EncounterServiceTypes.Treatment_Therapy:
                                void this.router.navigate([`/provider/encounters/treatment-therapy/${answer}`]);
                                break;
                            case EncounterServiceTypes.Evaluation_Assessment:
                                void this.router.navigate([`/provider/encounters/evaluation/${answer}`]);
                                break;
                            case EncounterServiceTypes.Other_Non_Billable:
                                void this.router.navigate([`/provider/encounters/non-msp/${answer}`]);
                                break;
                            default:
                                this.getEncounter();
                                break;
                        }
                    });
            }
        }
    }

    cancelCreate(): void {
        void this.router.navigate([this.routerLink]);
    }

    error(): void {
        this.notificationsService.error('Encounter not found.');
        void this.router.navigate([this.routerLink]);
    }
}
