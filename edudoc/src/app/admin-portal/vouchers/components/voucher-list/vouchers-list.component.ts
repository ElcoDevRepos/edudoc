import { HttpResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { forkJoin, Observable, Subscription } from 'rxjs';

import { SchoolDistrictService } from '@admin/school-districts/services/schooldistrict.service';
import { VoucherService } from '@admin/vouchers/voucher.service';
import { PdfService } from '@common/services/pdf.service';
import { ServiceCodeService } from '@common/services/service-code.service';
import { entityListModuleConfig } from '@common/shared.module';
import { ClaimTypes } from '@model/ClaimTypes';
import { IClaimVoucherDTO } from '@model/interfaces/custom/claim-voucher.dto';
import { ClaimsService, ClaimValues } from '@mt-ng2/auth-module';
import { ExtraSearchParams, IEntitySearchParams, SearchParams } from '@mt-ng2/common-classes';
import { IColumnSortedEvent, IItemSelectedEvent, SortDirection } from '@mt-ng2/entity-list-module';
import { MtSearchFilterItem } from '@mt-ng2/search-filter-select-control';
import { saveAs } from 'file-saver';
import { VouchersEntityListConfig } from './vouchers.entity-list-config';
import { ISelectionChangedEvent } from '@mt-ng2/type-ahead-control';
import { ISearchFilterDaterangeValue } from '@mt-ng2/search-filter-daterange-control';

type SchoolDistrictWithNpi = {
    Id: number;
    Name: string;
    NpiNumber: string;
    Selected?: boolean;
};

@Component({
    selector: 'app-vouchers-list',
    templateUrl: './vouchers-list.component.html',
})
export class VouchersListComponent implements OnInit, OnDestroy {
    vouchers: IClaimVoucherDTO[];
    currentPage = 1;
    itemsPerPage = entityListModuleConfig.itemsPerPage;
    query = '';
    total: number;
    serviceCodes: MtSearchFilterItem[] = [];
    schoolDistricts: MtSearchFilterItem[] = [];
    entityListConfig = new VouchersEntityListConfig();
    order = this.entityListConfig.getDefaultSortProperty();
    orderDirection = 'desc';

    searchNpiNumber: SchoolDistrictWithNpi[] = [];

    canAddVoucher = false;
    startDate: Date;
    endDate: Date;

    subscriptions: Subscription = new Subscription();

    constructor(
        private voucherService: VoucherService,
        private serviceCodeService: ServiceCodeService,
        private claimsService: ClaimsService,
        private router: Router,
        private schoolDistrictService: SchoolDistrictService,
        private pdfService: PdfService,
    ) {}

    get singleSchoolDistrictSelected(): boolean {
        return this.getSelectedFilters(this.schoolDistricts).length === 1;
    }

    ngOnInit(): void {
        this.canAddVoucher = this.claimsService.hasClaim(ClaimTypes.Vouchers, [ClaimValues.FullAccess]);
        forkJoin(this.serviceCodeService.getSearchFilterItems(), this.schoolDistrictService.getAll()).subscribe((answers) => {
            const [serviceCodes, schoolDistricts] = answers;
            this.serviceCodes = serviceCodes;
            this.schoolDistricts = schoolDistricts
                .filter((sds) => !sds.Archived)
                .map(
                    (sd) =>
                        new MtSearchFilterItem(
                            {
                                Id: sd.Id,
                                Name: sd.Name,
                            },
                            false,
                        ),
                );

            this.searchNpiNumber = schoolDistricts
                .filter((sds) => !sds.Archived)
                .map((sd) => ({
                    Id: sd.Id,
                    Name: sd.Name,
                    NpiNumber: sd.NpiNumber,
                }));
        });
        this.subscriptions.add(this.voucherService.voucherArchiveUpdated$.subscribe(() => this.getVouchers()));
    }

    ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    private getSelectedFilters(filterObj: MtSearchFilterItem[]): number[] {
        return filterObj.filter((item) => item.Selected).map((item) => item.Item.Id);
    }

    private buildSearch(): ExtraSearchParams[] {
        const selectedServiceCodeIds: number[] = this.getSelectedFilters(this.serviceCodes);
        const selectedSchoolDistrictIds: number[] = this.getSelectedFilters(this.schoolDistricts);
        const _extraSearchParams: ExtraSearchParams[] = [];

        _extraSearchParams.push(
            new ExtraSearchParams({
                name: 'ServiceCodeIds',
                valueArray: selectedServiceCodeIds,
            }),
        );

        _extraSearchParams.push(
            new ExtraSearchParams({
                name: 'SchoolDistrictIds',
                valueArray: selectedSchoolDistrictIds,
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

        if (selectedSchoolDistrictIds && selectedSchoolDistrictIds.length) {
            const npiNumbers = this.searchNpiNumber.filter((sd) => sd.Selected).map((sd) => sd.NpiNumber);

            _extraSearchParams.push(
                new ExtraSearchParams({
                    name: 'NpiNumbers',
                    valueArray: npiNumbers,
                }),
            );
        }

        return _extraSearchParams;
    }

    getVouchersCall(): Observable<HttpResponse<IClaimVoucherDTO[]>> {
        const search = this.query;
        const _extraSearchParams: ExtraSearchParams[] = this.buildSearch();

        const searchEntity: IEntitySearchParams = {
            extraParams: _extraSearchParams,
            order: this.order,
            orderDirection: this.orderDirection,
            query: search && search.length > 0 ? search : '',
            skip: (this.currentPage - 1) * this.itemsPerPage,
            take: this.itemsPerPage,
        };

        const searchparams = new SearchParams(searchEntity);
        return this.voucherService.getVouchers(searchparams);
    }

    getVouchers(): void {
        this.getVouchersCall().subscribe((answer) => {
            this.vouchers = answer.body;
            this.total = +answer.headers.get('X-List-Count');
        });
    }

    getFilterSearchbar(event: string) {
        this.query = event;
    }

    getFilterDateRange(range: ISearchFilterDaterangeValue) {
        this.startDate = range ? range.startDate : this.startDate;
        this.endDate = range ? range.endDate : this.endDate;
    }

    applyClicked(applyEvent: ISelectionChangedEvent): void {
        if (applyEvent) {
            this.filterSelectionChanged();
        }
    }

    filterSelectionChanged(): void {
        this.currentPage = 1;
        this.getVouchers();
    }

    columnSorted(event: IColumnSortedEvent): void {
        this.order = event.column.sort.sortProperty;
        this.orderDirection = event.column.sort.direction === SortDirection.Desc ? 'desc' : 'asc';
        this.getVouchers();
    }

    voucherSelected(event: IItemSelectedEvent): void {
        const entity = event.entity as IClaimVoucherDTO;
        void this.router.navigate(['/vouchers', entity.VoucherId]);
    }

    getPdf(): void {
        const selectedSchoolDistrictIds: number[] = this.getSelectedFilters(this.schoolDistricts);
        const _extraSearchParams: ExtraSearchParams[] = [];
        const year = new Date().getMonth() >= 7 ? new Date().getFullYear() : new Date().getFullYear() - 1;

        _extraSearchParams.push(
            new ExtraSearchParams({
                name: 'SchoolDistrictIds',
                valueArray: selectedSchoolDistrictIds,
            }),
        );

        _extraSearchParams.push(
            new ExtraSearchParams({
                name: 'StartDate',
                // Start of school year, 1st July
                value: new Date(year, 6, 1).toISOString(),
            }),
        );
        _extraSearchParams.push(
            new ExtraSearchParams({
                name: 'EndDate',
                // End of school year, 30th June
                value: new Date(year + 1, 5, 30).toISOString(),
            }),
        );

        const searchEntity: IEntitySearchParams = {
            extraParams: _extraSearchParams,
            query: '',
            skip: undefined,
            take: undefined,
        };

        const searchparams = new SearchParams(searchEntity);

        this.pdfService.getVoucherReport(searchparams).subscribe((bytes: Blob) => {
            const thefile = new Blob([bytes], {
                type: 'application/octet-stream',
            });
            saveAs(thefile, `VoucherReport.pdf`);
        });
    }
}
