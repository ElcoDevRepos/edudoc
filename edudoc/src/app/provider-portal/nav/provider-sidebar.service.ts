import { Injectable } from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';

import { removeNullNavItems } from '@common/util';
import { ClaimTypes } from '@model/ClaimTypes';
import { ClaimValues } from '@mt-ng2/auth-module';
import { INavSidebarService, NavSidebarContentContainer, NavSidebarHeaderItem, NavSidebarParentRowItem, NavSidebarRowItem } from '@mt-ng2/nav-module';
import { ProviderPortalAuthService } from '@provider/provider-portal-auth.service';
import { NavStylerComponent } from './nav-title-styler.component';

@Injectable({ providedIn: 'root' })
export class ProviderNavSidebarService implements INavSidebarService {
    subscriptions: Subscription = new Subscription();

    content: BehaviorSubject<NavSidebarContentContainer[]> = new BehaviorSubject([]);

    constructor(private providerAuthService: ProviderPortalAuthService) {}

    assembleNav(): NavSidebarContentContainer {
        const providerNavMenu: (NavSidebarRowItem | NavSidebarParentRowItem)[] = [
            new NavSidebarRowItem({
                content: 'My Profile',
                icon: 'fa fa-fw fa-address-card',
                link: '/provider/my-profile',
            }),
            new NavSidebarRowItem({
                content: 'Dashboard',
                icon: 'fa fa-fw fa-clipboard',
                link: '/provider/dashboard',
            }),
            new NavSidebarRowItem({
                claimType: ClaimTypes.ScheduleTherapyCalendar,
                content: 'Documentation Calendar',
                // expanded: false,
                icon: 'fa fa-fw fa-calendar',
                link: '/provider/case-load/schedules/calendar',
            }),
            new NavSidebarRowItem({
                claimType: ClaimTypes.MyCaseload,
                content: 'My Caseload',
                icon: 'fa fa-fw fa-child',
                link: '/provider/case-load/students',
            }),
            this.providerAuthService.providerCanSignReferral()
                ? new NavSidebarRowItem({
                      claimType: ClaimTypes.MissingReferrals,
                      content: 'Create Referrals Not on Caseload',
                      icon: 'fa fa-fw fa-child',
                      link: '/provider/create-referrals-not-on-caseload',
                  })
                : undefined,
            new NavSidebarParentRowItem({
                children: [
                    new NavSidebarRowItem({
                        claimType: ClaimTypes.Encounters,
                        content: 'Treatment/Therapy',
                        rowComponent: NavStylerComponent,
                    }),
                    new NavSidebarRowItem({
                        claimType: ClaimTypes.Encounters,
                        claimValues: [ClaimValues.FullAccess],
                        content: 'Create Encounter',
                        icon: 'fa fa-fw icon-fixed-width',
                        link: '/provider/encounters/treatment-therapy',
                    }),
                    new NavSidebarRowItem({
                        claimType: ClaimTypes.Encounters,
                        claimValues: [ClaimValues.FullAccess],
                        content: 'Create Encounter (new)',
                        icon: 'fa fa-fw icon-fixed-width',
                        link: '/provider/encounters/treatment-therapy-v5',
                    }),
                    new NavSidebarRowItem({
                        claimType: ClaimTypes.EncountersReadyForYou,
                        content: 'Encounters Ready For You',
                        icon: 'fa fa-fw icon-fixed-width',
                        link: '/provider/case-load/schedules/list',
                    }),
                    new NavSidebarRowItem({
                        claimType: ClaimTypes.EncountersReadyForYou,
                        content: 'Schedule By Days',
                        icon: 'fa fa-fw icon-fixed-width',
                        link: '/provider/case-load/schedules/list-by-day',
                    }),
                    new NavSidebarRowItem({
                        claimType: ClaimTypes.Encounters,
                        content: 'Pending Treatment',
                        icon: 'fa fa-fw icon-fixed-width',
                        link: '/provider/encounters-pending-treatment-therapies',
                    }),
                    ...(this.providerAuthService.providerHasEvaluations()
                        ? [
                              new NavSidebarRowItem({
                                  claimType: ClaimTypes.CreateEvaluation,
                                  content: 'Evaluation',
                                  rowComponent: NavStylerComponent,
                              }),
                              new NavSidebarRowItem({
                                  claimType: ClaimTypes.CreateEvaluation,
                                  claimValues: [ClaimValues.FullAccess],
                                  content: 'Create Evaluation',
                                  icon: 'fa fa-fw icon-fixed-width',
                                  link: '/provider/encounters/evaluation',
                              }),
                              new NavSidebarRowItem({
                                  claimType: ClaimTypes.PendingEvaluation,
                                  content: 'Pending Evaluation',
                                  icon: 'fa fa-fw icon-fixed-width',
                                  link: '/provider/encounters-pending-evaluation',
                              }),
                          ]
                        : []),
                    new NavSidebarRowItem({
                        claimType: ClaimTypes.CreateNonMSPService,
                        content: 'Non-MSP',
                        rowComponent: NavStylerComponent,
                    }),
                    new NavSidebarRowItem({
                        claimType: ClaimTypes.CreateNonMSPService,
                        claimValues: [ClaimValues.FullAccess],
                        content: 'Create Non-MSP Service',
                        icon: 'fa fa-fw icon-fixed-width',
                        link: '/provider/encounters/add/non-msp',
                    }),
                ],
                claimType: ClaimTypes.Encounters,
                content: 'Create Encounters',
                expanded: false,
                icon: 'fa fa-fw fa-book',
            }),
            new NavSidebarRowItem({
                claimType: ClaimTypes.Revise,
                content: 'Revise Encounters',
                icon: 'fa fa-fw fa-book',
                link: '/provider/revise-encounters',
            }),
            new NavSidebarRowItem({
                claimType: ClaimTypes.Revise,
                content: 'Return Encounters',
                icon: 'fa fa-fw fa-book',
                link: '/provider/return-encounters',
            }),
            new NavSidebarParentRowItem({
                children: [
                    new NavSidebarRowItem({
                        claimType: ClaimTypes.ReviewEncounters,
                        content: 'Encounter Summaries',
                        icon: 'fa fa-fw fa-list',
                        link: '/provider/reports',
                    }),
                ],
                claimType: ClaimTypes.ReviewEncounters,
                content: 'Reports',
                expanded: false,
                icon: 'fa fa-fw fa-list',
            }),
            new NavSidebarRowItem({
                addClaimValues: [ClaimValues.FullAccess],
                claimType: ClaimTypes.CaseNotesDataBank,
                content: 'Case Notes Data Bank',
                icon: 'fa fa-fw fa-sticky-note',
                link: '/provider/case-load/case-notes-data-bank',
            }),
            this.providerAuthService.providerHasProgressReports()
                ? new NavSidebarRowItem({
                      claimType: ClaimTypes.Encounters,
                      content: 'Progress Reports',
                      icon: 'fa fa-fw fa-list',
                      link: '/provider/progress-reports',
                  })
                : undefined,
            this.providerAuthService.providerIsSupervisor()
                ? new NavSidebarRowItem({
                      claimType: ClaimTypes.ReviewEncounters,
                      content: 'Encounters Ready for Supervisor Signature',
                      icon: 'fa fa-fw fa-list',
                      link: '/provider/approve-assistant-encounters',
                  })
                : undefined,

            new NavSidebarRowItem({
                content: 'Sign Out',
                icon: 'fa fa-fw fa-sign-out',
                link: '/sign-out',
            }),
        ];
        const rows = removeNullNavItems(providerNavMenu);
        const navContainer = new NavSidebarContentContainer({
            header: new NavSidebarHeaderItem({ content: 'NAVIGATION' }),
            rows: rows,
        });
        return navContainer;
    }
}
