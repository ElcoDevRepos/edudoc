import { NgModule } from '@angular/core';
import { NurseProgressQuickTextComponent } from './nurse-progress-quick-text.component';
import { SharedModule } from '../../common/shared.module';

@NgModule({
    declarations: [NurseProgressQuickTextComponent],
    exports: [NurseProgressQuickTextComponent],
    imports: [SharedModule],
})
export class NursingGoalResultModule {}
