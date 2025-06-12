import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ElectronicSignatures } from '@model/enums/electronic-signatures.enum';
import { IReferralSignOffRequest } from '@model/interfaces/custom/referral-sign-off-request.dto';
import { IESignatureContent } from '@model/interfaces/e-signature-content';
import { IStudent } from '@model/interfaces/student';
import { ISupervisorProviderStudentReferalSignOff } from '@model/interfaces/supervisor-provider-student-referal-sign-off';
import { AuthService, ILoggedIn } from '@mt-ng2/auth-module';
import { ExtraSearchParams, IEntitySearchParams, SearchParams } from '@mt-ng2/common-classes';
import { SortDirection } from '@mt-ng2/entity-list-module';
import { NotificationsService } from '@mt-ng2/notifications-module';
import { ProviderStudentReferralsService } from '@provider/case-load/services/provider-student-referrals.service';
import { ProviderStudentService } from '@provider/case-load/services/provider-student.service';
import { ElectronicSignatureModalService } from '@provider/common/electronic-signature-modal/electronic-signature-modal.service';
import { ProviderElectronicSignaturesService } from '@provider/encounters/services/provider-electronic-signature. service';
import { ProviderPortalAuthService } from '@provider/provider-portal-auth.service';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-provider-student-referrals',
    templateUrl: './provider-student-referrals.component.html',
})
export class ProviderStudentReferralsComponent implements OnInit, OnDestroy {
    @Input() student: IStudent;

    providerStudentReferrals: ISupervisorProviderStudentReferalSignOff[] = [];

    total: number;
    doubleClickIsDisabled = false;
    isHovered: boolean;
    isCardOpen = false;

    isEditing = false;
    referral: ISupervisorProviderStudentReferalSignOff;

    signature: IESignatureContent;
    referralSignOffRequest: IReferralSignOffRequest = {
        EffectiveStartDate: null,
        SignOffText: null,
        StudentId: 0,
    };

    isAssistant = false;

    subscriptions: Subscription;
    currentUser: ILoggedIn;

    get noReferrals(): boolean {
        return !this.providerStudentReferrals || this.providerStudentReferrals.length === 0;
    }

    get canSignReferrals(): boolean {
        return this.providerAuthService.providerCanSignReferral();
    }

    constructor(
        private providerStudentReferralsService: ProviderStudentReferralsService,
        private electronicSignatureModalService: ElectronicSignatureModalService,
        private electronicSignatureService: ProviderElectronicSignaturesService,
        private providerStudentService: ProviderStudentService,
        private notificationsService: NotificationsService,
        private providerAuthService: ProviderPortalAuthService,
        private authService: AuthService,
    ) {
        this.subscriptions = new Subscription();
    }

    ngOnInit(): void {
        this.currentUser = this.authService.currentUser.getValue();
        this.isAssistant = this.providerAuthService.providerIsAssistant();
        this.electronicSignatureService.getById(ElectronicSignatures.Referral).subscribe((signature) => {
            this.signature = signature;
            this.getProviderStudentReferals();
        });
    }
    ngOnDestroy(): void {
        this.subscriptions.unsubscribe();
    }

    getProviderStudentReferals(): void {
        const _extraSearchParams: ExtraSearchParams[] = this.buildSearch();

        const searchEntity: IEntitySearchParams = {
            extraParams: _extraSearchParams,
            order: 'Id',
            orderDirection: SortDirection.Desc,
            query: '',
            take: 9999,
        };

        const searchparams = new SearchParams(searchEntity);
        this.providerStudentReferralsService.get(searchparams).subscribe((answer) => {
            this.providerStudentReferrals = answer.body;
            this.total = +answer.headers.get('X-List-Count');
        });
    }

    private buildSearch(): ExtraSearchParams[] {
        const _extraSearchParams: ExtraSearchParams[] = [];

        _extraSearchParams.push(
            new ExtraSearchParams({
                name: 'StudentId',
                value: this.student.Id.toString(),
            }),
        );

        return _extraSearchParams;
    }

    private providerNameFormattingFunction(referral: ISupervisorProviderStudentReferalSignOff): string {
        return `${referral.SignedOffBy.LastName}, ${referral.SignedOffBy.FirstName}`;
    }

    viewProviderReferral(index: number): void {
        this.providerStudentReferralsService.viewReferrals(this.providerStudentReferrals[index].Id).subscribe((resultBlob: Blob) => {
            const fileContents = new Blob([resultBlob], {
                type: 'application/pdf',
            });
            const fileURL = URL.createObjectURL(fileContents);
            window.open(fileURL, '_blank');
        });
    }

    signReferral(): void {
        this.electronicSignatureModalService.toggleDateFields();
        this.showSignModal();
    }

    showSignModal(): void {
        this.subscriptions.unsubscribe();
        this.subscriptions.closed = false;

        const loggedInProviderName = this.authService.currentUser.getValue().Name;
        const mergeFields = [{ target: '(Merged Provider Name)', value: loggedInProviderName }];
        this.electronicSignatureModalService.showModal(this.signature, mergeFields);
        this.subscriptions.add(
            this.electronicSignatureModalService.saved.subscribe((effectiveDate) => {
                this.referralSignOffRequest.EffectiveStartDate = effectiveDate ;
                this.referralSignOffRequest.SignOffText = this.signature.Content;
                this.referralSignOffRequest.StudentId = this.student.Id;
                this.providerStudentService
                    .signStudentReferral(this.referralSignOffRequest)
                    .subscribe(() => {
                        this.notificationsService.success('Referral signed successfully.');
                        this.getProviderStudentReferals();
                    });
            }),
        );
    }

    deleteReferral(referral: ISupervisorProviderStudentReferalSignOff) {
        this.providerStudentReferralsService.deleteReferral(referral).subscribe(() => {
            this.notificationsService.success('Referral deleted successfully.');
            this.getProviderStudentReferals();
        });
    }

    editReferral(referral: ISupervisorProviderStudentReferalSignOff) {
        this.isEditing = true;
        this.referral = referral;
    }

    toggleCardOpen(): void {
        this.isCardOpen = !this.isCardOpen;
    }

    canUserEditOrDeleteReferral(referral: ISupervisorProviderStudentReferalSignOff): boolean {
        return referral?.SignedOffBy?.Id === this.currentUser?.Id;
    }
}
