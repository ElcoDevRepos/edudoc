import { NgModule } from '@angular/core';

import { SharedModule } from '@common/shared.module';
import { GoalAddComponent } from './components/goal-add/goal-add.component';
import { GoalBasicInfoComponent } from './components/goal-basic-info/goal-basic-info.component';
import { GoalDetailComponent } from './components/goal-detail/goal-detail.component';
import { GoalHeaderComponent } from './components/goal-header/goal-header.component';
import { GoalsComponent } from './components/goal-list/goals.component';
import { NursingGoalResultModule } from '@admin/nurse-progress-quick-text/nursing-goal-result.module';

@NgModule({
    declarations: [GoalsComponent, GoalHeaderComponent, GoalAddComponent, GoalDetailComponent, GoalBasicInfoComponent],
    imports: [SharedModule, NursingGoalResultModule],
})
export class GoalModule {}
