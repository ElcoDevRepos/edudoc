import { RosterValidationService } from '@admin/roster-validations/services/roster-validation.service';
import { ChangeDetectorRef, Component, OnDestroy } from '@angular/core';
import { IRosterValidationFile } from '@model/interfaces/roster-validation-file';
import { IEntity } from '@mt-ng2/base-service';
import { IEntityListComponentMembers, IEntityListDynamicCellComponent } from '@mt-ng2/entity-list-module';
import { IModalOptions } from '@mt-ng2/modal-module';
import { NotificationsService } from '@mt-ng2/notifications-module';
import { FileItem } from 'ng2-file-upload';

@Component({
    styles: [],
    templateUrl: './response-upload-cell.component.html',
})
export class ResponseUploadCellDynamicCellComponent implements IEntityListDynamicCellComponent, OnDestroy {
    entityListComponentMembers: IEntityListComponentMembers;
    set entity(value: IEntity) {
        this.rosterValidationFile = value as IRosterValidationFile;
    }

    modalOptions: IModalOptions = {
        showCancelButton: false,
        showConfirmButton: false,
        width: '50%',
    };

    rosterValidationFile: IRosterValidationFile;

    fileData: FormData;
    hasFileDataError = false;
    showUploadModal = false;
    allowedMimeType: string[] = [
        '',
        'text/plain',
        'application/EDI-X12',
    ];
    maxFileSize = 20 * 1024 * 1024;

    get responseUploaded(): boolean {
        return this.rosterValidationFile.RosterValidationResponseFiles && this.rosterValidationFile.RosterValidationResponseFiles.length > 0;
    }

    get uploadedDate(): Date {
        return this.rosterValidationFile.RosterValidationResponseFiles[0].DateUploaded;
    }

    constructor(
        private notificationsService: NotificationsService,
        private cdr: ChangeDetectorRef,
        private rosterValidationService: RosterValidationService,
    ) {
    }

    archiveRule(event: Event): void {
        event.stopPropagation();
        this.toggleModal();
    }

    toggleModal(): void {
        this.showUploadModal = !this.showUploadModal;
        this.cdr.detectChanges();
    }

    onWhenAddingFileFailed(error: string): void {
        this.notificationsService.error(error);
    }

    onUploadFile(file: FileItem): void {
        this.hasFileDataError = false;
        this.fileData = new FormData();
        this.fileData.append('file', file._file, file._file.name);
    }

    uploadFile(): void {
        this.rosterValidationService.upload(this.rosterValidationFile.Id, this.fileData).subscribe((responseFile) => {
            this.rosterValidationFile.RosterValidationResponseFiles.push(responseFile);
            this.notificationsService.success('Response file uploaded successfully!');
            this.toggleModal();
        });
    }

    ngOnDestroy(): void {
        this.cdr.detach();
    }
}
