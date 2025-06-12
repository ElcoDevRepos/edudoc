import { HttpResponse } from '@angular/common/http';
import { Component, EventEmitter, Inject, Injector, Input, OnInit, Output } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { IAddress } from '@model/interfaces/address';
import { ClaimsService, ClaimValues } from '@mt-ng2/auth-module';
import { IEntitySearchParams, SearchParams } from '@mt-ng2/common-classes';
import { markAllFormFieldsAsTouched } from '@mt-ng2/common-functions';
import { IEntityRouteConfig } from '@mt-ng2/entity-components-base';
import { SortDirection } from '@mt-ng2/entity-list-module';
import { NotificationsService } from '@mt-ng2/notifications-module';
import { Observable } from 'rxjs';
import { IEntityComponentsAddressesModuleConfig, EntityComponentsAddressesModuleConfigToken } from '@mt-ng2/entity-components-addresses';

export interface IHasAddresses {
    getAddresses(entityId: number, searchParams: SearchParams): Observable<HttpResponse<IAddressContainer[]>>;

    saveAddress(entityId: number, address: IAddressContainer): Observable<number>;

    deleteAddress(entityId: number, addressId: number): Observable<object>;
}

export interface IAddressContainer {
    Address: IAddress;
    IsPrimary: boolean;
}

export function formatAddressWithCounty(addr: IAddress): string {
    const isInternational = addr.CountryCode !== 'US';
    let fullAddress = '';
    fullAddress += addr && addr.Address1 ? addr.Address1 : '';
    fullAddress += addr && addr.Address2 ? ' ' + addr.Address2 : '';
    fullAddress += addr && addr.City ? ', ' + addr.City : '';
    fullAddress += addr && addr.County ? ', ' + `${addr.County} County` : '';
    if (isInternational) {
        fullAddress += addr && addr.Province ? ', ' + addr.Province : '';
        fullAddress += addr && addr.Country && addr.Country.Alpha3Code ? ', ' + addr.Country.Alpha3Code : '';
    } else {
        fullAddress += addr && addr.StateCode ? ', ' + addr.StateCode : '';
    }
    fullAddress += addr && addr.Zip ? ' ' + addr.Zip : '';
    return fullAddress;
}

@Component({
    selector: 'app-common-addresses-with-county',
    template: `
        <div class="miles-card padded" *ngIf="!isEditing">
            <h4>{{ getComponentName() }}</h4>
            <ul *ngIf="addressContainerArray.length" class="list-group">
                <li *ngFor="let address of addressContainerArray" (click)="selectedAddress = address" class="list-group-item">
                    {{ getIndividualAddressTitle(address.Address) }}
                    <i
                        *ngIf="showIsPrimary && address.IsPrimary"
                        class="fa fa-fw fa-star pull-right"
                        [style.marginTop.px]="3"
                        title="Primary Address"
                    ></i>
                </li>
            </ul>
            <i *ngIf="!addressContainerArray.length">No {{ getComponentName() }}</i>
            <div [hidden]="hideAdd()" class="fab-wrap">
                <button type="button" class="btn btn-primary btn-fab-md btn-fab-center" (click)="addAddress()">
                    <span class="fa fa-plus"></span>
                </button>
            </div>
            <div class="pull-right max-of-total">
                <span *ngIf="showTotal()">{{ _max }} of {{ _total }}</span>
            </div>
            <div class="show-on-hover" *ngIf="showTotal()">
                <a (click)="seeAll()" class="btn btn-primary btn-flat see-all"
                    >see all
                    <span class="badge">{{ _total }}</span>
                </a>
            </div>
        </div>
        <div class="miles-form padded" *ngIf="isEditing">
            <h4>
                {{ selectedAddress.Id > 0 ? 'Edit ' + getComponentName() : 'Add ' + getComponentName() }}
            </h4>
            <form [formGroup]="addressForm" (ngSubmit)="save()">
                <address-with-county
                    [addressContainer]="selectedAddress"
                    [parentForm]="addressForm"
                    [requireCounty]="requireCounty"
                    [showIsPrimary]="showIsPrimary"
                    [allowInternationalAddresses]="_allowInternationalAddresses"
                ></address-with-county>
                <button type="submit" class="btn btn-flat btn-success">
                    Save
                </button>
                <button type="button" class="btn btn-flat btn-default" (click)="selectedAddress = null">
                    Cancel
                </button>
                <button *ngIf="showDelete" type="button" class="btn btn-flat btn-danger pull-right" (mtConfirm)="delete()">
                    Delete
                </button>
            </form>
        </div>
    `,
})
export class CommonAddressesWithCountyComponent implements OnInit {
    private _addresses: IAddressContainer[] = [];
    @Input('requireCounty') requireCounty;
    
