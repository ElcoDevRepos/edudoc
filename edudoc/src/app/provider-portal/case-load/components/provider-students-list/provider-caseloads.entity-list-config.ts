import { DatePipe } from '@angular/common';
import { DeleteEntityCellComponent } from '@common/delete-entity-cell-component/delete-entity-cell.component';
import { IProviderCaseLoadDTO } from '@model/interfaces/custom/provider-student.dto';
import { IUser } from '@model/interfaces/user';
import { EntityListColumn, EntityListConfig } from '@mt-ng2/entity-list-module';
import { ProviderPortalAuthService } from '@provider/provider-portal-auth.service';
import { IncompleteProfileCellDynamicCellComponent } from './incomplete-profile-cell/incomplete-profile-cell.component';
import { ReferralCellDynamicCellComponent } from './referral-cell/referral-cell.component';
import { ReferralReminderCellDynamicCellComponent } from './referral-reminder-cell/referral-reminder-cell.component';

export class ProviderCaseloadsEntityListConfig extends EntityListConfig {
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
                        return new DatePipe('en-US').transform(response.DateOfBirth, 'MMM d, y', 'UTC');
                    },
                    name: 'DOB',
                    sort: {
                        sortProperty: 'DateOfBirth',
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
                    sort: {
                        sortProperty: 'SchoolDistrict',
                    },
                }),
                new EntityListColumn({
                    columnClass: 'referral-cell',
                    component: IncompleteProfileCellDynamicCellComponent,
                    excludeFromExport: true,
                    fireOnColumnSelected: false,
                    name: 'Incomplete Profile',
                    sort: { disableSort: true },
                }),
                new EntityListColumn({
                    accessorFunction: function (response: IProviderCaseLoadDTO): string {
                        return response.ProgressReports !== null
                            ? response.ProgressReports?.map(
                                  (pr) =>
                                      new DatePipe('en-US').transform(pr.StartDate, 'MM/dd/yyyy') +
                                      ' - ' +
                                      new DatePipe('en-US').transform(pr.EndDate, 'MM/dd/yyyy'),
                              ).join(',')
                            : '';
                    },
                    excludeFromView: !providerAuthService.providerHasReferrals(),
                    name: '90 Day Progress Completed',
                    sort: { disableSort: true },
                }),
                new EntityListColumn({
                    accessorFunction: function (response: IProviderCaseLoadDTO): string {
                        return response.SortingName.join(',') || '';
                    },
                    name: 'Session Name',
                    sort: {
                        sortProperty: 'SessionName',
                    },
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
                    excludeFromView:
                        providerAuthService.providerCanSignReferral() ||
                        !providerAuthService.providerHasReferrals() ||
                        (providerAuthService.providerIsAssistant() && !providerAuthService.providerIsOTAorPTA()),
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
                        return response.IsAssistantCaseload ? '' : 'No Assistant(s)';
                    },
                    excludeFromView:
                        !providerAuthService.providerIsSupervisor() ||
                        providerAuthService.providerIsAudio() ||
                        providerAuthService.providerIsSpeech(),
                    name: 'Assistant(s)',
                    sort: { disableSort: true },
                }),
                new EntityListColumn({
                    accessorFunction: function (response: IProviderCaseLoadDTO): string {
                        return response.Supervisor || '';
                    },
                    excludeFromView: !providerAuthService.providerIsAssistant(),
                    name: 'Supervisor',
                    sort: { disableSort: true },
                }),
                new EntityListColumn({
                    component: DeleteEntityCellComponent,
                    excludeFromExport: true,
                    name: 'Remove From Caseload',
                    sort: { disableSort: true },
                    style: { width: 50 },
                }),
            ],
        });
    }
}
