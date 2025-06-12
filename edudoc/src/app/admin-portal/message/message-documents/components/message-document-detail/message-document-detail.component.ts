import { Component, Input, OnInit } from '@angular/core';

import { ClaimsService, ClaimValues } from '@mt-ng2/auth-module';

import { ClaimTypes } from '@model/ClaimTypes';
import { IMessageDocument } from '@model/interfaces/message-document';
import { ExtraSearchParams, IEntitySearchParams, SearchParams } from '@mt-ng2/common-classes';
import { DynamicField, DynamicFieldType, DynamicFieldTypes, IDynamicFieldType } from '@mt-ng2/dynamic-form';
import { IItemDeletedEvent, IItemSelectedEvent } from '@mt-ng2/entity-list-module';
import { MessageDocumentService } from '../../services/message-document.service';
import { MessageDocumentsEntityListConfig } from './message-documents.entity-list-config';

@Component({
    selector: 'app-message-document-detail',
    templateUrl: './message-document-detail.component.html',
})
export class MessageDocumentDetailComponent implements OnInit {
    @Input() isProviderTraining: boolean;
    messageDocuments: IMessageDocument[];
    currentPage = 1;
    itemsPerPage = 25;
    total: number;
    entityListConfig = new MessageDocumentsEntityListConfig();

    includeArchived = false;
    canEdit: boolean;
    canAdd: boolean;

    constructor(private messageDocumentService: MessageDocumentService, private claimsService: ClaimsService) {}

    ngOnInit(): void {
        // check claims
        this.canEdit = this.claimsService.hasClaim(ClaimTypes.AppSettings, [ClaimValues.FullAccess]);
        this.canAdd = this.canEdit;
        this.getMessageDocuments();

        this.messageDocumentService.getMessageDocument().subscribe(() => {
            this.getMessageDocuments();
        });
    }

    getMessageDocuments(): void {
        this.messageDocumentService.get(this.getSearchParams()).subscribe((messageDocuments) => {
            this.messageDocuments = messageDocuments.body;
            this.total = +messageDocuments.headers.get('X-List-Count');
        });
    }

    getSearchParams(): SearchParams {
        const _extraSearchParams: ExtraSearchParams[] = [];

        _extraSearchParams.push(
            new ExtraSearchParams({
                name: 'providerTrainings',
                value: this.isProviderTraining ? '1' : '0',
            }),
        );

        _extraSearchParams.push(
            new ExtraSearchParams({
                name: 'includeArchived',
                value: this.includeArchived ? '1' : '0',
            }),
        );

        const searchEntity: IEntitySearchParams = {
            extraParams: _extraSearchParams,
            order: 'Id',
            orderDirection: 'desc',
            query: '',
            skip: (this.currentPage - 1) * this.itemsPerPage,
            take: this.itemsPerPage,
        };

        return new SearchParams(searchEntity);
    }

    filterSelectionChanged(): void {
        this.currentPage = 1;
        this.getMessageDocuments();
    }

    messageDocumentSelected(event: IItemSelectedEvent): void {
        this.messageDocumentService.setMessageDocument(event.entity as IMessageDocument);
    }

    createEmptyMessage(): void {
        this.messageDocumentService.setMessageDocument(this.messageDocumentService.getEmptyMessageDocument());
    }

    onItemDeleted(event: IItemDeletedEvent): void {
        const selectedDocument = event.entity as IMessageDocument;
        selectedDocument.Archived = !selectedDocument.Archived;
        this.messageDocumentService.update(selectedDocument).subscribe(() => {
            this.getMessageDocuments();
            this.createEmptyMessage();
        });
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
}
