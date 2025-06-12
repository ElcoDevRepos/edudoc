import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { entityListModuleConfig } from '@common/entity-list-module-config';
import { ServiceCodeService } from '@common/services/service-code.service';
import { IDistrictProgressReportStudentDto } from '@model/interfaces/custom/district-progress-report-student.dto';
import { IDistrictProgressReportDto } from '@model/interfaces/custom/district-progress-report.dto';
import { ExtraSearchParams, IEntitySearchParams, SearchParams } from '@mt-ng2/common-classes';
import { NotificationsService } from '@mt-ng2/notifications-module';
import { MtSearchFilterItem } from '@mt-ng2/search-filter-select-control';
import { DistrictProgressReportService } from '@school-district-admin/reports/services/district-admin-progress-report.service';
import { SchoolDistrictAdminUserService } from '@school-district-admin/users/services/school-district-admin-user.service';
import { DistrictAdminProgressReportEntityListConfig } from './district-admin-progress-report.entity-list-config';
import { ISearchFilterDaterangeValue } from '@mt-ng2/search-filter-daterange-control';
import { map, Observable } from 'rxjs';
import { ServiceCodeEnums } from '@model/enums/service-code.enum';
@Component({
    selector: 'app-district-admin-progress-report-list',
    templateUrl: './district-admin-progress-report-list.component.html',
})
export class DistrictProgressReportListComponent implements OnInit {
    districtProgressReports: IDistrictProgressReportDto[] = [];
    currentPage = 1;
    query = '';
    total: number;
    entityListConfig = new DistrictAdminProgressReportEntityListConfig(() => this.getDataForExport());
    order = this.entityListConfig.getDefaultSortProperty();
    orderDirection: string = this.entityListConfig.getDefaultSortDirection();

    districtId: number;

    startDate: Date = this.districtProgressReportService.getStartDate();
    endDate: Date = this.districtProgressReportService.getEndDate();
    minDate: Date = this.districtProgressReportService.getCurrentSchoolYearStart();
    serviceAreas: MtSearchFilterItem[] = [];

    districtProgressReportStudents: IDistrictProgressReportStudentDto[] = [];
    totalStudents: number;
    currentPageStudent = 1;

    constructor(
        private districtProgressReportService: DistrictProgressReportService,
        private userService: SchoolDistrictAdminUserService,
        private serviceCodeService: ServiceCodeService,
        private router: Router,
        private notificationsService: NotificationsService,
    ) {}

    ngOnInit(): void {
        this.districtId = this.userService.getAdminDistrictId();
        this.serviceCodeService.getSearchFilterItems().subscribe((resp) => {
            this.serviceAreas = resp.filter(resp => resp.Item.Id !== ServiceCodeEnums.NURSING);
            this.getProgressReports();
        });
    }

    getDataForExport(): Observable<IDistrictProgressReportDto[]> {
        return this.getProgressReportsCall({ skip: undefined, take: undefined }).pipe(map((answer) => answer.items));
    }

    getProgressReports(): void {
        this.getProgressReportsCall({
            skip: (this.currentPage - 1) * entityListModuleConfig.itemsPerPage,
            take: entityListModuleConfig.itemsPerPage,
        }).subscribe((answer) => {
            this.districtProgressReports = answer.items;
            this.total = answer.total;
        });
    }
    getProgressReportsCall(skipAndTake: { skip?: number; take?: number }): Observable<{ items: IDistrictProgressReportDto[]; total: number }> {
        const search = this.query;
        const _extraSearchParams = this.buildSearch();

        if (_extraSearchParams.length < 3) {
            this.notificationsService.info('Please select valid Dates and a Service Area.');
        }
        const searchEntity: IEntitySearchParams = {
            extraParams: _extraSearchParams,
            order: this.order,
            orderDirection: this.orderDirection,
            query: search && search.length > 0 ? search : '',
            skip: skipAndTake.skip,
            take: skipAndTake.take,
        };

        const searchparams = new SearchParams(searchEntity);
        return this.districtProgressReportService.getProvidersForProgressReport(this.districtId, searchparams).pipe(
            map((answer) => ({
                items: answer.body,
                total: +answer.headers.get('X-List-Count'),
            })),
        );
    }

    private getSelectedFilters(filterObj: MtSearchFilterItem[]): number[] {
        return filterObj.filter((item) => item.Selected).map((item) => item.Item.Id);
    }

    private buildSearch(): ExtraSearchParams[] {
        const _extraSearchParams: ExtraSearchParams[] = [];
        const serviceAreaIds: number[] = this.getSelectedFilters(this.serviceAreas);

        _extraSearchParams.push(
            new ExtraSearchParams({
                name: 'ServiceAreaId',
                valueArray: serviceAreaIds,
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
        return _extraSearchParams;
    }

    search(query: string): void {
        this.currentPage = 1;
        this.query = query;
        this.getProgressReports();
    }

    dateSelectionChanged(range: ISearchFilterDaterangeValue): void {
        this.startDate = range.startDate;
        this.endDate = range.endDate;
        this.districtProgressReportService.startDate = this.startDate;
        this.districtProgressReportService.endDate = this.endDate;
        this.getProgressReports();
    }

    filterSelectionChanged(): void {
        this.currentPage = 1;
        this.getProgressReports();
    }

    providerSelected(providerId: number): void {
        const provider = this.districtProgressReports.find((p) => p.ProviderId === providerId);
        this.districtProgressReportService.providerName = `${provider.FirstName} ${provider.LastName}`;
        this.districtProgressReportService.providerServiceArea = `${provider.ServiceAreaName}`;
        if (this.districtId) {
            void this.router.navigate([`/school-district-admin/progress-reports/students/${providerId}`]);
        } else {
            void this.router.navigate([`/admin/progress-reports/students/${providerId}`]);
        }
    }
}
