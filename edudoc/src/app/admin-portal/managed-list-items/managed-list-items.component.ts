import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { AgencyDynamicControls } from '@model/form-controls/agency.form-controls';
import { ContactRoleDynamicControls } from '@model/form-controls/contact-role.form-controls';
import { DocumentTypeDynamicControls } from '@model/form-controls/document-type.form-controls';
import { EncounterLocationDynamicControls } from '@model/form-controls/encounter-location.form-controls';
import { EncounterReturnReasonCategoryDynamicControls } from '@model/form-controls/encounter-return-reason-category.form-controls';
import { MethodDynamicControls } from '@model/form-controls/method.form-controls';
import { NonMspServiceDynamicControls } from '@model/form-controls/non-msp-service.form-controls';
import { VoucherTypeDynamicControls } from '@model/form-controls/voucher-type.form-controls';
import { IAgency } from '@model/interfaces/agency';
import { IMetaItem } from '@mt-ng2/base-service';
import { NotificationsService } from '@mt-ng2/notifications-module';
import { ISearchbarControlAPI } from '@mt-ng2/searchbar-control';
import { Observable, forkJoin } from 'rxjs';
import { ContactRoleService } from './managed-item-services/contact-role.service';
import { DisabilityCodeService } from './managed-item-services/disability-code.service';
import { DocumentTypeService } from './managed-item-services/document-type.service';
import { EncounterLocationService } from './managed-item-services/encounter-locations.service';
import { MethodService } from './managed-item-services/method.service';
import { NonMspServiceService } from './managed-item-services/non-msp-service.service';
import { ProviderAgencyService } from './managed-item-services/provider-agency.service';
import { ReturnReasonCategoryService } from './managed-item-services/return-reason-category.service';
import { StudentDeviationReasonService } from './managed-item-services/student-deviation-reason.service';
import { VoucherTypeService } from './managed-item-services/voucher-type.service';
import { IManagedListConfig, ManagedListTypeIds } from './managed-list-items';
import { IVoucherType } from '@model/interfaces/voucher-type';

export const ManagedListConfigs: IManagedListConfig[] = [
    {
        DynamicConfig: 'ContactRoleDynamicControls',
        Id: ManagedListTypeIds.ContactRole,
        Name: 'Contact Role',
        Service: 'ContactRole',
    },
    {
        DynamicConfig: 'AgencyDynamicControls',
        Id: ManagedListTypeIds.ProviderAgency,
        Name: 'Contracted Agency',
        Service: 'ProviderAgency',
    },
    {
        DynamicConfig: 'EncounterLocationDynamicControls',
        Id: ManagedListTypeIds.EncounterLocation,
        Name: 'Encounter Location',
        Service: 'EncounterLocation',
    },
    {
        DynamicConfig: 'MethodDynamicControls',
        Id: ManagedListTypeIds.Methods,
        Name: 'Method',
        Service: 'Method',
    },
    {
        DynamicConfig: 'ReturnReasonCategoryDynamicControls',
        Id: ManagedListTypeIds.ReturnReasonCategory,
        Name: 'Return Reason Category',
        Service: 'ReturnReasonCategory',
    },
    {
        DynamicConfig: 'DisabilityCodeDynamicControls',
        Id: ManagedListTypeIds.DisabilityCodes,
        Name: 'Disability Code',
        Service: 'DisabilityCode',
    },
    {
        DynamicConfig: 'StudentDeviationReasonDynamicControls',
        Id: ManagedListTypeIds.StudentDeviationReasons,
        Name: 'Student Deviation Reason',
        Service: 'StudentDeviationReason',
    },
    {
        DynamicConfig: 'DocumentTypeDynamicControls',
        Id: ManagedListTypeIds.DocumentType,
        Name: 'Document Type',
        Service: 'DocumentType',
    },
    {
        DynamicConfig: 'NonMspServiceDynamicControls',
        Id: ManagedListTypeIds.NonMspService,
        Name: 'Non-MSP Service',
        Service: 'NonMspService',
    },
    {
        DynamicConfig: 'NonMspServiceDynamicControls',
        Id: ManagedListTypeIds.VoucherType,
        Name: 'Voucher Type',
        Service: 'VoucherType',
    },
];

@Component({
    selector: 'app-managed-list-items',
    templateUrl: './managed-list-items.component.html',
})
export class ManagedListItemsComponent implements OnInit {
    contactRoleForm = new ContactRoleDynamicControls(null).Form;
    contactRoleTypeId = ManagedListTypeIds.ContactRole;

    providerAgencyForm = new AgencyDynamicControls(null).Form;
    providerAgencyTypeId = ManagedListTypeIds.ProviderAgency;

    encounterLocationForm = new EncounterLocationDynamicControls(null).Form;
    encounterLocationTypeId = ManagedListTypeIds.EncounterLocation;

    methodForm = new EncounterReturnReasonCategoryDynamicControls(null).Form;
    methodTypeId = ManagedListTypeIds.Methods;

    returnReasonCategoryForm = new MethodDynamicControls(null).Form;
    returnReasonCategoryId = ManagedListTypeIds.ReturnReasonCategory;

    disabilityCodeForm = new MethodDynamicControls(null).Form;
    disabilityCodeId = ManagedListTypeIds.DisabilityCodes;

    studentDeviationReasonForm = new MethodDynamicControls(null).Form;
    studentDeviationReasonId = ManagedListTypeIds.StudentDeviationReasons;

