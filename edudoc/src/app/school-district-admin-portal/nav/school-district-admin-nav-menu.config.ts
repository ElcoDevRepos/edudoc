

import { ClaimTypes } from '@model/ClaimTypes';
import { ClaimValues } from '@mt-ng2/auth-module';
import { NavSidebarRowItem, NavSidebarParentRowItem } from '@mt-ng2/nav-module';

// tslint:disable:object-literal-sort-keys
export const schoolDistrictAdminNavMenu: (NavSidebarRowItem | NavSidebarParentRowItem)[] = [
    new NavSidebarRowItem({
        content: 'My Profile',
        icon: 'fa fa-fw fa-address-card',
        link: '/school-district-admin/my-profile',
    }),
    new NavSidebarRowItem({
        content: 'Dashboard',
        icon: 'fa fa-fw fa-clipboard',
        link: '/school-district-admin/home',
    }),
    new NavSidebarParentRowItem({
        children: [
            new NavSidebarRowItem({
                addLink: '/school-district-admin/students-list/add',
                addClaimType: ClaimTypes.ReviewStudent,
                addClaimValues: [ClaimValues.FullAccess],
                claimType: ClaimTypes.ReviewStudent,
                content: 'Review Students',
                icon: 'fa fa-fw fa-child',
                link: '/school-district-admin/students-list',
            }),
            new NavSidebarRowItem({
                claimType: ClaimTypes.Students,
                content: 'Missing Student Addresses',
                icon: 'fa fa-fw fa-child',
                link: '/school-district-admin/student-missing-addresses',
            }),
            new NavSidebarRowItem({
                claimType: ClaimTypes.ReviewParentConsent,
                content: 'Review Parental Consents',
                icon: 'fa fa-fw fa-book',
                link: '/school-district-admin/student-parental-consents',
            }),
        ],
        content: 'Students',
        expanded: false,
        icon: 'fa fa-fw fa-child',
    }),
    new NavSidebarRowItem({
        claimType: ClaimTypes.RosterIssues,
        content: 'Roster Issues',
        icon: 'fa fa-fw fa-child',
        link: '/school-district-admin/students/issues',
    }),
    new NavSidebarRowItem({
        claimType: ClaimTypes.RosterIssues,
        content: 'Case Upload Issues',
        icon: 'fa fa-fw fa-child',
        link: '/school-district-admin/students/case-upload-issues',
    }),
    new NavSidebarRowItem({
        claimType: ClaimTypes.MergeStudent,
        content: 'Merge Students',
        icon: 'fa fa-fw fa-child',
        link: '/school-district-admin/students/merge',
    }),
    new NavSidebarParentRowItem({
        children: [
            new NavSidebarRowItem({
                claimType: ClaimTypes.DistrictActivitySummaryByServiceArea,
                content: 'Activity Summary',
                icon: 'fa fa-fw fa-list',
                link: '/school-district-admin/activity-summary',
            }),
            new NavSidebarRowItem({
                claimType: ClaimTypes.EncounterReportingByStudent,
                content: 'Encounters By Student',
                icon: 'fa fa-fw fa-list',
                link: '/school-district-admin/encounters-by-student',
            }),
            new NavSidebarRowItem({
                claimType: ClaimTypes.EncounterReportingByTherapist,
                content: 'Encounters By Therapist',
                icon: 'fa fa-fw fa-list',
                link: '/school-district-admin/encounters-by-therapist',
            }),
            new NavSidebarRowItem({
                claimType: ClaimTypes.DistrictActivitySummaryByServiceArea,
                content: '90-Day MSP Progress Reports',
                icon: 'fa fa-fw fa-list',
                link: '/school-district-admin/progress-reports',
            }),
            new NavSidebarRowItem({
                claimType: ClaimTypes.EncounterReportingByStudent,
                content: 'Encounters AUP Audit',
                icon: 'fa fa-fw fa-list',
                link: '/school-district-admin/encounters-aup-audit',
            }),
            new NavSidebarRowItem({
                claimType: ClaimTypes.EncounterReportingByStudent,
                content: 'District Management Report',
                icon: 'fa fa-fw fa-list',
                link: '/school-district-admin/district-management-report',
            }),
            new NavSidebarRowItem({
                claimType: ClaimTypes.EncounterReportingByStudent,
                content: 'Encounter Report',
                icon: 'fa fa-fw fa-list',
                link: '/school-district-admin/encounter-report',
            }),
            new NavSidebarRowItem({
                claimType: ClaimTypes.DistrictActivitySummaryByServiceArea,
                content: 'Completed Activity Report',
                icon: 'fa fa-fw fa-list',
                link: '/school-district-admin/completed-activity-report'
            })
        ],
        claimType: ClaimTypes.DistrictActivitySummaryByServiceArea,
        content: 'Reports',
        expanded: false,
        icon: 'fa fa-fw fa-list',
    }),
    new NavSidebarRowItem({
        content: 'Sign Out',
        icon: 'fa fa-fw fa-sign-out',
        link: '/sign-out',
    }),
];
// tslint:enable:object-literal-sort-keys
