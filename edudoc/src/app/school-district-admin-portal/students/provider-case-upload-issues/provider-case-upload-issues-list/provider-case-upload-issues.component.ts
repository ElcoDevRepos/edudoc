import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { map, Observable } from 'rxjs';

import { ClaimsService, ClaimValues } from '@mt-ng2/auth-module';
import { ExtraSearchParams, IEntitySearchParams, SearchParams } from '@mt-ng2/common-classes';
import { IColumnSortedEvent, IItemDeletedEvent, IItemSelectedEvent, SortDirection } from '@mt-ng2/entity-list-module';

import { entityListModuleConfig } from '@common/shared.module';
import { ClaimTypes } from '@model/ClaimTypes';
import { IProviderCaseUpload } from '@model/interfaces/provider-case-upload';
import { IModalOptions } from '@mt-ng2/modal-module';
import { NotificationsService } from '@mt-ng2/notifications-module';
import { ProviderCaseUploadIssuesService } from '../provider-case-upload-issues.service';
import { ProviderCaseUploadsEntityListConfig } from './provider-case-upload-issues.entity-list-config';

@Component({
    selector: 'app-provider-case-uploads',
    templateUrl: './provider-case-upload-issues.component.html',
})
export class ProviderCaseUploadIssuesComponent implements OnInit {
    providerCaseUploads: IProviderCaseUpload[];
    currentPage = 1;
    itemsPerPage = entityListModuleConfig.itemsPerPage;
    query = '';
    total: number;
    entityListConfig = new ProviderCaseUploadsEntityListConfig(() => this.getProviderCaseUploadsForExport());
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

    canAddProviderCaseUpload = false;

    constructor(
        private providerCaseUploadService: ProviderCaseUploadIssuesService,
        private claimsService: ClaimsService,
        private router: Router,
        private notificationService: NotificationsService,
    ) {}

    ngOnInit(): void {
        this.canAddProviderCaseUpload = this.claimsService.hasClaim(ClaimTypes.Students, [ClaimValues.FullAccess]);
        this.getProviderCaseUploads();
    }

    getProviderCaseUploadsCall(skipAndTake: { skip?: number; take?: number }): Observable<{ items: IProviderCaseUpload[]; total: number }> {
        const search = this.query;
        const _extraSearchParams: ExtraSearchParams[] = [];

        const searchEntity: IEntitySearchParams = {
            extraParams: _extraSearchParams,
            order: this.order,
            orderDirection: this.orderDirection,
            query: search && search.length > 0 ? search : '',
            skip: skipAndTake.skip,
            take: skipAndTake.take,
        };

        const searchparams = new SearchParams(searchEntity);
        return this.providerCaseUploadService.get(searchparams).pipe(
            map((answer) => ({
                items: answer.body,
                total: +answer.headers.get('X-List-Count'),
            })),
        );
    }

    getProviderCaseUploads(): void {
        this.getProviderCaseUploadsCall({
            skip: (this.currentPage - 1) * this.itemsPerPage,
            take: this.itemsPerPage,
        }).subscribe((answer) => {
            this.providerCaseUploads = answer.items;
            this.total = answer.total;
        });
    }

    getProviderCaseUploadsForExport(): Observable<IProviderCaseUpload[]> {
        return this.getProviderCaseUploadsCall({ skip: undefined, take: undefined }).pipe(map((a) => a.items));
    }

    search(query: string): void {
        this.currentPage = 1;
        this.query = query;
        this.getProviderCaseUploads();
    }

    filterSelectionChanged(): void {
        this.currentPage = 1;
        this.getProviderCaseUploads();
    }

    columnSorted(event: IColumnSortedEvent): void {
        this.order = event.column.sort.sortProperty;
        this.orderDirection = event.column.sort.direction === SortDirection.Desc ? 'desc' : 'asc';
        this.getProviderCaseUploads();
    }

    providerCaseUploadSelected(event: IItemSelectedEvent): void {
        void this.router.navigate(['school-district-admin/students/case-upload-issues', event.entity.Id]);
    }

    archive(evt: IItemDeletedEvent): void {
        const upload = this.providerCaseUploads.find((pcu) => pcu.Id === evt.entity.Id);
        upload.Archived = true;
        this.providerCaseUploadService.update(upload).subscribe(() => {
            this.notificationService.success('Case Upload Archived Successfully');
            this.getProviderCaseUploads();
        });
    }

    reverseCaseUpload(): void {
        const searchEntity: IEntitySearchParams = {
            order: this.order,
            orderDirection: this.orderDirection,
            query: '',
            skip: null,
            take: null,
        };
        const searchParams = new SearchParams(searchEntity);

        this.providerCaseUploadService.get(searchParams).subscribe((answer) => {
            this.providerCaseUploads = answer.body;
            this.total = +answer.headers.get('X-List-Count');
            this.archiveCaseUploads();
        });
    }

    archiveCaseUploads(): void {
        this.providerCaseUploadService.removeAllIssues().subscribe(() => {
            this.notificationService.success(`Case Uploads Archived Successfully`);
            this.getProviderCaseUploads();
        });
    }

    toggleModal(): void {
        this.showModal = !this.showModal;
    }
}
