import { HttpResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, ElementRef, OnInit } from '@angular/core';
import { saveAs } from 'file-saver';
import { Observable, finalize } from 'rxjs';

import { ExtraSearchParams, IEntitySearchParams, SearchParams } from '@mt-ng2/common-classes';
import { IColumnSortedEvent, IItemSelectedEvent, SortDirection } from '@mt-ng2/entity-list-module';

import { entityListModuleConfig } from '@common/shared.module';
import { IBillingFile } from '@model/interfaces/billing-file';
import { IModalOptions } from '@mt-ng2/modal-module';
import { NotificationsService } from '@mt-ng2/notifications-module';
import { ISearchbarControlAPI } from '@mt-ng2/searchbar-control';
import { BillingScheduleService } from '../../services/billing-schedule.service';
import { BillingFilesEntityListConfig } from './billing-files.entity-list-config';
import { UploadQueue } from '@common/file-uploader/file-uploader.component';
import { IBillingResponseFile } from '@model/interfaces/billing-response-file';
import { BillingResponseFilesEntityListConfig } from './billing-response-files.entity-list-config';

@Component({
    selector: 'app-billing-files',
    templateUrl: './billing-files.component.html',
})
export class BillingFilesComponent implements OnInit {
    billingFiles: IBillingFile[];
    currentPage = 1;
    itemsPerPage = entityListModuleConfig.itemsPerPage;
    query = '';
    total: number;
    entityListConfig = new BillingFilesEntityListConfig();
    order = this.entityListConfig.getDefaultSortProperty();
    orderDirection: string = SortDirection.Desc;

    searchControlApi: ISearchbarControlAPI;

    modalOptions: IModalOptions = {
        showCancelButton: false,
        showConfirmButton: false,
        width: '50%',
    };

    doubleClickIsDisabled = false;

    fileData: FormData;
    hasFileDataError = false;
    showResponseModal = false;
    allowedMimeType: string[] = ['', 'text/plain', 'application/EDI-X12'];
    maxFileSizeMb = 72;
    fileQueue: UploadQueue;

    showUploadFileHistoryModal = false;
    billingResponseFiles: IBillingResponseFile[];
    billingResponseFilesEntityListConfig = new BillingResponseFilesEntityListConfig();
    billingResponseFilesCurrentPage = 1;
    billingResponseFilesItemsPerPage = 10;
    billingResponseFilesTotal: number;
    billingResponseFilesOrder = 'DateUploaded';
    billingResponseFilesOrderDirection: string = SortDirection.Desc;


    constructor(
        private billingScheduleService: BillingScheduleService,
        private notificationsService: NotificationsService,
        private cdr: ChangeDetectorRef,
    ) {}

    ngOnInit(): void {
        this.getBillingFiles();
    }

    getBillingFilesCall(): Observable<HttpResponse<IBillingFile[]>> {
        const search = this.query;
        const _extraSearchParams: ExtraSearchParams[] = [];

        const searchEntity: IEntitySearchParams = {
            extraParams: _extraSearchParams,
            order: this.order,
            orderDirection: this.orderDirection,
            query: search && search.length > 0 ? search : '',
            skip: (this.currentPage - 1) * this.itemsPerPage,
            take: this.itemsPerPage,
        };

        const searchparams = new SearchParams(searchEntity);
        return this.billingScheduleService.getBillingFiles(searchparams);
    }

    getBillingFiles(): void {
        this.getBillingFilesCall().subscribe((answer) => {
            this.billingFiles = answer.body;
            this.total = +answer.headers.get('X-List-Count');
        });
    }

    search(query: string): void {
        this.currentPage = 1;
        this.query = query;
        this.getBillingFiles();
    }

    filterSelectionChanged(): void {
        this.currentPage = 1;
        this.getBillingFiles();
    }

    columnSorted(event: IColumnSortedEvent): void {
        this.order = event.column.sort.sortProperty;
        this.orderDirection = event.column.sort.direction === SortDirection.Desc ? 'desc' : 'asc';
        this.getBillingFiles();
    }

    downloadFile(event: IItemSelectedEvent): void {
        const entity = event.entity as IBillingFile;

        this.billingScheduleService.download(entity.Id).subscribe((resultBlob: Blob) => {
            const fileContents = new Blob([resultBlob], {
                type: 'application/octet-stream',
            });
            saveAs(fileContents, `${entity.Name}.txt`);
        });
    }

    searchControlReady(searchControlApi: ISearchbarControlAPI): void {
        this.searchControlApi = searchControlApi;
        void new Promise((resolve) => {
            const nativeElement = {
                placeholder: 'Begin typing...',
            };
            resolve(new ElementRef<any>(nativeElement));
        });
    }

    toggleResponseModal(): void {
        void Promise.resolve().then(() => {
            this.showResponseModal = !this.showResponseModal;
        });
    }

    onWhenAddingFileFailed(error: string): void {
        this.notificationsService.error(error);
    }

    onUploadQueueCreate(queue: UploadQueue): void {
        this.fileQueue = queue;
    }

    uploadResponse(): void {
        this.fileData = new FormData();
        for (const file of this.fileQueue.filesToUpload) {
            this.fileData.append('file', file._file, file._file.name);
        }
        this.billingScheduleService.upload(this.fileData).subscribe(
            () => {
                this.notificationsService.success('Response file uploaded successfully!');
                this.toggleResponseModal();
            },
            (error) => {
                const errorMessage = error.error?.ErrorMessage;
                if (typeof errorMessage === 'string') {
                    this.notificationsService.error(errorMessage);
                } else {
                    this.notificationsService.error('Something went wrong.');
                }
            },
        );
    }

    toggleUploadFileHistoryModal() {
        this.showUploadFileHistoryModal = !this.showUploadFileHistoryModal;
        if (this.showUploadFileHistoryModal) {
            this.getBillingResponseFiles();
        }
    }

    getBillingResponseFilesCall(): Observable<HttpResponse<IBillingResponseFile[]>> {
        const searchEntity: IEntitySearchParams = {
            order: this.billingResponseFilesOrder,
            orderDirection: this.billingResponseFilesOrderDirection,
            skip: (this.billingResponseFilesCurrentPage - 1) * this.billingResponseFilesItemsPerPage,
            take: this.billingResponseFilesItemsPerPage,
            query: ''
        };

        const searchparams = new SearchParams(searchEntity);
        return this.billingScheduleService.getBillingResponseFilesHistory(searchparams);
    }

    getBillingResponseFiles(): void {
        this.getBillingResponseFilesCall().subscribe((answer) => {
            this.billingResponseFiles = answer.body;
            this.billingResponseFilesTotal = +answer.headers.get('X-List-Count');
        });
    }
}
