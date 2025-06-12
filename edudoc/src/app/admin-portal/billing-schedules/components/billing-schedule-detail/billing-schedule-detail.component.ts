import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { ClaimsService, ClaimValues } from '@mt-ng2/auth-module';
import { NotificationsService } from '@mt-ng2/notifications-module';

import { BillingScheduleAdminNotificationService } from '@admin/billing-schedules/services/Inclusions/billing-schedule-admin-notification.service';
import { AbstractControl } from '@angular/forms';
import { ClaimTypes } from '@model/ClaimTypes';
import { IBillingSchedule } from '@model/interfaces/billing-schedule';
import { ISelectOptions } from '@model/interfaces/custom/select-options';
import { IMetaItem } from '@mt-ng2/base-service';
import { DynamicField, DynamicFieldType, DynamicFieldTypes, IDynamicField, IDynamicFieldType, InputTypes } from '@mt-ng2/dynamic-form';
import { IModalOptions } from '@mt-ng2/modal-module';
import { forkJoin } from 'rxjs/internal/observable/forkJoin';
import { BillingScheduleService } from '../../services/billing-schedule.service';
import { BillingScheduleExcludedCptCodeService } from '../../services/Exclusions/billing-schedule-cpt-code-exclusion.service';
import { BillingScheduleExcludedProviderService } from '../../services/Exclusions/billing-schedule-provider-exclusion.service';
import { BillingScheduleExcludedServiceCodeService } from '../../services/Exclusions/billing-schedule-service-code-exclusion.service';
import { BillingScheduleDistrictService } from '../../services/Inclusions/billing-schedule-district.service';
import { BillingScheduleEntityLabelGenerator } from './label-generators/billing-schedule-entity-label-generator';

export interface ISelectedItem extends IMetaItem {
    OptionId: number;
}

@Component({
    templateUrl: './billing-schedule-detail.component.html',
})

export class BillingScheduleDetailComponent implements OnInit {
    billingSchedule: IBillingSchedule;
    canEdit: boolean;
    canAdd: boolean;
    listsRendered = false;
    inQueue = false;

    // Districts
    districtOptions: ISelectOptions[];
    districtIds: number[];
    districtInclusionsCardName = 'DISTRICTS INCLUDED';
    districtInclusions: ISelectedItem[];

    // Admin Notifications
    adminOptions: ISelectOptions[];
    adminIds: number[];
    adminInclusionsCardName = 'ADMIN NOTIFICATIONS INCLUDED';
    adminInclusions: ISelectedItem[];

    // Exclusions
    // Providers
    providerOptions: ISelectOptions[];
    providerIds: number[];
    providerExclusionsCardName = 'PROVIDER EXCLUSIONS';
    providerExclusions: ISelectedItem[];

    // Service Types
    serviceCodeOptions: ISelectOptions[];
    serviceCodeIds: number[];
    serviceCodeExclusionsCardName = 'SERVICE CODE EXCLUSIONS';
    serviceCodeExclusions: ISelectedItem[];

    // Cpt Codes
    cptCodeOptions: ISelectOptions[];
    cptCodeIds: number[];
    cptCodeExclusionsCardName = 'CPT CODE EXCLUSIONS';
    cptCodeExclusions: ISelectedItem[];

    // Entity Modal
    modalOptions: IModalOptions = {
        customClass: {
            title: 'text-center',
        },
        showCloseButton: true,
        showConfirmButton: false,
        width: '75%',
    };
    showModal = false;
    entityMap = {
        admins: 5,
        cptCodes: 4,
        districts: 1,
        providers: 2,
        serviceCodes: 3,
    };
    entityType: number;
    modalOptionEntities: IMetaItem[];
    modalOptionEntitiesFiltered: IMetaItem[];
    modalSelectedEntities: ISelectedItem[];
    modalSelectedEntitiesFiltered: ISelectedItem[];
    modalEntityName: string;
    modalOptionsTotal: number;
    searchOptionsControl: AbstractControl;
    searchSelectionsControl: AbstractControl;

