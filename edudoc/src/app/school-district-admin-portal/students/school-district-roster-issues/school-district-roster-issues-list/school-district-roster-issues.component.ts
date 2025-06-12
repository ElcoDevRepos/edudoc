import { Component, OnInit } from '@angular/core';
import { ClaimsService, ClaimValues } from '@mt-ng2/auth-module';
import { IColumnSortedEvent, IItemDeletedEvent, IItemSelectedEvent, SortDirection } from '@mt-ng2/entity-list-module';

import { Router } from '@angular/router';
import { entityListModuleConfig } from '@common/shared.module';
import { ClaimTypes } from '@model/ClaimTypes';
import { ISchoolDistrictRoster } from '@model/interfaces/school-district-roster';
import { IEntitySearchParams, SearchParams } from '@mt-ng2/common-classes';
import { IModalOptions } from '@mt-ng2/modal-module';
import { NotificationsService } from '@mt-ng2/notifications-module';
import { map, Observable } from 'rxjs';
import { SchoolDistrictRosterIssuesService } from '../school-district-roster-issues.service';
import { SchoolDistrictRosterIssuesEntityListConfig } from './school-district-roster-issues.entity-list-config';

@Component({
    selector: 'app-school-district-roster-issues',
    templateUrl: './school-district-roster-issues.component.html',
})
export class SchoolDistrictRosterIssuesComponent implements OnInit {
    currentPage = 1;
    itemsPerPage = entityListModuleConfig.itemsPerPage;
    query = '';
    total: number;
    rosters: ISchoolDistrictRoster[] = [];
    entityListConfig = new SchoolDistrictRosterIssuesEntityListConfig(() => this.getDataForExport());
    order = this.entityListConfig.getDefaultSortProperty();
    orderDirection: string = this.entityListConfig.getDefaultSortDirection();

    // Modal Parameters
    showModal = false;
    modalOptions: IModalOptions = {
        customClass: {
            title: 'text-center',
        },
        showCancelButton: true,
        showCloseButton: false,
        showConfirmButton: true,
        width: '50%',
    };

    canEditRoster = false;

    constructor(
        private schoolDistrictRosterIssuesService: SchoolDistrictRosterIssuesService,
        private claimsService: ClaimsService,
        private router: Router,
        private notificationService: NotificationsService,
    ) {}

    ngOnInit(): void {
        this.canEditRoster = this.claimsService.hasClaim(ClaimTypes.Students, [ClaimValues.FullAccess]);
        this.getSchoolDistrictRosters();
    }

    getDataForExport(): Observable<ISchoolDistrictRoster[]> {
        return this.getSchoolDistrictRostersCall({ skip: undefined, take: undefined }).pipe(map((answer) => answer.items));
    }

    getSchoolDistrictRosters(): void {
        this.getSchoolDistrictRostersCall({
            skip: (this.currentPage - 1) * entityListModuleConfig.itemsPerPage,
            take: entityListModuleConfig.itemsPerPage,
        }).subscribe((answer) => {
            this.rosters = answer.items;
            this.total = answer.total;
        });
    }
    getSchoolDistrictRostersCall(skipAndTake: { skip?: number; take?: number }): Observable<{ items: ISchoolDistrictRoster[]; total: number }> {
        const searchEntity: IEntitySearchParams = {
            order: this.order,
            orderDirection: this.orderDirection,
            query: '',
            skip: skipAndTake.skip,
            take: skipAndTake.take,
        };
        const searchParams = new SearchParams(searchEntity);

        return this.schoolDistrictRosterIssuesService.get(searchParams).pipe(
            map((answer) => ({
                items: answer.body,
                total: +answer.headers.get('X-List-Count'),
            })),
        );
    }

    rosterSelected(event: IItemSelectedEvent): void {
        void this.router.navigate([`school-district-admin/students/issues`, event.entity.Id], {
            queryParams: { order: this.order, orderDirection: this.orderDirection },
        });
    }

    archiveRoster(evt: IItemDeletedEvent): void {
        this.schoolDistrictRosterIssuesService.delete(evt.entity.Id as number).subscribe(() => {
            this.notificationService.success('Roster Archived Successfully');
            this.getSchoolDistrictRosters();
        });
    }

    reverseRosterUpload(): void {
        const searchEntity: IEntitySearchParams = {
            order: this.order,
            orderDirection: this.orderDirection,
            query: '',
            skip: null,
            take: null,
        };
        const searchParams = new SearchParams(searchEntity);

        this.schoolDistrictRosterIssuesService.get(searchParams).subscribe((answer) => {
            this.rosters = answer.body;
            this.total = +answer.headers.get('X-List-Count');
            this.archiveRosters();
        });
    }

    archiveRosters(): void {
        this.schoolDistrictRosterIssuesService.removeAllIssues().subscribe(() => {
            this.notificationService.success(`Rosters Archived Successfully`);
            this.getSchoolDistrictRosters();
        });
    }

    toggleModal(): void {
        this.showModal = !this.showModal;
    }

    columnSorted(event: IColumnSortedEvent): void {
        this.order = event.column.sort.sortProperty;
        this.orderDirection = event.column.sort.direction === SortDirection.Desc ? 'desc' : 'asc';
        this.getSchoolDistrictRosters();
    }
}