    documentTypeForm = new DocumentTypeDynamicControls(null).Form;
    documentTypeId = ManagedListTypeIds.DocumentType;

    nonMspServiceForm = new NonMspServiceDynamicControls(null).Form;
    nonMspServiceId = ManagedListTypeIds.NonMspService;

    voucherTypeForm = new VoucherTypeDynamicControls(null).Form;
    voucherTypeId = ManagedListTypeIds.VoucherType;
    voucherTypes: IVoucherType[] = [];
    voucherFields: (keyof IVoucherType)[] = ['Name'];
    nonEditableVoucherTypes: IVoucherType[] = [];

    selectedManagedList: IManagedListConfig;
    managedListArr = [];
    isLoaded = false;

    // for custom provider agency managed list
    searchControlApi: ISearchbarControlAPI;
    query = '';
    allProviderAgencies: IMetaItem[] = [];
    filteredProviderAgencies: IMetaItem[] = [];

    constructor(
        public contactRoleService: ContactRoleService,
        public providerAgencyService: ProviderAgencyService,
        public encounterLocationService: EncounterLocationService,
        public returnReasonCategoryService: ReturnReasonCategoryService,
        public methodService: MethodService,
        public disabilityCodeService: DisabilityCodeService,
        public studentDeviationReasonService: StudentDeviationReasonService,
        public documentTypeService: DocumentTypeService,
        public nonMspServiceService: NonMspServiceService,
        public voucherTypeService: VoucherTypeService,
        public notificationService: NotificationsService,
    ) {}

    ngOnInit(): void {
        this.managedListArr.push(...ManagedListConfigs);
        this.isLoaded = true;
        this.getProviderAgencies();
        this.getVoucherTypes();
    }

    getProviderAgencies(): void {
        this.providerAgencyService.getItems().subscribe((res) => {
            this.allProviderAgencies = res;
        });
    }

    saveProviderAgency($event: FormGroup): void {
        const actions: Observable<object | number>[] = [];
        const providerAgencies: IMetaItem[] = $event.value.ProviderAgency;
        if (this.hasDuplicates(providerAgencies)) {
            this.notificationService.error('No duplicates allowed.');
        } else if (providerAgencies.some((pa) => pa.Name === '')) {
            this.notificationService.error('No empty fields allowed.');
        } else {
            // check for new items
            const newAgencies: IMetaItem[] = providerAgencies.filter((pa) => pa.Id === 0);
            for (const agency of newAgencies) {
                const item: IAgency = {
                    Id: 0,
                    Name: agency.Name,
                };
                actions.push(this.providerAgencyService.create(item));
            }
            // check for updated items
            const updatedAgencies: IMetaItem[] = providerAgencies.filter(
                (pa) => this.filteredProviderAgencies.filter((p) => p.Id === pa.Id && p.Name !== pa.Name).length,
            );
            for (const agency of updatedAgencies) {
                actions.push(this.providerAgencyService.update(agency));
            }
            // check for deleted items
            const deletedAgencies: IMetaItem[] = this.filteredProviderAgencies.filter((pa) => !providerAgencies.filter((p) => p.Id === pa.Id).length);
            for (const agency of deletedAgencies) {
                actions.push(this.providerAgencyService.delete(agency.Id));
            }
            forkJoin(...actions).subscribe(() => {
                this.notificationService.success('Provider Agencies successfully updated.');
                this.getProviderAgencies();
                this.filteredProviderAgencies = [];
                this.searchControlApi.clearSearch();
            });
        }
    }

    hasDuplicates(providerAgencies: IMetaItem[]): boolean {
        const seen = new Set();
        return (
            providerAgencies.some((obj) => {
                return seen.size === seen.add(obj.Name).size;
            }) ||
            providerAgencies.filter((val) => {
                return this.allProviderAgencies.filter((pa) => pa.Name === val.Name && pa.Id !== val.Id).length > 0;
            }).length > 0
        );
    }

    searchControlReady(searchControlApi: ISearchbarControlAPI): void {
        this.searchControlApi = searchControlApi;
        this.searchControlApi.getSearchInputElement().nativeElement.placeholder = 'Search Provider Agency';
    }

    search(query: string): void {
        this.query = query;
        this.getProviderAgency();
    }

    getProviderAgency(): void {
        // clear items if no query
        if (!this.query.length) {
            this.filteredProviderAgencies = [];
        } else {
            this.filteredProviderAgencies = this.allProviderAgencies.filter((pa) => pa.Name.toLowerCase().indexOf(this.query.toLowerCase()) >= 0);
        }
    }

    getVoucherTypes(): void {
        this.voucherTypeService.getItems().subscribe((items) => {
            this.voucherTypes = items.filter((i) => i.Editable);
            this.nonEditableVoucherTypes = items.filter((i) => !i.Editable);
        });
    }
    saveVoucherTypes(event: FormGroup): void {
        const editableVoucherTypes = (event.value.VoucherType as IVoucherType[]).map((vt, i) => ({
            ...vt,
            Sort: i + this.nonEditableVoucherTypes.length,
            Editable: true
        }));
        const voucherTypes = this.nonEditableVoucherTypes.concat(editableVoucherTypes);
        this.voucherTypeService.updateItems(voucherTypes).subscribe(() => {
            this.notificationService.success('Voucher types successfully updated.');
            this.getVoucherTypes();
        });
    }
}