    get noEntitySelections(): boolean {
        return !this.modalSelectedEntitiesFiltered?.length;
    }

    get noEntityOptions(): boolean {
        return !this.modalOptionEntitiesFiltered?.length;
    }

    constructor(
        private billingScheduleService: BillingScheduleService,
        private districtInclusionService: BillingScheduleDistrictService,
        private providerExclusionService: BillingScheduleExcludedProviderService,
        private serviceCodeExclusionService: BillingScheduleExcludedServiceCodeService,
        private cptCodeExclusionService: BillingScheduleExcludedCptCodeService,
        protected entityLabelGenerator: BillingScheduleEntityLabelGenerator,
        private claimsService: ClaimsService,
        private route: ActivatedRoute,
        private notificationsService: NotificationsService,
        private router: Router,
        private adminNotificationInclusionService: BillingScheduleAdminNotificationService,
    ) {}

    ngOnInit(): void {
        // check claims
        this.canEdit = this.claimsService.hasClaim(ClaimTypes.BillingSchedules, [ClaimValues.FullAccess]);
        this.canAdd = this.canEdit;
        // get current id from route
        const id = this.getIdFromRoute(this.route, 'billingScheduleId');
        if (id) {
            this.getBillingScheduleById(id);
        } else {
            void this.router.navigate(['billing-schedules']); // if no id found, go back to list
        }
    }

    getBillingScheduleById(id: number): void {
        this.billingScheduleService.getById(id).subscribe((billingSchedule) => {
            if (billingSchedule === null) {
                this.notificationsService.error('Billing Schedule not found');
                void this.router.navigate(['billing-schedules']);
            }
            this.billingSchedule = billingSchedule;
            this.inQueue = billingSchedule.InQueue;
            this.assignMetaItems();
            forkJoin([
                this.districtInclusionService.getSelectOptions(),
                this.providerExclusionService.getSelectOptions(),
                this.serviceCodeExclusionService.getServiceCodes(),
                this.cptCodeExclusionService.getSelectOptions(),
                this.adminNotificationInclusionService.getSelectOptions(),
            ]).subscribe(([districts, providers, serviceCodes, cptCodes, admins]) => {
                this.districtOptions = districts.filter((district) => !district.Archived);
                this.providerOptions = providers.filter((provider) => !provider.Archived);
                this.serviceCodeOptions = serviceCodes.map(
                    (serviceCode) =>
                        ({
                            Archived: false,
                            Id: serviceCode.Id,
                            Name: serviceCode.Name,
                        }),
                );
                this.cptCodeOptions = cptCodes.filter((cptCode) => !cptCode.Archived);
                this.adminOptions = admins.filter((admin) => !admin.Archived);
                this.districtIds = this.billingSchedule.BillingScheduleDistricts?.map(
                    (district) => {
                        return district.Id;
                    },
                );
            });
        });
    }

