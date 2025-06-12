import { Component, Input, OnInit } from '@angular/core';
import { EncounterResponseDtoService } from '@common/services/encounter-response-dto.service';
import { PdfService } from '@common/services/pdf.service';
import { StudentService } from '@common/services/student.service';
import { IEncounterDistrictData, IEncounterFullData, IEncounterLineData } from '@model/dtos/encounter-data';
import { ExtraSearchParams, IEntitySearchParams, SearchParams } from '@mt-ng2/common-classes';
import { DynamicField, DynamicFieldType, DynamicFieldTypes } from '@mt-ng2/dynamic-form';
import { EntityListExportService } from '@mt-ng2/entity-list-module';
import { ISearchFilterDaterangeValue } from '@mt-ng2/search-filter-daterange-control';
import { MtSearchFilterItem } from '@mt-ng2/search-filter-select-control';
import { EncounterBasicReportEntityListConfig, EncounterDetailedReportEntityListConfig } from './encounter-reports.entity-list.config';

@Component({
    selector: 'app-encounter-reports',
    templateUrl: './encounter-reports.component.html',
})
export class EncounterReportsComponent implements OnInit {
    @Input() providers: MtSearchFilterItem[];
    @Input() serviceCodes: MtSearchFilterItem[];
    @Input() schoolDistricts: MtSearchFilterItem[];
    @Input() serviceTypes: MtSearchFilterItem[];
    @Input() hideOtherDistrictProvidersButton: boolean;
    @Input() isDistrictAdminReport: boolean;

    studentOptions: MtSearchFilterItem[];
    startDate: Date = new Date();
    endDate: Date;
    otherProviders = false;

    pdfBlob: Blob;

    encounterBasicReportExportConfig = new EncounterBasicReportEntityListConfig();
    encounterDetailedReportExportConfig = new EncounterDetailedReportEntityListConfig(this.encounterResponseDtoService);

    constructor(
        private pdfService: PdfService,
        private studentService: StudentService,
        private exportService: EntityListExportService,
        private encounterResponseDtoService: EncounterResponseDtoService,
    ) {}

    ngOnInit(): void {
        this.getFilteredStudents();
    }

    dateSelectionChanged(event: ISearchFilterDaterangeValue): void {
        this.startDate = event.startDate;
        this.endDate = event.endDate;
        this.getFilteredStudents();
    }

    getOtherProvidersField(): DynamicField {
        return new DynamicField({
            formGroup: null,
            label: 'Other District Providers',
            name: 'otherProviders',
            type: new DynamicFieldType({
                fieldType: DynamicFieldTypes.Checkbox,
            }),
            value: this.otherProviders,
        });
    }

    getBasicEncounterReport(): void {
        const _extraSearchParams = this.buildSearch();

        const searchEntity: IEntitySearchParams = {
            extraParams: _extraSearchParams,
            query: '',
        };

        const searchparams = new SearchParams(searchEntity);

        this.pdfService.getBasicEncounterDocument(searchparams).subscribe((bytes: Blob) => {
            this.pdfBlob = new Blob([bytes], {
                type: 'application/octet-stream',
            });
        });
    }
    getBasicEncounterReportCsv(): void {
        const _extraSearchParams = this.buildSearch();

        const searchEntity: IEntitySearchParams = {
            extraParams: _extraSearchParams,
            query: '',
        };

        const searchparams = new SearchParams(searchEntity);

        this.pdfService.getBasicEncounterCsv(searchparams).subscribe((data) => {
            const fullData = this.mapLineDataToFullData(data);
            this.exportService.export(fullData, this.encounterBasicReportExportConfig);
        });
    }

    getDetailedEncounterReport(): void {
        const _extraSearchParams = this.buildSearch();

        const searchEntity: IEntitySearchParams = {
            extraParams: _extraSearchParams,
            query: '',
        };

        const searchparams = new SearchParams(searchEntity);

        this.pdfService.getDetailedEncounterDocument(searchparams).subscribe((bytes: Blob) => {
            this.pdfBlob = new Blob([bytes], {
                type: 'application/octet-stream',
            });
        });
    }

    getDetailedEncounterReportCsv(): void {
        const _extraSearchParams = this.buildSearch();

        const searchEntity: IEntitySearchParams = {
            extraParams: _extraSearchParams,
            query: '',
        };

        const searchparams = new SearchParams(searchEntity);

        this.pdfService.getDetailedEncounterCsv(searchparams).subscribe((data) => {
            const fullData = this.mapLineDataToFullData(data);
            this.exportService.export(fullData, this.encounterDetailedReportExportConfig);
        });
    }

