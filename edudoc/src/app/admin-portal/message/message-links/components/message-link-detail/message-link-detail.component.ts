import { Component, Input, OnInit } from '@angular/core';

import { ClaimsService, ClaimValues } from '@mt-ng2/auth-module';

import { ClaimTypes } from '@model/ClaimTypes';
import { IMessageLink } from '@model/interfaces/message-link';
import { ExtraSearchParams, IEntitySearchParams, SearchParams } from '@mt-ng2/common-classes';
import { DynamicField, DynamicFieldType, DynamicFieldTypes, IDynamicFieldType } from '@mt-ng2/dynamic-form';
import { IItemDeletedEvent, IItemSelectedEvent } from '@mt-ng2/entity-list-module';
import { MessageLinkService } from '../../services/message-link.service';
import { MessageLinksEntityListConfig } from './message-links.entity-list-config';

@Component({
    selector: 'app-message-link-detail',
    templateUrl: './message-link-detail.component.html',
})
export class MessageLinkDetailComponent implements OnInit {
    @Input() isProviderTraining: boolean;
    messageLinks: IMessageLink[];
    currentPage = 1;
    itemsPerPage = 25;
    total: number;
    entityListConfig = new MessageLinksEntityListConfig();

    includeArchived = false;
    canEdit: boolean;
    canAdd: boolean;

    constructor(private messageLinkService: MessageLinkService, private claimsService: ClaimsService) {}

    ngOnInit(): void {
        // check claims
        this.canEdit = this.claimsService.hasClaim(ClaimTypes.AppSettings, [ClaimValues.FullAccess]);
        this.canAdd = this.canEdit;
        this.getMessageLinks();

        this.messageLinkService.getMessageLink().subscribe(() => {
            this.getMessageLinks();
        });
    }

    getMessageLinks(): void {
        this.messageLinkService.get(this.getSearchParams()).subscribe((messageLinks) => {
            this.messageLinks = messageLinks.body;
            this.total = +messageLinks.headers.get('X-List-Count');
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
        this.getMessageLinks();
    }

    messageLinkSelected(event: IItemSelectedEvent): void {
        this.messageLinkService.setMessageLink(event.entity as IMessageLink);
    }

    createEmptyMessage(): void {
        this.messageLinkService.setMessageLink(this.messageLinkService.getEmptyMessageLink());
    }

    onItemDeleted(event: IItemDeletedEvent): void {
        const selectedPhysicianVacation = event.entity as IMessageLink;
        selectedPhysicianVacation.Archived = !selectedPhysicianVacation.Archived;
        this.messageLinkService.update(selectedPhysicianVacation).subscribe(() => {
            this.getMessageLinks();
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