    assignMetaItems(): void {
        this.districtInclusions = this.billingSchedule.BillingScheduleDistricts?.map(
            (districtInclusion) =>
            ({
                Id: districtInclusion.Id,
                Name: `${districtInclusion.SchoolDistrict.Name}`,
                OptionId: districtInclusion.SchoolDistrictId,
            }),
        );

        this.adminInclusions = this.billingSchedule.BillingScheduleAdminNotifications?.map(
            (adminInclusion) =>
            ({
                Id: adminInclusion.Id,
                Name: `${adminInclusion.Admin.FirstName} ${adminInclusion.Admin.LastName}`,
                OptionId: adminInclusion.AdminId,
            }),
        );

        this.providerExclusions = this.billingSchedule.BillingScheduleExcludedProviders.map(
            (providerExclusion) =>
            ({
                Id: providerExclusion.Id,
                Name: `${providerExclusion.Provider.ProviderUser.LastName}, ${providerExclusion.Provider.ProviderUser.FirstName}`,
                OptionId: providerExclusion.ProviderId,

            }),
        );

        this.serviceCodeExclusions = this.billingSchedule.BillingScheduleExcludedServiceCodes.map(
            (serviceCodeExclusion) =>
            ({
                Id: serviceCodeExclusion.Id,
                Name: `${serviceCodeExclusion.ServiceCode.Name}`,
                OptionId: serviceCodeExclusion.ServiceCodeId,
            } ),
        );

        this.cptCodeExclusions = this.billingSchedule.BillingScheduleExcludedCptCodes.map(
            (cptCodeExclusion) =>
            ({
                Id: cptCodeExclusion.Id,
                Name: `${cptCodeExclusion.CptCode.Code} - ${cptCodeExclusion.CptCode.Description.length > 50 ?
                                                            (cptCodeExclusion.CptCode.Description.substr(0, 50) + '...')
                                                            : cptCodeExclusion.CptCode.Description}`,
                OptionId: cptCodeExclusion.CptCodeId,
            }),
        );

        this.listsRendered = true;
    }

    getIdFromRoute(route: ActivatedRoute, param: string): number {
        const id = route.snapshot.paramMap.get(param);
        return Number.isNaN(parseInt(id, 10)) ? null : parseInt(id, 10);
    }

    addNewDistrictInclusion(): void {
        this.districtInclusionService.getSelectOptions().subscribe((districts) => {
            this.modalOptionEntities = districts.filter((district) => !this.districtInclusions.some((inclusion) => inclusion.OptionId === district.Id));
            this.modalOptionsTotal = districts.length;
            this.modalSelectedEntities = this.districtInclusions;
            this.setFilteredEntities();
            this.modalEntityName = 'DISTRICT INCLUSIONS';
            this.entityType = this.entityMap.districts;
            this.showModal = true;
        });
    }

    addNewAdminNotificationInclusion(): void {
        this.adminNotificationInclusionService.getSelectOptions().subscribe((admins) => {
            this.modalOptionEntities = admins.filter((admin) => !this.adminInclusions.some((inclusion) => inclusion.OptionId === admin.Id));
            this.modalOptionsTotal = admins.length;
            this.modalSelectedEntities = this.adminInclusions;
            this.setFilteredEntities();
            this.modalEntityName = 'ADMIN NOTIFICATION INCLUSIONS';
            this.entityType = this.entityMap.admins;
            this.showModal = true;
        });
    }

    addNewCptCodeExclusion(): void {
        this.cptCodeExclusionService.getSelectOptions().subscribe((cptCodes) => {
            this.modalOptionEntities = cptCodes.filter((cptCode) => !this.cptCodeExclusions.some((exclusion) => exclusion.OptionId === cptCode.Id));
            this.modalOptionsTotal = cptCodes.length;
            this.modalSelectedEntities = this.cptCodeExclusions;
            this.setFilteredEntities();
            this.modalEntityName = 'CPT CODE EXCLUSIONS';
            this.entityType = this.entityMap.cptCodes;
            this.showModal = true;
        });
    }

    addNewServiceCodeExclusion(): void {
        this.serviceCodeExclusionService.getServiceCodes().subscribe((serviceCodes) => {
            this.modalOptionEntities = serviceCodes.filter((serviceCode) => !this.serviceCodeExclusions.some((exclusion) => exclusion.OptionId === serviceCode.Id));
            this.modalOptionsTotal = serviceCodes.length;
            this.modalSelectedEntities = this.serviceCodeExclusions;
            this.setFilteredEntities();
            this.modalEntityName = 'SERVICE CODE EXCLUSIONS';
            this.entityType = this.entityMap.serviceCodes;
            this.showModal = true;
        });
    }

