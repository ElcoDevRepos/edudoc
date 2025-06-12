import { HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { entityListModuleConfig } from '@common/entity-list-module-config';
import { IActivitySummary } from '@model/interfaces/activity-summary';
import { IActivitySummaryDistrict } from '@model/interfaces/activity-summary-district';
import { IDistrictSummaryTotalsResponseDTO } from '@model/interfaces/custom/district-summary-response-dto.dto';
import { ExtraSearchParams, IEntitySearchParams, SearchParams } from '@mt-ng2/common-classes';
import { EntityListExportConfig, IItemSelectedEvent } from '@mt-ng2/entity-list-module';
import { ActivitySummaryService } from '@school-district-admin/reports/services/activity-summary.service';
import { Observable, map } from 'rxjs';
import { SummaryReportDistrictEntityListConfig } from './summary-report-district.entity-list-config';

@Component({
    selector: 'app-summary-report-district',
    templateUrl: './summary-report-district.component.html',
})
export class SummaryReportDistrictComponent implements OnInit {
    summaries: IActivitySummaryDistrict[] = [];

    summaryId: number;
    summaryTotal: IActivitySummary;

    currentPage = 1;
    itemsPerPage = entityListModuleConfig.itemsPerPage;
    total: number;
    entityListConfig = new SummaryReportDistrictEntityListConfig('District');
    order = 'Id';
    orderDirection: string = this.entityListConfig.getDefaultSortDirection();

    selectedDistrictId: number;
    openPendingReferrals: number;
    openReturnedEncounters: number;
    openEncountersReadyForFinalESign: number;
    pendingEvaluations: number;
    totalsLoaded = false;

    updating = false;

    constructor(private activitySummaryService: ActivitySummaryService, private router: Router) {}

    ngOnInit(): void {
        this.activitySummaryService.isAdmin = true;
        this.updating = true;

        this.entityListConfig.export = new EntityListExportConfig({
            exportName: 'Summary of Outstanding Documentation',
            getDataForExport: this.getSummariesForExport.bind(this)
        });

        this.getSummaries(true);
    }

    getSummaries(initial = false): void {
        if (!this.totalsLoaded && initial) {
            this.getTotalsCall().subscribe((answer) => {
                this.summaryTotal = answer;
                this.summaryId = this.summaryTotal.Id;
                this.totalsLoaded = true;

                this.getSummariesCall().subscribe((answer) => {
                    this.summaries = answer.body;
                    this.total = +answer.headers.get('X-List-Count');

                    this.updating = false;
                });
            });
        } else {
            this.getSummariesCall().subscribe((answer) => {
                this.summaries = answer.body;
                this.total = +answer.headers.get('X-List-Count');

                this.updating = false;
            });
        }
    }


    getSummariesForExport(): Observable<IActivitySummaryDistrict[]> {
        return this.getSummariesCall({ forExport: true }).pipe((map((answer) => answer.body)));
    }

    getSummariesCall(options = { forExport: false }): Observable<HttpResponse<IActivitySummaryDistrict[]>> {
        const searchparams = new SearchParams(this.buildSearch(options));

        // get summaries for the ActivitySummaryId(header)
        searchparams.extraParams?.push(new ExtraSearchParams({
            name: 'ActivitySummaryId',
            value: this.summaryTotal.Id.toString()
        }));

        return this.activitySummaryService.getActivitySummaryDistricts(searchparams);
    }

    getTotalsCall(): Observable<IActivitySummary> {
        return this.activitySummaryService.getMostRecentActivitySummaryTotal();
    }

    private buildSearch(options = { forExport: false }): IEntitySearchParams {
        const _extraSearchParams = [
            new ExtraSearchParams({
                name: 'isAdmin',
                value: '1',
            }),
        ];

        const searchEntity: IEntitySearchParams = {
            extraParams: _extraSearchParams,
            order: this.order,
            orderDirection: this.orderDirection,
            query: '',
            skip: options.forExport ? undefined : (this.currentPage - 1) * this.itemsPerPage,
            take: options.forExport ? undefined : this.itemsPerPage,
        };

        return searchEntity;
    }

    districtSelected(event: IItemSelectedEvent): void {
        const summary = event.entity as IActivitySummaryDistrict;
        this.selectedDistrictId = summary.DistrictId;
        this.activitySummaryService.setDistrict(summary.SchoolDistrict.Name);
        this.activitySummaryService.setDistrictId(this.selectedDistrictId);
        void this.router.navigate(['/admin/summary-report/activity-summary', event.entity.Id]);
    }

    assignTotals(summary: IDistrictSummaryTotalsResponseDTO): void {
        this.openEncountersReadyForFinalESign = summary.TotalEncountersReadyForFinalESign;
        this.openPendingReferrals = summary.TotalPendingReferrals;
        this.openReturnedEncounters = summary.TotalReturnedEncounters;
        this.pendingEvaluations = summary.TotalPendingEvaluations;

        this.totalsLoaded = true;
    }

    updateTables(): void {
        this.updating = true;
        this.activitySummaryService.updateSummaryTables()
            .subscribe((activitySummaryId) => {
                this.summaryId = activitySummaryId;
                this.totalsLoaded = false;
                this.getSummaries(true);
            });
    }
}
