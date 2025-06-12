import { Component } from '@angular/core';
import { IProviderCaseLoadDTO } from '@model/interfaces/custom/provider-student.dto';
import { IEntity } from '@mt-ng2/base-service';
import { IEntityListComponentMembers, IEntityListDynamicCellComponent } from '@mt-ng2/entity-list-module';
import { NotificationsService } from '@mt-ng2/notifications-module';
import { ProviderStudentReferralsService } from '@provider/case-load/services/provider-student-referrals.service';
import { ProviderStudentService } from '@provider/case-load/services/provider-student.service';
import { ProviderPortalAuthService } from '@provider/provider-portal-auth.service';

@Component({
    styles: [],
    templateUrl: './referral-reminder-cell.component.html',
})
export class ReferralReminderCellDynamicCellComponent implements IEntityListDynamicCellComponent {
    entityListComponentMembers: IEntityListComponentMembers;
    set entity(value: IEntity) {
        this.providerStudent = value as IProviderCaseLoadDTO;
    }

    providerStudent: IProviderCaseLoadDTO;

    constructor(
        private providerAuthService: ProviderPortalAuthService,
        private notificationsService: NotificationsService,
        private providerStudentService: ProviderStudentService,
        private providerStudentReferralsService: ProviderStudentReferralsService,
    ) {}

    get referralNeedsSignature(): boolean {
        return this.providerStudent.NeedsReferral;
    }

    get referralIsBillable(): boolean {
        return this.providerStudent.IsBillable;
    }

    get latestReferral(): boolean {
        return this.providerStudent.LatestReferralId > 0;
    }

    sendReminder(event: Event): void {
        event.stopPropagation();
        this.providerStudentService.sendReminderEmail(this.providerStudent.Id, this.providerAuthService.getProviderId()).subscribe(() => {
            this.notificationsService.success('Reminder sent successfully.');
        });
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
}
