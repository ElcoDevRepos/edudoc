import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { entityListModuleConfig } from '@common/entity-list-module-config';
import { IDistrictProgressReportStudentDto } from '@model/interfaces/custom/district-progress-report-student.dto';
import { IProgressReport } from '@model/interfaces/progress-report';
import { ExtraSearchParams, IEntitySearchParams, SearchParams } from '@mt-ng2/common-classes';
import { DistrictProgressReportService } from '@school-district-admin/reports/services/district-admin-progress-report.service';
import { DistrictAdminProgressReportStudentEntityListConfig } from './district-admin-progress-report-student.entity-list-config';
import { UserTypesEnum } from '@model/enums/user-types.enum';
import { AuthService } from '@mt-ng2/auth-module';

@Component({
    selector: 'app-district-admin-progress-report-student-list',
    templateUrl: './district-admin-progress-report-student-list.component.html',
})
export class DistrictProgressReportStudentListComponent implements OnInit {
    providerId: number;
    startDate: Date;
    endDate: Date;
    providerName: string;
    providerServiceArea: string;
    isAdmin = false;

    districtProgressReportStudents: IDistrictProgressReportStudentDto[] = [];
    currentPage = 1;
    query = '';
    total: number;
    entityListConfig = new DistrictAdminProgressReportStudentEntityListConfig();
    order = this.entityListConfig.getDefaultSortProperty();
    orderDirection: string = this.entityListConfig.getDefaultSortDirection();

    constructor(
        private route: ActivatedRoute,
        private districtProgressReportService: DistrictProgressReportService,
        private router: Router,
        private authService: AuthService,
    ) {}

    ngOnInit(): void {
        this.isAdmin = this.authService.currentUser.getValue().CustomOptions.UserTypeId === UserTypesEnum.Admin;
        this.providerId = +this.route.snapshot.paramMap.get('providerId');
        this.startDate = this.districtProgressReportService.getStartDate();
        this.endDate = this.districtProgressReportService.getEndDate();
        this.providerName = this.districtProgressReportService.providerName;
        this.providerServiceArea = this.districtProgressReportService.providerServiceArea;
        this.getProgressReportStudentList();
    }

    getProgressReportStudentList(): void {
        const _extraSearchParams: ExtraSearchParams[] = [];

        const searchEntity: IEntitySearchParams = {
            extraParams: _extraSearchParams,
            order: this.order,
            orderDirection: this.orderDirection,
            query: '',
            skip: (this.currentPage - 1) * entityListModuleConfig.itemsPerPage,
            take: entityListModuleConfig.itemsPerPage,
        };

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
        this.districtProgressReportService.getProvidersForProgressReportStudents(this.providerId, searchparams).subscribe((answer) => {
            this.districtProgressReportStudents = answer.body;
            this.total = +answer.headers.get('X-List-Count');
        });
    }

    progressReportSelected(entity: IProgressReport): void {
        if (this.isAdmin) {
            void this.router.navigate([`/admin/progress-reports/${this.providerId}/report/${entity.Id}`]);    
        } else {
            void this.router.navigate([`/school-district-admin/progress-reports/${this.providerId}/report/${entity.Id}`]);
        }
    }
}
