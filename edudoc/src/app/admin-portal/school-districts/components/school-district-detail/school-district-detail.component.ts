import { EscService } from '@admin/escs/services/esc.service';
import { SchoolDistrictService } from '@admin/school-districts/services/schooldistrict.service';
import { SchoolDistrictSharedEntities } from '@admin/school-districts/shared-entities/school-district.shared-entities';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { removeUnusedAddressParams } from '@common/address/save-address.library';
import { SchoolDistrictEscComponentModeEnums } from '@common/school-district-esc/school-district-esc.component';
import { AddressService } from '@common/services/address.service';
import { SchoolDistrictEscService } from '@common/services/school-district-esc.service';
import { ClaimTypes } from '@model/ClaimTypes';
import { IAddress } from '@model/interfaces/address';
import { IEscSchoolDistrict } from '@model/interfaces/esc-school-district';
import { ISchool } from '@model/interfaces/school';
import { ISchoolDistrict } from '@model/interfaces/school-district';
import { ClaimsService, ClaimValues } from '@mt-ng2/auth-module';
import { ExtraSearchParams, IEntitySearchParams, SearchParams } from '@mt-ng2/common-classes';
import { NotificationsService } from '@mt-ng2/notifications-module';
import { Observable, Subject, Subscription } from 'rxjs';
import { tap } from 'rxjs/operators';

@Component({
    selector: 'app-school-district-detail',
    templateUrl: './school-district-detail.component.html',
})
export class SchoolDistrictDetailComponent implements OnInit {
    schoolDistrict: ISchoolDistrict;
    schools: ISchool[];
    editingComponent: Subject<string> = new Subject();
    canEdit: boolean;
    canAdd: boolean;
    canChangeESC: boolean;
    id: number;
    address: IAddress;
    schoolDistrictSharedEntityId = SchoolDistrictSharedEntities.Contacts;
    schoolDistrictEscComponentModeEnums = SchoolDistrictEscComponentModeEnums;
    escSchoolDistricts: IEscSchoolDistrict[] = [];
    showMERDocumentsCard = false;
    subscriptions: Subscription = new Subscription();

    constructor(
        protected schoolDistrictService: SchoolDistrictService,
        protected escService: EscService,
        private claimsService: ClaimsService,
        private route: ActivatedRoute,
        private notificationsService: NotificationsService,
        private addressService: AddressService,
        private schoolDistrictEscService: SchoolDistrictEscService,
    ) {}

    ngOnInit(): void {
        // check claims
        this.canEdit = this.claimsService.hasClaim(ClaimTypes.SchoolDistricts, [ClaimValues.FullAccess]);
        this.canChangeESC = this.claimsService.hasClaim(ClaimTypes.ESCs, [ClaimValues.FullAccess]);
        this.canAdd = this.canEdit;
        // get current id from route
        this.id = +this.route.snapshot.paramMap.get('schoolDistrictId');
        // try load if id > 0
        if (this.id > 0) {
            if (this.canChangeESC) {
                this.getEscSchoolDistricts();
            }
            this.getSchoolDistrict().subscribe();
        } else {
            // set schoolDistrict to emptySchoolDistrict
            this.schoolDistrict = this.schoolDistrictService.getEmptySchoolDistrict();
            this.showMERDocumentsCard = true;
        }
        this.editingComponent.next('');
    }

    ngOnDestory(): void {
        this.subscriptions.unsubscribe();
    }

    getSchoolDistrict(): Observable<ISchoolDistrict> {
        return this.schoolDistrictService.getById(this.id).pipe(
            tap((schoolDistrict) => {
                this.schoolDistrict = schoolDistrict;
                this.schools = schoolDistrict.SchoolDistrictsSchools.map((sds) => sds.School);
                this.address = schoolDistrict.Address ? schoolDistrict.Address : this.addressService.getEmptyAddress();
                this.showMERDocumentsCard = true;
            }),
        );
    }

    saveAddress(address: IAddress): void {
        address = removeUnusedAddressParams(address);
        this.schoolDistrictService.saveAddress(this.schoolDistrict.Id, address).subscribe((answer) => {
            address.Id = answer;
            this.notificationsService.success('Address Saved Successfully');
            this.address = address;
            this.getSchoolDistrict();
        });
    }

    deleteAddress(): void {
        this.schoolDistrictService.deleteAddress(this.schoolDistrict.Id).subscribe(() => {
            this.notificationsService.success('Address Deleted Successfully');
            this.address = null;
            this.schoolDistrict.Address = null;
        });
    }

    getEscSchoolDistricts(): void {
        const _extraSearchParams: ExtraSearchParams[] = [
            { name: 'districtId', value: this.id.toString() },
            { name: 'includeArchived', value: '0' },
        ];

        const searchEntity: IEntitySearchParams = {
            extraParams: _extraSearchParams,
            query: '',
        };

        const searchparams = new SearchParams(searchEntity);
        this.schoolDistrictEscService.get(searchparams).subscribe((answer) => {
            this.escSchoolDistricts = answer.body;
        });
    }
}
