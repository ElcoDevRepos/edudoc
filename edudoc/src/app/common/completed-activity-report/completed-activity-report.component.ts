import { ProviderService } from '@admin/providers/provider.service';
import { SchoolDistrictService } from '@admin/school-districts/services/schooldistrict.service';
import { Component, Input } from '@angular/core';
import { PdfService } from '@common/services/pdf.service';
import { IProvider } from '@model/interfaces/provider';
import { ISchoolDistrict } from '@model/interfaces/school-district';
import { ExtraSearchParams, IEntitySearchParams, SearchParams } from '@mt-ng2/common-classes';
import { MtSearchFilterItem } from '@mt-ng2/search-filter-select-control';
import { ISelectionChangedEvent, VirtualTypeAheadGetItemsFunction } from '@mt-ng2/type-ahead-control';
import { saveAs } from 'file-saver';
import { Observable } from 'rxjs';
import { debounceTime, map } from 'rxjs/operators';

const SEPTEMBER = 7;
@Component({
    selector: 'app-completed-activity-report',
    templateUrl: './completed-activity-report.component.html',
})
export class CompletedActivityReportComponent {
    @Input() serviceCodes: MtSearchFilterItem[];
    @Input() districtId: number;

    schoolDistrictIdFilter = 0;
    getSchoolDistricts: VirtualTypeAheadGetItemsFunction = this.getSchoolDistrictsFunction.bind(this);
    providerIdFilter = 0;
    getProviders: VirtualTypeAheadGetItemsFunction = this.getProvidersFunction.bind(this);

    currentYear = new Date().getMonth() > SEPTEMBER ? new Date().getFullYear() + 1 : new Date().getFullYear();
    fiscalYear = this.currentYear;

    constructor(private pdfService: PdfService, private schoolDistrictService: SchoolDistrictService, private providerService: ProviderService) {}

    getCompletedActivityReport(): void {
        const _extraSearchParams = this.buildSearch();

        const searchEntity: IEntitySearchParams = {
            extraParams: _extraSearchParams,
            query: '',
        };

        const searchparams = new SearchParams(searchEntity);

        this.pdfService.getCompletedActivityReport(searchparams).subscribe((bytes: Blob) => {
            const thefile = new Blob([bytes], {
                type: 'application/octet-stream',
            });
            saveAs(thefile, `ProviderActivityReport.pdf`);
        });
    }

    private buildSearch(): ExtraSearchParams[] {
        const _extraSearchParams: ExtraSearchParams[] = [];
        const serviceCodeIds: number[] = this.serviceCodes ? this.getSelectedFilters(this.serviceCodes) : null;

        const districtId = this.districtId?.toString() ?? this.schoolDistrictIdFilter.toString();

        _extraSearchParams.push(
            new ExtraSearchParams({
                name: 'districtId',
                value: districtId,
            }),
        );

        if (serviceCodeIds && serviceCodeIds.length) {
            _extraSearchParams.push(
                new ExtraSearchParams({
                    name: 'serviceCodeIds',
                    valueArray: serviceCodeIds,
                }),
            );
        }

        if (this.fiscalYear) {
            _extraSearchParams.push(
                new ExtraSearchParams({
                    name: 'fiscalYear',
                    valueArray: [this.fiscalYear],
                }),
            );
        }

        if (this.providerIdFilter) {
            _extraSearchParams.push(
                new ExtraSearchParams({
                    name: 'providerId',
                    valueArray: [this.providerIdFilter],
                }),
            );
        }

        return _extraSearchParams;
    }

    private getSelectedFilters(filterObj: MtSearchFilterItem[]): number[] {
        return filterObj.filter((item) => item.Selected).map((item) => item.Item.Id);
    }

    private getSchoolDistrictsFunction(searchText: string): Observable<ISchoolDistrict[]> {
        return this.schoolDistrictService
            .search({
                query: searchText,
            })
            .pipe(
                debounceTime(300),
                map((resp) => resp.body),
            );
    }

    private getProvidersFunction(searchText: string): Observable<IProvider[]> {
        return this.providerService
            .searchProviders({
                query: searchText,
                extraParams: [{ name: 'districtIds', valueArray: [this.districtId ?? this.schoolDistrictIdFilter] }],
            })
            .pipe(
                debounceTime(300),
                map((resp) => resp.body),
            );
    }

    handleDistrictSelection(event: ISelectionChangedEvent): void {
        if (event.selection) {
            this.schoolDistrictIdFilter = (<ISchoolDistrict>event.selection).Id;
        } else {
            this.schoolDistrictIdFilter = 0;
        }
    }

    handleProviderSelection(event: ISelectionChangedEvent): void {
        if (event.selection) {
            this.providerIdFilter = (<IProvider>event.selection).Id;
        } else {
            this.providerIdFilter = 0;
        }
    }
}
