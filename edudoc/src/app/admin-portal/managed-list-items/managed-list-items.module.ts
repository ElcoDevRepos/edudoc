import { NgModule } from '@angular/core';
import { SharedModule } from '@common/shared.module';
import { ManagedListItemsComponent } from './managed-list-items.component';

@NgModule({
    declarations: [ManagedListItemsComponent],
    imports: [SharedModule],
})
export class ManagedListItemsModule {}
