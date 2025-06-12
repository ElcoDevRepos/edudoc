import { SchoolDistrictRostersService } from '@admin/school-districts/services/school-district-rosters.service';
import { Component, Injector, Input } from '@angular/core';
import { ISchoolDistrictRoster } from '@model/interfaces/school-district-roster';
import { CommonDocumentsComponent } from '@mt-ng2/entity-components-documents';
import { IModalOptions } from '@mt-ng2/modal-module';
import { NotificationsService } from '@mt-ng2/notifications-module';
import { FileItem } from 'ng2-file-upload';
import { RosterPreviewEntityListConfig } from './roster-preview.entity-list-config';

export interface ISchoolDistrictRosterEntity {
    Id: number;
    Roster: ISchoolDistrictRoster;
}

@Component({
    selector: 'app-overridden-common-documents',
    template: `
        <ng-container>
            <div class="miles-card padded" *ngIf="!showUploadArea">
                <h4>{{ headerTitle }}</h4>
                <div *ngIf="documentArray.length">
                    <div class="row">
                        <div class="col-md-12">
                            <div class="table-responsive">
                                <table class="table scrollable-table">
                                    <thead>
                                        <tr class="no-pointer">
                                            <th>
                                                <b>Filename</b>
                                            </th>
                                            <th>
                                                <b>Date Uploaded</b>
                                            </th>
                                            <th>
                                                <b>Date Processed</b>
                                            </th>
                                            <th>
                                                <b>Date Error</b>
                                            </th>
                                            <!-- <th class="text-center" *ngIf="canEdit">
                                    <b>Delete</b>
                                </th> -->
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr *ngFor="let document of documentArray; let i = index" class="no-pointer">
                                            <td>
                                                <span
                                                    style="cursor:pointer"
                                                    class="fa fa-fw {{ document.Name | fileicon }}"
                                                    (click)="downloadDoc(i)"
                                                ></span>
                                                <span style="cursor:pointer" (click)="downloadDoc(i)"> {{ document.Name }}</span>
                                            </td>
                                            <td *ngIf="document && document.DateUpload">
                                                <span> {{ document.DateUpload | date : 'short' }}</span>
                                            </td>
                                            <td>
                                                {{ document.DateProcessed | date : 'short' }}
                                            </td>
                                            <td>
                                                {{ document.DateError | date : 'short' }}
                                            </td>
                                            <!-- <td  *ngIf="canEdit" class="text-center">
                                    <span
                                        class="fa fa-fw fa-lg fa-trash text-danger delete"
                                        [style.cursor]="canEdit ? 'pointer' : 'default'"
                                        (mtConfirm)="deleteDoc(i)"
                                    ></span>
                                </td> -->
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
                <i *ngIf="!documentArray.length">No Documents</i>
                <div *ngIf="canEdit" class="fab-wrap">
                    <button type="button" class="btn btn-primary btn-fab-md btn-fab-center" (click)="isEditing = true">
                        <span class="fa fa-plus"></span>
                    </button>
                </div>
            </div>
            <div [hidden]="!showUploadArea" class="miles-form padded">
                <mt-document
                    [allowedMimeType]="allowedMimeType"
                    (afterAddingFile)="previewDocument($event)"
                    (addingFileFailed)="onWhenAddingFileFailed($event)"
                ></mt-document>
                <br />
                <button type="button" class="btn btn-flat btn-default" (click)="cancel()">Cancel</button>
            </div>
        </ng-container>
        <!-- preview modal -->
        <mt-modal-wrapper *ngIf="showModal && paginatedPreviewRows" [options]="modalOptions" (cancelClick)="closePreview()">
            <h4>Roster Preview</h4>
            <mt-entity-list
                *ngIf="paginatedPreviewRows && paginatedPreviewRows.length"
                [entities]="paginatedPreviewRows"
                [total]="totalRows"
                [(currentPage)]="currentPage"
                (pageChanged)="getPreviewRows()"
                [entityListConfig]="listConfig"
            >
            </mt-entity-list>

            <br />
            <button type="button" class="btn btn-success" (click)="save()">Save Roster</button>
            <button type="button" class="btn btn-default" (click)="closePreview()">Discard</button>
        </mt-modal-wrapper>
    `,
})
export class OverriddenCommonDocumentsComponent extends CommonDocumentsComponent {
    private _showPlusBtn: boolean;
    @Input('canEdit')
    get canEdit(): boolean {
        return this._showPlusBtn;
    }
    set canEdit(value: boolean) {
        this._showPlusBtn = value;
    }

    @Input('headerTitle')
    headerTitle = 'Documents';
    @Input('schoolDistrictRosterService')
    set schoolDistrictRosterService(value: SchoolDistrictRostersService) {
        this.service = value;
    }

    get schoolDistrictRosterService(): SchoolDistrictRostersService {
        return this.service as SchoolDistrictRostersService;
    }

    tempFile: FileItem;
    modalOptions: IModalOptions = {
        customClass: {
            //content: 'roster-preview-list',
            title: 'text-center',
        },
        showCloseButton: true,
        showConfirmButton: false,
        width: '90%',
    };
    showModal = false;

    // List config
    allPreviewRows: ISchoolDistrictRosterEntity[] = [];
    paginatedPreviewRows: ISchoolDistrictRosterEntity[] = [];
    currentPage = 1;
    listConfig = new RosterPreviewEntityListConfig();
    totalRows: number;
    constructor(protected injectorOverride: Injector, protected notificationsService: NotificationsService) {
        super(injectorOverride);
    }

    getPreviewRows(): void {
        const startIndex = (this.currentPage - 1) * 10;
        this.paginatedPreviewRows = this.allPreviewRows.slice(startIndex, startIndex + 10);
    }

    previewDocument(file: FileItem): void {
        this.tempFile = file;
        this.schoolDistrictRosterService.previewDocument(this.parentId, file._file).subscribe(
            (preview) => {
                this.allPreviewRows = preview.map((roster, i) => {
                    return { Id: i, Roster: roster };
                });
                this.getPreviewRows();
                this.totalRows = preview.length;
                this.showModal = true;
            },
            (err) => {
                const message = err.originalError ? err.originalError.message : err.ExceptionMessage ? err.ExceptionMessage : err.Message;
                this.notificationsService.error(message as string);
            },
        );
    }

    save(): void {
        this.addDocument(this.tempFile);
        this.closePreview();
        this.getDocuments();
        this.notificationsService.success('Roster uploaded successfully.');
    }

    closePreview(): void {
        this.showModal = false;
        this.paginatedPreviewRows = [];
        this.allPreviewRows = [];
    }
}
