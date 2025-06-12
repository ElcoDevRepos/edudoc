import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin, Observable, Subject } from 'rxjs';

import { IEsc } from '@model/interfaces/esc';
import { ClaimsService, ClaimValues } from '@mt-ng2/auth-module';
import { NotificationsService } from '@mt-ng2/notifications-module';

import { ClaimTypes } from '@model/ClaimTypes';

import { EscSharedEntities } from '@admin/escs/services/esc.shared-entities';
import { ProviderService } from '@admin/providers/provider.service';
import { HttpResponse } from '@angular/common/http';
import { removeUnusedAddressParams } from '@common/address/save-address.library';
import { SchoolDistrictEscComponentModeEnums } from '@common/school-district-esc/school-district-esc.component';
import { AddressService } from '@common/services/address.service';
import { SchoolDistrictEscService } from '@common/services/school-district-esc.service';
import { IAddress } from '@model/interfaces/address';
import { IEscSchoolDistrict } from '@model/interfaces/esc-school-district';
import { IProvider } from '@model/interfaces/provider';
import { ExtraSearchParams, IEntitySearchParams, SearchParams } from '@mt-ng2/common-classes';
import { SchoolDistrictService } from '../../../../admin-portal/school-districts/services/schooldistrict.service';
import { EscService } from '../../services/esc.service';
import { ProviderLabelGenerator } from './provider-label-generator';

@Component({
    selector: 'app-esc-detail',
    templateUrl: './esc-detail.component.html',
})
export class EscDetailComponent implements OnInit {
    esc: IEsc;
    editingComponent: Subject<string> = new Subject();
    canEdit: boolean;
    canAdd: boolean;
    id: number;
    address: IAddress;
    schoolDistrictEscComponentModeEnums = SchoolDistrictEscComponentModeEnums;
    escSchoolDistricts: IEscSchoolDistrict[] = [];
    providers: IProvider[];
    providerLoadCount: number;
    showDistricts = true;
    escSharedEntityId = EscSharedEntities.Contacts;

    constructor(
        protected schoolDistrictService: SchoolDistrictService,
        private escService: EscService,
        private claimsService: ClaimsService,
        private route: ActivatedRoute,
        private notificationsService: NotificationsService,
        private addressService: AddressService,
        private escSchoolDistrictService: SchoolDistrictEscService,
        private providerService: ProviderService,
        protected providerLabelGenerator: ProviderLabelGenerator,
        private router: Router,
    ) {}

    seeAllProviders(): void {
        void this.router.navigate(['admin', 'providers'], { queryParams: { escId: this.id, escName: this.esc.Name } });
    }
    selectProvider(provider: IProvider): void {
        void this.router.navigate(['providers', provider.Id]);
    }
    ngOnInit(): void {
        // check claims
        this.canEdit = this.claimsService.hasClaim(ClaimTypes.ESCs, [ClaimValues.FullAccess]);
        this.canAdd = this.canEdit;
        // get current id from route
        this.id = +this.route.snapshot.paramMap.get('escId');
        // try load if id > 0
        if (this.id > 0) {
            forkJoin([this.getSchoolDistrictEscs(), this.getEsc(), this.getProviders()]).subscribe(([districts, esc, providers]) => {
                this.esc = esc;
                this.escSchoolDistricts = districts.body.sort();
                this.providers = providers.body;
            });
        } else {
            // set esc to emptyEsc
            this.esc = this.escService.getEmptyEsc();
            this.address = this.addressService.getEmptyAddress();
        }
        this.editingComponent.next('');
    }

    getEsc(): Observable<IEsc> {
        return this.escService.getById(this.id);
    }

    saveAddress(address: IAddress): void {
        address = removeUnusedAddressParams(address);
        this.escService.saveAddress(this.id, address).subscribe((answer) => {
            address.Id = answer;
            this.notificationsService.success('Address Saved Successfully');
            this.address = address;
            this.getEsc();
        });
    }

    deleteAddress(): void {
        this.escService.deleteAddress(this.id).subscribe(() => {
            this.notificationsService.success('Address Deleted Successfully');
            this.address = null;
            this.esc.Address = null;
        });
    }

    getSchoolDistrictEscs(): Observable<HttpResponse<IEscSchoolDistrict[]>> {
        const _extraSearchParams: ExtraSearchParams[] = [
            { name: 'escId', value: this.id.toString() },
            { name: 'includeArchived', value: '0' },
        ];

        const searchEntity: IEntitySearchParams = {
            extraParams: _extraSearchParams,
            order: 'SchoolDistrict.Name',
            query: '',
        };

        const searchparams = new SearchParams(searchEntity);

        return this.escSchoolDistrictService.get(searchparams);
    }

    getProviders(): Observable<HttpResponse<IProvider[]>> {
        const _extraSearchParams: ExtraSearchParams[] = [
            { name: 'escId', value: this.id.toString() },
            { name: 'SchoolDistrictId', value: '0' },
            { name: 'archivedstatus', value: '0' },
        ];

        const searchEntity: IEntitySearchParams = {
            extraParams: _extraSearchParams,
            order: 'Id',
            query: '',
        };

        const searchparams = new SearchParams(searchEntity);
        return this.providerService.get(searchparams);
    }

    handleSchoolDistrictSave(): void {
        this.showDistricts = false;

        setTimeout(() => {
                this.getSchoolDistrictEscs().subscribe((districts) => this.escSchoolDistricts = districts.body.sort());
                this.showDistricts = true;
            }, 0);
    }
}
