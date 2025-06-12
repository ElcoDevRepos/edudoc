import { Component, Input, OnInit } from '@angular/core';
import { UserTypesEnum } from '@model/enums/user-types.enum';
import { IUserDetailCustomOptions } from '@model/interfaces/custom/user-detail-custom-options';
import { AuthService } from '@mt-ng2/auth-module';
import { IDocument } from '@mt-ng2/entity-components-documents';
import { IModalOptions } from '@mt-ng2/modal-module';
import { NotificationsService } from '@mt-ng2/notifications-module';
import { MerService } from '@school-district-admin/school-districts/services/mer.service';
import { saveAs } from 'file-saver';
import { FileItem } from 'ng2-file-upload';

@Component({
    selector: 'app-overridden-common-documents-mer',
    template: `
        <ng-container>
            <div class="miles-card padded" *ngIf="!showUploadArea">
                <h4 class="heading-with-button">
                    {{ headerTitle }}
                    <button class="btn btn-sm btn-primary" *ngIf="canEdit && isDistrictAdmin" type="button" (click)="showUploadArea = true">
                        Upload MER File
                    </button>
                    <button class="btn btn-sm btn-danger" *ngIf="canEdit && isHPCAdmin && merFile" type="button" (mtConfirm)="deleteFile()" [mtConfirmOptions]="archiveConfirm">
                        Delete MER File
                    </button>
                </h4>
                <div *ngIf="merFile">
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
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr *ngFor="let document of [merFile]" class="no-pointer">
                                            <td>
                                                <span
                                                    style="cursor:pointer"
                                                    class="fa fa-fw {{ document.Name | fileicon }}"
                                                    (click)="downloadMerFile()"
                                                ></span>
                                                <span style="cursor:pointer" (click)="downloadMerFile()"> {{ document.Name }}</span>
                                            </td>
                                            <td *ngIf="document && document.DateUpload">
                                                <span> {{ document.DateUpload | date: 'short' }}</span>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
                <i *ngIf="!merFile">No Document Uploaded Yet</i>

            </div>
            <div [hidden]="!showUploadArea" class="miles-form padded">
                <mt-document
                    [allowedMimeType]="allowedMimeType"
                    (afterAddingFile)="save($event)"
                    (addingFileFailed)="onWhenAddingFileFailed($event)"
                ></mt-document>
                <br />
                <button type="button" class="btn btn-flat btn-default" (click)="cancel()">
                    Cancel
                </button>
            </div>
        </ng-container>
    `,
})
export class MerDocumentsComponent  implements OnInit {
    @Input('canEdit') canEdit = false;
    @Input('districtId') districtId: number;
    headerTitle = 'MER FILE';
    merFile: IDocument;
    isDistrictAdmin = false;
    isHPCAdmin = false;
    showUploadArea = false;
    allowedMimeType = ['application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'];

    // Archive confirmation
    archiveConfirm: IModalOptions = {
        cancelButtonText: 'Cancel',
        confirmButtonText: 'Yes, I am sure!',
        denyButtonText: '',
        icon: 'warning',
        showCancelButton: true,
        showConfirmButton: true,
        showDenyButton: false,
        text: `Are you sure you want to delete the MER File?`,
        title: 'Delete File',
    };

    constructor(
        protected notificationsService: NotificationsService,
        private authService: AuthService,
        private merService: MerService,
    ) {}

    ngOnInit(): void {
        this.getDocument();
        const customOptions = this.authService.currentUser.getValue().CustomOptions as IUserDetailCustomOptions;
        this.isDistrictAdmin = customOptions.UserTypeId === UserTypesEnum.SchoolDistrictAdmin;
        this.isHPCAdmin = customOptions.UserTypeId === UserTypesEnum.Admin;
    }

    save(file: FileItem): void {
        this.merService.saveDocument(this.districtId, file._file).subscribe(() => this.getDocument());
    }

    deleteFile(): void {
        this.merService.deleteDocument(this.districtId, this.merFile.Id).subscribe(() => this.merFile = null);
    }

    cancel(): void {
        this.showUploadArea = false;
    }

    downloadMerFile(): void {
        this.merService.getDocument(this.districtId, this.merFile.Id).subscribe((resultBlob: Blob) => {
            const fileContents = new Blob([resultBlob], {
                type: 'application/octet-stream',
            });
            saveAs(fileContents, this.merFile.Name);
        });
    }

    getDocument(): void {
        this.merService.getDocumentByDistrictId(this.districtId).subscribe((answer) => {
            this.merFile = answer;
            this.showUploadArea = false;
        });
    }

    onWhenAddingFileFailed(error: string): void {
        this.notificationsService.error(error);
    }

}
