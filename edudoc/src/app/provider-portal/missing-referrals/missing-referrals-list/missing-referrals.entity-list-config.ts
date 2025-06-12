import { IProviderCaseLoadDTO } from '@model/interfaces/custom/provider-student.dto';
import { IUser } from '@model/interfaces/user';
import { EntityListColumn, EntityListConfig } from '@mt-ng2/entity-list-module';
import { ReferralCellDynamicCellComponent } from '@provider/case-load/components/provider-students-list/referral-cell/referral-cell.component';
import { ReferralReminderCellDynamicCellComponent } from '@provider/case-load/components/provider-students-list/referral-reminder-cell/referral-reminder-cell.component';
import { ProviderPortalAuthService } from '@provider/provider-portal-auth.service';

export class MissingReferralsEntityListConfig extends EntityListConfig {
    constructor(private providerAuthService: ProviderPortalAuthService) {
        super({
            columns: [
                new EntityListColumn({
                    accessorFunction: function (response: IProviderCaseLoadDTO): string {
                        return response.LastName;
                    },
                    name: 'Last Name',
                    sort: {
                        sortProperty: 'LastName',
                    },
                }),
                new EntityListColumn({
                    accessorFunction: function (response: IProviderCaseLoadDTO): string {
                        return response.FirstName;
                    },
                    name: 'First Name',
                    sort: {
                        sortProperty: 'FirstName',
                    },
                }),
                new EntityListColumn({
                    accessorFunction: function (response: IProviderCaseLoadDTO): string {
                        return response.StudentCode;
                    },
                    name: 'Student Code',
                    sort: {
                        sortProperty: 'StudentCode',
                    },
                }),
                new EntityListColumn({
                    accessorFunction: function (response: IProviderCaseLoadDTO): string {
                        return response.SchoolDistrict || '';
                    },
                    name: 'School District',
                    sort: { disableSort: true },
                }),
                new EntityListColumn({
                    accessorFunction: function (response: IProviderCaseLoadDTO): string {
                        return response.ESC || '';
                    },
                    name: 'Program Name',
                    sort: { disableSort: true },
                }),
                new EntityListColumn({
                    columnClass: 'referral-cell',
                    component: ReferralCellDynamicCellComponent,
                    excludeFromExport: true,
                    excludeFromView: !providerAuthService.providerHasReferrals(),
                    fireOnColumnSelected: false,
                    name: 'Referral Status',
                    sort: {
                        disableSort: true,
                    },
                }),
                new EntityListColumn({
                    columnClass: 'referral-reminder-cell',
                    component: ReferralReminderCellDynamicCellComponent,
                    excludeFromExport: true,
                    excludeFromView: providerAuthService.providerCanSignReferral() || !providerAuthService.providerHasReferrals(),
                    fireOnColumnSelected: false,
                    name: 'Referral Reminder',
                    sort: {
                        disableSort: true,
                    },
                }),
                new EntityListColumn({
                    accessorFunction: function (response: IProviderCaseLoadDTO): string {
                        const assistants = response.Assistants.map((assistant: IUser) => assistant.LastName + ', ' + assistant.FirstName);
                        if (assistants.length) {
                            return assistants.join('; ');
                        }
                        return 'No Assistant(s)';
                    },
                    excludeFromView: !providerAuthService.providerIsSupervisor(),
                    excludeFromExport: providerAuthService.providerIsAssistant(),
                    name: 'Assistant(s)',
                    sort: { disableSort: true },
                }),
                new EntityListColumn({
                    accessorFunction: function (response: IProviderCaseLoadDTO): string {
                        return response.Supervisor || '';
                    },
                    excludeFromView: !providerAuthService.providerIsAssistant(),
                    excludeFromExport: providerAuthService.providerIsSupervisor(),
                    name: 'Supervisor',
                    sort: { disableSort: true },
                }),
            ],
        });
    }
}
