import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MessageFilterTypeEnums } from '@model/enums/message-filter-types.enum';

import { IMessage } from '@model/interfaces/message';
import { NotificationsService } from '@mt-ng2/notifications-module';
import { MessageService } from '../../services/message.service';

@Component({
    selector: 'app-message-drag-n-drop-list',
    styles: [`
        .drag-wrapper.dragging {
            opacity: 0.5;
        }
    `],
    templateUrl: './message-drag-n-drop-list.component.html',
})
export class MessageDragAndDropComponent {
    @Input() messages: IMessage[];
    @Output() itemDeletedEvent = new EventEmitter<void>();
    draggingIndex: number;
    startIndex: number;

    get noMessages(): boolean {
        return !this.messages || this.messages.length === 0;
    }

    constructor(
        private messageService: MessageService,
        private notificationService: NotificationsService,
    ) {}

    onDragStart(fromIndex: number): void {
        this.draggingIndex = fromIndex;
        this.startIndex = fromIndex;
    }

    onDragEnter(toIndex: number): void {
        if (this.draggingIndex !== toIndex) {
            this._reorderItem(this.draggingIndex, toIndex);
        }
    }

    onDragEnd(toIndex: number): void {
        const itemToBeReordered = this.messages.slice(toIndex, toIndex + 1)[0];

        const shiftDown = this.startIndex < toIndex;
        const moved = shiftDown ? this.messages.slice(this.startIndex, toIndex) : this.messages.slice(toIndex + 1, (this.startIndex + 1));

        itemToBeReordered.SortOrder = this.messages[toIndex].SortOrder;
        moved.forEach((m) => shiftDown ? --m.SortOrder : ++m.SortOrder);
        moved.push(itemToBeReordered);

        this.messageService.updateOrder(moved).subscribe(() => {
            this.draggingIndex = undefined;
        });
    }

    private _reorderItem(fromIndex: number, toIndex: number): void {
        const itemToBeReordered = this.messages.splice(fromIndex, 1)[0];
        this.messages.splice(toIndex, 0, itemToBeReordered);
        this.draggingIndex = toIndex;
    }

    itemSelected(message: IMessage): void  {
        this.messageService.setMessage(message);
    }

    getSelection(message: IMessage): string {
        return message.MessageFilterTypeId === MessageFilterTypeEnums.Provider ? `${message.Provider.ProviderUser.LastName}, ${message.Provider.ProviderUser.FirstName}` :
                        message.MessageFilterTypeId === MessageFilterTypeEnums.SchoolDistrict ? `${message.SchoolDistrict.Name}` :
                        message.MessageFilterTypeId === MessageFilterTypeEnums.ProviderTitle ? `${message.ProviderTitle.Name}` :
                        'n/a';
    }

    getExpiration(message: IMessage): string {
        return new DatePipe('en-US').transform(message.ValidTill, 'MMM d, y', 'UTC');
    }

    itemDeleted(message: IMessage): void {
        this.messageService.delete(message.Id).subscribe(() => {
            this.messageService.getMessage().subscribe((res) => {
                const currentMessage = res;
                // clear deleted message from form
                if (message.Id === currentMessage.Id) {
                    this.messageService.setMessage(this.messageService.getEmptyMessage());
                }
            });
            this.itemDeletedEvent.emit();
            this.notificationService.success('Message successfully deleted.');
        });
    }
}
