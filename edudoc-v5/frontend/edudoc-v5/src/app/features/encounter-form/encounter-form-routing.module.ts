import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EncounterFormPageComponent } from './pages/encounter-form-page/encounter-form-page.component';

const routes: Routes = [
  {
    path: 'encounter-form',
    component: EncounterFormPageComponent
  },
  {
    path: 'encounter-form/:id',
    component: EncounterFormPageComponent
  },
  {
    path: '',
    redirectTo: 'encounter-form',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EncounterFormRoutingModule { }
