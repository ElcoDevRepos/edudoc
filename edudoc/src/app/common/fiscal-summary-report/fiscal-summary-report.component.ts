import { SchoolDistrictService } from '@admin/school-districts/services/schooldistrict.service';
import { formatDate } from '@angular/common';
import { Component, Input } from '@angular/core';
import { PdfService } from '@common/services/pdf.service';
import { IFiscalSummaryData } from '@model/interfaces/custom/fiscal-summary-data';
import { ISchoolDistrict } from '@model/interfaces/school-district';
import { IServiceCode } from '@model/interfaces/service-code';
import { ExtraSearchParams, IEntitySearchParams, SearchParams } from '@mt-ng2/common-classes';
import { DynamicField, DynamicFieldType, DynamicFieldTypes, IDynamicFieldType } from '@mt-ng2/dynamic-form';
import { ISelectionChangedEvent, VirtualTypeAheadGetItemsFunction } from '@mt-ng2/type-ahead-control';
import { saveAs } from 'file-saver';
import { Observable } from 'rxjs';
import { debounceTime, map } from 'rxjs/operators';

@Component({
    selector: 'app-fiscal-summary-report',
    styles: [`
    .reportHeader {
    background-color: lightblue;
    }
    .centerText {
        text-align: center;
    }
    .rightAlign {
        text-align: right;
        padding-right: 50px;
    }
    .floatRight {
        text-align: right;
        padding-right: 100px;
    }`,
    ],
    templateUrl: './fiscal-summary-report.component.html',
})
export class FiscalSummaryReportComponent {
    @Input() serviceCodes: IServiceCode[];
    currentDate = formatDate(new Date(), 'fullDate', 'en');
    fiscalYear = new Date().getFullYear();
    fiscalYearString = String(this.fiscalYear);
    fiscalSummaryData: IFiscalSummaryData;

    schoolDistrictIdFilter = 0;
    selectedSchoolDistrict: ISchoolDistrict;
    getSchoolDistricts: VirtualTypeAheadGetItemsFunction = this.getSchoolDistrictsFunction.bind(this);

    constructor(
        private pdfService: PdfService,
        private schoolDistrictService: SchoolDistrictService,
    ) {}

    getFiscalYearField(): DynamicField {
        return new DynamicField({
        formGroup: null,
        label: 'Fiscal Year',
        name: 'fiscalYear',
        options: null,
        type: new DynamicFieldType({
        fieldType: DynamicFieldTypes.Input,
        inputType: null,
        }),
        value: this.fiscalYear,
        });
        }

    findServiceCodeName(Id): string {
        return this.serviceCodes?.find((c) => c.Id === Id).Name;
    }
    getFiscalSummaryReport(): void {

        const _extraSearchParams = this.buildSearch();

        const searchEntity: IEntitySearchParams = {
            extraParams: _extraSearchParams,
            query: '',
        };

        const searchparams = new SearchParams(searchEntity);

        this.pdfService.getFiscalSummaryReport(searchparams).subscribe((bytes: Blob) => {
            const thefile = new Blob([bytes], {
                type: 'application/octet-stream',
            });
            saveAs(thefile, `FiscalSummaryReport.pdf`);
        });
    }

    private buildSearch(): ExtraSearchParams[] {
        const _extraSearchParams: ExtraSearchParams[] = [];
        // const serviceCodeIds: number[] = this.serviceCodes ? this.getSelectedFilters(this.serviceCodes) : null;

        _extraSearchParams.push(
            new ExtraSearchParams({
                name: 'districtId',
                value: this.schoolDistrictIdFilter.toString(),
            }),
        );

        _extraSearchParams.push(
            new ExtraSearchParams({
                name: 'fiscalYear',
                value: this.fiscalYear.toString(),
            }),
        );

        // if (serviceCodeIds && serviceCodeIds.length) {
        //     _extraSearchParams.push(
        //         new ExtraSearchParams({
        //             name: 'serviceCodeIds',
        //             valueArray: serviceCodeIds,
        //         }),
        //     );
        // }

        return _extraSearchParams;
    }

    // private getSelectedFilters(filterObj: MtSearchFilterItem[]): number[] {
    //     return filterObj.filter((item) => item.Selected).map((item) => item.Item.Id);
    // }

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

    handleDistrictSelection(event: ISelectionChangedEvent): void {
        if (event.selection) {
            this.selectedSchoolDistrict = (<ISchoolDistrict>event.selection);
            this.schoolDistrictIdFilter = this.selectedSchoolDistrict.Id;
            const _extraSearchParams = this.buildSearch();
            const numbers = (/^[0-9]+$/);

            const searchEntity: IEntitySearchParams = {
                extraParams: _extraSearchParams,
                query: '',
            };

            const searchparams = new SearchParams(searchEntity);
            if (this.fiscalYearString.length === 4 && this.fiscalYearString.match(numbers)) {
            this.pdfService.getFiscalSummaryReportData(new SearchParams(searchparams)).pipe(debounceTime(300)).subscribe((resp) => {
                this.fiscalSummaryData = resp;
            });
        }
        } else {
            this.schoolDistrictIdFilter = 0;
        }
    }

    handleFiscalYearSelection(event: number): void {
        if (event) {
            this.fiscalYear = event;
        } else {
            this.fiscalYear = new Date().getFullYear();
        }
        const _extraSearchParams = this.buildSearch();
        this.fiscalYearString = String(this.fiscalYear).length ? String(this.fiscalYear) : '';
        const numbers = (/^[0-9]+$/);

        const searchEntity: IEntitySearchParams = {
            extraParams: _extraSearchParams,
            query: '',
        };

        const searchparams = new SearchParams(searchEntity);
        if (this.fiscalYearString.length === 4 && this.fiscalYearString.match(numbers) && this.selectedSchoolDistrict) {
        this.pdfService.getFiscalSummaryReportData(new SearchParams(searchparams)).pipe(debounceTime(300)).subscribe((resp) => {
            this.fiscalSummaryData = resp;
        });
    }
    }
}
