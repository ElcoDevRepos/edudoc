import { NgModule } from '@angular/core';
import { SharedModule } from '@common/shared.module';
import { ElectronicSignaturesComponent } from './components/electronic-signatures.component';

@NgModule({
    declarations: [ElectronicSignaturesComponent],
    exports: [ElectronicSignaturesComponent],
    imports: [SharedModule],
})
export class ElectronicSignaturesModule {}
