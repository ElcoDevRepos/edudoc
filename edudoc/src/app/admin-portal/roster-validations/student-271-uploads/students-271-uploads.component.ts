import { HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { ClaimsService, ClaimValues } from '@mt-ng2/auth-module';
import { ExtraSearchParams, IEntitySearchParams, SearchParams } from '@mt-ng2/common-classes';
import { EntityListExportConfig, IColumnSortedEvent, IItemSelectedEvent, SortDirection } from '@mt-ng2/entity-list-module';

import { entityListModuleConfig } from '@common/shared.module';
import { ClaimTypes } from '@model/ClaimTypes';
import { IRosterValidationStudent } from '@model/interfaces/roster-validation-student';
import { IRosterValidationStudentResultDto, RosterValidationService } from '../services/roster-validation.service';
import { RosterValidationStudentsEntityListConfig } from './student-271-uploads.entity-list-config';

@Component({
    selector: 'app-271-student-uploads',
    templateUrl: './student-271-uploads.component.html',
})
export class Student271UploadsComponent implements OnInit {
    rosterValidationStudents: IRosterValidationStudent[];
    currentPage = 1;
    itemsPerPage = entityListModuleConfig.itemsPerPage;
    query = '';
    total: number;
    entityListConfig = new RosterValidationStudentsEntityListConfig();
    order = this.entityListConfig.getDefaultSortProperty();
    orderDirection: string = this.entityListConfig.getDefaultSortDirection();

    canAddRosterValidationStudent = false;
    isSuccessfullyProcessedOnly = false;
    latestUploadDate: Date;

    constructor(
        private rosterValidationStudentService: RosterValidationService,
        private claimsService: ClaimsService,
        private router: Router,
    ) {}

    ngOnInit(): void {
        this.entityListConfig.export = new EntityListExportConfig({ exportName: 'RosterValidationStudents List', getDataForExport: this.getRosterValidationStudentsForExport.bind(this) });
        this.canAddRosterValidationStudent = this.claimsService.hasClaim(ClaimTypes.MedMatch, [ClaimValues.FullAccess]);
        this.getRosterValidationStudents();
    }

    getRosterValidationStudentsCall(options = { forExport: false }): Observable<HttpResponse<IRosterValidationStudentResultDto>> {
        const search = this.query;
        const _extraSearchParams: ExtraSearchParams[] = [];
        _extraSearchParams.push(
            new ExtraSearchParams({
                name: 'isSuccessfullyProcessedOnly',
                value: this.isSuccessfullyProcessedOnly ? '1' : '0',
            }),
        );

        const searchEntity: IEntitySearchParams = {
            extraParams: _extraSearchParams,
            order: this.order,
            orderDirection: this.orderDirection,
            query: search && search.length > 0 ? search : '',
            skip: options.forExport ? undefined : (this.currentPage - 1) * this.itemsPerPage,
            take: options.forExport ? undefined : this.itemsPerPage,
        };

        const searchparams = new SearchParams(searchEntity);
        return this.rosterValidationStudentService.get271UploadedStudents(searchparams);
    }

    getRosterValidationStudents(): void {
        this.getRosterValidationStudentsCall().subscribe((answer) => {
            this.rosterValidationStudents = answer.body.Item1;
            this.latestUploadDate = answer.body.Item2;
            this.total = +answer.headers.get('X-List-Count');
        });
    }

    getRosterValidationStudentsForExport(): Observable<IRosterValidationStudent[]> {
        return this.getRosterValidationStudentsCall({ forExport: true }).pipe(map((answer) => answer.body.Item1));
    }

    search(query: string): void {
        this.currentPage = 1;
        this.query = query;
        this.getRosterValidationStudents();
    }

    filterSelectionChanged(): void {
        this.currentPage = 1;
        this.getRosterValidationStudents();
    }

    columnSorted(event: IColumnSortedEvent): void {
        this.order = event.column.sort.sortProperty;
        this.orderDirection = event.column.sort.direction === SortDirection.Desc ? 'desc' : 'asc';
        this.getRosterValidationStudents();
    }

    rosterValidationStudentSelected(event: IItemSelectedEvent): void {
        void this.router.navigate(['/admin/students', (event.entity as IRosterValidationStudent).StudentId]);
    }
}
