import { IProviderAccessChangeRequest } from '@admin/providers/libraries/dtos/revoke-access.dto';
import { ProviderService } from '@admin/providers/provider.service';
import { ProviderLicenseService } from '@admin/providers/services/provider-license.service';
import { ProviderOdeService } from '@admin/providers/services/provider-ode.service';
import { UserService } from '@admin/users/services/user.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ClaimTypes } from '@model/ClaimTypes';
import { UserTypesEnum } from '@model/enums/user-types.enum';
import { IProvider } from '@model/interfaces/provider';
import { IProviderAcknowledgmentLog } from '@model/interfaces/provider-acknowledgment-log';
import { IProviderInactivityDate } from '@model/interfaces/provider-inactivity-date';
import { IProviderLicens } from '@model/interfaces/provider-licens';
import { IProviderOdeCertification } from '@model/interfaces/provider-ode-certification';
import { AuthService, ClaimsService, ClaimValues } from '@mt-ng2/auth-module';
import { NotificationsService } from '@mt-ng2/notifications-module';
import { forkJoin, Observable, of } from 'rxjs';
import { ProviderInactivityDateService } from '../do-not-bill-card/provider-inactivity-date.service';
import { ILabelGenerator } from '../license-ode-list/label-generator';
import { RevokeAccessService } from '../provider-access-revocation/revoke-access.service';

@Component({
    selector: 'app-provider-detail',
    templateUrl: './provider-detail.component.html',
})
export class ProviderDetailComponent implements OnInit {
    canEdit: boolean;
    provider: IProvider;
    providerId: number;
    returnUrl: string;
    providerUserType: UserTypesEnum = UserTypesEnum.Provider;
    licenseLabelGenerator: ILabelGenerator = {
        generateLabel: (item: IProviderLicens): string => `<em>${item.License}</em>`,
    };
    odeLabelGenerator: ILabelGenerator = {
        generateLabel: (): string => '',
    };

    showLicenseList = true;
    showODEList = true;
    licenses: IProviderLicens[] = [];
    odes: IProviderOdeCertification[] = [];
    acknowledgmentLogs: IProviderAcknowledgmentLog[] = [];
    showRevokeAccess = true;
    showGrantAccess = false;
    showRevocationReason = false;
    showImpersonationButton = false;
    providerInactivityDates: IProviderInactivityDate[] = [];

    constructor(
        private providerService: ProviderService,
        private providerLicenseService: ProviderLicenseService,
        private providerOdeService: ProviderOdeService,
        private claimsService: ClaimsService,
        private route: ActivatedRoute,
        private notificationsService: NotificationsService,
        private router: Router,
        private authService: AuthService,
        private userService: UserService,
        private revokeAccessService: RevokeAccessService,
        private providerInactivityDateService: ProviderInactivityDateService,
    ) {}

    ngOnInit(): void {
        this.canEdit = this.claimsService.hasClaim(ClaimTypes.ProviderMaintenance, [ClaimValues.FullAccess]);
        const id = +this.route.snapshot.paramMap.get('providerId');
        this.providerId = id;
        forkJoin(this.getProviderById(id), this.providerService.getAcknowledgmentLogs(id),
            this.providerInactivityDateService.getInactivityDatesByProviderId(id)).subscribe((answers) => {
            const [provider, logs, pids] = answers;
            this.provider = provider;
            this.acknowledgmentLogs = logs;
            this.setShowLicensesList(true);
            this.setShowODEList(true);
            this.showRevokeAccess = !provider.Archived;
            this.showGrantAccess = provider.Archived;
            this.providerInactivityDates = pids;
        });

        this.authService.currentUser.subscribe((user) => {
            this.showImpersonationButton = this.userService.showImpersonateButton(user);
        });
    }

    getProviderById(id: number): Observable<IProvider> {
        if (id > 0) {
            return this.providerService.getById(id);
        } else {
            return of(this.providerService.getEmptyProvider());
        }
    }

    updateVersion(version: number[]): void {
        this.provider.ProviderUser.Version = version;
    }

    setShowODEList(shouldShow: boolean): void {
        if (shouldShow) {
            this.providerOdeService.getProviderOdes(this.providerId).subscribe((odes) => {
                this.odes = odes;
                this.showODEList = true;
            });
        } else {
            this.showODEList = false;
        }
    }

    setShowLicensesList(shouldShow: boolean): void {
        if (shouldShow) {
            this.providerLicenseService.getProviderLicenses(this.providerId).subscribe((licenses) => {
                this.licenses = licenses;
                this.showLicenseList = true;
            });
        } else {
            this.showLicenseList = false;
        }
    }
    revokeAccess(): void {
        this.showRevokeAccess = false;
        this.showRevocationReason = true;
    }

    grantAccess(): void {
        const accessDto: IProviderAccessChangeRequest = {
            Provider: this.provider,
        };
        this.providerService.changeProviderBlockedStatus(accessDto, false).subscribe(() => {
            this.notificationsService.success('Provider access granted successfully');
            this.handleRevokeAccessSubmitOrCancel(false);
            void this.router.navigate(['/providers']);
        });
        const access = this.revokeAccessService.getEmptyRevokeAccess();
        access.ProviderId = this.provider.Id;
        access.RevocationReasonId = null;
        access.Date = new Date();
        access.AccessGranted = true;
        this.revokeAccessService.create(access).subscribe();
    }

    handleRevokeAccessSubmitOrCancel(submitted: boolean): void {
        this.showRevokeAccess = !submitted;
        this.showGrantAccess = submitted;
        this.showRevocationReason = false;
        if (submitted) {
            void this.router.navigate(['/providers']);
        }
    }

    loginAsProvider(event: Event): void {
        if (event && event.stopPropagation) {
            event.stopPropagation();
        }

        this.userService.impersonate(this.provider.ProviderUser.Id).subscribe(
            () => {
                this.notificationsService.success('You are logged in');
                void this.router.navigate(['./provider/dashboard']);
            },
            (error) => {
                if (error.status === 418) {
                    this.notificationsService.error('Access link is invalid');
                } else if (error.status === 400) {
                    const errorMessage = error.error?.ModelState?.Service;
                    if (typeof errorMessage === 'string'){
                        this.error(errorMessage);
                    } else {
                        this.error('Something went wrong');
                    }
                }
            },
        );
    }

    error(msg?: string): void {
        if (!msg) {
            this.notificationsService.error('Something went wrong');
        } else {
            this.notificationsService.error(msg);
        }
    }
}
