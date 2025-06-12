import { Component } from '@angular/core';
import { IEntity } from '@mt-ng2/base-service';
import { IEntityListComponentMembers, IEntityListDynamicCellComponent } from '@mt-ng2/entity-list-module';
import { IModalOptions } from '@mt-ng2/modal-module';

export interface IArchivableEntity extends IEntity {
    Archived: boolean;
    CanBeArchived: boolean;
}

@Component({
    styles: [],
    template: `
        <div *ngIf="entity.Archived && entity.CanBeArchived" class="text-center">
            <button type="button" (mtConfirm)="archiveEntity($event)" [mtConfirmOptions]="unarchiveConfirm"><i class="fa fa-undo fa-2x"></i></button>
        </div>
        <div *ngIf="!entity.Archived && entity.CanBeArchived" class="text-center">
            <button type="button" (mtConfirm)="archiveEntity($event)" [mtConfirmOptions]="archiveConfirm">
                <i class="fa fa-trash fa-2x" aria-hidden="true"></i>
            </button>
        </div>
    `,
})
export class DeleteEntityCellComponent implements IEntityListDynamicCellComponent {
    entityListComponentMembers: IEntityListComponentMembers;
    private _entity: IArchivableEntity;
    set entity(value: IArchivableEntity) {
        this._entity = value;
        this._entity.CanBeArchived = value.CanBeArchived !== false;
    }
    get entity(): IArchivableEntity {
        return this._entity;
    }

    archiveConfirm: IModalOptions = {
        cancelButtonText: 'Close',
        confirmButtonText: 'Yes, I am sure!',
        denyButtonText: '',
        icon: 'warning',
        showCancelButton: true,
        showConfirmButton: true,
        showDenyButton: false,
        text: `Are you sure you want to delete this record?`,
        title: 'Delete Record',
    };

    unarchiveConfirm: IModalOptions = {
        cancelButtonText: 'Delete',
        confirmButtonText: 'Yes, I am sure!',
        denyButtonText: '',
        icon: 'warning',
        showCancelButton: true,
        showConfirmButton: true,
        showDenyButton: false,
        text: `Are you sure you want to restore this record?`,
        title: 'Restore Record',
    };



    archiveEntity(event: Event): void {
        this.entityListComponentMembers.itemDeleted(this.entity, event);
    }
}
