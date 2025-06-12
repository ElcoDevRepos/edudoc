import { Component, OnInit } from '@angular/core';

import { AuthService, ClaimsService, ClaimValues } from '@mt-ng2/auth-module';

import { ClaimTypes } from '@model/ClaimTypes';
import { IMessage } from '@model/interfaces/message';
import { IEntitySearchParams, SearchParams } from '@mt-ng2/common-classes';
import { MessageService } from '../../services/message.service';
import { MessagesEntityListConfig } from './messages.entity-list-config';

@Component({
    templateUrl: './message-detail.component.html',
})
export class MessageDetailComponent implements OnInit {
    messages: IMessage[];
    total: number;
    entityListConfig = new MessagesEntityListConfig();

    canEdit: boolean;
    canAdd: boolean;

    constructor(private messageService: MessageService, private claimsService: ClaimsService, private authService: AuthService) {}

    ngOnInit(): void {
        // check claims
        this.canEdit = this.claimsService.hasClaim(ClaimTypes.AppSettings, [ClaimValues.FullAccess]);
        this.canAdd = this.canEdit;
        this.getAllMessages();

        this.messageService.getMessage().subscribe(() => {
            const user = this.authService.currentUser.getValue();
            if (user.Id) { this.getAllMessages(); }
        });
    }

    getAllMessages(): void {
        this.messageService.get(this.getSearchParams()).subscribe((messages) => {
            this.messages = messages.body;
            this.total = +messages.headers.get('X-List-Count');
        });
    }

    getSearchParams(): SearchParams {
        const searchEntity: IEntitySearchParams = {
            order: 'SortOrder',
            orderDirection: 'asc',
            query: '',
        };

        return new SearchParams(searchEntity);
    }

    createEmptyMessage(): void {
        this.messageService.setMessage(this.messageService.getEmptyMessage());
    }
}
