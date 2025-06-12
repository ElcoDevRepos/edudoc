import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NotificationsService } from '@mt-ng2/notifications-module';
import { FileItem, FileLikeObject, FileUploader } from 'ng2-file-upload';

type FileUploaderType = 'any' | 'pdf' | 'photo' | 'custom';

export class UploadQueue {
    _queue: QueuedFile[] = [];
    get isEmpty(): boolean {
        return this._queue.length === 0;
    }
    get all(): QueuedFile[] {
        return this._queue;
    }
    get filesToUpload(): FileItem[] {
        return this._queue.map((qf) => qf.item);
    }

    add(file: FileItem): void {
        this._queue.push(new QueuedFile(file));
    }

    remove(index: number): void {
        const file = this._queue.splice(index, 1);
        file.pop()?.remove();
    }
}

export class QueuedFile {
    private _file: FileItem;
    get item(): FileItem {
        return this._file;
    }

    constructor(file: FileItem) {
        this._file = file;
    }

    remove(): void {
        this._file.remove();
    }
}

const PhotoMimeTypes = ['image/png', 'image/jpg', 'image/jpeg', 'image/gif'];
const PdfMimeTypes = ['application/pdf'];

@Component({
    selector: 'file-uploader',
    styles: [
        `
            .drop-zone {
                border: 5px dashed lightgray;
                text-align: center;
            }
            .drop-zone-hover {
                border: 5px dashed green;
                text-align: center;
            }
            .upload-queue {
                width: 100%;
            }
        `,
    ],
    templateUrl: './file-uploader.component.html',
})
export class FileUploaderComponent implements OnInit {
    @Input() showHeader = true;
    @Input() type: FileUploaderType = 'custom';
    @Input() multiUpload: boolean;
    @Input() maxSizeMb = 1;
    @Input() allowedMimeTypes: string[];
    @Output() onCreate = new EventEmitter<UploadQueue>();

    @Input()
    header: string;
    dropZoneHovered: boolean;

    uploader: FileUploader;
    maxFileSize: number;

    uploadQueue: UploadQueue;

    constructor(private notificationsService: NotificationsService) {}

    ngOnInit(): void {
        this.maxFileSize = this.maxSizeMb * 1024 * 1024;

        switch (this.type) {
            case 'any':
                this.header ??= 'Upload Files';
                this.allowedMimeTypes ??= [...PhotoMimeTypes, ...PdfMimeTypes];
                break;
            case 'pdf':
                this.header ??= 'Upload PDFs';
                this.allowedMimeTypes ??= [...PdfMimeTypes];
                break;
            case 'photo':
                this.header ??= 'Upload Photos';
                this.allowedMimeTypes ??= [...PhotoMimeTypes];
                break;
            case 'custom':
                this.header ??= 'Upload Files';
                break;
            default:
                this.allowedMimeTypes = [];
        }

        this.uploader = new FileUploader({
            allowedMimeType: this.allowedMimeTypes,
            maxFileSize: this.maxFileSize,
            url: '',
        });
        this.uploader.onWhenAddingFileFailed = (item, filter) => this.addingFileFailed(item, filter);
        this.uploader.onAfterAddingFile = (item) => this.afterAddingFile(item);
        this.uploadQueue = new UploadQueue();
        this.onCreate.emit(this.uploadQueue);
    }

    afterAddingFile(file: FileItem): void {
        if (this.multiUpload !== true) this.uploadQueue.remove(0);
        this.uploadQueue.add(file);
    }

    addingFileFailed(item: FileLikeObject, filter: any): void {
        switch (filter.name) {
            case 'fileSize': {
                this.notificationsService.error(`Maximum upload size exceeded (${item.size as string} of ${this.maxFileSize} allowed)`);
                break;
            }
            case 'mimeType': {
                const allowedTypes = this.allowedMimeTypes.join(', ');
                this.notificationsService.error(`Type "${item.type}" is not allowed. Allowed types: "${allowedTypes}"`);
                break;
            }
            default: {
                this.notificationsService.error(`Unknown error (filter is ${filter.name as string})`);
            }
        }
    }
    printSelectedFile(event): void {
    //
    }
}