    addNewProviderExclusion(): void {
        this.providerExclusionService.getSelectOptions().subscribe((providers) => {
            this.modalOptionEntities = providers.filter((provider) => !this.providerExclusions.some((exclusion) => exclusion.OptionId === provider.Id));
            this.modalOptionsTotal = providers.length;
            this.modalSelectedEntities = this.providerExclusions;
            this.setFilteredEntities();
            this.modalEntityName = 'PROVIDER EXCLUSIONS';
            this.entityType = this.entityMap.providers;
            this.showModal = true;
        });
    }

    setFilteredEntities(): void {
        this.modalOptionEntitiesFiltered = [...this.modalOptionEntities];
        this.modalSelectedEntitiesFiltered = [...this.modalSelectedEntities];
    }

    toggleModal(): void {
        this.showModal = !this.showModal;
        this.modalOptionEntities = [];
    }

    saveEntity(evt: IMetaItem): void {
        switch (this.entityType) {
            case this.entityMap.cptCodes: {
                const cptCodeToExclude = this.cptCodeExclusionService.getEmptyBillingScheduleExcludedCptCode();
                cptCodeToExclude.BillingScheduleId = this.billingSchedule.Id;
                cptCodeToExclude.CptCodeId = evt.Id;
                this.cptCodeExclusionService.create(cptCodeToExclude).subscribe((id) => {
                    cptCodeToExclude.Id = id;
                    this.modalSelectedEntities.push(
                        {
                            Archived: false,
                            Id: id,
                            Name: evt.Name,
                            OptionId: evt.Id,
                        } as ISelectedItem,
                    );
                    this.sortModal(evt, true);
                });
                break;
            }
            case this.entityMap.districts: {
                const districtToinclude = this.districtInclusionService.getEmptyBillingScheduleDistrict();
                districtToinclude.BillingScheduleId = this.billingSchedule.Id;
                districtToinclude.SchoolDistrictId = evt.Id;
                this.districtInclusionService.create(districtToinclude).subscribe((id) => {
                    districtToinclude.Id = id;
                    this.modalSelectedEntities.push(
                        {
                            Archived: false,
                            Id: id,
                            Name: evt.Name,
                            OptionId: evt.Id,
                        } as ISelectedItem,
                    );
                    this.sortModal(evt, true);
                });
                break;
            }
            case this.entityMap.providers: {
                const providerToExclude = this.providerExclusionService.getEmptyBillingScheduleExcludedProvider();
                providerToExclude.BillingScheduleId = this.billingSchedule.Id;
                providerToExclude.ProviderId = evt.Id;
                this.providerExclusionService.create(providerToExclude).subscribe((id) => {
                    providerToExclude.Id = id;
                    this.modalSelectedEntities.push(
                        {
                            Archived: false,
                            Id: id,
                            Name: evt.Name,
                            OptionId: evt.Id,
                        } as ISelectedItem,
                    );
                    this.sortModal(evt, true);
                });
                break;
            }
            case this.entityMap.serviceCodes: {
                const serviceCodeToExclude = this.serviceCodeExclusionService.getEmptyBillingScheduleExcludedServiceCode();
                serviceCodeToExclude.BillingScheduleId = this.billingSchedule.Id;
                serviceCodeToExclude.ServiceCodeId = evt.Id;
                this.serviceCodeExclusionService.create(serviceCodeToExclude).subscribe((id) => {
                    serviceCodeToExclude.Id = id;
                    this.modalSelectedEntities.push(
                        {
                            Archived: false,
                            Id: id,
                            Name: evt.Name,
                            OptionId: evt.Id,
                        } as ISelectedItem,
                    );
                    this.sortModal(evt, true);
                });
                break;
            }
            case this.entityMap.admins: {
                const adminToInclude = this.adminNotificationInclusionService.getEmptyBillingScheduleAdminNotification();
                adminToInclude.BillingScheduleId = this.billingSchedule.Id;
                adminToInclude.AdminId = evt.Id;
                this.adminNotificationInclusionService.create(adminToInclude).subscribe((id) => {
                    adminToInclude.Id = id;
                    this.modalSelectedEntities.push(
                        {
                            Archived: false,
                            Id: id,
                            Name: evt.Name,
                            OptionId: evt.Id,
                        } as ISelectedItem,
                    );
                    this.sortModal(evt, true);
                });
                break;
            }
            default: {
                this.notificationsService.error('Entity type not set');
                break;
            }
        }
    }

