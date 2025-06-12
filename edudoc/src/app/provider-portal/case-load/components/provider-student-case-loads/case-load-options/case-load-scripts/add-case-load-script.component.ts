import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { ServiceCodeAcronymEnums } from '@model/enums/service-code.enum';
import { ICaseLoadScript } from '@model/interfaces/case-load-script';
import { IEncounterLocation } from '@model/interfaces/encounter-location';
import { AuthService } from '@mt-ng2/auth-module';
import { markAllFormFieldsAsTouched } from '@mt-ng2/common-functions';
import { DynamicField, DynamicLabel } from '@mt-ng2/dynamic-form';
import { IDocument } from '@mt-ng2/entity-components-documents';
import { NotificationsService } from '@mt-ng2/notifications-module';
import { CaseLoadScriptsService } from '@provider/case-load/services/case-load-scripts.service';
import { ProviderPortalAuthService } from '@provider/provider-portal-auth.service';
import { FileItem } from 'ng2-file-upload';
import { finalize } from 'rxjs/internal/operators/finalize';
import { CaseLoadScriptDynamicConfig } from './case-load-script.dynamic-config';
import { CaseLoadService } from '@provider/case-load/services/case-load.service';
import { IDiagnosisCode } from '@model/interfaces/diagnosis-code';

@Component({
    selector: 'app-add-case-load-script',
    template: `
        <div class="miles-form padded">
            <h4>{{ title }} Script</h4>
            <mt-dynamic-form *ngIf="formFactory" [config]="formObject" (formCreated)="formCreated($event)" (submitted)="formSubmitted($event)">
                <br />

                <app-case-load-script-goals
                    *ngIf="caseLoadScript && isNursingProvider"
                    [caseLoadScript]="caseLoadScript"
                    [isAdding]="isNewScript"
                    [draftMode]="draftMode"
                >
                </app-case-load-script-goals>
                <br />

                <div>
                    <br />
                    <mt-document
                        *ngIf="!showFileList"
                        [allowedMimeType]="allowedMimeType"
                        (afterAddingFile)="onAddDocument($event)"
                        (addingFileFailed)="onWhenAddingFileFailed($event)"
                    ></mt-document>
                </div>
                <div class="document-upload">
                    <br />
                    <mt-common-documents
                        *ngIf="showFileList"
                        [documentArray]="documentArray"
                        (documentDownloaded)="editExistingFile()"
                    ></mt-common-documents>
                </div>

                <br />

                <button type="submit" class="btn btn-flat btn-success" mt-doubleClickDisabled>
                    {{ title }}
                </button>
                <button type="button" class="btn btn-flat btn-default" (click)="close()">Cancel</button>
            </mt-dynamic-form>
        </div>
    `,
})
export class AddCaseLoadScriptComponent implements OnInit {
    @Output() onClose: EventEmitter<void> = new EventEmitter<void>();
    @Output() onCaseLoadScriptAdded: EventEmitter<void> = new EventEmitter<void>();
    @Output() onCaseLoadDraftAdded = new EventEmitter<IScriptAndFile>();
    @Output() onCaseLoadDraftUpdated = new EventEmitter<IScriptAndFile>();
    @Input() caseLoadId: number;
    @Input() caseLoadScript: ICaseLoadScript;
    @Input() encounterLocations: IEncounterLocation[];
    @Input() draftMode = false;

    viewOnly: DynamicLabel[] = [];
    formObject: DynamicField[] = [];
    form: UntypedFormGroup;
    formFactory: CaseLoadScriptDynamicConfig<ICaseLoadScript>;
    doubleClickDisabled = false;

    allowedMimeType: string[] = [
        'application/pdf',
        'application/msword',
        'image/jpeg',
        'image/png',
        'text/plain',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ];
    fileData: FormData;
    hasFileDataError = false;
    errorString = '';
    documentArray: IDocument[] = [];
    showFileList = false;

    diagnosisCodes: IDiagnosisCode[];

    get isNewScript(): boolean {
        if (this.draftMode) {
            return this.caseLoadScript && this.caseLoadScript.Id === -1 ? false : true;
        } else {
            return this.caseLoadScript && this.caseLoadScript.Id ? false : true;
        }
    }

    get title(): string {
        return this.isNewScript ? 'Add' : 'Update';
    }

    get isNursingProvider(): boolean {
        return this.providerAuthService.getProviderServiceCode() === ServiceCodeAcronymEnums.HCN;
    }

    constructor(
        private caseLoadScriptsService: CaseLoadScriptsService,
        private caseLoadService: CaseLoadService,
        private notificationsService: NotificationsService,
        private providerAuthService: ProviderPortalAuthService,
        private authService: AuthService,
    ) {}

    ngOnInit(): void {
        this.caseLoadService.getReasonForServiceOptions(this.providerAuthService.getProviderId()).subscribe((diagnosisCodes) => {
            this.diagnosisCodes = diagnosisCodes;
            this.setConfig();
        });
    }

