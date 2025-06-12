import { NgModule } from '@angular/core';
import { SharedModule } from '@common/shared.module';
import { CptCodeAssociationsComponent } from './components/cpt-associations/cpt-associations.component';
import { CptCodeBasicInfoComponent } from './components/cpt-code-basic-info/cpt-code-basic-info.component';
import { CptCodeDetailComponent } from './components/cpt-code-detail/cpt-code-detail.component';
import { CptCodeHeaderComponent } from './components/cpt-code-header/cpt-code-header.component';
import { CptCodesComponent } from './components/cpt-code-list/cpt-code.component';

@NgModule({
    declarations: [
        CptCodesComponent,
        CptCodeHeaderComponent,
        CptCodeDetailComponent,
        CptCodeBasicInfoComponent,
        CptCodeDetailComponent,
        CptCodeAssociationsComponent,
    ],
    imports: [SharedModule],
})
export class CptCodeModule {}
