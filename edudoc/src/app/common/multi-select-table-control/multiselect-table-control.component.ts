import { Component, EventEmitter, Input, OnChanges, OnInit, Output, ViewChild } from '@angular/core';
import { IMetaItem, MetaItem } from '@mt-ng2/base-service';
import { NotificationsService } from '@mt-ng2/notifications-module';

@Component({
    selector: 'multiselect-table-control',
    styles: [
        `
            .invalid {
                border-color: red;
            }
        `,
    ],
    templateUrl: './multiselect-table-control.component.html',
})
export class MultiselectTableControlComponent implements OnInit, OnChanges {
    @ViewChild('placeholder') placeholder;

    @Output() onItemSelected: EventEmitter<IMetaItem> = new EventEmitter();
    @Output() onItemRemoved: EventEmitter<number> = new EventEmitter();

    @Input('itemType') itemType = '';
    @Input() valid = true;
    @Input() required = false;
    @Input() hasSelectAll = false;
    selectAllItem: IMetaItem = new MetaItem(0, 'Select All');

    private _allItems: IMetaItem[] = [];
    @Input('allItems')
    set allItems(value: IMetaItem[]) {
        this._allItems = value;
    }
    get allItems(): IMetaItem[] {
        return this._allItems;
    }

    @Input('currentItems') currentItems = [];
    @Input('idProperty') idProperty;

    private _selectedIds: number[] = [];
    set selectedIds(val: number[]) {
        this._selectedIds = val;
    }
    get selectedIds(): number[] {
        return this._selectedIds;
    }

    get unselectedItems(): IMetaItem[] {
        return this.allItems.filter((item) => this._selectedIds.indexOf(item.Id) < 0);
    }
    get selectedItems(): IMetaItem[] {
        return this.allItems.filter((item) => this._selectedIds.indexOf(item.Id) >= 0);
    }

    get allItemsSelected(): boolean {
        return this.unselectedItems.length === 0;
    }

    get placeholderText(): string {
        return this.unselectedItems.length > 0 ? `Select an item` : 'All items selected';
    }

    selectedItem: IMetaItem | string = '';

    constructor(private notificationService: NotificationsService) {}

    ngOnInit(): void {
        this.selectedIds = this.currentItems ? this.currentItems.map((i) => i[this.idProperty]) : [];
        this.selectedItem = this.placeholderText;
    }

    ngOnChanges(): void {
        this.selectedIds = this.currentItems ? this.currentItems.map((i) => i[this.idProperty]) : [];
    }

    selectItem(evt: IMetaItem): void {
        if (evt.Id === 0) {
            this.unselectedItems.forEach((item) => {
                this.pushItem(item);
            });
        } else {
            this.pushItem(evt);
        }
    }

    pushItem(evt: IMetaItem): void {
        this._selectedIds.push(evt.Id);
        this.onItemSelected.emit(evt);
        if (!this.unselectedItems.length) {
            this.notificationService.info(`All ${this.itemType.toLowerCase()} are selected.`);
        }
    }

    removeItem(itemId: number): void {
        this._selectedIds = this._selectedIds.filter((id) => id !== itemId);
        this.selectedItem = this.placeholderText;
        this.onItemRemoved.emit(itemId);
    }
}
