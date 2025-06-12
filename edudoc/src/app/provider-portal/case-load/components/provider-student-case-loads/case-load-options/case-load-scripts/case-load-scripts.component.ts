import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { archiveConfirm, unarchiveConfirm } from '@common/mtConfirmOptions/mtConfirmOptions';
import { ICaseLoad } from '@model/interfaces/case-load';
import { ICaseLoadScript } from '@model/interfaces/case-load-script';
import { ExtraSearchParams, IEntitySearchParams, SearchParams } from '@mt-ng2/common-classes';
import { DynamicField, DynamicFieldType, DynamicFieldTypes, IDynamicFieldType } from '@mt-ng2/dynamic-form';
import { SortDirection } from '@mt-ng2/entity-list-module';
import { NotificationsService } from '@mt-ng2/notifications-module';
import { CaseLoadScriptsService } from '@provider/case-load/services/case-load-scripts.service';
import { saveAs } from 'file-saver';
import { IScriptAndFile } from './add-case-load-script.component';

@Component({
    selector: 'app-case-load-scripts',
    templateUrl: './case-load-scripts.component.html',
})
export class CaseLoadScriptsComponent implements OnInit {
    @Input() caseLoad: ICaseLoad;
    @Input() canEdit: boolean;
    @Input() draftMode = false;

    @Output() draftScriptsChanged = new EventEmitter<IScriptAndFile[]>();
    @Output() editing = new EventEmitter<boolean>();

    caseLoadScripts: ICaseLoadScript[] = [];
    fileData: FormData[] = [];
    isEditing = false;

    total: number;
    doubleClickIsDisabled = false;
    includeArchived = false;
    isHovered: boolean;
    isCardOpen = false;

    archiveConfirm = archiveConfirm;
    unarchiveConfirm = unarchiveConfirm;
    selectedScript: ICaseLoadScript = null;

    constructor(
        private caseLoadScriptsService: CaseLoadScriptsService,
        private notificationService: NotificationsService,
    ) {}

    ngOnInit(): void {
        if (this.draftMode) {
            this.selectedScript = null;
            this.caseLoadScripts = [];
            this.fileData = [];
            this.emitDraftChange();
        } else {
            this.refreshScripts();
        }
    }

    getCaseLoadScripts(): void {
        const _extraSearchParams: ExtraSearchParams[] = this.buildSearch();

        const searchEntity: IEntitySearchParams = {
            extraParams: _extraSearchParams,
            order: 'Id',
            orderDirection: SortDirection.Desc,
            query: '',
            take: 9999,
        };

        const searchparams = new SearchParams(searchEntity);
        this.caseLoadScriptsService.get(searchparams).subscribe((answer) => {
            this.caseLoadScripts = answer.body;
            this.total = +answer.headers.get('X-List-Count');
        });
    }

    private buildSearch(): ExtraSearchParams[] {
        const _extraSearchParams: ExtraSearchParams[] = [];

        _extraSearchParams.push(
            new ExtraSearchParams({
                name: 'CaseLoadId',
                value: this.caseLoad.Id.toString(),
            }),
        );

        _extraSearchParams.push(
            new ExtraSearchParams({
                name: 'includeArchived',
                value: this.includeArchived ? '1' : '0',
            }),
        );

        return _extraSearchParams;
    }

    addScript(): void {
        this.isEditing = true;
        this.editing.emit(this.isEditing);
    }

    cancelClick(): void {
        this.isEditing = false;
        this.editing.emit(this.isEditing);
        this.selectedScript = null;
    }

    toggleCardOpen(): void {
        this.isCardOpen = !this.isCardOpen;
    }

    noCaseLoadScripts(): boolean {
        return !this.caseLoadScripts || this.caseLoadScripts.length === 0;
    }

    getArchivedField(): DynamicField {
        return new DynamicField({
            formGroup: null,
            label: 'Include Archived',
            name: 'includeArchived',
            type: new DynamicFieldType({
                fieldType: DynamicFieldTypes.Checkbox,
            }),
            value: this.includeArchived,
        });
    }

    archiveCaseLoadScript(caseLoadScript: ICaseLoadScript): void {
        if (this.draftMode) {
            const index = this.caseLoadScripts.indexOf(caseLoadScript);
            if (index > -1) {
                this.caseLoadScripts = this.caseLoadScripts.filter((_x, i) => i !== index);
                this.fileData = this.fileData.filter((_x, i) => i !== index);
                this.emitDraftChange();
            }
        } else {
            if (!caseLoadScript.Archived && this.caseLoadScripts.filter((x) => !x.Archived).length === 1) {
                this.notificationService.error('Cannot remove the last Script, at least one is required.');
                return;
            }
            if (caseLoadScript.Id === 0) {
                this.caseLoad.CaseLoadScripts = this.caseLoad.CaseLoadScripts.filter((clg) => clg !== caseLoadScript);
            } else {
                caseLoadScript.Archived = !caseLoadScript.Archived;
                this.caseLoadScriptsService.update(caseLoadScript).subscribe(() => {
                    this.notificationService.success('Script Updated Successfully');
                    this.getCaseLoadScripts();
                });
            }
        }
    }

    refreshScripts(): void {
        this.selectedScript = null;
        this.getCaseLoadScripts();
    }

    doctorNameFormattingFunction(script: ICaseLoadScript): string {
        return `${script.DoctorLastName}, ${script.DoctorFirstName}`;
    }

    download(index: number): void {
        this.caseLoadScriptsService.download(this.caseLoadScripts[index]).subscribe((resultBlob: Blob) => {
            const fileContents = new Blob([resultBlob], {
                type: 'application/octet-stream',
            });
            saveAs(fileContents, this.caseLoadScripts[index].FileName);
        });
    }

    clone(script: ICaseLoadScript): void {
        this.selectedScript = this.caseLoadScriptsService.getEmptyCaseLoadScript();
        this.selectedScript.CaseLoadId = script.CaseLoadId;
        this.selectedScript.CaseLoadScriptGoals = script.CaseLoadScriptGoals.map((csg) => {
                csg.CaseLoadScriptId = 0;
                csg.DateCreated = new Date();
                csg.DateModified = null;
                return csg;
        });
        this.selectedScript.DoctorFirstName = script.DoctorFirstName;
        this.selectedScript.DoctorLastName = script.DoctorLastName;
        this.selectedScript.InitiationDate = script.ExpirationDate;
        this.selectedScript.Npi = script.Npi;

        this.isEditing = true;
    }

    scriptSelected(script: ICaseLoadScript): void {
        this.selectedScript = script;
        this.isEditing = true;
        this.editing.emit(this.isEditing);
    }

    draftAdded(draft: IScriptAndFile): void {
        this.selectedScript = null;
        this.caseLoadScripts.push(draft.Script);
        this.fileData.push(draft.File);
        this.emitDraftChange();
    }

    draftUpdated(draft: IScriptAndFile): void {
        this.selectedScript = null;
        const index = this.caseLoadScripts.indexOf(draft.Script);
        if (index > -1) {
            this.caseLoadScripts = this.caseLoadScripts.map((x, i) => i === index ? draft.Script : x);
            this.fileData = this.fileData.map((x, i) => i === index ? draft.File : x);
            this.emitDraftChange();
        }
    }

    emitDraftChange(): void {
        this.draftScriptsChanged.emit(this.caseLoadScripts.map((x, i) => ({
            File: this.fileData[i],
            Script: x,
        })));
    }
}