    sortModal(evt: IMetaItem | ISelectedItem, adding: boolean): void {
        if (adding) {
            this.modalSelectedEntities.sort(function (a, b): number {
                if (a.Name < b.Name) { return -1; }
                if (a.Name > b.Name) { return 1; }
                return 0;
            });
            this.modalOptionEntities = this.modalOptionEntities.filter((entity) => entity !== evt);
            this.setFilteredEntities();
        } else {
            this.modalOptionEntities.sort(function (a, b): number {
                if (a.Name < b.Name) { return -1; }
                if (a.Name > b.Name) { return 1; }
                return 0;
            });
            this.modalSelectedEntities = this.modalSelectedEntities.filter((entity) => entity !== evt);
            this.setFilteredEntities();
        }

    }

    deleteEntity(evt: ISelectedItem): void {
        const option: IMetaItem = {
            Id: evt.OptionId,
            Name: evt.Name,
        };

        switch (this.entityType) {
            case this.entityMap.cptCodes:
                this.cptCodeExclusionService.delete(evt.Id).subscribe(() => {
                    this.modalOptionEntities.push(option);
                    this.sortModal(evt, false);
                    this.cptCodeExclusions = this.modalSelectedEntities;
                });
                break;
            case this.entityMap.districts:
                this.districtInclusionService.delete(evt.Id).subscribe(() => {
                    this.modalOptionEntities.push(option);
                    this.sortModal(evt, false);
                    this.districtInclusions = this.modalSelectedEntities;
                });
                break;
            case this.entityMap.providers:
                this.providerExclusionService.delete(evt.Id).subscribe(() => {
                    this.modalOptionEntities.push(option);
                    this.sortModal(evt, false);
                    this.providerExclusions = this.modalSelectedEntities;
                });
                break;
            case this.entityMap.serviceCodes:
                this.serviceCodeExclusionService.delete(evt.Id).subscribe(() => {
                    this.modalOptionEntities.push(option);
                    this.sortModal(evt, false);
                    this.serviceCodeExclusions = this.modalSelectedEntities;
                });
                break;
            case this.entityMap.admins:
                this.adminNotificationInclusionService.delete(evt.Id).subscribe(() => {
                    this.modalOptionEntities.push(option);
                    this.sortModal(evt, false);
                    this.adminInclusions = this.modalSelectedEntities;
                });
                break;
            default:
                this.notificationsService.error('Entity type not set');
                break;
        }
    }

    getSearchField(): DynamicField {
        return new DynamicField({
            formGroup: 'null',
            label: 'Search',
            name: 'search',
            type: new DynamicFieldType({
                fieldType: DynamicFieldTypes.Input,
                inputType: InputTypes.Textarea,
            }),
            validation: [],
            value: null,
        });
    }

    filterModal(event: string, options: boolean): void {
        if (options) {
            this.modalOptionEntitiesFiltered = this.modalOptionEntities.filter((option) => option.Name.toLowerCase().includes(event.toLowerCase()));
        } else {
            this.modalSelectedEntitiesFiltered = this.modalSelectedEntities.filter((selected) => selected.Name.toLowerCase().includes(event.toLowerCase()));
        }
    }

    generateBillingFile(): void {
        this.billingSchedule.InQueue = true;
        this.inQueue = true;
        this.billingScheduleService.update(this.billingSchedule).subscribe(() => {
            this.notificationsService.success('The schedule has been added to the queue and a claims file will be generated shortly');
        });
    }

}
