import { Component, Injector, Input } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { IMetaItem } from '@mt-ng2/base-service';
import { DynamicField, DynamicFieldType, DynamicFieldTypes, SelectInputTypes } from '@mt-ng2/dynamic-form';
import { CommonDocumentsComponent } from '@mt-ng2/entity-components-documents';
import { IModalOptions } from '@mt-ng2/modal-module';
import { NotificationsService } from '@mt-ng2/notifications-module';
import { ProviderCaseUploadService } from '@school-district-admin/school-districts/services/provider-case-uploads.service';
import { FileItem } from 'ng2-file-upload';
import { CaseUploadPreviewEntityListConfig } from './case-upload-preview.entity-list-config';
import { IProviderCaseUploadPreviewDTO } from '@model/interfaces/custom/provider-case-upload-preview.dto';

export interface IProviderCaseUploadEntity {
    Id: number;
    CaseUpload: IProviderCaseUploadPreviewDTO;
}

@Component({
    selector: 'app-overridden-common-documents-case-upload',
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
                    <button type="button" class="btn btn-primary btn-fab-md btn-fab-center" (click)="showAddDocument()">
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
            <h4>Caseload Upload Preview</h4>
            <mt-entity-list
                id="caseUploadPreview"
                *ngIf="paginatedPreviewRows && paginatedPreviewRows.length"
                [entities]="paginatedPreviewRows"
                [total]="totalRows"
                [(currentPage)]="currentPage"
                (pageChanged)="getPreviewRows()"
                [entityListConfig]="listConfig"
            >
            </mt-entity-list>

            <br />
            <button type="button" class="btn btn-success" (click)="save()">Save Case Upload</button>
            <button type="button" class="btn btn-default" (click)="closePreview()">Discard</button>
        </mt-modal-wrapper>
    `,
})
export class ProviderCaseUploadDocumentsComponent extends CommonDocumentsComponent {
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
    @Input('providerCaseUploadService')
    set providerCaseUploadService(value: ProviderCaseUploadService) {
        this.service = value;
    }

    get providerCaseUploadService(): ProviderCaseUploadService {
        return this.service as ProviderCaseUploadService;
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
    allPreviewRows: IProviderCaseUploadEntity[] = [];
    paginatedPreviewRows: IProviderCaseUploadEntity[] = [];
    currentPage = 1;
    listConfig = new CaseUploadPreviewEntityListConfig();
    totalRows: number;

    // provider field
    form: UntypedFormGroup;
    providerField: DynamicField;
    selectedProvider: number;
    providers: IMetaItem[] = [];

    constructor(protected injectorOverride: Injector, protected notificationsService: NotificationsService, private fb: UntypedFormBuilder) {
        super(injectorOverride);
    }

    getPreviewRows(): void {
        const startIndex = (this.currentPage - 1) * 10;
        this.paginatedPreviewRows = this.allPreviewRows.slice(startIndex, startIndex + 10);
    }

    previewDocument(file: FileItem): void {
        this.tempFile = file;
        this.providerCaseUploadService.previewDocument(this.parentId, file._file).subscribe((preview) => {
            this.allPreviewRows = preview.map((caseUpload, i) => {
                return { Id: i, CaseUpload: caseUpload };
            });
            this.getPreviewRows();
            this.totalRows = preview.length;
            this.showModal = true;
        });
    }

    save(): void {
        this.addDocument(this.tempFile);
        this.closePreview();
        this.getDocuments();
        this.notificationsService.success('Case uploaded successfully.');
    }

    closePreview(): void {
        this.showModal = false;
        this.paginatedPreviewRows = [];
        this.allPreviewRows = [];
        this.selectedProvider = null;
        this.providerCaseUploadService.providerId = null;
    }

    setProviderField(): void {
        this.providerField = new DynamicField({
            formGroup: null,
            label: 'Provider',
            name: 'Provider',
            options: this.providers,
            type: new DynamicFieldType({
                fieldType: DynamicFieldTypes.Select,
                inputType: SelectInputTypes.Dropdown,
            }),
            // eslint-disable-next-line @typescript-eslint/unbound-method
            validation: [Validators.required],
            validators: { required: true },
            value: 0,
        });
    }

    showAddDocument(): void {
        this.isEditing = true;
        const id = +this.route.snapshot.paramMap.get('districtId');
        this.providerCaseUploadService.getProviderSelectOptions(id).subscribe((resp) => {
            this.providers = resp;
            this.setProviderField();
            this.form = this.fb.group({
                Provider: this.fb.group({}),
            });
        });
    }

    providerChanged(evt: number): void {
        this.selectedProvider = evt;
        this.providerCaseUploadService.providerId = evt;
    }
}