    @Input('addressContainerArray')
    get addressContainerArray(): IAddressContainer[] {
        return this._addresses;
    }
    set addressContainerArray(value: IAddressContainer[]) {
        this.addressesPassedIn = true;
        this._addresses = value;
        this.selectedAddress = null;
    }
    addressesPassedIn = false;

    @Input('service') service: IHasAddresses;

    @Input('address')
    set address(value: IAddress) {
        this.addressesPassedIn = true;
        this._addresses = value ? [{ Address: value, IsPrimary: true }] : [];
        this.selectedAddress = null;
        this.max = 1;
        this.useMaxAsLimit = true;
    }

    _total: number;
    @Input('total')
    set total(value: number) {
        this._total = value;
    }

    _canEdit: boolean;
    @Input('canEdit')
    set canEdit(value: boolean) {
        this._canEdit = value;
    }

    _canAdd: boolean;
    @Input('canAdd')
    set canAdd(value: boolean) {
        this._canAdd = value;
    }

    _seeAllUrl: string;
    @Input('seeAllUrl')
    set seeAllUrl(value: string) {
        this._seeAllUrl = value;
    }

    showIsPrimary = true;

    _max = 3;
    @Input('max')
    set max(value: number) {
        if (value <= 1) {
            this.showIsPrimary = false;
        }
        this._max = value;
    }

    _allowInternationalAddresses: boolean;
    @Input('allowInternationalAddresses')
    set allowInternationalAddresses(value: boolean) {
        this._allowInternationalAddresses = value;
    }

    _entityName: string;
    @Input('entityName')
    set entityName(value: string) {
        this._entityName = value;
    }

    _showDelete = true;
    @Input('showDelete')
    set showDelete(value: boolean) {
        this._showDelete = value;
    }
    get showDelete(): boolean {
        return this._showDelete && this.selectedAddress.Address.Id > 0;
    }

    _useMaxAsLimit: boolean;
    @Input('useMaxAsLimit')
    set useMaxAsLimit(value: boolean) {
        this._useMaxAsLimit = value;
    }

    @Output('onSave') onSave: EventEmitter<IAddressContainer> = new EventEmitter<IAddressContainer>();
    @Output('onDelete') onDelete: EventEmitter<IAddressContainer> = new EventEmitter<IAddressContainer>();

    private _selectedAddress: IAddressContainer = null;
    get selectedAddress(): IAddressContainer {
        return this._selectedAddress;
    }
    set selectedAddress(value: IAddressContainer) {
        if (value === null) {
            this.addressForm = this.fb.group({});
        }
        this._selectedAddress = value;
    }

    parentId: number;
    addressForm: UntypedFormGroup;

    get isEditing(): boolean {
        return this.selectedAddress && this._canEdit;
    }

    newAddress: IAddressContainer = {
        Address: {
            Address1: '',
            Address2: '',
            City: '',
            CountryCode: 'US',
            County: '',
            Id: 0,
            Province: '',
            StateCode: 'OH',
            Zip: '',
        },
        IsPrimary: false,
    };

    constructor(
        private fb: UntypedFormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private injector: Injector,
        private notificationsService: NotificationsService,
        private claimsService: ClaimsService,
        @Inject(EntityComponentsAddressesModuleConfigToken) private config: IEntityComponentsAddressesModuleConfig,
    ) {}

    ngOnInit(): void {
        this.addressForm = this.fb.group({});
        this.setVariables();
        this.getAddresses();
    }

