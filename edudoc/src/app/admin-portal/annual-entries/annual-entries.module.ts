import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '@common/shared.module';
import { AnnualEntryAddComponent } from './components/annual-entry-add/annual-entry-add.component';
import { AnnualEntryBasicInfoComponent } from './components/annual-entry-basic-info/annual-entry-basic-info.component';
import { AnnualEntryDetailsComponent } from './components/annual-entry-details/annual-entry-details.component';
import { AnnualEntryHeaderComponent } from './components/annual-entry-header/annual-entry-header.component';
import { AnnualEntriesComponent } from './components/annual-entry-list/annual-entries.component';
import { AnnualEntryArchiveDynamicCellComponent } from './components/annual-entry-list/annual-entry-cell/annual-entry-cell.component';

@NgModule({
    declarations: [
        AnnualEntriesComponent,
        AnnualEntryBasicInfoComponent,
        AnnualEntryDetailsComponent,
        AnnualEntryAddComponent,
        AnnualEntryHeaderComponent,
        AnnualEntryArchiveDynamicCellComponent,
    ],
    imports: [ SharedModule, CommonModule ],
})
export class AnnualEntriesModule {}
