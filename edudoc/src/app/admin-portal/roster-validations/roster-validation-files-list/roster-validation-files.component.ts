import { HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { saveAs } from 'file-saver';
import { Observable } from 'rxjs';

import { ExtraSearchParams, IEntitySearchParams, SearchParams } from '@mt-ng2/common-classes';
import { IColumnSortedEvent, IItemSelectedEvent, SortDirection } from '@mt-ng2/entity-list-module';

import { entityListModuleConfig } from '@common/shared.module';
import { IRosterValidationFile } from '@model/interfaces/roster-validation-file';
import { ISearchbarControlAPI } from '@mt-ng2/searchbar-control';
import { RosterValidationService } from '../services/roster-validation.service';
import { RosterValidationFilesEntityListConfig } from './roster-validation-files.entity-list-config';

@Component({
    selector: 'app-roster-validation-files',
    templateUrl: './roster-validation-files.component.html',
})
export class RosterValidationFilesComponent implements OnInit {
    rosterValidationFiles: IRosterValidationFile[];
    currentPage = 1;
    itemsPerPage = entityListModuleConfig.itemsPerPage;
    query = '';
    total: number;
    entityListConfig = new RosterValidationFilesEntityListConfig();
    order = this.entityListConfig.getDefaultSortProperty();
    orderDirection: string = SortDirection.Desc;

    searchControlApi: ISearchbarControlAPI;

    constructor(
        private rosterValidationService: RosterValidationService,
    ) {}

    ngOnInit(): void {
        this.getRosterValidationFiles();
    }

    getRosterValidationFilesCall(): Observable<HttpResponse<IRosterValidationFile[]>> {
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
        return this.rosterValidationService.getRosterValidationFiles(searchparams);
    }

    getRosterValidationFiles(): void {
        this.getRosterValidationFilesCall().subscribe((answer) => {
            this.rosterValidationFiles = answer.body;
            this.total = +answer.headers.get('X-List-Count');
        });
    }

    search(query: string): void {
        this.currentPage = 1;
        this.query = query;
        this.getRosterValidationFiles();
    }

    filterSelectionChanged(): void {
        this.currentPage = 1;
        this.getRosterValidationFiles();
    }

    columnSorted(event: IColumnSortedEvent): void {
        this.order = event.column.sort.sortProperty;
        this.orderDirection = event.column.sort.direction === SortDirection.Desc ? 'desc' : 'asc';
        this.getRosterValidationFiles();
    }

    downloadFile(event: IItemSelectedEvent): void {
        const entity = event.entity as IRosterValidationFile;
        this.rosterValidationService.download(entity.Id).subscribe((resultBlob: Blob) => {
            const fileContents = new Blob([resultBlob], {
                type: 'application/octet-stream',
            });
            saveAs(fileContents, `${(entity).Name}.txt`);
        });
    }

    generateValidationFile(): void {
        this.rosterValidationService.generateRosterValidationFile().subscribe(() => this.getRosterValidationFiles());
    }

    searchControlReady(searchControlApi: ISearchbarControlAPI): void {
        this.searchControlApi = searchControlApi;
        this.searchControlApi.getSearchInputElement().nativeElement.placeholder = 'Begin typing...';
    }
}