    mapLineDataToFullData<T extends IEncounterLineData>(districtData: IEncounterDistrictData<T>[]): IEncounterFullData<T>[] {
        return districtData.flatMap((districtDatum) =>
            districtDatum.GroupData.flatMap((groupDatum) =>
                groupDatum.LineData.flatMap(
                    (lineDatum): IEncounterFullData<T> => ({
                        LineData: {
                            ...lineDatum,
                            EncounterDate: new Date(lineDatum.EncounterDate).toLocaleDateString("en-US"),
                        },
                        GroupData: groupDatum,
                        DistrictData: districtDatum,
                    }),
                ),
            ),
        );
    }    

    private buildSearch(): ExtraSearchParams[] {
        const _extraSearchParams: ExtraSearchParams[] = [];
        const providerIds: number[] = this.providers ? this.getSelectedFilters(this.providers) : null;
        const districtIds: number[] = this.schoolDistricts ? this.getSelectedFilters(this.schoolDistricts) : null;
        const serviceCodeIds: number[] = this.serviceCodes ? this.getSelectedFilters(this.serviceCodes) : null;
        const studentIds: number[] = this.studentOptions ? this.getSelectedFilters(this.studentOptions) : null;
        const serviceTypeIds: number[] = this.serviceTypes ? this.getSelectedFilters(this.serviceTypes) : null;

        if (this.isDistrictAdminReport) {
            if (serviceCodeIds.length) {
                _extraSearchParams.push(
                    new ExtraSearchParams({
                        name: 'ServiceCodeIds',
                        valueArray: serviceCodeIds,
                    }),
                );
            } else {
                _extraSearchParams.push(
                    new ExtraSearchParams({
                        name: 'ServiceCodeIds',
                        valueArray: this.serviceCodes.map((sc) => sc.Item.Id),
                    }),
                );
            }
        } else {
            if (districtIds?.length) {
                _extraSearchParams.push(
                    new ExtraSearchParams({
                        name: 'DistrictIds',
                        valueArray: districtIds,
                    }),
                );
            }
            {
                _extraSearchParams.push(
                    new ExtraSearchParams({
                        name: 'DistrictIds',
                        valueArray: this.schoolDistricts.map((district) => district.Item.Id),
                    }),
                );
            }
        }
        if (providerIds && providerIds.length) {
            _extraSearchParams.push(
                new ExtraSearchParams({
                    name: 'ProviderIds',
                    valueArray: providerIds,
                }),
            );
        }

        if (studentIds && studentIds.length) {
            _extraSearchParams.push(
                new ExtraSearchParams({
                    name: 'StudentIds',
                    valueArray: studentIds,
                }),
            );
        }

        if (serviceTypeIds && serviceTypeIds.length) {
            _extraSearchParams.push(
                new ExtraSearchParams({
                    name: 'ServiceTypeIds',
                    valueArray: serviceTypeIds,
                }),
            );
        }

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

        _extraSearchParams.push(
            new ExtraSearchParams({
                name: 'OtherProviders',
                value: this.otherProviders ? '1' : '0',
            }),
        );

        _extraSearchParams.push(
            new ExtraSearchParams({
                name: 'IsDistrictAdminReport',
                value: this.isDistrictAdminReport ? '1' : '0',
            }),
        );

        return _extraSearchParams;
    }

    private getSelectedFilters(filterObj: MtSearchFilterItem[]): number[] {
        return filterObj.filter((item) => item.Selected).map((item) => item.Item.Id);
    }

    getFilteredStudents(): void {
        const districtIds = this.schoolDistricts?.filter((item) => item.Selected).map((item) => item.Item.Id) || [];
        const serviceCodeIds = this.serviceCodes?.filter((item) => item.Selected).map((item) => item.Item.Id) || [];

        const _extraSearchParams: ExtraSearchParams[] = [];

        const searchEntity: IEntitySearchParams = {
            extraParams: _extraSearchParams,
            order: 'LastName',
            orderDirection: 'asc',
            query: '',
        };

        if (districtIds) {
            _extraSearchParams.push(
                new ExtraSearchParams({
                    name: 'DistrictIds',
                    valueArray: districtIds,
                }),
            );
        }
        if (serviceCodeIds) {
            _extraSearchParams.push(
                new ExtraSearchParams({
                    name: 'ServiceCodeIds',
                    valueArray: serviceCodeIds,
                }),
            );
        }

        _extraSearchParams.push(
            new ExtraSearchParams({
                name: 'OtherProviders',
                value: this.otherProviders ? '1' : '0',
            }),
        );

        _extraSearchParams.push(
            new ExtraSearchParams({
                name: 'IsDistrictAdminReport',
                value: this.isDistrictAdminReport ? '1' : '0',
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

        const searchparams = new SearchParams(searchEntity);
        this.studentService.getStudentSelectOptionsByDistricts(searchparams).subscribe((students) => {
            this.studentOptions = students.body.map((p) => new MtSearchFilterItem(p, false));
        });
    }
}
