import { ChangeDetectorRef, Component, OnDestroy, ViewRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IProviderCaseLoadDTO } from '@model/interfaces/custom/provider-student.dto';
import { IReferralSignOffRequest } from '@model/interfaces/custom/referral-sign-off-request.dto';
import { AuthService } from '@mt-ng2/auth-module';
import { IEntity } from '@mt-ng2/base-service';
import { IEntityListComponentMembers, IEntityListDynamicCellComponent } from '@mt-ng2/entity-list-module';
import { NotificationsService } from '@mt-ng2/notifications-module';
import { ProviderStudentReferralsService } from '@provider/case-load/services/provider-student-referrals.service';
import { ProviderStudentService } from '@provider/case-load/services/provider-student.service';
import { ElectronicSignatureModalService } from '@provider/common/electronic-signature-modal/electronic-signature-modal.service';
import { ProviderPortalAuthService } from '@provider/provider-portal-auth.service';
import { Subscription } from 'rxjs';
import { finalize } from 'rxjs/operators';

@Component({
    styles: [],
    templateUrl: './referral-cell.component.html',
})
export class ReferralCellDynamicCellComponent implements IEntityListDynamicCellComponent, OnDestroy {
    entityListComponentMembers: IEntityListComponentMembers;
    set entity(value: IEntity) {
        this.providerStudent = value as IProviderCaseLoadDTO;
    }

    providerStudent: IProviderCaseLoadDTO;
    referralSignOffRequest: IReferralSignOffRequest = {
        EffectiveStartDate: null,
        SignOffText: null,
        StudentId: 0,
    };

    subscriptions: Subscription;

    get canSignReferrals(): boolean {
        return this.providerAuthService.providerCanSignReferral();
    }

    get referralNeedsSignature(): boolean {
        const isCreateReferralsNotOnCaseload = this.route.toString().indexOf('create-referrals-not-on-caseload') > -1;
        return (this.providerStudent.NeedsReferral && !isCreateReferralsNotOnCaseload) || isCreateReferralsNotOnCaseload;
    }

    get latestReferral(): boolean {
        return this.providerStudent.LatestReferralId > 0;
    }

    constructor(
        private notificationsService: NotificationsService,
        private providerStudentService: ProviderStudentService,
        private electronicSignatureModalService: ElectronicSignatureModalService,
        private providerStudentReferralsService: ProviderStudentReferralsService,
        private providerAuthService: ProviderPortalAuthService,
        private cdr: ChangeDetectorRef,
        private authService: AuthService,
        private route: ActivatedRoute
    ) {
        this.subscriptions = new Subscription();
    }

    signReferral(event: Event): void {
        event.stopPropagation();
        this.electronicSignatureModalService.toggleDateFields();
        this.showSignModal();
    }

    showSignModal(): void {
        const loggedInProviderName = this.authService.currentUser.getValue().Name;
        const mergeFields = [{ target: '(Merged Provider Name)', value: loggedInProviderName }];
        this.electronicSignatureModalService.showModal(this.providerStudent.ReferralSignature[0], mergeFields);
        this.subscriptions.add(
            this.electronicSignatureModalService.saved.subscribe((effectiveDate) => {
                this.referralSignOffRequest.EffectiveStartDate = effectiveDate ;
                this.referralSignOffRequest.SignOffText = this.providerStudent.ReferralSignature[0].Content;
                this.referralSignOffRequest.StudentId = this.providerStudent.Id;
                this.providerStudentService
                    .signStudentReferral(this.referralSignOffRequest)
                    .pipe(finalize(() => this.subscriptions.unsubscribe()))
                    .subscribe((id) => {
                        this.providerStudent.NeedsReferral = false;
                        this.providerStudent.LatestReferralId = id;
                        this.notificationsService.success('Referral signed successfully.');
                        // Change detection to remove button
                        if (!(this.cdr as ViewRef).destroyed) {
                            this.cdr.detectChanges();
                        }
                    });
            }),
        );
        this.subscriptions.add(
            this.electronicSignatureModalService.cancelled.subscribe(() => {
                this.subscriptions.unsubscribe();
                this.subscriptions.closed = false;
            }),
        );
    }

    viewProviderReferral(event: Event): void {
        event.stopPropagation();
        this.providerStudentReferralsService.viewReferrals(this.providerStudent.LatestReferralId).subscribe((resultBlob: Blob) => {
            const fileContents = new Blob([resultBlob], {
                type: 'application/pdf',
            });
            const fileURL = URL.createObjectURL(fileContents);
            window.open(fileURL, '_blank');
        });
    }

    ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
        this.cdr.detach();
    }
}
