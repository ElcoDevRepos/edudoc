import { NgModule } from '@angular/core';

import { SharedModule } from '@common/shared.module';
import { DiagnosisCodeAddComponent } from './components/diagnosis-code-add/diagnosis-code-add.component';
import { DiagnosisCodeBasicInfoComponent } from './components/diagnosis-code-basic-info/diagnosis-code-basic-info.component';
import { DiagnosisCodeDetailComponent } from './components/diagnosis-code-detail/diagnosis-code-detail.component';
import { DiagnosisCodeHeaderComponent } from './components/diagnosis-code-header/diagnosis-code-header.component';
import { DiagnosisCodesComponent } from './components/diagnosis-code-list/diagnosis-codes.component';

import { DiagnosisAssociationsListComponent } from './components/diagnosis-associations-list/diagnosis-associations-list.component';

@NgModule({
    declarations: [
        DiagnosisCodesComponent,
        DiagnosisCodeHeaderComponent,
        DiagnosisCodeAddComponent,
        DiagnosisCodeDetailComponent,
        DiagnosisCodeBasicInfoComponent,
        DiagnosisAssociationsListComponent,
    ],
    imports: [SharedModule],
})
export class DiagnosisCodeModule {}
