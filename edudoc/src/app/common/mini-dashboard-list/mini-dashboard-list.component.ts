import { Component, EventEmitter, Input, Output } from '@angular/core';
import { archiveConfirm, unarchiveConfirm } from '@common/mtConfirmOptions/mtConfirmOptions';
import { IEntity } from '@mt-ng2/base-service';
import { DynamicField, DynamicFieldType, DynamicFieldTypes, IDynamicFieldType } from '@mt-ng2/dynamic-form';
import { ILabelGenerator } from './../interfaces/ILabelGenerator.d';

@Component({
    selector: 'app-mini-dashboard-list',
    styles: [
        `
            .alternateColorItem:hover {
                background-color: #f5f5f5;
            }
            .alternateColorItem:nth-child(even) {
                background-color: #ececec;
            }
            .alternateColorItem:first-child {
                border-top: 1px solid #ddd;
            }
            .alternateColorItem:last-child {
                border-bottom: 1px solid #ddd;
            }
        `,
    ],
    templateUrl: './mini-dashboard-list.component.html',
})
export class MiniDashboardListComponent {
    @Input()
    items: IEntity[];
    @Input()
    totalItems: number;
    @Input()
    canEdit: boolean;
    @Input()
    noOfItemsToShow: number;
    @Input()
    cardName: string;
    @Input()
    labelGenerator: ILabelGenerator;
    @Input()
    forceShowAll: boolean;
    @Input()
    hideShowAll: boolean;
    @Input()
    showTotalCount: boolean;
    @Input()
    alternateColor: boolean;
    @Input()
    canDelete: boolean;

    @Output('onSeeAll') onSeeAll: EventEmitter<void> = new EventEmitter<void>();
    @Output('onAddItem') onAddItem: EventEmitter<void> = new EventEmitter<void>();
    @Output('onIncludeArchived') onIncludeArchived: EventEmitter<boolean> = new EventEmitter<boolean>();

    @Output('onSelectItem') onSelectItem: EventEmitter<IEntity> = new EventEmitter<IEntity>();
    @Output('onDeleteItem') onDeleteItem: EventEmitter<IEntity> = new EventEmitter<IEntity>();

    includeArchived = false;

    archiveConfirm = archiveConfirm;
    unarchiveConfirm = unarchiveConfirm;

    

    showTotal(): boolean {
        return (this.totalItems && this.totalItems > this.noOfItemsToShow) || this.forceShowAll;
    }

    seeAll(): void {
        this.onSeeAll.emit();
    }

    addItem(): void {
        this.onAddItem.emit();
    }

    getItemName(item: IEntity): string {
        if (this.labelGenerator) {
            return this.labelGenerator.GetLabel(item).toUpperCase();
        }
        return '';
    }

    selectItem(item: IEntity): void {
        this.onSelectItem.emit(item);
    }

    deleteItem(item: IEntity): void {
        this.onDeleteItem.emit(item);
    }

    setIncludeArchived(): void {
        this.includeArchived = !this.includeArchived;
        this.onIncludeArchived.emit(this.includeArchived);
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
