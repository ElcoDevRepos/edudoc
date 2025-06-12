import { Component, EventEmitter, Injector, Input, OnInit, Output } from '@angular/core';
import { EncounterResponseDtoService } from '@common/services/encounter-response-dto.service';
import { PdfService } from '@common/services/pdf.service';
import { IEncounterResponseDto } from '@model/interfaces/custom/encounter-response.dto';
import { EntityListExportConfig, EntityListExportService } from '@mt-ng2/entity-list-module';
import { saveAs } from 'file-saver';
import { Observable, of } from 'rxjs';
import { AupAuditExportEntityListConfig } from './aup-audit-export.entity-list-config';

@Component({
    selector: 'app-aup-audit',
    templateUrl: './aup-audit.component.html',
})
export class AupAuditComponent implements OnInit {
    @Input() allEncounters: IEncounterResponseDto[];
    @Input() encounters: IEncounterResponseDto[];
    @Output() encountersChange = new EventEmitter<IEncounterResponseDto[]>();
    entityListConfig = new AupAuditExportEntityListConfig(this.encounterResponseDtoService);
    protected entityListExportService: EntityListExportService;

    constructor(private encounterResponseDtoService: EncounterResponseDtoService, injector: Injector, private pdfService: PdfService) {
        this.entityListExportService = injector.get(EntityListExportService);
    }

    ngOnInit(): void {
        this.entityListConfig.export = new EntityListExportConfig({
            exportName: 'AUP Audit List',
            getDataForExport: this.getEncountersForExport.bind(this),
        });
    }

    removeEncounterFromList(encounter: IEncounterResponseDto): void {
        this.encounters = this.encounters.filter((e) => e.EncounterNumber !== encounter.EncounterNumber);
        this.encountersChange.emit(this.encounters);
    }

    exportToCSV(): void {
        if (this.entityListConfig.export.getDataForExport) {
            this.entityListConfig.export.getDataForExport().subscribe((data) => {
                this.entityListExportService.export(data, this.entityListConfig);
            });
        }
    }

    exportToPDF(): void {
        if (this.encounters?.length > 0) {
            this.pdfService.getAupAuditReport(this.encounters, ).subscribe((bytes) => {
                const thefile = new Blob([bytes], {
                    type: 'application/octet-stream',
                });
                saveAs(thefile, `AupAuditReport.pdf`);
            });
        }
    }

    clearAll(): void {
        this.encounters = [];
        this.encountersChange.emit(this.encounters);
    }

    getEncountersForExport(): Observable<IEncounterResponseDto[]> {
        return of(this.encounters);
    }

    getAll(): void {
        this.encounters = this.encounters.concat(this.allEncounters.filter(e => !this.encounters.some(e2 => e.EncounterStudentId === e2.EncounterStudentId)))
        this.encountersChange.emit(this.encounters);
    }
}
