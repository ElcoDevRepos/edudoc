import { HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { entityListModuleConfig } from '@common/entity-list-module-config';
import { ParentalConsentTypesEnum } from '@model/enums/parental-consent-types.enum';
import { IStudentParentalConsentDistrictDTO } from '@model/interfaces/custom/student-parental-consent-district.dto';
import { ExtraSearchParams, IEntitySearchParams, SearchParams } from '@mt-ng2/common-classes';
import { IItemSelectedEvent, IColumnSortedEvent, SortDirection } from '@mt-ng2/entity-list-module';
import { MtSearchFilterItem } from '@mt-ng2/search-filter-select-control';
import { StudentParentalConsentTypeService } from '@school-district-admin/students/studentparentalconsenttype.service';
import { Observable } from 'rxjs';
import { StudentParentalConsentService } from '../student-parental-consent.service';
import { StudentParentalConsentsDistrictEntityListConfig } from './student-parental-consents-district.entity-list-config';
import { IEntity } from '@model/interfaces/base';

@Component({
    selector: 'app-student-parental-consents-district',
    templateUrl: './student-parental-consents-district.component.html',
})
export class StudentParentalConsentsDistrictComponent implements OnInit {
    parentalConsents: IStudentParentalConsentDistrictDTO[];
    currentPage = 1;
    query = '';
    total: number;
    entityListConfig = new StudentParentalConsentsDistrictEntityListConfig();
    order = this.entityListConfig.getDefaultSortProperty();
    orderDirection: string = this.entityListConfig.getDefaultSortDirection();

    parentalConsentTypes: MtSearchFilterItem[] = [];

    constructor(private studentParentalConsentService: StudentParentalConsentService,
        private studentParentalConsentTypeService: StudentParentalConsentTypeService,
        private router: Router) {}

    ngOnInit(): void {
        this.studentParentalConsentTypeService.getItems().subscribe((resp) => {
            this.parentalConsentTypes = resp.map((ct) => ct.Id === ParentalConsentTypesEnum.PendingConsent ?
                new MtSearchFilterItem(ct, true) : new MtSearchFilterItem(ct, false));
            this.studentParentalConsentService.setSelectedParentalConsentIds(this.getSelectedFilters(this.parentalConsentTypes));
        });
    }

    getParentalConsentsCall(): Observable<HttpResponse<IStudentParentalConsentDistrictDTO[]>> {
        const search = this.query?.length > 0 ? this.query : '';
        const _extraSearchParams: ExtraSearchParams[] = [];
        const consentTypeIds: number[] = this.getSelectedFilters(this.parentalConsentTypes);

        _extraSearchParams.push(
            new ExtraSearchParams({
                name: 'ConsentTypeIds',
                valueArray: consentTypeIds,
            }),
        );

        const searchEntity: IEntitySearchParams = {
            extraParams: _extraSearchParams,
            order: this.order,
            orderDirection: this.orderDirection,
            query: search && search.length > 0 ? search : '',
            skip: (this.currentPage - 1) * entityListModuleConfig.itemsPerPage,
            take: entityListModuleConfig.itemsPerPage,
        };

        const searchparams = new SearchParams(searchEntity);
        return this.studentParentalConsentService.searchStudentConsentsByDistrict(searchparams);
    }

    getParentalConsents(): void {
        this.getParentalConsentsCall().subscribe((answer) => {
            this.parentalConsents = answer.body;
            this.total = +answer.headers.get('X-List-Count');
        });
    }

    private getSelectedFilters(filterObj: MtSearchFilterItem[]): number[] {
        return filterObj.filter((item) => item.Selected).map((item) => item.Item.Id);
    }

    getFilterSearchbar(event: string) {
        this.query = event;
    }

    applyClicked(applyEvent: Event) {
        if(applyEvent) {
            this.filterSelectionChanged();
        }
    }

    filterSelectionChanged(): void {
        this.currentPage = 1;
        this.studentParentalConsentService.setSelectedParentalConsentIds(this.getSelectedFilters(this.parentalConsentTypes));
        this.getParentalConsents();
    }

    districtSelected($event: IItemSelectedEvent): void {
        const entity = $event.entity as IEntity;
        this.studentParentalConsentService.setDistrictId(entity.Id);
        void this.router.navigateByUrl(`/admin/student-parental-consents/${(entity.Id).toString()}`);
    }

    columnSorted(event: IColumnSortedEvent): void {
        this.order = event.column.sort.sortProperty;
        this.orderDirection = event.column.sort.direction === SortDirection.Desc ? 'desc' : 'asc';
        this.getParentalConsents();
    }
}
