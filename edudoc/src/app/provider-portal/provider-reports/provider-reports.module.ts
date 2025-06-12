import { NgModule } from '@angular/core';
import { SharedModule } from '@common/shared.module';
import { ProviderReportsComponent } from './components/provider-reports.component';

@NgModule({
    declarations: [
        ProviderReportsComponent,
    ],
    imports: [
        SharedModule,
    ],
})
export class ProviderReportsModule {}
