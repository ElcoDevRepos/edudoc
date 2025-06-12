import { Component, OnInit } from '@angular/core';
import { ServiceCodeAcronymEnums } from '@model/enums/service-code.enum';
import { TherapyCaseNoteDynamicControls } from '@model/form-controls/therapy-case-note.form-controls';
import { TherapyCaseNoteService } from '@provider/case-load/services/therapy-case-notes.service';
import { ProviderPortalAuthService } from '@provider/provider-portal-auth.service';
import { saveAs } from 'file-saver';

@Component({
    selector: 'app-therapy-case-note-managed-list',
    templateUrl: './therapy-case-note-managed-list.component.html',
})
export class TherapyCaseNoteManagedListComponent implements OnInit {
    therapyCaseNoteForm = new TherapyCaseNoteDynamicControls(null).Form;
    hasMigrationHistory = false;

    get isNursingProvider(): boolean {
        return this.providerAuthService.getProviderServiceCode() === ServiceCodeAcronymEnums.HCN;
    }

    constructor(
        public therapyCaseNoteService: TherapyCaseNoteService,
        private providerAuthService: ProviderPortalAuthService,
        ) {}

    ngOnInit(): void {
        this.therapyCaseNoteService.hasMigrationHistory().subscribe((res) => {
            this.hasMigrationHistory = res;
        });
    }

    downloadMigrationHistory(): void {
        this.therapyCaseNoteService.downloadMigrationHistoryFile().subscribe((blob) => {
            saveAs(blob, 'CaseNotesHistory.xlsx');
        });
    }
}
