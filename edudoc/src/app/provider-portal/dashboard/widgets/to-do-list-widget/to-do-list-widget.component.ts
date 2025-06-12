import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ExtraSearchParams, IEntitySearchParams, SearchParams } from '@mt-ng2/common-classes';
import { StudentTherapyScheduleService } from '@provider/case-load/services/student-therapy-schedule.service';
import { ProviderDashboardService } from '@provider/dashboard/services/provider-dashboard.service';
import { ProviderPortalAuthService } from '@provider/provider-portal-auth.service';

@Component({
    selector: 'app-to-do-list-widget',
    styleUrls: ['../../provider-dashboard-component/provider-dashboard-common-css.component.less'],
    templateUrl: './to-do-list-widget.component.html',
})
export class ToDoListWidgetComponent implements OnInit {
    @Input() providerId: number;
    @Input() isSupervisor: boolean;
    pendingReferralsCount: number;
    returnedEncountersCount: number;
    pendingApprovalsCount: number;
    encountersReadyForYouCount: number;
    pendingTreatmentTherapiesCount: number;
    pendingEvaluationsCount: number;
    pendingProgressReportsCount: number;

    get showPendingSupervisorCoSign(): boolean {
        return this.providerPortalAuthService.providerIsOTorPT();
    }

    get showPendingReferrals(): boolean {
        return this.providerPortalAuthService.providerHasReferrals();
    }

    get showPendingProgressReports(): boolean {
        return this.providerPortalAuthService.providerHasProgressReports();
    }

    constructor(
        private providerAuthService: ProviderPortalAuthService,
        private providerDashboardService: ProviderDashboardService,
        private studentTherapyScheduleService: StudentTherapyScheduleService,
        private providerPortalAuthService: ProviderPortalAuthService,
        public router: Router,
    ) {}

    ngOnInit(): void {
        this.getPendingReferralsCount();
        this.getReturnedEncountersCount();
        this.getPendingApprovalsCount();
        this.getToEncountersReadyForYouCount();
        this.getPendingTreatmentTherapiesCount();
        this.getPendingEvaluationsCount();
        this.getPendingProgressReportsCount();
    }

    private getPendingReferralsCount(): void {
        this.providerDashboardService.getPendingReferralsCount(this.providerAuthService.getProviderId()).subscribe((count) => {
            this.pendingReferralsCount = count;
        });
    }

    private getReturnedEncountersCount(): void {
        this.providerDashboardService.getReturnedEncountersCount().subscribe((count) => {
            this.returnedEncountersCount = count;
        });
    }

    private getPendingApprovalsCount(): void {
        this.providerDashboardService.getPendingApprovalsCount().subscribe((count) => {
            this.pendingApprovalsCount = count;
        });
    }

    private getPendingTreatmentTherapiesCount(): void {
        this.providerDashboardService.getPendingTreatmentTherapiesCount().subscribe((count) => {
            this.pendingTreatmentTherapiesCount = count;
        });
    }

    private getPendingEvaluationsCount(): void {
        this.providerDashboardService.getPendingEvaluationsCount().subscribe((count) => {
            this.pendingEvaluationsCount = count;
        });
    }

    private getPendingProgressReportsCount(): void {
        this.providerDashboardService.getPendingProgressReportsCount().subscribe((count) => {
            this.pendingProgressReportsCount = count;
        });
    }

    private getToEncountersReadyForYouCount(): void {

        const _extraSearchParams: ExtraSearchParams[] = [];
        const endDate: Date = new Date();
        const includeArchived = false;

        _extraSearchParams.push(
            new ExtraSearchParams({
                name: 'IncludeArchived',
                value: includeArchived ? '1' : '0',
            }),
        );

        _extraSearchParams.push(
            new ExtraSearchParams({
                name: 'EndDate',
                value: endDate.toISOString(),
            }),
        );

        const searchEntity: IEntitySearchParams = {
            extraParams: _extraSearchParams,
            query: '',
        };

        const searchparams = new SearchParams(searchEntity);
        this.studentTherapyScheduleService.getForList(searchparams).subscribe((answer) => {
            this.encountersReadyForYouCount = +answer.headers.get('X-List-Count');
        });
    }

    goToStudentsList(): void {
        void this.router.navigate(['/provider/case-load/students', { fromToDo: true }]);
    }

    goToEncountersListForReturned(): void {
        void this.router.navigate(['/provider/return-encounters', { fromToDoForReturned: true }]);
    }

    goToEncountersListForApprovals(): void {
        void this.router.navigate(['/provider/approve-assistant-encounters', { fromToDoForApprovals: true }]);
    }

    goToEncountersReadyForYou(): void {
        void this.router.navigate(['/provider/case-load/schedules/list']);
    }

    goToEncountersListForPendingTreatmentTherapies(): void {
        void this.router.navigate(['/provider/encounters-pending-treatment-therapies']);
    }

    goToEncountersListForPendingEvaluations(): void {
        void this.router.navigate(['/provider/encounters-pending-evaluation']);
    }

    goToProgressReports(): void {
        void this.router.navigate(['/provider/progress-reports']);
    }
}