    formCreated(createdForm: UntypedFormGroup): void {
        this.form = createdForm;
    }

    setConfig(): void {
        if (this.caseLoadScript == null) {
            this.caseLoadScript = this.caseLoadScriptsService.getEmptyCaseLoadScript();
        }
        this.formFactory = new CaseLoadScriptDynamicConfig(this.caseLoadScript, this.isNursingProvider, this.diagnosisCodes);
        const config = this.caseLoadScript.Id === 0 ? this.formFactory.getForCreate() : this.formFactory.getForUpdate();
        this.viewOnly = config?.viewOnly?.map((x) => new DynamicLabel(x));
        this.formObject = config?.formObject?.map((x) => new DynamicField(x));

        if (this.caseLoadScript.Id !== 0) {
            // existing script
            if (this.caseLoadScript.FilePath.length > 0) {
                this.caseLoadScriptsService.getById(this.caseLoadScript.Id).subscribe((resp) => {
                    this.showFileList = true;
                    this.documentArray.push({
                        DateUpload: resp.DateUpload,
                        FilePath: resp.FilePath,
                        Id: resp.Id,
                        Name: resp.FileName,
                    });
                });
            }
        }
    }

    formSubmitted(form: UntypedFormGroup): void {
        const missingGoals = this.isNursingProvider && !(this.caseLoadScript.CaseLoadScriptGoals.length > 0);
        if (form.valid && !this.hasFileDataError && !missingGoals) {
            this.formFactory.assignFormValues(this.caseLoadScript, form.value.CaseLoadScript as ICaseLoadScript);
            this.saveCaseLoadScript();
        } else {
            markAllFormFieldsAsTouched(form);
            this.validationError(this.hasFileDataError, missingGoals);
            setTimeout(() => (this.doubleClickDisabled = false));
        }
    }

    validationError(hasFileDataError: boolean, missingGoals: boolean): void {
        this.notificationsService.error(
            hasFileDataError
                ? this.errorString
                : missingGoals
                ? 'You must have at least one associated goal to proceed.'
                : 'Please check form and try again.',
        );
    }

    private saveCaseLoadScript(): void {
        this.caseLoadScript.CaseLoadId = this.caseLoadId;
        if (this.isNewScript) {
            this.caseLoadScript.UploadedById = this.authService.currentUser.getValue().Id;
            this.caseLoadScript.FilePath = '';
            this.caseLoadScript.FileName = '';
            if (this.draftMode) {
                this.caseLoadScript.Id = -1;
                this.draftSuccess(this.caseLoadScript, this.fileData, true);
            } else {
                this.caseLoadScript.CaseLoadScriptGoals.forEach((goal) => (goal.Goal = null));
                this.caseLoadScriptsService
                    .createWithFks(this.caseLoadScript)
                    .pipe(finalize(() => (this.doubleClickDisabled = false)))
                    .subscribe((answer) => {
                        this.caseLoadScript.Id = answer;
                        if (this.fileData) {
                            this.caseLoadScriptsService.upload(this.caseLoadScript, this.fileData).subscribe(() => {
                                this.success();
                            });
                        } else {
                            this.success();
                        }
                    });
            }
        } else {
            if (this.draftMode) {
                this.draftSuccess(this.caseLoadScript, this.fileData, false);
            } else {
                this.caseLoadScriptsService
                    .update(this.caseLoadScript)
                    .pipe(finalize(() => (this.doubleClickDisabled = false)))
                    .subscribe(() => {
                        if (this.fileData) {
                            this.caseLoadScriptsService.upload(this.caseLoadScript, this.fileData).subscribe(() => {
                                this.success();
                            });
                        } else {
                            this.success();
                        }
                    });
            }
        }
    }

    close(): void {
        this.onClose.emit();
    }

    onWhenAddingFileFailed(error: string): void {
        this.notificationsService.error(error);
        this.hasFileDataError = true;
        this.errorString = error;
    }

    onAddDocument(file: FileItem): void {
        if (file) {
            this.hasFileDataError = false;
            this.fileData = new FormData();
            this.fileData.append('file', file._file, file._file.name);
            this.showFileList = true;
            this.documentArray = [];
            this.documentArray.push({
                DateUpload: new Date(),
                FilePath: file._file.name,
                Id: 0,
                Name: file._file.name,
            });
        }
    }

    editExistingFile(): void {
        this.showFileList = false;
    }

    private success(): void {
        this.onCaseLoadScriptAdded.emit();
        this.onClose.emit();
        this.notificationsService.success('Script saved successfully.');
    }

    private draftSuccess(script: ICaseLoadScript, fileData: FormData, isAdding: boolean): void {
        if (isAdding) {
            this.onCaseLoadDraftAdded.emit({
                File: fileData,
                Script: script,
            });
        } else {
            this.onCaseLoadDraftUpdated.emit({
                File: fileData,
                Script: script,
            });
        }
        this.onClose.emit();
    }
}

export interface IScriptAndFile {
    Script: ICaseLoadScript;
    File: FormData;
}
