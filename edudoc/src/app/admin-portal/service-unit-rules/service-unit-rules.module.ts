import { NgModule } from '@angular/core';

import { ServiceUnitRuleBasicInfoComponent } from './components/service-unit-rule-basic-info/service-unit-rule-basic-info.component';
import { ServiceUnitRuleDetailComponent } from './components/service-unit-rule-detail/service-unit-rule-detail.component';
import { ServiceUnitRuleHeaderComponent } from './components/service-unit-rule-header/service-unit-rule-header.component';

import { SharedModule } from '@common/shared.module';
import { EffectiveTillCellDynamicCellComponent } from './components/service-unit-rule-detail/effective-till-cell/effective-till-cell.component';
import { ServiceUnitTimeSegmentsComponent } from './components/service-unit-time-segments/service-unit-time-segments.component';

@NgModule({
    declarations: [
        ServiceUnitRuleHeaderComponent,
        ServiceUnitRuleDetailComponent,
        ServiceUnitRuleBasicInfoComponent,
        ServiceUnitTimeSegmentsComponent,
        EffectiveTillCellDynamicCellComponent,
    ],
    imports: [SharedModule],
})
export class ServiceUnitRuleModule {}
