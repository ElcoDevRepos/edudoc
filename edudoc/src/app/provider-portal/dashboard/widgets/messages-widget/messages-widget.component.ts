import { Component, OnInit } from '@angular/core';
import { ModalService } from '@mt-ng2/modal-module';
import { IMessageDto } from '../../../../model/interfaces/custom/message.dto';
import { ProviderMessageService } from '../../services/provider-message.service';

@Component({
    selector: 'app-provider-messages-widget',
    styleUrls: ['../../provider-dashboard-component/provider-dashboard-common-css.component.less'],
    templateUrl: './messages-widget.component.html',
})
export class MessagesWidgetComponent implements OnInit {
    messages: IMessageDto[];
    messagesView: IMessageDto[];
    expandable = false;
    expanded = false;

    viewedMessage: IMessageDto;
    unreadMessages: number;

    get unreadMessagesCount(): number {
        return this.messages?.filter((m) => !m.IsRead).length;
    }

    constructor(
        private providerMessageService: ProviderMessageService,
        private modalService: ModalService,
    ) {}

    ngOnInit(): void {
        this.getMessages();
    }

    private getMessages(): void {
        this.providerMessageService.getProviderMessages().subscribe((messages) => {
            this.messages = messages;
            this.expandable = this.messages.length > 5;
            this.messagesView = this.expandable ? this.messages.slice(0, 5) : this.messages;
        });
    }

    expandView(): void {
        this.messagesView = this.messages;
        this.expanded = true;
    }

    collapseView(): void {
        this.messagesView = this.messages.slice(0, 5);
        this.expanded = false;
    }

   viewMessage(message: IMessageDto): void {
        this.viewedMessage = message;
        this.modalService.showModal({
            cancelButtonText: 'Ok',
            confirmButtonText: 'Mark Message As Read',
            customClass: {
                title: 'text-center',
            },
            html: this.viewedMessage.Body,
            showCancelButton: this.viewedMessage.IsRead,
            showCloseButton: true,
            showConfirmButton: !this.viewedMessage.IsRead,
            title: this.viewedMessage.Description,
            width: '35%',
        }).subscribe((result) => {
            const shouldReadMessage = result;
            if (shouldReadMessage.value) {
                this.providerMessageService.markMessageAsRead(this.viewedMessage.Id).subscribe((messages) => {
                    this.expanded = false;
                    this.messages = messages;
                    this.expandable = this.messages.length > 5;
                    this.messagesView = this.expandable ? this.messages.slice(0, 5) : this.messages;
                    this.viewedMessage = null;
                });
            } else {
                return;
            }
        });
    }

    getMessageBody(message: IMessageDto): string {
        const msg = message.Body.replace(/<[^>]+>/g, '');
        return msg.length > 45 ? `${msg.substring(0, 45)}...` : `${msg}`;
    }
}