    /**
     * Assigns local variables to defaults or config properties.
     */
    setVariables(): void {
        const config: IEntityRouteConfig = <IEntityRouteConfig>this.route.parent.snapshot.data;
        if (config && config.entityIdParam) {
            this.parentId = +this.route.parent.snapshot.paramMap.get(config.entityIdParam);
        }
        const service = this.service || (config && config.service) || null;
        if (service) {
            if (typeof service === 'function') {
                this.service = this.injector.get(service);
            }
        }
        if (this._canEdit === undefined) {
            this._canEdit = config && config.claimType ? this.claimsService.hasClaim(config.claimType, [ClaimValues.FullAccess]) : false;
        }
        if (this._canAdd === undefined) {
            this._canAdd = this._canEdit;
        }
        if (this._allowInternationalAddresses === undefined) {
            this._allowInternationalAddresses = (config && config.allowInternationalAddresses) || false;
        }
        if (this._seeAllUrl === undefined) {
            this._seeAllUrl = (config && config.addressesPath) || 'addresses';
        }
        if (this._entityName === undefined) {
            this._entityName = (config && config.addressesComponentName) || null;
        }
    }

    getAddresses(): void {
        if (!this.addressesPassedIn && this.hasService()) {
            const searchparamProperties: IEntitySearchParams = {
                order: 'IsPrimary',
                orderDirection: SortDirection.Desc,
                query: '',
                take: this._max,
            };
            const searchparams = new SearchParams(searchparamProperties);

            this.service.getAddresses(this.parentId, searchparams).subscribe((response) => {
                this._addresses = response.body;
                this._total = +response.headers.get('X-List-Count');
            });
        }
    }

    getComponentName(): string {
        if (this._entityName) {
            return this._entityName;
        }
        if (this._max === 1 && this._useMaxAsLimit) {
            return 'ADDRESS';
        }
        return 'ADDRESSES';
    }

    showTotal(): boolean {
        return this._total && this._total > this._max;
    }

    hideAdd(): boolean {
        return !this._canAdd || (this._useMaxAsLimit && this.addressContainerArray.length >= this._max);
    }

    hasService(): boolean {
        return this.service && this.parentId && this.parentId > 0;
    }

    seeAll(): void {
        void this.router.navigate([`${this._seeAllUrl}`], {
            relativeTo: this.route,
        });
    }

    addAddress(): void {
        if (!this._canAdd) {
            return;
        }
        const newAddress = { ...this.newAddress };
        if (!this._addresses || this._addresses.length === 0) {
            newAddress.IsPrimary = true;
        }
        this.selectedAddress = newAddress;
    }

    getIndividualAddressTitle(address: IAddress): string {
        return formatAddressWithCounty(address);
    }

    save(): void {
        if (this.addressForm.valid) {
            if (this.addressesPassedIn) {
                this.onSave.emit(this.addressForm.value as IAddressContainer);
                this.selectedAddress = null;
            } else {
                this.saveAddress(this.addressForm);
            }
        } else {
            this.notificationsService.error('Save Failed');
            markAllFormFieldsAsTouched(this.addressForm);
        }
    }

    private saveAddress(addressForm: UntypedFormGroup): void {
        const address = { ...this._selectedAddress };
        address.Address = {
            Address1: addressForm.value.Address1,
            Address2: addressForm.value.Address2,
            City: addressForm.value.City,
            CountryCode: addressForm.value.CountryCode,
            County: addressForm.value.County,
            Id: addressForm.value.Id,
            Province: addressForm.value.Province,
            StateCode: addressForm.value.StateCode,
            Zip: addressForm.value.Zip,
        };
        address.IsPrimary = addressForm.value.IsPrimary;
        this.service.saveAddress(this.parentId, address).subscribe(
            (success) => {
                this.notificationsService.success('Address Saved Successfully');
                if (this.selectedAddress.Address.Id === 0) {
                    this.selectedAddress.Address.Id = success;
                }
                this.onSave.emit(this.selectedAddress);
                this.selectedAddress = null;
                this.getAddresses();
            },
            () => this.notificationsService.error('Save Failed'),
        );
    }

    cancel(): void {
        this.selectedAddress = null;
    }

    delete(): void {
        if (this.addressesPassedIn) {
            this.onDelete.emit(this.addressForm.value as IAddressContainer);
            this.selectedAddress = null;
        } else {
            this.deleteAddress(this.addressForm);
        }
    }

    private deleteAddress(addressForm: UntypedFormGroup): void {
        this.service.deleteAddress(this.parentId, addressForm.value.Id as number).subscribe(
            () => {
                this.notificationsService.success('Address Deleted');
                this.onDelete.emit(this.selectedAddress);
                this.selectedAddress = null;
                this.getAddresses();
            },
            () => this.notificationsService.error('Delete Failed'),
        );
    }
}
