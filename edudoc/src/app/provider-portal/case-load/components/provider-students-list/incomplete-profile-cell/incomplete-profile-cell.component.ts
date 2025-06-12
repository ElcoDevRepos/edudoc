import { Component } from '@angular/core';
import { IProviderCaseLoadDTO } from '@model/interfaces/custom/provider-student.dto';
import { IEntityListComponentMembers, IEntityListDynamicCellComponent } from '@mt-ng2/entity-list-module';

@Component({
    styles: [],
    template: `<button *ngIf="entity.HasIncompleteProfile" class="btn btn-flat btn-success">Yes</button>`,
})
export class IncompleteProfileCellDynamicCellComponent implements IEntityListDynamicCellComponent {
    entityListComponentMembers: IEntityListComponentMembers;
    entity: IProviderCaseLoadDTO;
}
